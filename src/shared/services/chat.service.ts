import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ChatService{
    chatlistpage: number;
    chatpage: number;

    constructor(private http: Http, private authService: AuthService){
        this.chatlistpage = 0;
        this.chatpage = 0;
    }

    getChats(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});

        return this.http.get('http://www.blincapp.com/chats/getchats?page=' + this.chatlistpage, options)
            .map((resp) => {
                this.chatlistpage += 1;
                return resp.json();
            })
            .catch(this.handleError);
    }

    findChat(user){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});

        return this.http.get("http://www.blincapp.com/chats/findchat?user2=" + user, options)
            .map((resp) => {
                this.chatpage = 0;
                return resp.json();
            })
            .catch(this.handleError);
    }

    createChat(user){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            user2: user
        }

        return this.http.post('http://www.blincapp.com/chats/newchat', body, options)
            .map((resp) => {
                this.chatpage = 0;
                return resp.json();
            })
            .catch(this.handleError);
    }

    getMessages(chat){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});

        return this.http.get("http://www.blincapp.com/chats/getmessages?page" + this.chatpage + '&chat=' + chat, options)
            .map((resp) => {
                this.chatpage += 1;
                return resp.json();
            })
            .catch(this.handleError);
    }

    getUnreadMessages(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});

        return this.http.get("http://www.blincapp.com/chats/getunreadmessages" , options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    markAsRead(messages){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            messages: messages
        }

        return this.http.put("http://www.blincapp.com/chats/markasread", body, options)
            .map((resp) => {

            })
            .catch(this.handleError);
    }

    private handleError(error){
        return Observable.throw(error);
    }
}