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
    if (!(this.isLooping && this.current)) {
      this.current = this.queue.shift();
    }

    return this.current;
  }

  public remove(howMany: number = 1) {
    if (
      howMany <= 0 ||
      howMany === null ||
      howMany === undefined ||
      isNaN(howMany)
    ) {
      return 0;
    }

    if (howMany > this.queue.length) {
      var temp = this.queue.length;
      this.queue.length = 0;
      return temp;
    } else {
      this.queue.length -= howMany;
      return howMany;
    }
  }

  public reset() {
    this.queue.length = 0;
    this.current = undefined;
  }
}
