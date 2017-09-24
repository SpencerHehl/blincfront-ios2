import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Events } from 'ionic-angular';

import { NotificationService } from '../../../shared/services/notifications.service';
import { NotificationPage } from '../notification/notification.component';
import { ProfilePage } from '../../profile/profile.component';
import { PeoplePage } from '../../people/people.component';
import { EventPage } from '../../events/event/event.component';
import { EventService } from '../../../shared/services/event.service';

@Component({
    templateUrl: 'list.notification.component.html'
})
export class NotificationListPage{
    notifications: any[];

    constructor(private notificationService: NotificationService, private alertCtrl: AlertController,
         public navParams: NavParams, public navCtrl: NavController, public events: Events,
         private eventService: EventService){}

    ionViewWillLoad(){
        this.notificationService.getNotifications().subscribe(
            response => {
                console.log(response);
                this.notifications = response;
            },
            err => this.failAlert(err)
        )
    }

    clearNotifications(){
        this.notifications.forEach((notification) => {
            this.notificationService.updateNotification(notification._id).subscribe(
                response => {
                    notification.viewed = true;
                    this.events.publish('notifications:updated');
                }
            );
        })
    }

    viewProfile(notification){
        this.navCtrl.push(ProfilePage, { user: notification.sourceUser });
        this.notificationService.updateNotification(notification._id).subscribe(
            response => {
                notification.viewed = true;
                this.events.publish('notifications:updated');
            }
        );
    }

    viewItem(notification){
        if(notification.commentId){
            this.notificationService.updateNotification(notification._id).subscribe(
                response => {
                    notification.viewed = true;
                    this.events.publish('notifications:updated');
                }
            );            
            this.notificationService.getComment(notification.commentId).subscribe(
                response => {
                    this.navCtrl.push(NotificationPage, { post: response.post, comments: response.comments });                
                },
                err => this.failAlert(err),
            )
        }else if(notification.postId){
            this.notificationService.updateNotification(notification._id).subscribe(
                response => {
                    notification.viewed = true;
                    this.events.publish('notifications:updated');
                }
            );            
            this.notificationService.getPost(notification.postId).subscribe(
                response => {
                    this.navCtrl.push(NotificationPage, { post: response.post, comments: response.comments });                
                },
                err => this.failAlert(err),
            )
        }else if(notification.followReqId){
            this.notificationService.updateNotification(notification._id).subscribe(
                response => {
                    notification.viewed = true;
                    this.events.publish('notifications:updated');
                }
            );
            this.navCtrl.push(PeoplePage)
        }else if(notification.eventId){
            this.notificationService.updateNotification(notification._id).subscribe(
                rseponse => {
                    notification.viewed = true;
                    this.events.publish('notifications:updated');
                }
            )
            this.eventService.getEvent(notification.eventId).subscribe(
                response => {
                    this.navCtrl.push(EventPage, {event: response});
                }
            )   
        }else{
            this.notificationService.updateNotification(notification._id).subscribe(
                response => {
                    notification.viewed = true;
                    this.events.publish('notifications:updated');
                }
            );
            this.navCtrl.push(ProfilePage, { user: notification.sourceUser });
        }
    }

    loadMore(){
        this.notificationService.getMoreNotifications().subscribe(
            response => {
                if(response.length > 0){
                    Array.prototype.push.apply(this.notifications, response);
                }
            },
            err => this.failAlert(err)
        )
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