import {Component, Input, OnChanges, SimpleChanges, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

interface EventRecord {
  time: number;
  type: 'next' | 'error' | 'complete';
  value?: string | any;
}

/**
 * Компонент для визуализации Observable в виде диаграммы мрамора
 * 
 * @example
 * <lib-marble-diagram [observable]="myObservable$" [duration]="2000"></lib-marble-diagram>
 */
@Component({
  selector: 'lib-marble-diagram',
  templateUrl: './marble-diagram.component.html',
  styleUrls: ['./marble-diagram.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MarbleDiagramComponent implements OnChanges, OnDestroy {
  @Input() observable: Observable<string> | undefined;
  @Input() duration: number = 1000;
  @Input() maxMarkers: number = 10;

  eventRecords: EventRecord[] = [];
  subscription: Subscription | null = null;
  isRendering = false;

  hoveredEvent: EventRecord | null = null;

  tooltipPosition = { x: 0, y: 0 };
  showTooltip = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['observable'] && this.observable) {
      this.eventRecords = [];
      this.subscription?.unsubscribe();
      this.visualizeObservable();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private visualizeObservable(): void {
    if(!this.observable) return;

    const startTime = Date.now();

    const handleNext = (value: string) => {
      this.addEventRecord({ time: Date.now() - startTime, type: 'next', value });
    }
    const handleError = (err: any) => {
      this.addEventRecord({ time: Date.now() - startTime, type: 'error', value: err });
    }
    const handleComplete = () => {
      this.addEventRecord({ time: Date.now() - startTime, type: 'complete' });
    }

    this.subscription = this.observable.subscribe({
      next: handleNext,
      error: handleError,
      complete: handleComplete,
    });

    if (this.duration > 0) {
      setTimeout(() => {
        this.subscription?.unsubscribe();
      }, this.duration);
    }
  }

  private addEventRecord(record: EventRecord) {
    if (this.eventRecords.length >= this.maxMarkers) {
      this.eventRecords.shift(); // Удаляем самый старый маркер
      this.subscription?.unsubscribe(); // Отписываемся при достижении лимита
    }
    this.eventRecords.push(record);
    this.isRendering = true;
    setTimeout(() => {
      this.isRendering = false;
      this.changeDetectorRef.markForCheck();
    });
  }

  calculateMarkerPosition(eventTime: number): string {
    if (this.duration < 0) {
      const maxTime = Math.max(...this.eventRecords.map(e => e.time), 1000);
      return `${(eventTime / maxTime) * 100}%`;
    }
    return `${(eventTime / this.duration) * 100}%`;
  }

  onMarkerHover(event: EventRecord | null, mouseEvent?: MouseEvent) {
    this.hoveredEvent = event;
    if (event && mouseEvent) {
      const tooltipWidth = 100; // Примерная ширина тултипа
      const windowWidth = window.innerWidth;

      // Если тултип не помещается справа, показываем его слева
      const x = mouseEvent.clientX + tooltipWidth > windowWidth
        ? mouseEvent.clientX - tooltipWidth
        : mouseEvent.clientX;

      this.tooltipPosition = {
        x: x,
        y: mouseEvent.clientY
      };
      this.showTooltip = true;
    } else {
      this.showTooltip = false;
    }
  }

  getMaxTime(): number {
    if (this.duration >= 0) return this.duration;
    return Math.max(...this.eventRecords.map(e => e.time), 1000);
  }
}
