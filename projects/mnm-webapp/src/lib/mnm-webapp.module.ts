import { ModuleWithProviders, NgModule } from '@angular/core';
import { MNMConfig } from './config/mnm-config';
import { MNM_CONFIG } from './config/mnm.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MNMHttpInterceptor } from './services/http/mnm-http.interceptor';
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
import { LocalStorageAccessorService } from './services/local-storage-accessor.service';

@NgModule({
    imports: [
        NotificationComponent,
        LoadingComponent,
        MnmMainComponent,
    ],
    declarations: [WizardComponent, OnCreateDirective, ContextMenuDirective],
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
