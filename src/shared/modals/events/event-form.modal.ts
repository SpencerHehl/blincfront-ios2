import { Component } from '@angular/core';
import { AlertController, ViewController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';

@Component({
    templateUrl: 'event-form.modal.html'
})
export class EventFormModal{
    selectedDate: any;
    
    constructor(private authService: AuthService, private eventService: EventService,
         private calendar: Calendar,
         private alertCtrl: AlertController, private viewCtrl: ViewController){}

    createEvent(formValues){
        this.eventService.geoCode(formValues.locationStreet, formValues.locationCity, formValues.locationState).subscribe(
            response => {
                if(response.length == 0){
                    this.failAlert("Invalid Address. Please Try again.");
                }else{
                    var lat = response.results[0].location.lat;
                    var lng = response.results[0].location.lng;
                    this.eventService.createEvent(formValues, lat, lng).subscribe(
                        response => {
                            this.viewCtrl.dismiss(response);
                        },
                        err => this.failAlert(err)
                    )
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