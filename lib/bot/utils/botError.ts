class BotError extends Error {
  constructor(msg: string, name: string) {
    super(msg);
    this.name = name;
  }
}

export default BotError;
