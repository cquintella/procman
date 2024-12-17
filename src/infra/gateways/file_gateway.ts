import * as fs from 'fs/promises';
import * as path from 'path';
import { Either, Left, Right } from 'purify-ts';
import {
  FileGatewayError,
  ConsolidationInProgressError,
  FileWriteError,
  UnknownFileGatewayError,
  FileReadError,
} from '../errors/file_gateway_error';

/**
 * Interface que define os registros do journal.
 */
interface JournalRecord<T> {
  sequence: number;
  operation: 'add' | 'delete';
  record: T;
}

/**
 * Classe que gerencia a leitura, escrita e manipulação de dados em arquivos JSON com uso de um journal para operações.
 */
export class FileGateway<T> {
  #mainFilePath: string;
  #journalFilePath: string;
  #cache: T[] = [];
  #isConsolidating: boolean = false;
  #writeRetries = 3;

  /**
   * Construtor da classe FileGateway.
   * @param storageDir Diretório onde os arquivos serão armazenados.
   * @param filePrefix Prefixo do nome dos arquivos.
   */
  constructor(storageDir: string, filePrefix: string) {
    this.#mainFilePath = path.join(storageDir, `${filePrefix}.json`);
    this.#journalFilePath = path.join(storageDir, `${filePrefix}.journal.json`);
  }

