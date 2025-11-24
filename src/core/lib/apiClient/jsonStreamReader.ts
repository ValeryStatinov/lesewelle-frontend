export type JsonStreamNextResult<T> = { value: T; done: false } | { value: undefined; done: true };

/**
 * Reads newline-delimited JSON from a stream
 */
export class JsonStreamReader<T> {
  private _reader: ReadableStreamDefaultReader<ArrayBuffer>;
  private _done: boolean = false;
  private _isReading: boolean = false;
  private _buffer: string = '';
  private _newLineIndex: number = -1;
  private _textDecoder: TextDecoder = new TextDecoder();

  public constructor(reader: ReadableStreamDefaultReader<ArrayBuffer>) {
    this._reader = reader;
  }

  public get done(): boolean {
    return this._done;
  }

  private readJsonFromBuffer(): T {
    const line = this._buffer.slice(0, this._newLineIndex).trim();
    this._buffer = this._buffer.slice(this._newLineIndex + 1);
    this._newLineIndex = this._buffer.indexOf('\n');

    try {
      const json = JSON.parse(line) as T;

      return json;
    } catch (error) {
      const message = error instanceof Error ? error.message : `Unknown error: ${String(error)}`;
      const preview = line.length > 100 ? `${line.slice(0, 100)}...` : line;

      throw new Error(`Failed to parse JSON parsing "${preview}": ${message}`);
    }
  }

  public async nextJson(): Promise<JsonStreamNextResult<T>> {
    if (this._done) {
      return { value: undefined, done: true };
    }

    if (this._isReading) {
      throw new Error('Already reading');
    }

    // next json is already in buffer, just read and return it
    if (this._newLineIndex >= 0) {
      const json = this.readJsonFromBuffer();

      return { value: json, done: false };
    }

    // wait for new bytes from stream, then check if there is a new line in buffer
    // meaning there is a new json in buffer ready to be read
    try {
      this._isReading = true;

      while (true) {
        const chunk = await this._reader.read();

        if (chunk.done) {
          this._done = true;

          return { value: undefined, done: true };
        }

        this._buffer += this._textDecoder.decode(chunk.value, { stream: true });
        this._newLineIndex = this._buffer.indexOf('\n');

        if (this._newLineIndex >= 0) {
          const json = this.readJsonFromBuffer();

          return { value: json, done: false };
        }
      }
    } finally {
      this._isReading = false;
    }
  }
}
