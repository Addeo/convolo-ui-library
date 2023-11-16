import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'alfa-progress',
    templateUrl: './alfa-progress.component.html',
    styleUrls: ['./alfa-progress.component.scss'],
    standalone: true,
})
export class AlfaProgressComponent implements OnInit {
    @Input() progress: number | undefined = 0;
    constructor() {}

    ngOnInit() {}
}