  /**
   * Garante que os arquivos principais e do journal existem, criando-os caso contrário.
   * @returns Either<Error, FileGateway> Indica se houve erro ou sucesso e retorna o próprio objeto.
   */
  private async ensureFilesExist(): Promise<
    Either<FileGatewayError, FileGateway<T>>
  > {
    try {
      // Verifica ou cria o arquivo principal.
      await fs.access(this.#mainFilePath).catch(async () => {
        try {
          await fs.writeFile(this.#mainFilePath, JSON.stringify([]));
        } catch (writeError) {
          throw new FileWriteError(this.#mainFilePath, writeError as Error);
        }
      });

      // Verifica ou cria o arquivo do journal.
      await fs.access(this.#journalFilePath).catch(async () => {
        try {
          await fs.writeFile(this.#journalFilePath, JSON.stringify([]));
        } catch (writeError) {
          throw new FileWriteError(this.#journalFilePath, writeError as Error);
        }
      });

      return Right(this); // Retorna o próprio objeto.
    } catch (error) {
      return Left(new UnknownFileGatewayError(error as Error));
    }
  }

  /**
   * Escreve uma entrada no journal.
   * @param entry A entrada a ser registrada no journal.
   * @returns Either<FileGatewayError, FileGateway> Indica se houve erro ou sucesso e retorna o próprio objeto.
   */
  private async writeJournalEntry(
    entry: JournalRecord<T>
  ): Promise<Either<FileGatewayError, FileGateway<T>>> {
    // Tenta ler o conteúdo atual do arquivo de journal
    const journalContentOrError: Either<FileReadError, JournalRecord<T>[]> =
      await this.readFile<JournalRecord<T>[]>(this.#journalFilePath);

    if (journalContentOrError.isLeft()) {
      const readError = journalContentOrError.extract() as Error;
      return Left(new FileReadError(this.#journalFilePath, readError));
    }

    // Extrai o conteúdo do journal com segurança
    const journalContent: JournalRecord<T>[] =
      journalContentOrError.extract() as JournalRecord<T>[];

    try {
      // Adiciona a nova entrada ao conteúdo do journal
      journalContent.push(entry);

      // Tenta escrever o conteúdo atualizado no arquivo de journal
      const writeResult: Either<
        FileWriteError,
        FileGateway<T>
      > = await this.writeFile(this.#journalFilePath, journalContent);

      // Verifica se houve erro ao escrever no arquivo
      if (writeResult.isLeft()) {
        const writeError = writeResult.extract() as Error;
        return Left(new FileWriteError(this.#journalFilePath, writeError));
      }

      // Retorna o próprio objeto em caso de sucesso
      return Right(this);
    } catch (unexpectedError) {
      // Lida com qualquer erro inesperado durante a operação
      return Left(new UnknownFileGatewayError(unexpectedError as Error));
    }
  }

  /**
   * Adiciona um registro ao sistema e registra a operação no journal.
   * @param record Registro a ser adicionado.
   * @returns Either<FileGatewayError, FileGateway> Indica se houve erro ou sucesso e retorna o próprio objeto.
   */
  async add(record: T): Promise<Either<FileGatewayError, FileGateway<T>>> {
    if (this.#isConsolidating) {
      return Left(new ConsolidationInProgressError());
    }

    const journalEntry: JournalRecord<T> = {
      sequence: Date.now(),
      operation: 'add',
      record,
    };

    const writeResult: Either<
      Error,
      FileGateway<T>
    > = await this.writeJournalEntry(journalEntry);

    if (writeResult.isLeft()) {
      return Left(new FileGatewayError('File Write Error', 'Error'));
    }

    this.#cache.push(record);
    return Right(this); // Retorna o próprio objeto.
  }

  /**
   * Exclui um registro pelo ID e registra a operação no journal.
   * @param id ID do registro a ser excluído.
   * @returns Either<FileGatewayError, FileGateway> Indica se houve erro ou sucesso e retorna o próprio objeto.
   */
  async deleteById(
    id: string
  ): Promise<Either<FileGatewayError, FileGateway<T>>> {
    if (this.#isConsolidating) {
      return Left(new ConsolidationInProgressError());
    }

    const updatedCache = this.#cache.filter((item: any) => item.id !== id);
    if (updatedCache.length === this.#cache.length) {
      return Left(
        new FileGatewayError('error', `Record with ID ${id} not found.`)
      );
    }

    const journalEntry: JournalRecord<T> = {
      sequence: Date.now(),
      operation: 'delete',
      record: { id } as unknown as T,
    };

    const writeResult = await this.writeJournalEntry(journalEntry);

    if (writeResult.isLeft()) {
      return Left(
        new FileGatewayError(
          'Error',
          'Cannot delete records during journal consolidation.'
        )
      );
    }

    this.#cache = updatedCache;
    return Right(this); // Retorna o próprio objeto.
  }

  /**
   * Consolida o journal, aplicando as operações de add e delete no arquivo principal.
   * @returns Either<Error, FileGateway> Indica se houve erro ou sucesso e retorna o próprio objeto.
   */
  async consolidateJournal(): Promise<Either<Error, FileGateway<T>>> {
    if (this.#isConsolidating) {
      return Left(new Error('Consolidation is already in progress.'));
    }

    this.#isConsolidating = true;

    try {
      const journalContentOrError = await this.readFile<JournalRecord<T>[]>(
        this.#journalFilePath
      );
      if (journalContentOrError.isLeft()) return journalContentOrError;

      const journalEntries = journalContentOrError.extract();

      const mainFileContentOrError = await this.readFile<T[]>(
        this.#mainFilePath
      );
      if (mainFileContentOrError.isLeft()) return mainFileContentOrError;

      let consolidatedRecords: JournalRecord<T>[] =
        mainFileContentOrError.extract() as JournalRecord<T>[];

      for (const entry of journalEntries as JournalRecord<T>[]) {
        if (entry.operation === 'add') {
          consolidatedRecords.push(entry.record as JournalRecord<T>);
        } else if (entry.operation === 'delete') {
          consolidatedRecords = consolidatedRecords.filter(
            //Property 'push' does not exist on type 'T[] | FileReadError'. Property 'push' does not exist on type 'FileReadError'.ts(2339)
            (item: any) => item.id !== (entry.record as any).id
          );
        }
      }

      await this.writeFile(this.#mainFilePath, consolidatedRecords);
      await this.writeFile(this.#journalFilePath, []);

      this.#isConsolidating = false;
      return Right(this); // Retorna o próprio objeto.
    } catch (error) {
      this.#isConsolidating = false;
      return Left(error as Error);
    }
  }

  /**
   * Lê o conteúdo de um arquivo e retorna um Either com o conteúdo ou o erro.
   * @param filePath Caminho do arquivo a ser lido.
   * @returns Either<Error, R> O conteúdo do arquivo ou erro.
   */
  private async readFile<R>(
    filePath: string
  ): Promise<Either<FileReadError, R>> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return Right(JSON.parse(data));
    } catch (error) {
      return Left(error as FileReadError);
    }
  }

  /**
   * Escreve dados em um arquivo com múltiplas tentativas em caso de falha.
   * @param filePath Caminho do arquivo a ser escrito.
   * @param data Dados a serem escritos no arquivo.
   * @returns Either<FileWriteError, FileGateway> Indica se houve erro ou sucesso e retorna o próprio objeto.
   */
  private async writeFile(
    filePath: string,
    data: any
  ): Promise<Either<FileWriteError, FileGateway<T>>> {
    for (let attempt = 1; attempt <= this.#writeRetries; attempt++) {
      try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return Right(this); // Retorna o próprio objeto ao concluir com sucesso.
      } catch (error) {
        // Se esta é a última tentativa, retorna o erro.
        if (attempt === this.#writeRetries) {
          return Left(new FileWriteError(filePath, error as Error));
        }
      }
    }

    // Este ponto nunca será alcançado devido ao `for`, mas incluímos para garantir consistência.
    return Left(new FileWriteError(filePath, {} as Error));
  }
}
