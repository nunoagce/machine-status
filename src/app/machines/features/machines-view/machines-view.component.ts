import { Component, inject } from '@angular/core';
import { MachineStateService } from '../../data-access/machine-state.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MachineListItemComponent } from '../../presentation/machine-list-item/machine-list-item.component';
import { MachineHistoryComponent } from '../../presentation/machine-history/machine-history.component';

@Component({
    selector: 'app-machines-view',
    standalone: true,
    imports: [NgIf, NgFor, AsyncPipe, MachineListItemComponent, MachineHistoryComponent],
    templateUrl: './machines-view.component.html',
    styleUrl: './machines-view.component.scss'
})
export class MachinesViewComponent {

    state = inject(MachineStateService);

    private focusedMachineId$ = new BehaviorSubject<number>(0); // there are no machines with id 0, so no machine starts focused

    machines$ = this.state.getMachines();

    focusedMachine$ = combineLatest({
        list: this.machines$,
        focusedId: this.focusedMachineId$
    }).pipe(map(({ list, focusedId }) => list.find(m => m.id === focusedId)))

    focusOn(id: number) {
        this.focusedMachineId$.next(id);
    }
}
