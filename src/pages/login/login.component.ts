import { Component } from '@angular/core';
import { NavParams, AlertController, NavController } from 'ionic-angular';
import { FacebookAuth, GoogleAuth, User } from '@ionic/cloud-angular';

import { AuthService } from '../../shared/services/auth.service';
import { TabsPage } from '../tabs/tabs';

@Component({
    templateUrl: 'login.component.html'
})
export class LoginPage {
    constructor(public alertCtrl: AlertController, private authService: AuthService,
        private NavParams: NavParams, private user: User, public navController: NavController,
        private facebookAuth: FacebookAuth, private googleAuth: GoogleAuth){}

    ionViewWillLoad(){
        if(this.facebookAuth.getToken()){
            if(this.user.social.facebook){
                this.authService.authMethod = "facebook";
                this.authService.currentUser = this.user.social.facebook.data;
                this.authService.login().subscribe(
                    response => this.navController.setRoot(TabsPage),
                    err => this.failAlert(err)
                )
            }else if(this.user.social.google){
                this.authService.authMethod = "google";
                this.authService.currentUser = this.user.social.google.data;
                this.authService.login().subscribe(
                    response => this.navController.setRoot(TabsPage),
                    err => this.failAlert(err)
                )
            }
        }
    }

    facebookLogin(){
        this.facebookAuth.login().then((result) =>{
            console.log(result);
            this.facebookAuth.storeToken(result.token);
            console.log(result.token);            
            this.authService.authMethod = "facebook";
            console.log("facebook");
            console.log(this.user.social.facebook);            
            this.authService.currentUser = this.user.social.facebook.data;          
            if(result.signup){
                this.authService.authToken = result.token;
                console.log("set token");                
                this.authService.newUser(this.user.social.facebook.data).subscribe(
                    response => this.navController.setRoot(TabsPage),
                    err => this.failAlert(err)
                );
            }else{
                console.log("logging in");                
                this.authService.login().subscribe(
                    response => this.navController.setRoot(TabsPage),
                    err => this.failAlert(err)
                )
            }
        })
        .catch((err) => {
            console.log(err);            
            this.failAlert(err);
        });
    }

    googleLogin(){
        this.googleAuth.login().then((result) =>{
            this.googleAuth.storeToken(result.token);
            this.authService.authMethod = "google";
            this.authService.currentUser = this.user.social.google.data;
            if(result.signup){
                this.authService.authToken = result.token;
                this.authService.newUser(this.user.social.google.data).subscribe(
                    response => this.navController.setRoot(TabsPage),
                    err => this.failAlert(err)
                );
            }else{
                this.authService.login().subscribe(
                    response => this.navController.setRoot(TabsPage),
                    err => this.failAlert(err)
                )
            }
        })
        .catch((err) => {
            this.failAlert(err);
        });
    }

    failAlert(message){
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }
}