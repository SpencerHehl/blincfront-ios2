import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FacebookAuth, GoogleAuth } from '@ionic/cloud-angular';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login.component';
import { NotificationService } from '../shared/services/notifications.service';
import { LocationService } from '../shared/services/location.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen,
      private notificationService: NotificationService, private locService: LocationService,
      private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}
