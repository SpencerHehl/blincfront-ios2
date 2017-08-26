import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NotificationService } from '../../services/notifications.service';
import { NotificationPage } from '../../../pages/notifications/notification/notification.component';
import { ProfilePage } from '../../../pages/profile/profile.component';

@Component({
    selector: 'notification-card',
    templateUrl: 'notification.card.html'
})
export class NotificationCardComponent{
    @Input() Notification: any;

    constructor(private notificationService: NotificationService, private navCtrl: NavController){}

    ngOnInit(){

    }

    viewItem(){
        if(this.Notification.commentId){
            this.navCtrl.push(NotificationPage, { type: 'comment', commentId: this.Notification.commentId });
            this.notificationService.updateNotification(this.Notification._id).subscribe();
        }else if(this.Notification.postId){
            this.navCtrl.push(NotificationPage, { type: 'post', postId: this.Notification.postId });
            this.notificationService.updateNotification(this.Notification._id).subscribe();
        }else{
            this.navCtrl.push(ProfilePage, { followUser: this.Notification.sourceUser._id });
            this.notificationService.updateNotification(this.Notification._id).subscribe();
        }
    }
}