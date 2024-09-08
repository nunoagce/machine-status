import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesViewComponent } from './machines-view.component';
import { BehaviorSubject } from 'rxjs';
import { Machine } from '../../models/machine';
import { MachineStateService } from '../../data-access/machine-state.service';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';

describe('MachinesViewComponent', () => {
    let component: MachinesViewComponent;
    let fixture: ComponentFixture<MachinesViewComponent>;
    const machineListResponse = new BehaviorSubject<Machine[]>([]);
    let machineStateSpy: jasmine.SpyObj<MachineStateService>;

    beforeEach(async () => {
        machineStateSpy = jasmine.createSpyObj<MachineStateService>(['getMachines']);
        machineStateSpy.getMachines.and.returnValue(machineListResponse.asObservable());

        await TestBed.configureTestingModule({
            imports: [MachinesViewComponent],
            providers: [{ provide: MachineStateService, useValue: machineStateSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(MachinesViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        machineListResponse.next([])
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should subscribe to the state service', () => {
        expect(machineStateSpy.getMachines).toHaveBeenCalled();
    });

    describe('when there are no machines in state', () => {
        it('should show an alert', () => {
            const noItemsAlert = fixture.debugElement.query(By.css('[data-test="no-items-alert"]'));
            expect(noItemsAlert).toBeTruthy();
            expect((noItemsAlert.nativeElement as HTMLElement).textContent).toBe('No machines to show');
        });

        it('should not show the machine list', () => {
            const list = fixture.debugElement.query(By.css('[data-test="list"]'));
            expect(list).toBeFalsy();
        });

        it('should not show the machine history panel', () => {
            const panel = fixture.debugElement.query(By.css('[data-test="history"]'));
            expect(panel).toBeFalsy();
        });
    })

    describe('when there are machines in state', () => {
        const machinesLoaded: Machine[] = [{
            id: 1,
            name: 'machine 1',
            status: 'ON',
            history: []
        },
        {
            id: 2,
            name: 'machine 2',
            status: 'ON',
            history: []
        }];

        beforeEach(() => {
            machineListResponse.next(machinesLoaded);
            fixture.detectChanges();
        })

        it('should not show the no items alert', () => {
            const noItemsAlert = fixture.debugElement.query(By.css('[data-test="no-items-alert"]'));
            expect(noItemsAlert).toBeFalsy();
        });

        it('should show the machine list and items', () => {
            const list = fixture.debugElement.query(By.css('[data-test="list"]'));
            expect(list).toBeTruthy();
            const items = fixture.debugElement.queryAll(By.css('[data-test="list-item"]'));
            expect(items.length).toBe(2);
        });

        it('should not show the machine history panel when there is no focused machine', () => {
            const panel = fixture.debugElement.query(By.css('[data-test="history"]'));
            expect(panel).toBeFalsy();
        });

        describe('when a list item is clicked', () => {
            beforeEach(() => {
                const items = fixture.debugElement.queryAll(By.css('[data-test="list-item"]'));
                (items[1].nativeElement as HTMLElement).dispatchEvent(new Event('itemClicked'));;
                fixture.detectChanges();
            })

            it('should show the machine history panel', () => {
                const panel = fixture.debugElement.query(By.css('[data-test="history"]'));
                expect(panel).toBeTruthy();
            });
        })
    })
});
