import { shuffle } from 'core/lib/utils/array';
import { PriorityQueue } from 'core/lib/utils/priorityQueue';

const jitter = () => {
  return Math.floor(Math.random() * 4) - 1;
};

class StudyCard<T> {
  public card: T;
  public easyStreak = 0;
  public queuePosition = 0;

  public constructor(card: T, queuePosition: number) {
    this.card = card;
    this.queuePosition = queuePosition;
  }

  public compare(other: StudyCard<T>) {
    if (this.queuePosition - other.queuePosition > 0) {
      return -1;
    }

    return 1;
  }
}

/**
 * @param requiredEasyStreak starts from 1, default value 3
 */
export type StudyQueueParams<T> = {
  initialItems?: T[];
  requiredEasyStreak?: number;
};

export class StudyQueue<T> {
  private learningQueue: PriorityQueue<StudyCard<T>>;
  private cardMap = new Map<T, StudyCard<T>>();
  private maxQueuePosition = 0;

  private hardBaseIncrement = 4;
  private mediumBaseIncrement = 4;
  private easyBaseIncrement = 6;
  private mediumStreakIncrement = 3;
  private easyStreakIncrement = 4;
  private requiredEasyStreak = 3;

  public constructor(params: StudyQueueParams<T> = {}) {
    const { initialItems = [], requiredEasyStreak } = params;

    if (requiredEasyStreak !== undefined && requiredEasyStreak < 1) {
      throw new Error(`requiredEasyStreak has invalid value: ${requiredEasyStreak.toString()}`);
    }
    this.requiredEasyStreak = requiredEasyStreak ?? this.requiredEasyStreak;

    const shuffledItems = shuffle([...initialItems]);
    const cards: StudyCard<T>[] = [];
    for (const it of shuffledItems) {
      const card = new StudyCard(it, this.maxQueuePosition);
      cards.push(card);
      this.cardMap.set(it, card);
      this.maxQueuePosition += 1;
    }

    this.learningQueue = new PriorityQueue(cards);
  }

  public nextCard(): T | undefined {
    const card = this.learningQueue.pop();
    if (!card) {
      return undefined;
    }

    return card.card;
  }

  public size() {
    return this.learningQueue.size();
  }

  public addToQueue(items: T[]) {
    const shuffledItems = shuffle([...items]);

    for (const it of shuffledItems) {
      const card = new StudyCard(it, this.maxQueuePosition);
      this.cardMap.set(it, card);
      this.maxQueuePosition++;
      this.learningQueue.push(card);
    }
  }

  private getStudyCard(item: T): StudyCard<T> {
    const card = this.cardMap.get(item);
    if (!card) {
      throw new Error('Card not found in study queue');
    }
    return card;
  }

  public onHard(item: T) {
    const card = this.getStudyCard(item);
    card.queuePosition = card.queuePosition + this.hardBaseIncrement + jitter();
    card.easyStreak = 0;
    this.learningQueue.push(card);

    this.maxQueuePosition = Math.max(this.maxQueuePosition, card.queuePosition);
  }

  public onMedium(item: T) {
    const card = this.getStudyCard(item);
    card.queuePosition =
      card.queuePosition + this.mediumBaseIncrement + (card.easyStreak + 1) * this.mediumStreakIncrement + jitter();
    card.easyStreak = Math.max(0, card.easyStreak - 1);
    this.learningQueue.push(card);

    this.maxQueuePosition = Math.max(this.maxQueuePosition, card.queuePosition);
  }

  public onEasy(item: T) {
    const card = this.getStudyCard(item);
    if (card.easyStreak === this.requiredEasyStreak - 1) {
      this.cardMap.delete(item);
      return;
    }

    card.queuePosition =
      card.queuePosition + this.easyBaseIncrement + (card.easyStreak + 1) * this.easyStreakIncrement + jitter();
    card.easyStreak += 1;
    this.learningQueue.push(card);

    this.maxQueuePosition = Math.max(this.maxQueuePosition, card.queuePosition);
  }
}
