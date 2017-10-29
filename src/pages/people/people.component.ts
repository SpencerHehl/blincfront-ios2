import { Component } from '@angular/core';
import { AlertController, NavController, ActionSheetController, ToastController } from 'ionic-angular';
import { Contacts, Contact } from '@ionic-native/contacts';
import { SMS } from '@ionic-native/sms';

import { UserService } from '../../shared/services/user.service';
import { ProfileService } from '../profile/shared/profile.service';
import { ProfilePage } from '../profile/profile.component';
import { AuthService } from '../../shared/services/auth.service';
import { PostService } from '../../shared/services/post.service';
import { MediaService } from '../../shared/services/media.service';

@Component({
    templateUrl: 'people.component.html'
})
export class PeoplePage{
    nearbyList: any[];
    searchList: any[];
    followRequests: any[];
    followPosts: any[];
    searchText: any;
    loaded: boolean = false;

    constructor(private userService: UserService, private profileService: ProfileService,
         private alertCtrl: AlertController, private navCtrl: NavController,
         private authService: AuthService, private postService: PostService,
         private mediaService: MediaService, private contacts: Contacts,
         private sms: SMS, private toastCtrl: ToastController,
         private actionSheetCtrl: ActionSheetController){
             this.followPosts = [];
         }

    ionViewDidEnter(){
        this.postService.followPage = 1;
        this.postService.getFollowPosts().subscribe(
            response => {
                this.followPosts = response;
                this.loaded = true;
            }
        )
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
        this.userService.approveFollowReq(req._id, true).subscribe(
            response => {
                req.status = 'Approved';
            }
        )
    }

    declineRequest(req){
        this.userService.approveFollowReq(req._id, false).subscribe(
            response => {
                req.status = 'Declined';
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

    reloadPosts(refresher){
        this.postService.getFollowPosts().subscribe(
            response => {
                this.followPosts = response;
                refresher.complete();
            }
        )
        this.userService.getFollowRequests().subscribe(
            response => {
                this.followRequests = response;
            }
        )
    }

    loadMore(infiniteScroll){
        this.postService.loadMoreFollow().subscribe(
            response => {
                if(response.length > 0){
                    Array.prototype.push.apply(this.followPosts, response);
                }
                infiniteScroll.complete();
            }
        )
    }

    inviteFriends(){
        let inviteSheet = this.actionSheetCtrl.create({
            title: 'Invite Friends',
            buttons: [
                {
                    text: 'Message',
                    handler: () => {
                        this.inviteMessage();
                    }
                }
            ]
        })
        inviteSheet.present();
    }

    inviteMessage(){
        let inviteMessage = 'Check out Blinc, a new way of connecting to people, places, and events near you! www.blincapp.com';
        let number;
        this.contacts.pickContact().then((contact) => {
            number = contact.phoneNumbers[0].value;
        });
        this.sms.hasPermission().then((hasPermission) => {
            if(hasPermission){
                this.sms.send(number, inviteMessage);
            }else{
                this.failAlert('Blinc does not have permissions for this function. Please grant it permission to messages in your settings and try again.');
            }
        })
        .catch((err) => {
            this.failAlert(err);
        })
    }

    presentToast(message){
        let toast = this.toastCtrl.create({
            message:message,
            duration:3000
        });
        toast.present();
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