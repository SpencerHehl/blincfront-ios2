import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, ViewController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile.component';
import { PostService } from '../../shared/services/post.service';
import { CommentService } from '../../shared/services/comment.service';
import { ProfileService } from '../profile/shared/profile.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    templateUrl: 'likes.component.html'
})
export class LikesPage{
    content: any;
    users: any[];
    contentType: string;

    constructor(private postService: PostService, private commentService: CommentService,
         private navCtrl: NavController, private navParams: NavParams,
         private modalCtrl: ModalController, private alertCtrl: AlertController,
         private profileService: ProfileService, private viewCtrl: ViewController,
         private authService: AuthService){}

    ionViewWillEnter(){
        this.contentType = this.navParams.get('type');
        this.content = this.navParams.get('content');
        if(this.contentType == 'post'){
            this.postService.getLikes(this.content._id).subscribe(
                response => {
                    this.users = response;
                },
                err => this.failAlert(err)
            )
        }else{
            this.commentService.getLikes(this.content._id).subscribe(
                response => {
                    this.users = response;
                },
                err => this.failAlert(err)
            )
        }
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
            user.profileService.unfollow(user._id).subscribe(
                response => {},
                err => this.failAlert(err)
            )
        }
    }

    viewProfile(user){
        this.navCtrl.push(ProfilePage, {user: user});
    }

    close(){
        this.viewCtrl.dismiss();
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
