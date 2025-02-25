import { OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as i0 from "@angular/core";
interface EventRecord {
    time: number;
    type: 'next' | 'error' | 'complete';
    value?: string | any;
}
export declare class MarbleDiagramComponent implements OnChanges, OnDestroy {
    private changeDetectorRef;
    observable: Observable<string> | undefined;
    duration: number;
    maxMarkers: number;
    eventRecords: EventRecord[];
    subscription: Subscription | null;
    isRendering: boolean;
    hoveredEvent: EventRecord | null;
    tooltipPosition: {
        x: number;
        y: number;
    };
    showTooltip: boolean;
    constructor(changeDetectorRef: ChangeDetectorRef);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private visualizeObservable;
    private addEventRecord;
    calculateMarkerPosition(eventTime: number): string;
    onMarkerHover(event: EventRecord | null, mouseEvent?: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MarbleDiagramComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MarbleDiagramComponent, "lib-marble-diagram", never, { "observable": { "alias": "observable"; "required": false; }; "duration": { "alias": "duration"; "required": false; }; "maxMarkers": { "alias": "maxMarkers"; "required": false; }; }, {}, never, never, false, never>;
}
export {};
