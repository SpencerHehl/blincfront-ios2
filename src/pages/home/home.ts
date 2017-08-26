import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../shared/services/auth.service';
import { ProfilePage } from '../profile/profile.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private authService: AuthService) {}

  myProfile(){
    this.navCtrl.push(ProfilePage, {user: this.authService.mongoUser});
  }
}
