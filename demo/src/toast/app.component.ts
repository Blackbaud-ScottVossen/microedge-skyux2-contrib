import { Component, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SkyContribToastComponent } from '../../../src/modules/toast';

import { MicroedgeSkyContribModule } from '../../../src/core';

import { Bootstrapper } from '../../bootstrapper';

@Component({
  selector: 'sky-demo-app',
  templateUrl: './app.component.html'
})
class AppComponent {
  @ViewChild('toastA') public toastA: SkyContribToastComponent;
  @ViewChild('toastB') public toastB: SkyContribToastComponent;

  public openToastA() {
    this.toastA.showSuccess('toast A');
  }

  public openToastB() {
    this.toastB.showSuccess('toast B', '', false);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    MicroedgeSkyContribModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
class AppModule { }

Bootstrapper.bootstrapModule(AppModule);
