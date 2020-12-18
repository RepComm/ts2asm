
export class Accessor<T> {
  protected internal: Array<T>;
  protected offset: number;
  private stack: Array<number>;

  constructor(size: number = 0) {
    this.internal = new Array(size);
    this.offset = 0;
    this.stack = new Array();
  }
  save (): this {
    this.stack.push(this.offset);
    return this;
  }
  getLastSave (): number {
    return this.stack[this.stack.length-1];
  }
  slice (from: number, to: number): Array<T> {
    return this.internal.slice(from, to);
  }
  restore (popOnly: boolean = false): this {
    let v = this.stack.pop();
    if (!popOnly) this.setOffset(v);
    return this;
  }
  setOffset(offset: number): this {
    this.offset = offset;
    return this;
  }
  getOffset (): number {
    return this.offset;
  }
  rewind(count: number = 1): this {
    this.offset -= count;
    if (this.offset < 0) this.offset = 0;
    return this;
  }
  /**Sets the items from a passed array*/
  setItems(items: Array<T>): this {
    //copy array
    this.internal = items.slice();
    return this;
  }
  /**Grab the next item and then advance the offset*/
  next(): T {
    let result = this.peak();
    this.offset++;
    return result;
  }
  /**Returns true if there are more items to process at the current offset*/
  hasNext(): boolean {
    return this.offset < this.internal.length;
  }
  /**Grab the next item without advancing*/
  peak(): T {
    return this.internal[this.offset];
  }
}

/**An accessor (list with auto increment) for iterating over
 * an array of items with a offset stack that allows
 * save() and restore() to offets
 */
export class Staccessor<T> extends Accessor<T> {
  private stack: Array<number>;
  constructor(size: number = 0) {
    super(size);
  }
  /**Push the current index onto a stack to be recovered by `restore()` later*/
  save(): this {
    this.stack.push(this.offset);
    return this;
  }
  /**Jump back to a `save()`ed token offset*/
  restore(): this {
    this.setOffset(this.stack.pop());
    return this;
  }
}
