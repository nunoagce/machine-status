import { TestBed, tick } from '@angular/core/testing';

import { MachineStateService } from './machine-state.service';
import { Subject, delay, of, takeUntil } from 'rxjs';
import { ApiMachineChange } from '../../api-contracts/machines/api-machine-change';
import { ApiMachine } from '../../api-contracts/machines/api-machine';
import { MachineService } from '../../api-contracts/machines/machine.service';

describe('MachineStateService', () => {
    let service: MachineStateService;
    const machinesChangesResponse = new Subject<ApiMachineChange>();
    let machineServiceSpy: jasmine.SpyObj<MachineService>;
    const fakeMachineNamePrefix = 'fake-name-'
    let destroy$: Subject<void>;

    beforeEach(() => {
        destroy$ = new Subject<void>();

        machineServiceSpy = jasmine.createSpyObj<MachineService>(['getById', 'getMachineChanges']);
        machineServiceSpy.getById.and.callFake((id: number) => of({ id: id, name: fakeMachineNamePrefix + id }));
        machineServiceSpy.getMachineChanges.and.returnValue(machinesChangesResponse.asObservable());

        TestBed.configureTestingModule({
            providers: [{ provide: MachineService, useValue: machineServiceSpy }]
        });
        service = TestBed.inject(MachineStateService);
    });

    afterEach(() => {
        destroy$.next();
        destroy$.complete();
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should connect to the machine changes stream', () => {
        expect(machineServiceSpy.getMachineChanges).toHaveBeenCalled();
        service.getMachines()
            .pipe(takeUntil(destroy$))
            .subscribe(machines => {
                expect(machines.length).toBe(0);
            })
    });

    describe('when receiving a change event for a new machine', () => {
        it('should get the details of the machine', () => {
            const machineOn: ApiMachineChange = { id: 3, isOn: true };
            machinesChangesResponse.next(machineOn);

            expect(machineServiceSpy.getById).toHaveBeenCalledWith(machineOn.id);
        })

        it('should emit the machine name and that the machine is on', () => {
            const machineOn: ApiMachineChange = { id: 3, isOn: true };
            machinesChangesResponse.next(machineOn);

            service.getMachines()
                .pipe(takeUntil(destroy$))
                .subscribe(machines => {
                    expect(machines.length).toBe(1);
                    expect(machines[0].id).toBe(machineOn.id)
                    expect(machines[0].name).toBe(fakeMachineNamePrefix + machineOn.id);
                    expect(machines[0].status).toBe('ON');
                })
        })

        it('should emit that the machine is off', () => {
            const machineOn: ApiMachineChange = { id: 3, isOn: false };
            machinesChangesResponse.next(machineOn);

            service.getMachines()
                .pipe(takeUntil(destroy$))
                .subscribe(machines => {
                    expect(machines.length).toBe(1);
                    expect(machines[0].id).toBe(machineOn.id)
                    expect(machines[0].status).toBe('OFF');
                })
        })

        it('should emit the machine status history', () => {
            const machineOn: ApiMachineChange = { id: 3, isOn: false };
            machinesChangesResponse.next(machineOn);

            service.getMachines()
                .pipe(takeUntil(destroy$))
                .subscribe(machines => {
                    expect(machines.length).toBe(1);
                    expect(machines[0].id).toBe(machineOn.id)
                    expect(machines[0].history.length).toBe(1);
                    expect(machines[0].history[0].status).toBe('OFF');
                })
        })
    })

    describe('when receiving a second change event', () => {
        const firstEvent: ApiMachineChange = { id: 3, isOn: true };
        beforeEach(() => {
            machinesChangesResponse.next(firstEvent);
        })

        describe('when is the same id', () => {
            const secondEvent: ApiMachineChange = { id: 3, isOn: false };
            beforeEach(() => {
                machinesChangesResponse.next(secondEvent);
            })

            it('should not repeat call to get machine details', () => {
                expect(machineServiceSpy.getById).toHaveBeenCalledTimes(1);
            })

            it('should update the status in the machine list', () => {
                service.getMachines()
                    .pipe(takeUntil(destroy$))
                    .subscribe(machines => {
                        expect(machines.length).toBe(1);
                        expect(machines[0].id).toBe(firstEvent.id)
                        expect(machines[0].status).toBe('OFF');
                        expect(machines[0].history.length).toBe(2);
                        expect(machines[0].history[0].status).toBe('ON');
                        expect(machines[0].history[1].status).toBe('OFF');
                    })
            })
        })

        describe('when is not the same id', () => {
            const secondEvent: ApiMachineChange = { id: 5, isOn: true };
            beforeEach(() => {
                machinesChangesResponse.next(secondEvent);
            })

            it('should get machine details for both events once', () => {
                expect(machineServiceSpy.getById).toHaveBeenCalledTimes(2);
                expect(machineServiceSpy.getById).toHaveBeenCalledWith(firstEvent.id);
                expect(machineServiceSpy.getById).toHaveBeenCalledWith(secondEvent.id);
            })

            it('should append the machine to the machine list', () => {
                service.getMachines()
                    .pipe(takeUntil(destroy$))
                    .subscribe(machines => {
                        expect(machines.length).toBe(2);
                        expect(machines[0].id).toBe(firstEvent.id)
                        expect(machines[1].id).toBe(secondEvent.id)
                    })
            })
        })
    })
});
