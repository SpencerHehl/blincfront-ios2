import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service';

@Injectable()
export class UserService{

    constructor(private authService: AuthService, private http: Http){}

    getTopUsers(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/user/getusers', options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    searchUsers(username){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/user/searchusers?name=' + username, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError)
    }

    private handleError(error){
        return Observable.throw(error);
    }
}