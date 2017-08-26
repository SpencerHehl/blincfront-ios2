import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';

import { ProfileService } from '../shared/profile.service';

@Component({
    templateUrl: 'followlist.component.html'
})
export class FollowListPage{
    followList: any[];
    listType: string;

    constructor(private profileService: ProfileService, private navCtrl: NavController,
         private navParams: NavParams, private alertCtrl: AlertController){}

    ionViewWillLoad(){
        this.followList = this.navParams.get('followList');
        this.listType = this.navParams.get('listType');
    }
}