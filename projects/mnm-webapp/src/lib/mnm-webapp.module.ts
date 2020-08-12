import { ModuleWithProviders, NgModule } from '@angular/core';
import { MNMConfig } from './mnm-config';
import { MNM_CONFIG } from './mnm.config';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  declarations: [
    NotificationComponent,
    LoadingComponent,
    OnCreateDirective,
    WizardComponent,
    ContextMenuDirective
  ],
  exports: [
    NotificationComponent,
    LoadingComponent,
    OnCreateDirective,
    WizardComponent,
    ContextMenuDirective
  ]
})
export class MnmWebappModule {
  static forRoot(mnmConfig?: MNMConfig): ModuleWithProviders<MnmWebappModule> {
    return {
      ngModule: MnmWebappModule,
      providers: [
        NotificationService,
        LoadingService,
        UploadService,
        { provide: MNM_CONFIG, useValue: mnmConfig },
        { provide: HTTP_INTERCEPTORS, useClass: MNMHttpInterceptor, multi: true },
        OauthService,
        BroadcasterService,
      ]
    };
  }

  static forChild(): ModuleWithProviders<MnmWebappModule> {
    return {
      ngModule: MnmWebappModule,
      providers: [
        // {provide: HTTP_INTERCEPTORS, useClass: MNMHttpInterceptor, multi: true},
      ]
    };
  }
}
