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
        return this.http.get('http://104.238.138.146:80/user/getusers', options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    searchUsers(username){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjI5MzU3YS0zOTQ1LTRlZWQtYTBkNC0zMjVlNzViYjI3NGMifQ.a7G19890MEenRJwayz7QUze9Q-krZlEi6RPrubWzUj0"});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://104.238.138.146:8082/user/searchusers?name=' + username, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError)
    }

    private handleError(error){
        return Observable.throw(error);
    }
}