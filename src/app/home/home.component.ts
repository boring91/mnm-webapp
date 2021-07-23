import {
    Component,
    EventEmitter,
    Injector,
    Input,
    NgModuleRef,
    OnDestroy,
    OnInit,
    Output,
    ViewContainerRef,
} from '@angular/core';
import {
    LoadingService,
    ModalService,
    NotificationService,
} from '../../../projects/mnm-webapp/src/public_api';
import { HomeService } from './home.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    public constructor(
        private testService: ModalService,
        private module: NgModuleRef<any>
    ) {}

    public async showModal(): Promise<void> {
        // return;
        await this.testService.show(TestModalComponent, {
            moduleRef: this.module,
            beforeInit: c => {
                c.input = { value: 'hello' };
            },
        });
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
export class TestModalComponent implements OnInit, OnDestroy {
    @Input() public input: any;
    @Output() public emit = new EventEmitter();

    public constructor(
        private testService: ModalService,
        private homeService: HomeService,
        private loadingService: LoadingService
    ) {
        loadingService.showLoading();

        setTimeout(() => {
            this.loadingService.hideLoading();
        }, 3000);
    }

    public ngOnInit(): void {
        console.log(this.input.value);
    }

    public showModal(): void {
        this.testService.show(TestModalComponent);
    }

    public ngOnDestroy(): void {
        console.log('destroyed');
    }
}
