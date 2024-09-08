import { Injectable } from '@angular/core';
import { Observable, interval, map, of } from 'rxjs';
import { ApiMachine } from './api-machine';
import { ApiMachineChange } from './api-machine-change';

@Injectable({
    providedIn: 'root'
})
export class MachineService {

    private fakeWebsocket$: Observable<ApiMachineChange> = interval(2000).pipe(
        map(() => Math.floor(Math.random() * 7) + 1), // random integer between 1 and 7
        map(id => {
            return {
                id,
                isOn: Math.random() < 0.5
            }
        })
    );

    getMachineChanges(): Observable<ApiMachineChange> {
        return this.fakeWebsocket$;
    }

    getById(id: number): Observable<ApiMachine> {
        return of({ id: id, name: `Machine ${id}` });
    }
}
