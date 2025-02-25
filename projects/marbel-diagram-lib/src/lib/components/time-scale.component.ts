import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'lib-time-scale',
  template: `
    <div class="time-scale" [class.show-line]="showLine">
        <div class="time-line"></div>
        <div *ngFor="let tick of ticks" class="tick-container" [style.left]="tick.position">
            <div class="tick-line"></div>
            <div class="tick-label">{{ tick.time }}ms</div>
        </div>
    </div>
  `,
  styles: [`
    .time-scale {
      position: relative;
      height: 30px;
      border-top: 2px solid #666;
      margin-top: 20px;
    }
    .tick-container {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
      text-align: center;
    }
    .tick-line {
      height: 10px;
      width: 1px;
      background-color: #666;
      margin: 0 auto;
    }
    .tick-label {
      font-size: 12px;
      color: #333;
      font-weight: bold;
      margin-top: 4px;
    }
    .time-line {
      position: absolute;
      left: 0;
      height: 2px;
      width: 100%;
      background-color: #ccc;
      display: none;
    }
    .show-line .time-line {
      display: block;
    }
  `],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeScaleComponent implements OnChanges {
  @Input() duration: number = 1000;
  @Input() ticksCount: number = 5;
  @Input() maxTime?: number;
  @Input() showLine: boolean = false;

  ticks: { time: number, position: string }[] = [];

  constructor (private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateTicks();
  }

  private updateTicks(): void {
    const effectiveDuration = this.duration >= 0 ? this.duration : (this.maxTime || 1000);
    this.ticks = Array.from({length: this.ticksCount}).map((_, i) => ({
      time: Math.round((i / (this.ticksCount - 1)) * effectiveDuration),
      position: `${(i / (this.ticksCount - 1)) * 100}%`
    }));
    this.cdr.markForCheck();
  }
}