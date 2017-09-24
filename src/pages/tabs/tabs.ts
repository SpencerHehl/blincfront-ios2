import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { ProfilePage } from '../profile/profile.component';
import { NearMePage } from '../posts/nearme/nearme.component';
import { MapViewPage } from '../posts/mapview/mapview.component';
import { PeoplePage } from '../people/people.component';
import { EventListPage } from '../events/eventslist/eventlist.component';
import { NotificationService } from '../../shared/services/notifications.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab3Root = ProfilePage;
  tab1Root = NearMePage;
  tab2Root = MapViewPage;
  tab4Root = PeoplePage;
  tab5Root = EventListPage;
  notifications: any[];

  constructor(private notifcationService: NotificationService, public events: Events) {
    events.subscribe('notifications:updated', () => {
      this.notifcationService.getUnreadNotifications().subscribe(
          response => {
              console.log(response);
              this.notifications = response;
          }
      )
    })
  }

  ionViewDidEnter(){
    this.notifcationService.getUnreadNotifications().subscribe(
        response => {
            console.log(response);
            this.notifications = response;
        }
    )
  }
}
