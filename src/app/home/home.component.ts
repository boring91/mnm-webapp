import { HttpClient } from '@angular/common/http';
import {
    Component,
    EventEmitter,
    Input,
    NgModuleRef,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { first } from 'rxjs/operators';
import {
    LoadingService,
    ModalService,
    OauthService,
} from '../../../projects/mnm-webapp/src/public_api';
import { HomeService } from './home.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    public credits = -1;

    public constructor(
        private testService: ModalService,
        private module: NgModuleRef<any>,
        public oauthService: OauthService,
        public httpClient: HttpClient
    ) {
        oauthService.userInfo$.pipe(first()).subscribe(x => {
            if (!x.isLoggedIn) return;

            this.fetchCredits();
            this.fetchCredits();
            this.fetchCredits();
            this.fetchCredits();
        });
    }

    public async showModal(): Promise<void> {
        // return;
        await this.testService.show(TestModalComponent, {
            moduleRef: this.module,
            beforeInit: c => {
                c.input = { value: 'hello' };
            },
            size: {
                width: '30%',
                height: '90vh',
            },
        });
    }

    public login() {
        const username = 'm2008m1033m@gmail.com';
        const password = 'Onepiece12!';
        this.oauthService.login(username, password, true).subscribe(res => {
            console.log(res);
            this.fetchCredits();
        });
    }

    public logout() {
        this.oauthService.logout();
        this.credits = -1;
    }

    public fetchCredits() {
        this.httpClient
            .get('http://localhost:5000/account/credit')
            .subscribe(res => (this.credits = (res as any).extra));
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
        private loadingService: LoadingService,
        private moduleRef: NgModuleRef<any>
    ) {
        loadingService.showLoading();

        setTimeout(() => {
            this.loadingService.hideLoading();
        }, 3000);
    }

    public ngOnInit(): void {}

    public showModal(): void {
        this.testService.show(TestModalComponent, {
            moduleRef: this.moduleRef,
            size: {
                width: '400px',
            },
        });
    }

    public ngOnDestroy(): void {}
}
