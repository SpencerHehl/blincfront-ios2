import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';

import { AuthService } from '../../../shared/services/auth.service';
import { EventService } from '../../../shared/services/event.service';
import { EventFormModal } from '../../../shared/modals/events/event-form.modal';

@Component({
    templateUrl: 'eventlist.component.html'
})
export class EventListPage{
    nearbyEventsDate: any[];
    nearbyEventsAttending: any[];
    nearbyEventsMine: any[];
    eventFilter: string;
    loading: any;

    constructor(private authService: AuthService, private eventService: EventService,
         private navCtrl: NavController, private navParams: NavParams,
         private alertCtrl: AlertController, private loadingCtrl: LoadingController,
         private modalCtrl: ModalController){
        this.eventFilter = 'date';
    }

    ionViewDidEnter(){
        this.eventService.getEventsDate().subscribe(
            response => {
                console.log(response.events);
                this.nearbyEventsDate = response.events;
            },
            err => this.failAlert(err)
        )
    }

    presentLoader(){
        this.loading = this.loadingCtrl.create({
            content: 'Loading...'
        })

        this.loading.present();
    }

    newEvent(){
        let eventModal = this.modalCtrl.create(EventFormModal);
        eventModal.present();
        eventModal.onDidDismiss(response => {
            if(response){
                this.nearbyEventsMine.unshift(response);
            }
        })
    }

    loadMore(){
        this.presentLoader();
        if(this.eventFilter == 'date'){
            this.eventService.loadDate().subscribe(
                response => {
                    this.loading.dismiss().then(() => {
                        if(response.length > 0){
                            Array.prototype.push.apply(this.nearbyEventsDate, response);
                        }
                    })  
                },
                err => this.failAlert(err)
            )
        }else if(this.eventFilter == 'mine'){
            this.eventService.loadMine().subscribe(
                response => {
                    this.loading.dismiss().then(() => {
                        if(response.length > 0){
                            Array.prototype.push.apply(this.nearbyEventsMine, response);
                        }
                    })  
                },
                err => this.failAlert(err)
            )
        }else{
            this.eventService.loadAttending().subscribe(
                response => {
                    this.loading.dismiss().then(() => {
                        if(response.length > 0){
                            Array.prototype.push.apply(this.nearbyEventsAttending, response);
                        }
                    })  
                },
                err => this.failAlert(err)
            )
        }
    }

    onFilterChange(){
        if((!this.nearbyEventsAttending) && this.eventFilter == 'attending'){
            console.log("filter change");
            this.eventService.getEventsAttending().subscribe(
                response => {
                    console.log("subscription complete");
                    console.log(response);
                    this.nearbyEventsAttending = response;
                },
                err => this.failAlert(err)
            )
        }else if((!this.nearbyEventsDate) && this.eventFilter == 'date'){
            console.log("filter change");
            this.eventService.getEventsDate().subscribe(
                response => {
                    console.log("subscription complete");
                    console.log(response);
                    this.nearbyEventsDate = response;
                },
                err => this.failAlert(err)
            )
        }
    }

    reloadEvents(refresher){
        if(this.eventFilter == 'date'){
            this.eventService.getEventsDate().subscribe(
                response => {
                    this.nearbyEventsDate = response;
                    refresher.complete();
                },
                err => this.failAlert(err)
            )
        }else if(this.eventFilter == 'mine'){
            this.eventService.getMyEvents().subscribe(
                response => {
                    this.nearbyEventsMine = response;
                    refresher.complete();
                },
                err => this.failAlert(err)
            )
        }else{
            this.eventService.getEventsAttending().subscribe(
                response => {
                    this.nearbyEventsAttending = response;
                    refresher.complete();
                },
                err => this.failAlert(err)
            )
        }
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