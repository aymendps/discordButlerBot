export interface Song {
  title: string;
  url: string;
  thumbnail_url: string;
}

export class SongQueue {
  private queue: Song[];
  private previous: Song[];
  private current: Song;
  private isLooping: boolean;

  public constructor() {
    this.queue = [];
    this.previous = [];
    this.current = undefined;
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

  public getPrevious() {
    return this.previous.pop();
  }

  public setCurrent(song: Song) {
    this.current = song;
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

    this.addToPrevious(this.queue[0]);

    if (this.isLooping && this.current) {
      return this.current;
    } else {
      return this.queue.shift();
    }
  }

  public reset() {
    this.queue.length = 0;
    this.current = undefined;
  }
}
