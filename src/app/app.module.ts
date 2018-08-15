import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MnmWebappModule} from 'mnm-webapp';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MnmWebappModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
