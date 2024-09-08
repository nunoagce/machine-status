import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MachinesViewComponent } from './machines/features/machines-view/machines-view.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MachinesViewComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'machines';
}
