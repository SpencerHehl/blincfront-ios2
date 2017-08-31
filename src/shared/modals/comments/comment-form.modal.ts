import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';

import { CommentService } from '../../services/comment.service';

@Component({
    templateUrl: 'comment-form.modal.html'
})
export class CommentFormModal {
    imageData: any;
    postType: any;
    postId: any;
    loading: any;

    constructor(private commentService: CommentService, private navParams: NavParams,
        private viewCtrl: ViewController, public alertCtrl: AlertController,
        private loadingCtrl: LoadingController){
            this.postType = this.navParams.get('postType');
            this.postId = this.navParams.get('postId');
            if(this.postType == 'photo'){
                this.imageData = this.navParams.get('image');
            }
        }

    presentLoader(){
        this.loading = this.loadingCtrl.create({
            content: 'Submitting...'
        })
        this.loading.present();
    }

    submitPost(formValues){
        this.presentLoader();
        if(this.postType == 'text'){
            this.commentService.postTextComment(formValues, this.postId).subscribe(
                response => {
                    this.loading.dismiss().then(() => {
                        this.viewCtrl.dismiss(response);
                    });
                },
                err => this.failAlert(err)
            );
        }else{
            this.commentService.postPictureComment(formValues, this.imageData, this.postId).subscribe(
                response => {
                    this.loading.dismiss().then(() => {
                        this.viewCtrl.dismiss(response);
                    });
                },
                err => this.failAlert(err)
            );
        }
    }

    cancel(){
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