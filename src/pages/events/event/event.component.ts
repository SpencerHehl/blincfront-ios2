import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Camera, CameraOptions} from '@ionic-native/camera';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

import { AuthService } from '../../../shared/services/auth.service';
import { EventService } from '../../../shared/services/event.service';
import { PostFormModal } from '../../../shared/modals/posts/post-form.modal';
import { AttendeesPage } from '../attendees/attendees.component';

@Component({
    templateUrl: 'event.component.html'   
})
export class EventPage{
    event: any;
    isAttending: boolean;
    eventStatus: string;

    constructor(private authService: AuthService, private eventService: EventService,
         private camera: Camera, private navCtrl: NavController,
         private navParams: NavParams, private alertCtrl: AlertController,
         private modalCtrl: ModalController, private launchNavigator: LaunchNavigator){}

    ionViewDidEnter(){
        this.event = this.navParams.get('event');
        console.log(this.event);
        this.eventService.getEventStatus(this.event._id).subscribe(
            response => {
                console.log(response);
                this.isAttending = response.isAttending;
                this.eventStatus = response.eventStatus;
            },
            err => this.failAlert(err)
        )
    }

    postText(){
        let postModal = this.modalCtrl.create(PostFormModal, {postType: 'text', isEventPost: true, event: this.event});
        postModal.present();
        postModal.onDidDismiss(response => {
            if(response){
                this.event.eventPosts.unshift(response);                
            }
        });
    }

    postSavedPhoto(){
        const options: CameraOptions = {
            quality: 50,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            let postModal = this.modalCtrl.create(PostFormModal, {postType: 'photo', image: base64Image, isEventPost: true, event: this.event});
            postModal.present();
            postModal.onDidDismiss(response => {
                if(response){
                    this.event.eventPosts.unshift(response);
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
            correctOrientation: true,
            allowEdit: true
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            let postModal = this.modalCtrl.create(PostFormModal, {postType: 'photo', image: base64Image, isEventPost: true, event: this.event});
            postModal.present();
            postModal.onDidDismiss(response => {
                if(response){
                    this.event.eventPosts.unshift(response);
                }
            });
        });
    }

    viewAttendees(){
        this.navCtrl.push(AttendeesPage, {event: this.event});
    }

    attendEvent(){
        this.eventService.acceptInvite(this.event._id).subscribe(
            response => {
                this.event.isAttending = true;
            }
        )
    }

    tentativeEvent(){
        this.eventService.tentativeInvite(this.event._id).subscribe(
            response => {
                this.event.isAttending = true;
            }
        )
    }

    navigate(){
        let address = this.event.details.location.streetAddr + " " + this.event.details.location.city + " " + this.event.details.location.state
        this.launchNavigator.navigate(address);
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