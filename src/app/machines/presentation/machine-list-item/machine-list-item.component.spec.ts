import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineListItemComponent } from './machine-list-item.component';
import { Machine } from '../../models/machine';
import { By } from '@angular/platform-browser';

describe('MachineListItemComponent', () => {
    let component: MachineListItemComponent;
    let fixture: ComponentFixture<MachineListItemComponent>;
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
            imports: [MachineListItemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MachineListItemComponent);
        component = fixture.componentInstance;
        component.machine = machine;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render a button with the machine name', () => {
        const button = fixture.debugElement.query(By.css('button'));
        expect(button).toBeTruthy();
        expect((button.nativeElement as HTMLButtonElement).textContent?.trim()).toBe(machine.name);
    })

    it('should render a badge with the amount of status changes of the machine', () => {
        const badge = fixture.debugElement.query(By.css('[data-test="badge"]'));
        expect(badge).toBeTruthy();
        expect((badge.nativeElement as HTMLElement).textContent?.trim()).toBe(machine.history.length.toString());
    })

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
    })


    it('should emit when the button is clicked', () => {
        spyOn(component.itemClicked, 'emit');

        const button: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('button');
        expect(button).toBeTruthy();

        button.click();

        expect(component.itemClicked.emit).toHaveBeenCalled();
    })
});
