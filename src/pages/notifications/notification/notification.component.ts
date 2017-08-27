import { Component } from '@angular/core';
import { NavParams, AlertController, NavController, ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { CommentService } from '../../../shared/services/comment.service';
import { PostService } from '../../../shared/services/post.service';
import { NotificationService } from '../../../shared/services/notifications.service';
import { AuthService } from '../../../shared/services/auth.service';
import { TabsPage } from '../../tabs/tabs';
import { CommentFormModal } from '../../../shared/modals/comments/comment-form.modal';

@Component({
    templateUrl: "notification.component.html"
})
export class NotificationPage{
    post: any;
    comments: any[];
    newCommentImg: string;

    constructor(private commentService: CommentService, private postService: PostService,
         private notificationService: NotificationService, private navParams: NavParams,
         private alertCtrl: AlertController, private camera: Camera,
         private authService: AuthService, private navCtrl: NavController,
         private modalCtrl: ModalController){}

    ionViewWillLoad(){
        this.post = this.navParams.get('post');
        this.comments = this.navParams.get('comments');
    }

    postText(){
        let postModal = this.modalCtrl.create(CommentFormModal, {postType: 'text', postId: this.post._id});
        postModal.present();
        postModal.onDidDismiss(response => {
            if(response){
                this.comments.push(response);
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
                    this.comments.push(response);
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
                    this.comments.push(response);
                }
            });
        });
    }

    reportPostDate(post, index){
        this.postService.reportPost(post).subscribe(
            resp => {
                this.navCtrl.setRoot(TabsPage);
            },
            err => this.failAlert(err)
        )
    }

    deletePostDate(post, index){
        this.postService.deletePost(post).subscribe(
            resp => {
                this.navCtrl.setRoot(TabsPage);
            },
            err => this.failAlert(err)
        )
    }

    deleteComment(comment, index){
        this.comments.splice(index, 1);
        this.commentService.deleteComment(comment).subscribe(
            resp => {},
            err => this.failAlert(err)
        )
    }

    reportComment(comment, index){
        this.comments.splice(index, 1);
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