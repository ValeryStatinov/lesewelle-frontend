export interface PriorityQueueItem {
  compare(other: PriorityQueueItem): number;
}

export class PriorityQueue<T extends PriorityQueueItem> {
  private items: T[] = [];

  public constructor(initialItems?: T[]) {
    if (initialItems) {
      this.items = [...initialItems];
      this.heapify();
    }
  }

  public size() {
    return this.items.length;
  }

  public isEmpty() {
    return this.size() === 0;
  }

  private parent(i: number) {
    return Math.floor((i - 1) / 2);
  }

  private left(i: number) {
    return i * 2 + 1;
  }

  private right(i: number) {
    return i * 2 + 2;
  }

  private swap(i: number, j: number) {
    if (i < 0 || j < 0 || i >= this.size() || j >= this.size()) {
      throw new Error(
        `wrong indexes, provided ${i.toString()}, ${j.toString()}, while length is ${this.size().toString()} `,
      );
    }

    const temp = this.items[i];
    this.items[i] = this.items[j];
    this.items[j] = temp;
  }

  private siftDown(i: number) {
    while (true) {
      let largest = i;
      const left = this.left(i);
      const right = this.right(i);

      if (left < this.size() && this.items[left].compare(this.items[largest]) > 0) {
        largest = left;
      }
      if (right < this.size() && this.items[right].compare(this.items[largest]) > 0) {
        largest = right;
      }

      if (largest === i) {
        break;
      }

      this.swap(i, largest);
      i = largest;
    }
  }

  private siftUp(i: number) {
    if (i >= this.size()) {
      throw new Error(`[siftUp] index out of range: ${i.toString()}; length: ${this.size().toString()}`);
    }

    let parent = this.parent(i);
    while (parent >= 0 && this.items[i].compare(this.items[parent]) > 0) {
      this.swap(i, parent);
      i = parent;
      parent = this.parent(i);
    }
  }

  private heapify() {
    for (let i = Math.floor(this.size() / 2) - 1; i >= 0; i--) {
      this.siftDown(i);
    }
  }

  public push(item: T) {
    this.items.push(item);
    this.siftUp(this.size() - 1);
  }

  public peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    return this.items[0];
  }

  public pop() {
    if (this.isEmpty()) {
      return undefined;
    }

    const top = this.items[0];
    this.items[0] = this.items[this.size() - 1];
    this.items.length = this.size() - 1;
    this.siftDown(0);

    return top;
  }
}
