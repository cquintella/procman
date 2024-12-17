export class ReadFileError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'Error Reading File';
    }
  }