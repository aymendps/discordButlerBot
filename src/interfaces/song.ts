export interface Song {
  title: string;
  url: string;
  thumbnail_url: string;
  duration: number;
  seek: number;
}

export class SongQueue {
  private queue: Song[];
  private current: Song;
  private isLooping: "None" | "One" | "All";
  public collector;
  public justSeeked: boolean = false;

  public constructor() {
    this.queue = [];
    this.current = undefined;
    this.isLooping = "None";
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

  public nextLoopingMode() {
    switch (this.isLooping) {
      case "None":
        this.isLooping = "One";
        break;
      case "One":
        this.isLooping = "All";
        break;
      case "All":
        this.isLooping = "None";
        break;
    }
    return {
      isLooping: this.isLooping,
      loopedSong: this.current,
    };
  }

  public push(song: Song) {
    this.queue.push(song);
  }

  public pop() {
    // if (!(this.isLooping && this.current)) {
    //   this.current = this.queue.shift();
    // }

    // return this.current;

    if (this.isLooping === "None" || !this.current) {
      this.current = this.queue.shift();
      return this.current;
    }

    if (this.isLooping === "One" && this.current) {
      this.current.seek = 0;
      return this.current;
    }

    if (this.isLooping === "All" && this.current) {
      this.current.seek = 0;
      this.queue.push(this.current);
      this.current = this.queue.shift();
      return this.current;
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
