import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AuthService } from '../../shared/services/auth.service';
import { ProfileService } from './shared/profile.service';
import { PostService } from '../../shared/services/post.service';
import { NotificationService } from '../../shared/services/notifications.service';
import { PostFormModal } from '../../shared/modals/posts/post-form.modal';
import { FollowListPage } from './followlist/followlist.component';
import { NotificationListPage } from '../notifications/listview/list.notification.component';
import { LoginPage } from '../login/login.component';
import { SettingsPage } from '../profile/settings/settings.component';
import { UserService } from '../../shared/services/user.service';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfilePage {
  user: any;
  followColor: string;
  followText: string;
  isActiveUser: boolean;
  notifications: any[];
  passedUser: any;
  isViewable: boolean = true;
  hasRequested: boolean;

  constructor(public navCtrl: NavController, private authService: AuthService,
    private profileService: ProfileService, public alertCtrl: AlertController,
    private postService: PostService, public modalCtrl: ModalController,
    private camera: Camera, private navParams: NavParams, private userService: UserService,
    private notifcationService: NotificationService, private actionSheetCtrl: ActionSheetController) {}

    ionViewDidEnter(){
        if(!this.passedUser){
            if(this.navParams.get('user')){
                this.passedUser = this.navParams.get('user');
            }else{
                this.passedUser = this.authService.mongoUser;
            }
        }
        this.profileService.getProfile(this.passedUser._id).subscribe(
            response => {
                this.user = response;
                console.log(this.user);
                if(this.user._id == this.authService.mongoUser._id){
                    this.isActiveUser = true;
                    this.isViewable = true;
                    this.hasRequested = false;
                }else{
                    this.isActiveUser = false;
                    if(this.user.settings.profilePrivate){
                        if(this.user.followed){
                            this.isViewable = true;
                        }else{
                            this.isViewable = false;
                            this.profileService.getFollowReq(this.user._id).subscribe(
                                response => {
                                    console.log(response);
                                    this.hasRequested = response.hasRequested;
                                    console.log(this.hasRequested);
                                }
                            )
                        }
                    }else{
                        this.isViewable = true;
                    }
                    if(this.user.followed){
                        this.followColor = 'warning';
                        this.followText = "Followed";
                    }else{
                        this.followColor = 'light';
                        this.followText = "Unfollowed";
                    }
                }
                
            },
            err => this.failAlert(err)
        )
        this.notifcationService.getUnreadNotifications().subscribe(
            response => {
                console.log(response);
                this.notifications = response;
            },
            err => this.failAlert(err)
        )
        this.profileService.getFollowLists(this.user._id).subscribe(
            response => {
                this.user.numFollowers = response.numFollowers;
                this.user.numFollowed = response.numFollowed;
                this.user.followedBy = response.followedBy;
                this.user.followList = response.followList;
                this.user.followed = response.followed;
                if(this.user.followed){
                    this.followColor = 'warning';
                    this.followText = "Followed";
                }else{
                    this.followColor = 'light';
                    this.followText = "Follow";
                }
            }
        )
    }

    loadMore(){
        this.profileService.getProfilePosts(this.user._id).subscribe(
            response => {
                console.log(response);
                if(response.length > 0){
                    Array.prototype.push.apply(this.user.myPosts, response);
                    console.log(this.user.myPosts);
                }
            },
            err => this.failAlert(err)
        )
    }

    postText(){
        let postModal = this.modalCtrl.create(PostFormModal, {postType: 'text', isEventPost: false});
        postModal.present();
        postModal.onDidDismiss(response => {
            if(response){
                this.user.myPosts.unshift(response);                
            }
        });
    }

    postSavedPhoto(){
        const options: CameraOptions = {
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            mediaType: this.camera.MediaType.PICTURE,
            targetHeight: 1000,
            targetWidth: 1000
        }
        
        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            let postModal = this.modalCtrl.create(PostFormModal, {postType: 'photo', image: base64Image, isEventPost: false});
            postModal.present();
            postModal.onDidDismiss(response => {
                if(response){
                    this.user.myPosts.unshift(response);
                }
            });
        });
    }

    postPhoto(){
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            mediaType: this.camera.MediaType.PICTURE,
            targetHeight: 1000,
            targetWidth: 1000
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            let postModal = this.modalCtrl.create(PostFormModal, {postType: 'photo', image: base64Image, isEventPost: false});
            postModal.present();
            postModal.onDidDismiss(response => {
                if(response){
                    this.user.myPosts.unshift(response);
                }
            });
        });
    }

    followUser(){
        this.user.followed = !this.user.followed;
        if(this.user.followed){
            this.followColor = 'warning';
            this.followText = "Followed";
            this.profileService.follow(this.user._id).subscribe(
                response => {},
                err => this.failAlert(err)
            )
        }else{
            this.followColor = 'dark';
            this.followText = "Unfollowed";
            this.profileService.unfollow(this.user._id).subscribe(
                response => {},
                err => this.failAlert(err)
            )
        }
    }

    viewFollowerList(){
        if(this.isViewable){
            this.navCtrl.push(FollowListPage, {followList: this.user.followedBy, listType: 'Followers'});            
        }
    }

    viewFollowingList(){
        if(this.isViewable){
            this.navCtrl.push(FollowListPage, {followList: this.user.followList, listType: 'Following'});            
        }
    }

    requestFollow(){
        this.userService.newFollowReq(this.user._id).subscribe();
        this.hasRequested = true;
    }

    reportPost(post, index){
        this.user.myPosts.splice(index, 1);
        this.postService.reportPost(post).subscribe(
            resp => {},
            err => this.failAlert(err)
        )
    }

    deletePost(post, index){
        this.user.myPosts.splice(index, 1);
        this.postService.deletePost(post).subscribe(
            resp => {
                console.log(resp);
            },
            err => this.failAlert(err)
        )
    }

    viewNotifications(){
        this.navCtrl.push(NotificationListPage);
    }

    settings(){
        this.navCtrl.push(SettingsPage, {settings: this.user.settings});
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
