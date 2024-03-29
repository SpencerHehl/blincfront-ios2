import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, ModalController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing'; 

import { PostService } from '../../services/post.service';
import { CommentPage } from '../../../pages/comments/comment.component';
import { ProfilePage } from '../../../pages/profile/profile.component';
import { MediaService } from '../../services/media.service';
import { AuthService } from '../../services/auth.service';
import { LikesPage } from '../../../pages/likes/likes.component';
import { EventService } from '../../services/event.service';
import { EventPage } from '../../../pages/events/event/event.component';
import { MapViewPage } from '../../../pages/posts/mapview/mapview.component';

@Component({
    selector: 'post-card',
    templateUrl: 'post.card.html'
})
export class PostCardComponent {
    @Input() Post: any;
    @Output() deleteEmitter = new EventEmitter();
    @Output() reportEmitter = new EventEmitter();
    likeColor: string;
    isActiveUser: boolean;

    constructor(private postService: PostService, private navCtrl: NavController,
         private navParams: NavParams, private mediaService: MediaService,
         private authService: AuthService, private actionSheetCtrl: ActionSheetController,
         private alertCtrl: AlertController, private modalCtrl: ModalController,
         private toastCtrl: ToastController, private socialSharing: SocialSharing,
         private eventService: EventService){}

    ngOnInit(){
        if(this.Post.likedByUser){
            this.likeColor = 'ionicblue';
        }else{
            this.likeColor = 'dark';
        }
        if(this.Post.content.contentType == 'photo'){
            this.mediaService.getMedia(this.Post._id).subscribe(
                resp => this.Post.content["img"] = resp,
                err => console.log(err)
            )
        }
        if(this.Post.poster._id == this.authService.mongoUser._id){
            this.isActiveUser = true;
        }else{
            this.isActiveUser = false;
        }
    }

    likePost(postId) {
        this.Post.likedByUser = !this.Post.likedByUser;
        if(this.Post.likedByUser){
            this.Post.numLikes += 1;
            this.likeColor = 'ionicblue';
            this.postService.likePost(postId).subscribe(
                response => {}
            )
        }else{
            this.Post.numLikes -= 1;
            this.likeColor = 'dark';
            this.postService.unlikePost(postId).subscribe(
                response => {}
            )
        }
        
    }

    vviewMore(){
        let actionSheet = this.actionSheetCtrl.create({
            title: 'More'
        });
        if(this.isActiveUser){
            actionSheet.addButton(
                {
                    text: 'Delete Post',
                    role: 'destructive',
                    handler: () => {
                        actionSheet.dismiss().then(()=>{
                            this.confirmDelete();
                        })
                    } 
                }
            );
        }else{
            actionSheet.addButton({
                text: 'Flag as Inappropriate',
                handler: () => {
                    actionSheet.dismiss().then(()=>{
                        this.confirmReport();
                    })
                }
            })
        }
        if(this.Post.mapable){
            actionSheet.addButton(
                {
                    text: 'View On Map',
                    handler: () => {
                        actionSheet.dismiss().then(() => {
                            this.viewOnMap();
                        })
                    }
                }
            )
        }
        if(this.Post.asscEvent){
            actionSheet.addButton(
                {
                    text: 'View Event',
                    handler: () => {
                        actionSheet.dismiss().then(() => {
                            this.viewEvent();
                        })
                    }
                }
            )
        }
        actionSheet.addButton({
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                actionSheet.dismiss();
            }
        });
        actionSheet.present();
    }

    deletePost(){
        this.deleteEmitter.emit(this.Post);
    }

    reportPost(){
        this.Post.isFlagged = true;
        this.reportEmitter.emit(this.Post);
    }

    confirmDelete(){
        let confirmAlert = this.alertCtrl.create({
            title: 'Confirm',
            subTitle: 'Are you sure you want to delete this post?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        confirmAlert.dismiss();
                        this.deletePost();
                    } 
                },
                {
                    text: 'No',
                    handler: () => {
                        confirmAlert.dismiss();
                    }
                }
            ]
        });
        confirmAlert.present();
    }

    confirmReport(){
        let confirmAlert = this.alertCtrl.create({
            title: 'Confirm',
            subTitle: 'Are you sure you want to report this post?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        this.reportPost();
                        confirmAlert.dismiss();
                    } 
                },
                {
                    text: 'No',
                    handler: () => {
                        confirmAlert.dismiss();
                    }
                }
            ]
        });
        confirmAlert.present();
    }

    viewComments(Post) {
        this.postService.getPost(this.Post._id).subscribe(
            response => {
                this.navCtrl.push(CommentPage, {'post': response});
            }
        )
        
    }

    share(){
        let message = this.Post.content.body;
        let subject = this.Post.content.title + " @ " + this.Post.content.location;
        let file = this.Post.content.img;
        this.socialSharing.share(message, subject, file, null).then(() => {
            this.presentToast("Success");
        })
    }

    presentToast(message){
        let toast = this.toastCtrl.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }

    viewLikes(){
        this.navCtrl.push(LikesPage, {type: 'post', content: this.Post});
    }

    viewProfile(){
        this.navCtrl.push(ProfilePage, {user: this.Post.poster})
    }

    viewEvent(){
        if(this.Post.asscEvent){
            this.eventService.getEvent(this.Post.asscEvent).subscribe(
                response => {
                    this.navCtrl.push(EventPage, {event: response});
                }
            )
        }
    }

    viewOnMap(){
        if(this.Post.mapable){
            this.navCtrl.push(MapViewPage, {post: this.Post});
        }
    }
}