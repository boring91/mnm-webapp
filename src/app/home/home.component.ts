import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { ModalService } from '../../../projects/mnm-webapp/src/public_api';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    public constructor(private testService: ModalService) {}

    public async showModal(): Promise<void> {
        await this.testService.show(TestModalComponent);
    }
}























@Component({
    selector: 'app-test-modal',
    template: `
        <div>
            <h5 style="margin: 0">
                Lorem ipsum dolor sit amet, consectetur ag elit. Nam sit amet
                diam dui. Nunc condim Lorem ipsum dolor sit amet, consectetur ag
                elit. Nam sit amet diam dui. Nunc condim Lorem ipsum dolor sit
                amet, consectetur ag elit. Nam sit amet diam dui. Nunc condim
            </h5>
            <h3>Show another?</h3>
            <h4>The input is {{ input }}</h4>
            <p>
                Lorem ipsum dolor sit amet, consectetur ag elit. Nam sit amet
                diam dui. Nunc condim Lorem ipsum dolor sit amet, consectetur ag
                elit. Nam sit amet diam dui. Nunc condim Lorem ipsum dolor sit
                amet, consectetur ag elit. Nam sit amet diam dui. Nunc condim
                Lorem ipsum dolor sit amet, consectetur ag elit. Nam sit amet
                diam dui. Nunc condim Lorem ipsum dolor sit amet, consectetur ag
                elit. Nam sit amet diam dui. Nunc condim Lorem ipsum dolor sit
                amet, consectetur ag elit. Nam sit amet diam dui. Nunc condim
                Lorem ipsum dolor sit amet, consectetur ag elit. Nam sit amet
                diam dui. Nunc condim Lorem ipsum dolor sit amet, consectetur ag
                elit. Nam sit amet diam dui. Nunc condim Lorem ipsum dolor sit
                amet, consectetur ag elit. Nam sit amet diam dui. Nunc condim
                Lorem ipsum dolor sit amet, consectetur ag elit. Nam sit amet
                diam dui. Nunc condim Lorem ipsum dolor sit amet, consectetur ag
                elit. Nam sit amet diam dui. Nunc condim Lorem ipsum dolor sit
                amet, consectetur ag elit. Nam sit amet diam dui. Nunc condim
                Lorem ipsum dolor sit amet, consectetur ag elit. Nam sit amet
                diam dui. Nunc condim Lorem ipsum dolor sit amet, consectetur ag
                elit. Nam sit amet diam dui. Nunc condim Lorem ipsum dolor sit
                amet, consectetur ag elit. Nam sit amet diam dui. Nunc condim
                Lorem ipsum dolor sit amet, consectetur ag elit. Nam sit amet
                diam dui. Nunc condim Lorem ipsum dolor sit amet, consectetur ag
                elit. Nam sit amet diam dui. Nunc condim Lorem ipsum dolor sit
                amet, consectetur ag elit. Nam sit amet diam dui. Nunc condim
                Lorem ipsum dolor sit amet, consectetur ag elit. Nam sit amet
                diam dui. Nunc condim Lorem ipsum dolor sit amet, consectetur ag
                elit. Nam sit amet diam dui. Nunc condim Lorem ipsum dolor sit
                amet, consectetur ag elit. Nam sit amet diam dui. Nunc condim
                Lorem ipsum dolor sit amet, consectetur ag elit. Nam sit amet
                diam dui. Nunc condim Lorem ipsum dolor sit amet, consectetur ag
                elit. Nam sit amet diam dui. Nunc condim Lorem ipsum dolor sit
                amet, consectetur ag elit. Nam sit amet diam dui. Nunc condim
                Lorem ipsum dolor sit amet, consectetur ag elit. Nam sit amet
                diam dui. Nunc condim Lorem ipsum dolor sit amet, consectetur ag
                elit. Nam sit amet diam dui. Nunc condim Lorem ipsum dolor sit
                amet, consectetur ag elit. Nam sit amet diam dui. Nunc condim
            </p>
            <button (click)="showModal()">Show another modal?</button>
            <button class="mr-2" (click)="emit.emit()">Emit an event?</button>
        </div>
    `,
})
export class TestModalComponent implements OnDestroy {
    @Input() public input = 'Initial input';
    @Output() public emit = new EventEmitter();

    public constructor(private testService: ModalService) {}

    public showModal(): void {
        this.testService.show(TestModalComponent);
    }

    public ngOnDestroy(): void {
        console.log('destroyed');
    }
}
