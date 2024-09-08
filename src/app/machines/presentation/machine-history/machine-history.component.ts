import { Component, Input } from '@angular/core';
import { Machine } from '../../models/machine';
import { DatePipe, NgClass, NgFor, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-machine-history',
    standalone: true,
    imports: [NgClass, UpperCasePipe, NgFor, DatePipe],
    templateUrl: './machine-history.component.html',
    styleUrl: './machine-history.component.scss'
})
export class MachineHistoryComponent {

    @Input({ required: true }) machine!: Machine;

}
