import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile.component';
import { NearMePage } from '../posts/nearme/nearme.component';
import { MapViewPage } from '../posts/mapview/mapview.component';
import { PeoplePage } from '../people/people.component';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab3Root = ProfilePage;
  tab1Root = NearMePage;
  tab2Root = MapViewPage;
  tab4Root = PeoplePage;

  constructor() {

  }
}
