import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { CommentService } from '../../shared/services/comment.service';
import { AuthService } from '../../shared/services/auth.service';
import { PostService } from '../../shared/services/post.service';
import { MediaService } from '../../shared/services/media.service';
import { TabsPage } from '../tabs/tabs';
import { CommentFormModal } from '../../shared/modals/comments/comment-form.modal';
import { LikesModalComponent } from '../../shared/modals/likes/likes.modal';

@Component({
    templateUrl: 'comment.component.html'
})

export class CommentPage {
    post: any;
    postComments: any[];
    newCommentImg: string;
    likeColor: string;

    constructor(private navCtrl: NavController, private alertCtrl: AlertController,
         private commentService: CommentService, private navParams: NavParams,
         private camera: Camera, private authService: AuthService,
         private postService: PostService, private modalCtrl: ModalController,
         private mediaService: MediaService){}
    
    ionViewWillLoad(){
        this.post = this.navParams.get('post');
        if(this.post.content.contentType == 'photo'){
            this.mediaService.getMedia(this.post._id).subscribe(
                resp => this.post.content["img"] = resp,
                err => console.log(err)
            )
        }
        this.commentService.getComments(this.post._id).subscribe(
            response => {
                console.log(response);
                this.postComments = response;
            },
            err => this.failAlert(err)
        )
    }

    viewLikes(){
        let likesModal = this.modalCtrl.create(LikesModalComponent, {type: 'post', content: this.post});
        likesModal.present();
    }

    likePost(postId) {
        this.post.likedByUser = !this.post.likedByUser;
        if(this.post.likedByUser){
            this.post.numLikes += 1;
            this.likeColor = 'primary';
            this.postService.likePost(postId).subscribe(
                response => {}
            )
        }else{
            this.post.numLikes -= 1;
            this.likeColor = 'dark';
            this.postService.unlikePost(postId).subscribe(
                response => {}
            )
        }
        
    }

    postText(){
        let postModal = this.modalCtrl.create(CommentFormModal, {postType: 'text', postId: this.post._id});
        postModal.present();
        postModal.onDidDismiss(response => {
            if(response){
                this.postComments.push(response);
            }
        });
    }

    postSavedPhoto(){
        const options: CameraOptions = {
            quality: 50,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            let postModal = this.modalCtrl.create(CommentFormModal, {postType: 'photo', image: base64Image, postId: this.post._id});
            postModal.present();
            postModal.onDidDismiss(response => {
                if(response){
                    this.postComments.push(response);
                }
            });
        });
    }

    postPhoto(){
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: true
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            let postModal = this.modalCtrl.create(CommentFormModal, {postType: 'photo', image: base64Image, postId: this.post._id});
            postModal.present();
            postModal.onDidDismiss(response => {
                if(response){
                    this.postComments.push(response);
                }
            });
        });
    }

    reportPost(post, index){
        this.postService.reportPost(post).subscribe(
            resp => {
                this.navCtrl.setRoot(TabsPage);
            },
            err => this.failAlert(err)
        )
    }

    deletePost(post, index){
        this.postService.deletePost(post).subscribe(
            resp => {
                this.navCtrl.setRoot(TabsPage);
            },
            err => this.failAlert(err)
        )
    }

    deleteComment(comment, index){
        this.postComments.splice(index, 1);
        this.commentService.deleteComment(comment).subscribe(
            resp => {},
            err => this.failAlert(err)
        )
    }

    reportComment(comment, index){
        this.postComments.splice(index, 1);
        this.commentService.reportComment(comment).subscribe(
            resp => {},
            err => this.failAlert(err)
        )
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