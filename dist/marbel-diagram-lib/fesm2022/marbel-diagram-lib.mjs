import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { SlicePipe, CommonModule } from '@angular/common';

class MarbleDiagramComponent {
    changeDetectorRef;
    observable;
    duration = 1000;
    maxMarkers = 10;
    eventRecords = [];
    subscription = null;
    isRendering = false;
    hoveredEvent = null;
    tooltipPosition = { x: 0, y: 0 };
    showTooltip = false;
    constructor(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    ngOnChanges(changes) {
        if (changes['observable'] && this.observable) {
            this.eventRecords = [];
            this.subscription?.unsubscribe();
            this.visualizeObservable();
        }
    }
    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
    visualizeObservable() {
        if (!this.observable)
            return;
        const startTime = Date.now();
        const handleNext = (value) => {
            this.addEventRecord({ time: Date.now() - startTime, type: 'next', value });
        };
        const handleError = (err) => {
            this.addEventRecord({ time: Date.now() - startTime, type: 'error', value: err });
        };
        const handleComplete = () => {
            this.addEventRecord({ time: Date.now() - startTime, type: 'complete' });
        };
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
    addEventRecord(record) {
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
    calculateMarkerPosition(eventTime) {
        if (this.duration < 0) {
            const maxTime = Math.max(...this.eventRecords.map(e => e.time), 1000);
            return `${(eventTime / maxTime) * 100}%`;
        }
        return `${(eventTime / this.duration) * 100}%`;
    }
    onMarkerHover(event, mouseEvent) {
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
        }
        else {
            this.showTooltip = false;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: MarbleDiagramComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.7", type: MarbleDiagramComponent, isStandalone: false, selector: "lib-marble-diagram", inputs: { observable: "observable", duration: "duration", maxMarkers: "maxMarkers" }, usesOnChanges: true, ngImport: i0, template: "<div class=\"marble-diagram\">\n  <div class=\"time-line\"></div>\n  <div\n    *ngFor=\"let event of eventRecords\"\n    class=\"marker\"\n    [class.next]=\"event.type === 'next'\"\n    [class.error]=\"event.type === 'error'\"\n    [class.complete]=\"event.type === 'complete'\"\n    [style.left]=\"calculateMarkerPosition(event.time)\"\n    (mouseenter)=\"onMarkerHover(event, $event)\"\n    (mouseleave)=\"onMarkerHover(null)\"\n  >\n    {{ event.value ? event.value.charAt(0) : event.type.charAt(0).toUpperCase() }}\n  </div>\n\n  <div *ngIf=\"showTooltip && hoveredEvent\" class=\"tooltip\" [ngStyle]=\"{left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px'}\">\n    <div>Time: {{ hoveredEvent.time }}ms</div>\n    <div *ngIf=\"hoveredEvent.value\">Value: {{ hoveredEvent.value }}</div>\n  </div>\n</div>\n", styles: [".marble-diagram{display:flex;align-items:center;height:50px;border:1px solid #ccc;margin-bottom:10px;position:relative;overflow-x:auto;overflow-y:hidden}.marker{position:absolute;height:20px;display:flex;align-items:center;justify-content:center;font-weight:700;padding:0 5px;border-radius:3px;transition:left .3s ease-in-out}.marker.next{background-color:#90ee90;border:1px solid green}.marker.error{background-color:#f08080;border:1px solid red}.marker.complete{background-color:#add8e6;border:1px solid blue}.time-line{position:absolute;left:0;height:2px;width:100%;background-color:#ccc}.tooltip{position:fixed;background:#fff;border:1px solid #ccc;padding:5px;border-radius:3px;box-shadow:0 2px 4px #0003;z-index:1000;pointer-events:none}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: MarbleDiagramComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-marble-diagram', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<div class=\"marble-diagram\">\n  <div class=\"time-line\"></div>\n  <div\n    *ngFor=\"let event of eventRecords\"\n    class=\"marker\"\n    [class.next]=\"event.type === 'next'\"\n    [class.error]=\"event.type === 'error'\"\n    [class.complete]=\"event.type === 'complete'\"\n    [style.left]=\"calculateMarkerPosition(event.time)\"\n    (mouseenter)=\"onMarkerHover(event, $event)\"\n    (mouseleave)=\"onMarkerHover(null)\"\n  >\n    {{ event.value ? event.value.charAt(0) : event.type.charAt(0).toUpperCase() }}\n  </div>\n\n  <div *ngIf=\"showTooltip && hoveredEvent\" class=\"tooltip\" [ngStyle]=\"{left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px'}\">\n    <div>Time: {{ hoveredEvent.time }}ms</div>\n    <div *ngIf=\"hoveredEvent.value\">Value: {{ hoveredEvent.value }}</div>\n  </div>\n</div>\n", styles: [".marble-diagram{display:flex;align-items:center;height:50px;border:1px solid #ccc;margin-bottom:10px;position:relative;overflow-x:auto;overflow-y:hidden}.marker{position:absolute;height:20px;display:flex;align-items:center;justify-content:center;font-weight:700;padding:0 5px;border-radius:3px;transition:left .3s ease-in-out}.marker.next{background-color:#90ee90;border:1px solid green}.marker.error{background-color:#f08080;border:1px solid red}.marker.complete{background-color:#add8e6;border:1px solid blue}.time-line{position:absolute;left:0;height:2px;width:100%;background-color:#ccc}.tooltip{position:fixed;background:#fff;border:1px solid #ccc;padding:5px;border-radius:3px;box-shadow:0 2px 4px #0003;z-index:1000;pointer-events:none}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { observable: [{
                type: Input
            }], duration: [{
                type: Input
            }], maxMarkers: [{
                type: Input
            }] } });

class MarbleDiagramModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: MarbleDiagramModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.1.7", ngImport: i0, type: MarbleDiagramModule, declarations: [MarbleDiagramComponent], imports: [SlicePipe,
            CommonModule], exports: [MarbleDiagramComponent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: MarbleDiagramModule, imports: [CommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.7", ngImport: i0, type: MarbleDiagramModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [MarbleDiagramComponent],
                    imports: [
                        SlicePipe,
                        CommonModule,
                    ],
                    exports: [MarbleDiagramComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MarbleDiagramComponent, MarbleDiagramModule };
//# sourceMappingURL=marbel-diagram-lib.mjs.map
