import { v4 as uuidv4 } from 'uuid';
import { ProcessDTO } from './dtos/process_dto';

export class Process {
  readonly #id: string;
  #name: string;
  #objective: string;
  #description: string;

  private constructor(props: ProcessDTO) {
    this.#id = props.id;
    this.#name = props.name;
    this.#objective = props.objective;
    this.#description = props.description;
  }

  public static create(
    name: string,
    objective: string,
    description: string
  ): Process {
    if (!name || name.trim().length === 0) {
      throw new Error('Process name is required');
    }

    let props: ProcessDTO = {
      id: '',
      name: name,
      objective: objective,
      description: description,
    };

    return new Process(props);
  }

  // Getters
  public get id(): string {
    return this.#id;
  }

  public get name(): string {
    return this.#name;
  }

  public get objective(): string {
    return this.#objective;
  }

  public get description(): string {
    return this.#description;
  }

  // Setters
  public set name(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('Process name cannot be empty');
    }
    this.#name = name;
  }

  public set objective(objective: string) {
    if (!objective || objective.trim().length === 0) {
      throw new Error('Process objective cannot be empty');
    }
    this.#objective = objective;
  }

  public set description(description: string) {
    this.description = description;
  }
}
