import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, ModalController } from 'ionic-angular';

import { PostService } from '../../services/post.service';
import { CommentPage } from '../../../pages/comments/comment.component';
import { ProfilePage } from '../../../pages/profile/profile.component';
import { MediaService } from '../../services/media.service';
import { AuthService } from '../../services/auth.service';
import { LikesModalComponent } from '../../modals/likes/likes.modal';

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
         private alertCtrl: AlertController, private modalCtrl: ModalController){}

    ngOnInit(){
        if(this.Post.likedByUser){
            this.likeColor = 'primary';
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
            this.likeColor = 'primary';
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

    viewMore(){
        if(this.isActiveUser){
            let actionSheet = this.actionSheetCtrl.create({
                title: 'More',
                buttons: [
                    {
                    text: 'Delete Post',
                    role: 'destructive',
                    handler: () => {
                        actionSheet.dismiss().then(()=>{
                            this.confirmDelete();
                        })
                    } 
                    },{
                        text: 'Flag as Inappropriate',
                        handler: () => {
                            actionSheet.dismiss().then(()=>{
                                this.confirmReport();
                            })
                        }
                    },{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            actionSheet.dismiss();
                        }
                    }
                ]
            });
            actionSheet.present();
        }else{
            let actionSheet = this.actionSheetCtrl.create({
                title: 'More',
                buttons: [
                    {
                        text: 'Flag as Inappropriate',
                        handler: () => {
                            actionSheet.dismiss().then(()=>{
                                this.confirmReport();
                            })
                        }
                    },{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            actionSheet.dismiss();
                        }
                    }
                ]
            });
            actionSheet.present();
        }
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

    viewLikes(){
        let likesModal = this.modalCtrl.create(LikesModalComponent, {type: 'post', content: this.Post});
        likesModal.present();
    }

    viewProfile(){
        this.navCtrl.push(ProfilePage, {user: this.Post.poster})
    }
}