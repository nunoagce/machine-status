import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineHistoryComponent } from './machine-history.component';
import { Machine } from '../../models/machine';
import { By } from '@angular/platform-browser';

describe('MachineHistoryComponent', () => {
    let component: MachineHistoryComponent;
    let fixture: ComponentFixture<MachineHistoryComponent>;
    const machine: Machine = {
        id: 2,
        name: 'test-name',
        status: 'ON',
        history: [
            { status: 'ON', time: new Date() },
            { status: 'OFF', time: new Date() },
            { status: 'ON', time: new Date() },
        ]
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MachineHistoryComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MachineHistoryComponent);
        component = fixture.componentInstance;
        component.machine = machine;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render a card', () => {
        const card = fixture.debugElement.query(By.css('[data-test="card"]'));
        expect(card).toBeTruthy();
    });

    it('should render the machine name as card title', () => {
        const cardTitle = fixture.debugElement.query(By.css('[data-test="card-title"]'));
        expect(cardTitle).toBeTruthy();
        expect((cardTitle.nativeElement as HTMLElement).textContent?.trim()).toBe(machine.name);
    });

    it('should render the machine status', () => {
        let status = fixture.debugElement.query(By.css('[data-test="status"]'));
        expect(status).toBeTruthy();
        let statusElement = status.nativeElement as HTMLElement;
        expect(statusElement.textContent?.trim()).toBe('ON');
        expect(statusElement.classList).toContain('text-success');

        component.machine.status = 'OFF';
        fixture.detectChanges();
        status = fixture.debugElement.query(By.css('[data-test="status"]'));
        expect(status).toBeTruthy();
        statusElement = status.nativeElement as HTMLElement;
        expect(statusElement.textContent?.trim()).toBe('OFF');
        expect(statusElement.classList).toContain('text-danger');
    });

    it('should render the machine status history', () => {
        const status = fixture.debugElement.queryAll(By.css('[data-test="history"]'));
        expect(status.length).toBe(3);
        const firstStatusElement = status[0].nativeElement as HTMLElement;
        expect(firstStatusElement.textContent?.trim()).toContain('ON');
        const secondStatusElement = status[1].nativeElement as HTMLElement;
        expect(secondStatusElement.textContent?.trim()).toContain('OFF');
    });
});
