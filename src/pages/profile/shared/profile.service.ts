import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../../../shared/services/auth.service';


@Injectable()
export class ProfileService{
    page: number;

    constructor(private http:Http, private authService: AuthService){
        this.page = 0;
    }

    getProfilePosts(profileId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://104.238.138.146:80/profile/profileposts?page=' + this.page + '&user=' + profileId, options)
            .map((resp) => {
                this.page += 1;
                return resp.json();
            })
            .catch(this.handleError);
    }

    getProfile(profileId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://104.238.138.146:80/profile/' + profileId, options)
            .map((resp) => {
                this.page += 1;
                return resp.json();
            })
            .catch(this.handleError);
    }

    follow(profileId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            id: profileId
        }
        return this.http.put('http://104.238.138.146:80/profile/follow', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    unfollow(profileId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            id: profileId
        }
        return this.http.put('http://104.238.138.146:80/profile/unfollow', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getFollowLists(profileId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/profile/followlists/' + profileId, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    private handleError(error){
        return Observable.throw(error);
    }
}