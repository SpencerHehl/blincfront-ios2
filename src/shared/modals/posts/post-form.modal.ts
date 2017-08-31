import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';

import { PostService } from '../../services/post.service';

@Component({
    templateUrl: 'post-form.modal.html'
})
export class PostFormModal {
    imageData: any;
    postType: any;
    mapable: boolean;
    loading: any;

    constructor(private postService: PostService, private navParams: NavParams,
        private viewCtrl: ViewController, public alertCtrl: AlertController,
        private loadingCtrl: LoadingController){
            this.postType = this.navParams.get('postType');
            if(this.postType == 'photo'){
                this.imageData = this.navParams.get('image');
            }
            this.mapable = false;
        }

    submitPost(formValues){
        this.presentLoader();

        if(this.postType == 'text'){
            this.postService.postText(formValues).subscribe(
                response => {
                    this.loading.dismiss().then(() => {
                        this.viewCtrl.dismiss(response);
                    });
                },
                err => this.failAlert(err)
            );
        }else{
            this.postService.postPhoto(formValues, this.imageData).subscribe(
                response => {
                    this.loading.dismiss().then(() => {
                        this.viewCtrl.dismiss(response);
                    });
                },
                err => this.failAlert(err)
            );
        }
    }

    presentLoader(){
        this.loading = this.loadingCtrl.create({
            content: 'Submitting...'
        })

        this.loading.present();
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