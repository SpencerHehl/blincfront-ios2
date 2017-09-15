import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AuthService } from '../../../shared/services/auth.service';
import { ProfileService } from '../shared/profile.service';
import { LoginPage } from '../../login/login.component';

@Component({
    templateUrl: 'settings.component.html'
})
export class SettingsPage{
    mappable: boolean;
    profilePrivate: boolean;

    constructor(private navCtrl: NavController, private navParams: NavParams,
         private authService: AuthService, private profileService: ProfileService,
         private alertCtrl: AlertController){}

    ionViewDidLoad(){
        console.log(this.navParams.get('settings'));
        this.mappable = this.navParams.get('settings').mappableDefault;
        this.profilePrivate = this.navParams.get('settings').profilePrivate;
    }

    logout(){
        let confirmAlert = this.alertCtrl.create({
            title: 'Confirm',
            subTitle: 'Are you sure you want to log out?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        this.authService.logout().subscribe(
                            response => {},
                            err => this.failAlert(err),
                            () => {
                                this.navCtrl.setRoot(LoginPage);
                            }
                        )
                    }
                },{
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        confirmAlert.dismiss();
                    }
                }
            ]
        });
        confirmAlert.present();
    }

    failAlert(message){
        let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: message,
        buttons: ['OK']
        });
        alert.present();
    }

    save(){
        this.profileService.updateProfile(this.mappable, this.profilePrivate).subscribe(
            resp => {
                this.navCtrl.pop();
            },
            err => {
                this.failAlert(err);
            }
        );
    }

}