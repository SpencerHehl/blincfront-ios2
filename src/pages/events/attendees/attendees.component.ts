import { Component } from '@angular/core';
import { NavParams, NavController, ModalController } from 'ionic-angular';

import { AuthService } from '../../../shared/services/auth.service';
import { ProfilePage } from '../../profile/profile.component';
import { AttendeesInviteModal } from '../../../shared/modals/invites/attendeesinvite.modal';

@Component({
    templateUrl: 'attendees.component.html'
})
export class AttendeesPage{
    event: any;

    constructor(private authService: AuthService, private navParams: NavParams,
         private navCtrl: NavController, private modalCtrl: ModalController){}

    ionViewDidEnter(){
        this.event = this.navParams.get('event');
        console.log(this.event);
    }

    inviteFriends(){
        let inviteModal = this.modalCtrl.create(AttendeesInviteModal, {event: this.event._id});
        inviteModal.present();
        inviteModal.onDidDismiss(response => {
            
        });
    }

    viewProfile(user){
        this.navCtrl.push(ProfilePage, {user: user});
    }
}