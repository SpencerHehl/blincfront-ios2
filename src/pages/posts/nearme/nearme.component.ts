import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { PostService } from '../../../shared/services/post.service';
import { PostFormModal } from '../../../shared/modals/posts/post-form.modal';

@Component({
    templateUrl: 'nearme.component.html'
})
export class NearMePage implements OnInit{
    nearbyPostsDate: any[];
    nearbyPostsLikes: any[];
    postFilter: string;
    loading: any;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, 
        private postService: PostService, public navParams: NavParams, 
        public alertCtrl: AlertController, private camera: Camera,
        private loadingCtrl: LoadingController){
        this.postFilter = 'date';
    }

    ngOnInit(){
        this.presentLoader();
        this.postService.getNearbyPostsDate().subscribe(
            response => {
                this.loading.dismiss().then(() => {
                    this.nearbyPostsDate = response;
                })
            },
            err => this.failAlert(err)
        );
    }

    presentLoader(){
        this.loading = this.loadingCtrl.create({
            content: 'Loading...'
        })

        this.loading.present();
    }

    postText(){
        let postModal = this.modalCtrl.create(PostFormModal, {postType: 'text'});
        postModal.present();
        postModal.onDidDismiss(response => {
            if(response){
                this.nearbyPostsDate.unshift(response);
                this.nearbyPostsLikes.push(response);
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
            let postModal = this.modalCtrl.create(PostFormModal, {postType: 'photo', image: base64Image});
            postModal.present();
            postModal.onDidDismiss(response => {
                if(response){
                    this.nearbyPostsDate.unshift(response);
                    this.nearbyPostsLikes.push(response);
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
            let postModal = this.modalCtrl.create(PostFormModal, {postType: 'photo', image: base64Image});
            postModal.present();
            postModal.onDidDismiss(response => {
                if(response){
                    this.nearbyPostsDate.unshift(response);
                    this.nearbyPostsLikes.push(response);
                }
            });
        });
    }

    loadMore(){
        this.presentLoader();
        if(this.postFilter == 'date'){
            this.postService.loadDate().subscribe(
                response => {
                    this.loading.dismiss().then(() => {
                        if(response.length > 0){
                            Array.prototype.push.apply(this.nearbyPostsDate, response);
                        }
                    })  
                },
                err => this.failAlert(err)
            )
        }else{
            this.postService.loadLikes().subscribe(
                response => {
                    this.loading.dismiss().then(() => {
                        if(response.length > 0){
                            Array.prototype.push.apply(this.nearbyPostsDate, response);
                        }
                    })  
                },
                err => this.failAlert(err)
            )
        }
    }

    onFilterChange(){
        if((!this.nearbyPostsLikes) && this.postFilter == 'like'){
            console.log("filter change");
            this.postService.getNearbyPostsLikes().subscribe(
                response => {
                    console.log("subscription complete");
                    console.log(response);
                    this.nearbyPostsLikes = response;
                },
                err => this.failAlert(err)
            )
        }
    }

    reloadPosts(refresher){
        if(this.postFilter == 'date'){
            this.postService.getNearbyPostsDate().subscribe(
                response => {
                    this.nearbyPostsDate = response;
                    refresher.complete();
                },
                err => this.failAlert(err)
            )
        }else{
            this.postService.getNearbyPostsLikes().subscribe(
                response => {
                    this.nearbyPostsLikes = response;
                    refresher.complete();
                },
                err => this.failAlert(err)
            )
        }
    }

    reportPostDate(post, index){
        this.nearbyPostsDate.splice(index, 1);
        this.postService.reportPost(post).subscribe(
            resp => {},
            err => this.failAlert(err)
        )
    }

    deletePostDate(post, index){
        console.log(post);
        console.log(index);
        this.nearbyPostsDate.splice(index, 1);
        this.postService.deletePost(post).subscribe(
            resp => {},
            err => this.failAlert(err)
        )
    }

    reportPostLikes(post, index){
        this.nearbyPostsLikes.splice(index, 1);
        this.postService.reportPost(post).subscribe(
            resp => {},
            err => this.failAlert(err)
        )
    }

    deletePostLikes(post, index){
        this.nearbyPostsLikes.splice(index, 1);
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