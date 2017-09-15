import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';

import { PostService } from '../../../shared/services/post.service';
import { PostFormModal } from '../../../shared/modals/posts/post-form.modal';
import { LocationService } from '../../../shared/services/location.service';

@Component({
    templateUrl: 'nearme.component.html'
})
export class NearMePage{
    nearbyPostsDate: any[];
    nearbyPostsLikes: any[];
    postFilter: string;
    loading: any;
    topPost: any;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, 
        private postService: PostService, public navParams: NavParams, 
        public alertCtrl: AlertController, private camera: Camera,
        private loadingCtrl: LoadingController, private locService: LocationService,
        private diagnostic: Diagnostic){
        this.postFilter = 'date';
    }

    ionViewDidEnter(){
        this.checkLocation();
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
            saveToPhotoAlbum: true,
            correctOrientation: true
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
        this.postService.getTopPost().subscribe(
            response => {
                this.topPost = response;
            }
        )
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

    checkLocation(){
        this.locService.checkLocationEnabled().then((isAvailable) => {
            if(isAvailable){
                this.presentLoader();
                this.locService.initializeLocation().then((resp) => {
                    this.locService.lat = resp.coords.latitude;
                    this.locService.lng = resp.coords.longitude;
                    this.locService.startTracking();
                    this.postService.getTopPost().subscribe(
                        response => {
                            this.topPost = response;
                        }
                    )
                    this.postService.getNearbyPostsDate().subscribe(
                        response => {
                            this.loading.dismiss().then(() => {
                                console.log(response);
                                this.nearbyPostsDate = response;
                            })
                        },
                        err => {
                            this.loading.dismiss().then(() => {
                                this.failAlert(err);
                            })
                        }
                    );
                }).catch((err) => {
                    this.loading.dismiss().then(() => {
                        this.locService.checkLocationAuth().then((isAuthorized) => {
                            if(isAuthorized){
                                this.failAlert("Oops! Looks like something went wrong and we can't seem to find your location.");
                            }else{
                                this.locationAuthFail();
                            }
                        });
                    })
                })
            }else{
                this.locationFail();
            }
        })
    }

    locationAuthFail(){
        let alert = this.alertCtrl.create({
            title: 'Location',
            subTitle: 'This app must have access to your location to function. Press "OK" to enable and then swipe down to refresh when you return to the app.',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        alert.dismiss().then(() => {
                            this.diagnostic.switchToSettings();
                        })
                    }
                }
            ]
        })
        alert.present();
    }

    failAlert(message){
        let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: message,
        buttons: ['OK']
        });
        alert.present();
    }

    locationFail(){
        let alert = this.alertCtrl.create({
            title: 'Location',
            subTitle: 'Location services must be enabled to use this app. Press "OK" to enable and then swipe down to refresh when you return to the app.',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        alert.dismiss().then(() => {
                            this.diagnostic.switchToLocationSettings();
                        })
                    }
                }
            ]
        })
        alert.present();
    }
}