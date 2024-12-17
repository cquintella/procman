import { Either, Left, Right } from 'purify-ts';
import { ProcessesRepoInteface } from '../repos/ProcessesRepoInterface';
import { Process } from '../entities/process';
import { ProccessNotFoundError } from '../errors/proccess_not_found_error';

class UpdateProcess {
  private repo: ProcessesRepoInteface;

  constructor(processRepo: ProcessesRepoInteface) {
    this.repo = processRepo;
  }

  public async execute(processToUpdate: Process): Promise<Either<Error, void>> {
    const result: Either<ProccessNotFoundError, Process> =
      this.repo.findProcessById(processToUpdate.getId());
  }
}
