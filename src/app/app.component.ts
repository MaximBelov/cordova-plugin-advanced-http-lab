import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is('cordova')){
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
      if (this.platform.is('cordova') && this.platform.is('ios')) {
        const i = document.createElement('iframe');
        i.style.display = 'none';
        document.body.appendChild(i);
        // @ts-ignore
        window.console = i.contentWindow.console;
      }
    });
  }
}
