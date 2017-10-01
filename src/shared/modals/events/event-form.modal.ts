import { Component } from '@angular/core';
import { AlertController, ViewController, NavParams } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';

@Component({
    templateUrl: 'event-form.modal.html'
})
export class EventFormModal{
    selectedDate: any;
    title: string;
    locationName: string;
    locationStreet: string;
    locationCity: string;
    locationState: string;
    about: string;
    startDate: Date = new Date();
    endDate: Date = new Date();
    isEdit: boolean;
    eventId: string;
    event: any;
    modalTitle: string = "New Event";
    submitText: string = "Create";
    
    constructor(private authService: AuthService, private eventService: EventService,
         private calendar: Calendar, private navParams: NavParams,
         private alertCtrl: AlertController, private viewCtrl: ViewController){
            this.isEdit = this.navParams.get('isEdit');
            if(this.isEdit){
                this.modalTitle = "Edit Event";
                this.submitText = "Update"
                this.event = this.navParams.get('event');
                this.about = this.event.details.eventBody;
                this.endDate = this.event.details.endDate;
                this.startDate = this.event.details.startDate;
                this.locationCity = this.event.details.location.city;
                this.locationName = this.event.details.location.name;
                this.locationState = this.event.details.location.state;
                this.locationStreet = this.event.details.location.streetAddr;
                this.title = this.event.details.eventTitle;
                this.eventId = this.event._id;
            }
        }

    createEvent(formValues){
        this.eventService.geoCode(formValues.locationStreet, formValues.locationCity, formValues.locationState).subscribe(
            response => {
                if(response.length == 0){
                    this.failAlert("Invalid Address. Please Try again.");
                }else{
                    var lat = response.results[0].location.lat;
                    var lng = response.results[0].location.lng;
                    if(this.isEdit){
                        this.eventService.editEvent(this.eventId, formValues, lat, lng).subscribe(
                            response => {
                                this.viewCtrl.dismiss(response);
                            },
                            err => this.failAlert(err)
                        )
                    }else{
                        this.eventService.createEvent(formValues, lat, lng).subscribe(
                            response => {
                                this.viewCtrl.dismiss(response);
                            },
                            err => this.failAlert(err)
                        )
                    }
                }
            }
        )
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