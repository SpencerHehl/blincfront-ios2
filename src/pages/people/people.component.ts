import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { UserService } from '../../shared/services/user.service';
import { ProfileService } from '../profile/shared/profile.service';

@Component({
    templateUrl: 'people.component.html'
})
export class PeoplePage{
    nearbyList: any[];
    searchList: any[];

    constructor(private userService: UserService, private profileService: ProfileService,
         private alertCtrl: AlertController){}

    ionViewDidLoad(){
        /*this.userService.getTopUsers().subscribe(
            response => {
                this.nearbyList = response;
            }
        )*/
    }

    followUser(user){
        user.followed = !user.followed;
        if(user.followed){
            user.followColor = 'primary';
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

    searchUsers(input: any){
        let value = input.data;
        if(value && value.trim() !== ''){
            this.userService.searchUsers(value).subscribe(
                resp => {
                    this.searchList = resp;
                }
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