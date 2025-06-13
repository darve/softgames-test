export const easeInCubic = (
  t: number,
  b: number,
  c: number,
  d: number
): number => {
  return c * (t /= d) * t * t + b;
};

export const easeOutCubic = (
  t: number,
  b: number,
  c: number,
  d: number
): number => {
  return c * ((t = t / d - 1) * t * t + 1) + b;
};

export const easeInOutCubic = (
  t: number,
  b: number,
  c: number,
  d: number
): number => {
  if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
  return (c / 2) * ((t -= 2) * t * t + 2) + b;
};

interface TransitionOptions {
  name?: string;
  delay: number;
  duration: number;
  start: number;
  finish: number;
  step: (value: number) => void;
  cb?: () => void;
}

export class Transition {
  name?: string;
  delay: number;
  progress: number;
  duration: number;
  start: number;
  finish: number;
  step: (value: number) => void;
  cb?: () => void;
  dead: boolean;

  constructor(opts: TransitionOptions) {
    this.name = opts.name;
    this.delay = opts.delay;
    this.progress = 0 - this.delay;
    this.duration = opts.duration;
    this.start = opts.start;
    this.finish = opts.finish;
    this.step = opts.step;
    this.cb = opts.cb;
    this.dead = false;
  }

  tick() {
    if (this.progress >= 0)
      this.step(
        easeInOutCubic(
          this.progress,
          0,
          this.finish - this.start,
          this.duration
        ) + this.start
      );

    this.progress++;

    if (this.progress === this.duration) {
      this.dead = true;
      if (this.cb) this.cb();
    }
  }

  flip() {
    const temp_start = this.start;
    const temp_finish = this.finish;

    this.start = Number(temp_start);
    this.finish = Number(temp_finish);
  }
}
