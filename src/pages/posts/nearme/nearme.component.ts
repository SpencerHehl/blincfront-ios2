import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController, Events } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { PostService } from '../../../shared/services/post.service';
import { PostFormModal } from '../../../shared/modals/posts/post-form.modal';
import { LocationService } from '../../../shared/services/location.service';

@Component({
    templateUrl: 'nearme.component.html'
})
export class NearMePage{
    nearbyPostsDate: any[] = [];
    nearbyPostsLikes: any[] = [];
    postFilter: string;
    loading: any;
    topPost: any = null;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, 
        private postService: PostService, public navParams: NavParams, 
        public alertCtrl: AlertController, private camera: Camera,
        private loadingCtrl: LoadingController, private locService: LocationService, public events: Events){
            this.postFilter = 'date';
            events.subscribe('location:updated', () => {
                this.presentLoader();
                if(this.postFilter == 'date'){
                    this.postService.getNearbyPostsDate().subscribe(
                        response => {
                            this.loading.dismiss().then(() => {
                                this.nearbyPostsDate = response;
                            });
                        },
                        err => this.failAlert(err)
                    )
                }else{
                    this.postService.getNearbyPostsLikes().subscribe(
                        response => {
                            this.loading.dismiss().then(() => {
                                this.nearbyPostsLikes = response;
                            });
                        },
                        err => this.failAlert(err)
                    )
                }
            })
    }

    ionViewDidEnter(){
        this.postService.datePage = 1;
        this.postService.likesPage = 1;
        this.presentLoader();
        if(!this.topPost){
            this.postService.getTopPost().subscribe(
                response => {
                    this.topPost = response;
                }
            )
        }
        this.postService.getNearbyPostsDate().subscribe(
            response => {
                this.loading.dismiss().then(() => {
                    this.nearbyPostsDate = response;
                })
            },
            err => {
                this.loading.dismiss().then(() => {
                    this.failAlert(err);
                })
            }
        );
    }

    presentLoader(){
        this.loading = this.loadingCtrl.create({
            content: 'Loading...'
        })

        this.loading.present();
    }

    postText(){
        let postModal = this.modalCtrl.create(PostFormModal, {postType: 'text', isEventPost: false});
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
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            mediaType: this.camera.MediaType.PICTURE,
            targetHeight: 1000,
            targetWidth: 1000
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            let postModal = this.modalCtrl.create(PostFormModal, {postType: 'photo', image: base64Image, isEventPost: false});
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
            destinationType: this.camera.DestinationType.DATA_URL,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: true,
            targetHeight: 1000,
            targetWidth: 1000
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            let postModal = this.modalCtrl.create(PostFormModal, {postType: 'photo', image: base64Image, isEventPost: false});
            postModal.present();
            postModal.onDidDismiss(response => {
                if(response){
                    this.nearbyPostsDate.unshift(response);
                    this.nearbyPostsLikes.push(response);
                }
            });
        });
    }

    loadMore(infiniteScroll){
        if(this.postFilter == 'date'){
            this.postService.loadDate().subscribe(
                response => {
                        if(response.length > 0){
                            Array.prototype.push.apply(this.nearbyPostsDate, response);
                        }
                        infiniteScroll.complete();
                },
                err => this.failAlert(err)
            )
        }else{
            this.postService.loadLikes().subscribe(
                response => {
                        if(response.length > 0){
                            Array.prototype.push.apply(this.nearbyPostsLikes, response);
                        }
                        infiniteScroll.complete();
                },
                err => this.failAlert(err)
            )
        }
    }

    onFilterChange(){
        if((!this.nearbyPostsLikes) && this.postFilter == 'like'){
            this.postService.getNearbyPostsLikes().subscribe(
                response => {
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