import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { UserService } from '../../shared/services/user.service';
import { ProfileService } from '../profile/shared/profile.service';
import { ProfilePage } from '../profile/profile.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    templateUrl: 'people.component.html'
})
export class PeoplePage{
    nearbyList: any[];
    searchList: any[];
    followRequests: any[];
    searchText: any;

    constructor(private userService: UserService, private profileService: ProfileService,
         private alertCtrl: AlertController, private navCtrl: NavController,
         private authService: AuthService){}

    ionViewDidLoad(){
        /*this.userService.getTopUsers().subscribe(
            response => {
                this.nearbyList = response;
            }
        )*/
        this.userService.getFollowRequests().subscribe(
            response => {
                this.followRequests = response;
            }
        )
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

    viewProfile(user){
        this.navCtrl.push(ProfilePage, {user: user});
    }

    approveRequest(req){
        console.log(req);
        this.userService.approveFollowReq(req._id, true).subscribe(
            response => {
                req.status = 'Approved';
                console.log(req);
            }
        )
    }

    declineRequest(req){
        console.log(req);
        this.userService.approveFollowReq(req._id, false).subscribe(
            response => {
                req.status = 'Declined';
                console.log(req);
            }
        )
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