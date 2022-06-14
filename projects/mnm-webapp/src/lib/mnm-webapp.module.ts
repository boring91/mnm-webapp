import { ModuleWithProviders, NgModule } from '@angular/core';
import { MNMConfig } from './mnm-config';
import { MNM_CONFIG } from './mnm.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MNMHttpInterceptor } from './services/http/mnm-http.interceptor';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification/notification.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NotificationService } from './components/notification/notification.service';
import { LoadingService } from './components/loading/loading.service';
import { UploadService } from './services/upload/upload.service';
import { OauthService } from './services/oauth.service';
import { BroadcasterService } from './services/broadcaster/broadcaster.service';
import { OnCreateDirective, ContextMenuDirective } from './directives';
import { WizardComponent } from './components/wizard/wizard.component';
import { DefaultNotificationHandler } from './components/notification/default.notification-handler';
import { MNM_NOTIFICATION_HANDLER } from './components/notification/notification-handler';
import { MnmMainComponent } from './components/main/main.component';
import { ModalService } from './services/modal/modal.service';
import { ModalComponent } from './services/modal/components/modal/modal.component';
import { ModalContainerComponent } from './services/modal/components/modal-container/modal-container.component';
import { LocalStorageAccessorService } from '../public_api';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        // HttpClientModule
    ],
    declarations: [
        // Will be exported
        NotificationComponent,
        LoadingComponent,
        WizardComponent,
        MnmMainComponent,
        OnCreateDirective,
        ContextMenuDirective,

        // Used internally
        ModalComponent,
        ModalContainerComponent,
    ],
    exports: [
        NotificationComponent,
        LoadingComponent,
        MnmMainComponent,
        WizardComponent,
        OnCreateDirective,
        ContextMenuDirective,
    ],
})
export class MnmWebappModule {
    static forRoot(
        mnmConfig?: MNMConfig
    ): ModuleWithProviders<MnmWebappModule> {
        return {
            ngModule: MnmWebappModule,
            providers: [
                NotificationService,
                LoadingService,
                UploadService,
                ModalService,
                { provide: MNM_CONFIG, useValue: mnmConfig },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MNMHttpInterceptor,
                    multi: true,
                },
                {
                    provide: MNM_NOTIFICATION_HANDLER,
                    useClass: DefaultNotificationHandler,
                    multi: false,
                },
                OauthService,
                BroadcasterService,
                LocalStorageAccessorService,
            ],
        };
    }

    static forChild(): ModuleWithProviders<MnmWebappModule> {
        return {
            ngModule: MnmWebappModule,
            providers: [
                // {provide: HTTP_INTERCEPTORS, useClass: MNMHttpInterceptor, multi: true},
            ],
        };
    }
}
