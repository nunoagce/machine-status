import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Machine } from '../../models/machine';
import { NgClass, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-machine-list-item',
    standalone: true,
    imports: [UpperCasePipe, NgClass],
    templateUrl: './machine-list-item.component.html',
    styleUrl: './machine-list-item.component.scss'
})
export class MachineListItemComponent {

    @Input({ required: true }) machine!: Machine;

    @Output() itemClicked = new EventEmitter<void>();
}
