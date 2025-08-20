import { BasePlugin, SEND_TYPES } from '@hawk-tracker/core';
import { record } from 'rrweb';

type RrwebPluginOptions = {
  maxEvents?: number;
  sampling?: Parameters<typeof record>[0]['sampling'];
  emit?: (event: any) => void;
};

export class RrwebPlugin extends BasePlugin {
  private options: Required<RrwebPluginOptions>;
  private events: any[] = [];
  private stopFn: (() => void) | null = null;

  constructor(options: RrwebPluginOptions = {}) {
    super(SEND_TYPES.CUSTOM);
    this.options = {
      maxEvents: options.maxEvents ?? 300,
      sampling: options.sampling ?? {
        mousemove: 50,
        scroll: 50,
        media: true,
        input: 'last',
      },
      emit: options.emit ?? (() => {}),
    };
  }

  install(): void {
    if (typeof window === 'undefined') return;
    if (this.stopFn) return;

    this.stopFn = record({
      sampling: this.options.sampling,
      emit: (e: any) => {
        this.events.push(e);
        if (this.events.length > this.options.maxEvents) {
          this.events.splice(0, this.events.length - this.options.maxEvents);
        }
        this.options.emit(e);
      },
    });

    (window as any).$hawkRrweb = {
      getReplay: ({ maxSize = this.options.maxEvents } = {}) => {
        const size = Math.min(maxSize, this.events.length);
        return this.events.slice(this.events.length - size);
      },
      stop: () => {
        if (this.stopFn) {
          this.stopFn();
          this.stopFn = null;
        }
      },
    };
  }
}
