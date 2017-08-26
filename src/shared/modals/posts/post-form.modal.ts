import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';

import { PostService } from '../../services/post.service';

@Component({
    templateUrl: 'post-form.modal.html'
})
export class PostFormModal {
    imageData: any;
    postType: any;

    constructor(private postService: PostService, private navParams: NavParams,
        private viewCtrl: ViewController, public alertCtrl: AlertController){
            this.postType = this.navParams.get('postType');
            if(this.postType == 'photo'){
                this.imageData = this.navParams.get('image');
            }
        }

    submitPost(formValues){
        console.log(formValues);
        if(this.postType == 'text'){
            this.postService.postText(formValues).subscribe(
                response => {
                    this.viewCtrl.dismiss(response);
                },
                err => this.failAlert(err)
            );
        }else{
            this.postService.postPhoto(formValues, this.imageData).subscribe(
                response => {
                    this.viewCtrl.dismiss(response);
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