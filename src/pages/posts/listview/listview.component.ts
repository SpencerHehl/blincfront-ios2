import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { PostService } from '../../../shared/services/post.service';

@Component({
    templateUrl: 'listview.component.html'
})
export class ListViewPage{
    mapPosts: any[];

    constructor(public navCtrl: NavController, private navParams: NavParams,
        public alertCtrl: AlertController, private postService: PostService){}

    ionViewWillLoad(){
        var distance = this.navParams.get('distance');
        var currCenter = this.navParams.get('center');
        console.log(distance);
        console.log(currCenter);
        this.postService.getMapPosts(distance, currCenter).subscribe(
            resp => {
                console.log(resp);
                this.mapPosts = resp;
            },
            err => this.failAlert(err)
        )
    }

    reportPost(post, index){
        this.mapPosts.splice(index, 1);
        this.postService.reportPost(post).subscribe(
            resp => {},
            err => this.failAlert(err)
        )
    }

    deletePost(post, index){
        this.mapPosts.splice(index, 1);
        this.postService.deletePost(post).subscribe(
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