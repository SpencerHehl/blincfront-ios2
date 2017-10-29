import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, ToastController, AlertController, Content } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { AuthService } from '../../../shared/services/auth.service';
import { ChatService } from '../../../shared/services/chat.service';

@Component({
    selector: 'page-chat-room',
    templateUrl: 'privatechat.component.html'
})
export class PrivateChatPage {
    chat: any;
    messages: any[] = [];
    message: string = '';
    @ViewChild(Content) content: Content;

    constructor(private navParams: NavParams, private navCtrl: NavController,
         private socket: Socket, private authService: AuthService,
         private chatService: ChatService){}

    ionViewDidEnter(){
        this.chat = this.navParams.get('chat');
        this.chatService.getMessages(this.chat._id).subscribe(
            resp => {
                this.messages = resp;
                setTimeout(() => {
                    this.content.scrollToBottom(300);
                },100);
            }
        )
        this.socket.connect()
        this.socket.emit('join', {room: this.chat._id, user: this.authService.mongoUser._id});
        this.socket.on('receive-message', (data) => {
            this.messages.push(data.message);
        })
    }

    ionViewWillLeave(){
        this.socket.disconnect();
    }

    sendMessage(){
        this.socket.emit('send-message', {room: this.chat._id, messagetext: this.message, sender: this.authService.mongoUser._id});
        this.message = '';
        this.content.scrollToBottom(300);
    }
}