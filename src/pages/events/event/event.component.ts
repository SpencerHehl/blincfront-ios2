import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ActionSheetController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions} from '@ionic-native/camera';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SocialSharing } from '@ionic-native/social-sharing';

import { AuthService } from '../../../shared/services/auth.service';
import { EventService } from '../../../shared/services/event.service';
import { PostFormModal } from '../../../shared/modals/posts/post-form.modal';
import { AttendeesPage } from '../attendees/attendees.component';
import { EventFormModal } from '../../../shared/modals/events/event-form.modal';

@Component({
    templateUrl: 'event.component.html'   
})
export class EventPage{
    event: any;
    isAttending: boolean;
    eventStatus: string;
    isCreator: boolean;

    constructor(private authService: AuthService, private eventService: EventService,
         private socialSharing: SocialSharing, private navCtrl: NavController,
         private navParams: NavParams, private alertCtrl: AlertController,
         private modalCtrl: ModalController, private launchNavigator: LaunchNavigator,
         private actionSheetCtrl: ActionSheetController, private camera: Camera,
         private toastCtrl: ToastController){}

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
        if(this.event.creator == this.authService.mongoUser._id){
            this.isCreator = true;
        }else{
            this.isCreator = false;
        }
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
            quality: 25,
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
            quality: 25,
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

    share(){
        let message = "Found this awesome event on Blinc! Check it out!" 
        let subject = this.event.details.title + " @ " + this.event.details.location.name;
        this.socialSharing.share(message, subject).then(() => {
            let toast = this.toastCtrl.create({
                message: "Thanks for sharing!",
                duration: 2000
            });
            toast.present();
        })
    }

    more(){
        let actionSheet = this.actionSheetCtrl.create({
            title: 'More',
            buttons: [
                {
                    text: 'Cancel Event',
                    role: 'destructive',
                    handler: () => {
                        actionSheet.dismiss().then(() => {
                            this.cancelEvent();
                        })
                    }  
                },{
                    text: 'Edit Event',
                    handler: () => {
                        actionSheet.dismiss().then(() => {
                            this.editEvent();
                        })
                    }
                }
            ]
        })
        actionSheet.present();
    }

    cancelEvent(){
        this.eventService.cancelEvent(this.event._id).subscribe(
            response => {
                this.event = response;
            }
        )
    }

    editEvent(){
        let eventModal = this.modalCtrl.create(EventFormModal, {event: this.event, isEdit: true});
        eventModal.present();
        eventModal.onDidDismiss(response => {
            if(response){
                this.event = response;
            }
        })
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