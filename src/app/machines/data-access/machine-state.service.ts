import { Injectable, OnDestroy, inject } from '@angular/core';
import { MachineService } from '../../api-contracts/machines/machine.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Machine } from '../models/machine';
import { ApiMachineChange } from '../../api-contracts/machines/api-machine-change';
import { ApiMachine } from '../../api-contracts/machines/api-machine';

@Injectable({
    providedIn: 'root'
})
export class MachineStateService implements OnDestroy {

    private machineService = inject(MachineService);

    private machineList$ = new BehaviorSubject<Machine[]>([]);

    private machineChangesSubscription: Subscription = this.machineService
        .getMachineChanges()
        .subscribe((change: ApiMachineChange) => {
            const loadedMachines = this.machineList$.getValue();
            const newStatus = change.isOn ? 'ON' : 'OFF'

            let changedMachine = loadedMachines.find(m => m.id === change.id)

            if (changedMachine) {
                if (changedMachine.status !== newStatus) {
                    changedMachine.status = newStatus;
                    changedMachine.history.push({ status: newStatus, time: new Date() })
                    this.machineList$.next(loadedMachines);
                }
                return;
            }

            this.machineService.getById(change.id).subscribe((response: ApiMachine) => {
                loadedMachines.push({
                    id: response.id,
                    name: response.name,
                    status: newStatus,
                    history: [{ status: newStatus, time: new Date() }]
                });
                this.machineList$.next(loadedMachines);
            })
        })

    getMachines(): Observable<Machine[]> {
        return this.machineList$.asObservable();
    }

    ngOnDestroy(): void {
        this.machineChangesSubscription?.unsubscribe();
    }

    private setMachineState(machine: Machine, newStatus: 'ON' | 'OFF') {
        if (machine.status === newStatus) {
            return;
        }
        machine.status = newStatus;
        machine.history.push({ status: newStatus, time: new Date() })
    }
}
