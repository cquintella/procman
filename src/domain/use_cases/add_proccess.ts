import { Process } from '../entities/process';
import { ProcessesRepoInteface } from '../repos/ProcessesRepoInterface';

export default class AddProcess {
  private repo: ProcessesRepoInteface;

  constructor(repo: ProcessesRepoInteface) {
    this.repo = repo;
  }

  run(process: Process) {
    this.repo.addProcess(process);
  }
}
