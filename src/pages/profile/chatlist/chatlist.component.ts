import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { PrivateChatPage } from '../privatechat/privatechat.component';
import { ChatService } from '../../../shared/services/chat.service';

@Component({
    templateUrl: 'chatlist.component.html'
})
export class ChatListPage{
    chats: any[] =[];
    unreadMessages: any;

    constructor(private navCtrl: NavController, private navParams: NavParams,
         private alertCtrl: AlertController, private chatService: ChatService){}

    ionViewDidEnter(){
        this.chats = this.navParams.get('chats');
        this.chatService.getUnreadMessages().subscribe(
            resp => {
                this.unreadMessages = resp;
                let chatsObj = {}
                this.unreadMessages.forEach((message) => {
                    if(chatsObj[message.chatId]){
                        chatsObj[message.chatId].push(message);
                    }else{
                        chatsObj[message.chatId] = [message];
                    }
                })
                this.chats.forEach((chat) => {
                    let messages = chatsObj[chat._id];
                    if(messages){
                        chat.unread = messages;
                    }else{
                        chat.unread = [];
                    }
                })
            },
            err => this.failAlert(err)
        )
    }

    openChat(chat){
        this.chatService.markAsRead(chat.unread).subscribe();
        this.navCtrl.push(PrivateChatPage, {chat: chat, messages: chat.messages});
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