import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { PostService } from '../../../shared/services/post.service';

@Component({
    templateUrl: 'post.component.html'
})
export class PostPage {
    post: any;

    constructor(private navCtrl: NavController, private navParams: NavParams,
         private postService: PostService, private alertCtrl: AlertController){}

    ionViewWillLoad(){
        this.post = this.navParams.get('post');
    }

    reportPost(post){
        this.postService.reportPost(post).subscribe(
            resp => {
                this.navCtrl.pop();
            },
            err => this.failAlert(err)
        )
    }

    deletePost(post){
        this.postService.deletePost(post).subscribe(
            resp => {
                this.navCtrl.pop();
            },
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