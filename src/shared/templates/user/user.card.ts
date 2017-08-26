import { Component, Input } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { ProfileService } from '../../../pages/profile/shared/profile.service';
import { ProfilePage } from '../../../pages/profile/profile.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'user-card',
    templateUrl: 'user.card.html'
})
export class UserCardComponent{
    @Input() User: any;
    followColor: string;
    followText: string;

    constructor(private profileService: ProfileService, private navCtrl: NavController,
         private alertCtrl: AlertController, private authService: AuthService){}

    ngOnInit(){
        if(this.User.followed){
            this.followColor = "primary";
            this.followText = "Followed";
        }else{
            this.followColor = "dark";
            this.followText = "Unfollowed";
        }
    }

    viewProfile(){
        this.navCtrl.push(ProfilePage, {user: this.User});
    }

    followUser(){
        this.User.followed = !this.User.followed;
        if(this.User.followed){
            this.followColor = 'primary';
            this.followText = "Followed";
            this.profileService.follow(this.User._id).subscribe(
                response => {},
                err => this.failAlert(err)
            )
        }else{
            this.followColor = 'dark';
            this.followText = "Unfollowed";
            this.profileService.unfollow(this.User._id).subscribe(
                response => {},
                err => this.failAlert(err)
            )
        }
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