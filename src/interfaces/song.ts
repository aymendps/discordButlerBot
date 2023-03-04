export interface Song {
  title: string;
  url: string;
  thumbnail_url: string;
}

export class SongQueue {
  private queue: Song[];
  private previous: Song[];
  private isLooping: boolean;

  public constructor() {
    this.queue = [];
    this.previous = [];
    this.isLooping = false;
  }

  private addToPrevious(song: Song) {
    if (
      this.previous.length === 0 ||
      this.previous[this.previous.length - 1].url !== song.url
    ) {
      this.previous.push(song);
    }
  }

  public front() {
    return this.queue[0];
  }

  public length() {
    return this.queue.length;
  }

  public isEmpty() {
    return this.queue.length === 0;
  }

  public setLooping(isLooping: boolean) {
    this.isLooping = isLooping;
  }

  public push(song: Song) {
    this.queue.push(song);
  }

  public pop() {
    if (this.isEmpty()) {
      return null;
    }

    this.addToPrevious(this.queue[0]);

    if (this.isLooping) {
      return this.queue[0];
    } else {
      return this.queue.shift();
    }
  }

  public reset() {
    this.queue.length = 0;
  }
}
