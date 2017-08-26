import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AuthService } from './auth.service';

@Injectable()
export class NotificationService {
    page: number;
    myNotifications: any;

    constructor(private http: Http, private authService: AuthService){
        this.page = 0;
    }

    getUnreadNotifications(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});

        return this.http.get('http://www.blincapp.com/notifications/unread', options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    updateNotification(notificationId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        headers.append('Content-type', 'application/json');
        let options = new RequestOptions({headers: headers});        

        let body = {
            id: notificationId
        }

        return this.http.put('http://www.blincapp.com/notifications/', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getPost(postId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});

        return this.http.get('http://www.blincapp.com/notifications/getpost?id=' + postId, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getComment(commentId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});

        return this.http.get('http://www.blincapp.com/notifications/getcomment?id=' + commentId, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getNotifications(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        this.page = 0;
        return this.http.get('http://www.blincapp.com/notifications/?page=' + this.page, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getMoreNotifications(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        this.page += 1;
        return this.http.get('http://www.blincapp.com/notifications/?page=' + this.page, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    private handleError(error: Response){
        return Observable.throw(error.statusText);
    }
}