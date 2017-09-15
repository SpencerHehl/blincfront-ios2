import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';

import { ProfileService } from '../shared/profile.service';
import { ProfilePage } from '../../../pages/profile/profile.component';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    templateUrl: 'followlist.component.html'
})
export class FollowListPage{
    followList: any[];
    listType: string;

    constructor(private profileService: ProfileService, private navCtrl: NavController,
         private navParams: NavParams, private alertCtrl: AlertController){}

    ionViewWillLoad(){
        this.followList = this.navParams.get('followList');
        console.log(this.followList);
        this.followList.map((user)=>{
            if(user.followed){
                user.followColor = 'primary';
                user.followText = "Followed";
            }else{
                user.followColor = 'dark';
                user.followText = "Unfollowed";
            }
        })
        this.listType = this.navParams.get('listType');
    }

    followUser(user){
        user.followed = !user.followed;
        if(user.followed){
            user.followColor = 'Primary';
            user.followText = "Followed";
            this.profileService.follow(user._id).subscribe(
                response => {},
                err => this.failAlert(err)
            )
        }else{
            user.followColor = 'dark';
            user.followText = "Unfollowed";
            this.profileService.unfollow(user._id).subscribe(
                response => {},
                err => this.failAlert(err)
            )
        }
    }

    viewProfile(user){
        this.navCtrl.push(ProfilePage, {user: user});
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