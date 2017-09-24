import { Component, Input, Output } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

import { EventService } from '../../services/event.service';
import { EventPage } from '../../../pages/events/event/event.component';
import { AuthService } from '../../services/auth.service';
import { AttendeesPage } from '../../../pages/events/attendees/attendees.component';

@Component({
    selector: 'event-card',
    templateUrl: 'event.card.html'
})
export class EventCardComponent{
    @Input() Event: any;

    constructor(private navCtrl: NavController, private navParams: NavParams,
         private eventService: EventService, private authService: AuthService,
         private launchNavigator: LaunchNavigator){}

    ngOnInit(){
    }

    viewEvent(){
        this.navCtrl.push(EventPage, {event: this.Event});
    }

    viewAttendees(){
        this.navCtrl.push(AttendeesPage, {event: this.Event});
    }

    navigate(){
        let address = this.Event.details.location.streetAddr + " " + this.Event.details.location.city + " " + this.Event.details.location.state
        this.launchNavigator.navigate(address);
    }
}