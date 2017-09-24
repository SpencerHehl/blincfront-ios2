import { Component } from '@angular/core';
import { NavParams, AlertController, NavController, LoadingController } from 'ionic-angular';
import { FacebookAuth, GoogleAuth, User } from '@ionic/cloud-angular';
import { Diagnostic } from '@ionic-native/diagnostic';

import { AuthService } from '../../shared/services/auth.service';
import { PostService } from '../../shared/services/post.service';
import { LocationService } from '../../shared/services/location.service';
import { TabsPage } from '../tabs/tabs';

@Component({
    templateUrl: 'login.component.html'
})
export class LoginPage {
    loading: any;

    constructor(public alertCtrl: AlertController, private authService: AuthService,
        private NavParams: NavParams, private user: User, public navController: NavController,
        private facebookAuth: FacebookAuth, private googleAuth: GoogleAuth,
        private loadingCtrl: LoadingController, private postService: PostService,
        private locService: LocationService, private diagnostic: Diagnostic){}

    ionViewWillLoad(){
        this.checkLocation();
    }

    checkLocation(){
        this.locService.checkLocationEnabled().then((isAvailable) => {
            if(isAvailable){
                this.locService.initializeLocation().then((resp) => {
                    this.locService.lat = resp.coords.latitude;
                    this.locService.lng = resp.coords.longitude;
                    this.locService.startTracking();
                    this.tokenLogin();
                }).catch((err) => {
                    this.locService.checkLocationAuth().then((isAuthorized) => {
                        if(isAuthorized){
                            this.failAlert("Oops! Looks like something went wrong and we can't seem to find your location.");
                        }else{
                            this.locationAuthFail();
                        }
                    })
                })
            }else{
                this.locationFail();
            }
        })
    }

    tokenLogin(){
        if(this.facebookAuth.getToken()){
            if(this.user.social.facebook){
                this.authService.authMethod = "facebook";
                this.authService.currentUser = this.user.social.facebook.data;
                this.authService.login().subscribe(
                    response => {
                        this.navController.setRoot(TabsPage);
                    },
                    err => {
                        this.failAlert(err);
                    }
                )
            }else if(this.user.social.google){
                this.authService.authMethod = "google";
                this.authService.currentUser = this.user.social.google.data;
                this.authService.login().subscribe(
                    response => {
                        this.navController.setRoot(TabsPage);
                    },
                    err => {
                            this.failAlert(err);                            
                    }
                )
            }
        }
    }

    presentLoader(){
        this.loading = this.loadingCtrl.create({
            content: 'Loading...'
        })

        this.loading.present();
    }

    facebookLogin(){
        this.presentLoader();
        console.log("facebook login");
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
                    response => {
                        this.loading.dismiss().then(() => {
                            this.navController.setRoot(TabsPage); 
                        })
                    },
                    err => {
                        this.loading.dismiss().then(() => {
                            this.failAlert(err);                            
                        })                    
                    }
                );
            }else{
                console.log("logging in");                
                this.authService.login().subscribe(
                    response => {
                        this.loading.dismiss().then(() => {
                            this.navController.setRoot(TabsPage);
                        })
                    },
                    err => {
                        this.loading.dismiss().then(() => {
                            this.failAlert(err);                            
                        })                    
                    }
                )
            }
        })
        .catch((err) => {
            console.log(err);            
            {
                this.loading.dismiss().then(() => {
                    this.failAlert(err);                            
                })            
            };
        });
    }

    googleLogin(){
        this.presentLoader();
        this.googleAuth.login().then((result) =>{
            this.googleAuth.storeToken(result.token);
            this.authService.authMethod = "google";
            this.authService.currentUser = this.user.social.google.data;
            if(result.signup){
                this.authService.authToken = result.token;
                this.authService.newUser(this.user.social.google.data).subscribe(
                    response => {
                        this.loading.dismiss().then(() => {
                            this.navController.setRoot(TabsPage);
                        })
                    },
                    err => {
                        this.loading.dismiss().then(() => {
                            this.failAlert(err);                            
                        })                    
                    }
                );
            }else{
                this.authService.login().subscribe(
                    response => {
                        this.loading.dismiss().then(() => {
                            this.navController.setRoot(TabsPage);
                        })
                    },
                    err => {
                        this.loading.dismiss().then(() => {
                            this.failAlert(err);                            
                        })                    
                    }
                )
            }
        })
        .catch((err) => {
            {
                this.loading.dismiss().then(() => {
                    this.failAlert(err);                            
                })            
            }
        });
    }

    failAlert(message){
        this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: message,
                buttons: ['OK']
            });
            alert.present();
        })
    }

    locationAuthFail(){
        let alert = this.alertCtrl.create({
            title: 'Location',
            subTitle: 'This app must have access to your location to function. Press "OK" to enable and then swipe down to refresh when you return to the app.',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        alert.dismiss().then(() => {
                            this.diagnostic.switchToSettings();
                        })
                    }
                }
            ]
        })
        alert.present();
    }

    locationFail(){
        let alert = this.alertCtrl.create({
            title: 'Location',
            subTitle: 'Location services must be enabled to use this app. Press "OK" to enable and then swipe down to refresh when you return to the app.',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        alert.dismiss().then(() => {
                            this.diagnostic.switchToLocationSettings();
                        })
                    }
                }
            ]
        })
        alert.present();
    }
}