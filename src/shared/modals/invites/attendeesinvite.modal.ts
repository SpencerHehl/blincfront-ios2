import { Component } from '@angular/core';
import { ViewController, AlertController, NavParams } from 'ionic-angular';

import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
    templateUrl: 'attendeesinvite.modal.html'
})
export class AttendeesInviteModal{
    user: any;
    eventId: any;

    constructor(private authService: AuthService, private eventService: EventService,
         private alertCtrl: AlertController, private navParams: NavParams,
         private viewCtrl: ViewController){}

    ionViewDidEnter(){
        this.eventId = this.navParams.get('event');
        this.eventService.getFollowList(this.eventId).subscribe(
            response => {
                this.user = response;
            },
            err => this.failAlert(err)
        )
    }

    inviteFollower(user, i){
        this.eventService.inviteAttendees(user, this.eventId).subscribe();
        this.user.followList[i].invited = true;
    }

    inviteFollowin(user, i){
        this.eventService.inviteAttendees(user, this.eventId).subscribe();
        this.user.followedBy[i].invited = true;
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