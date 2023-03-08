export interface Song {
  title: string;
  url: string;
  thumbnail_url: string;
}

export class SongQueue {
  private queue: Song[];
  private current: Song;
  private isLooping: boolean;

  public constructor() {
    this.queue = [];
    this.current = undefined;
    this.isLooping = false;
  }

  public getCurrent() {
    return this.current;
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

  public toggleLooping() {
    this.isLooping = !this.isLooping;
    return {
      isLooping: this.isLooping,
      loopedSong: this.current,
    };
  }

  public push(song: Song) {
    this.queue.push(song);
  }

  public pop() {
    if (this.isEmpty()) {
      return undefined;
    }

    if (!(this.isLooping && this.current)) {
      this.current = this.queue.shift();
    }

    return this.current;
  }

  public undoPush() {
    return this.queue.pop();
  }

  public reset() {
    this.queue.length = 0;
    this.current = undefined;
  }
}
