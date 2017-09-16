import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service';
import { LocationService } from './location.service';

@Injectable()
export class PostService{
    myLocation: any;
    datePage: number;
    likesPage: number;
    
    constructor(private http: Http, private geolocation: Geolocation,
        private authService: AuthService, private locService: LocationService){
        this.datePage = 1;
        this.likesPage = 1;
    }

    getMyLocation(){
        return Observable.fromPromise(this.geolocation.getCurrentPosition())
            .map((resp) => {
                this.myLocation = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                }
                return this.myLocation;
            }).catch(this.handleError);
    }

    getPost(postId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/post/' + postId, options)
            .map((resp) => {
                return resp.json()
            })
            .catch(this.handleError);
    }

    getNearbyPostsDate(){
        if(this.locService.tracking){
            this.myLocation = {
                lat: this.locService.lat,
                lng: this.locService.lng
            }
            let token = this.authService.authToken;
            let headers = new Headers({'Authorization': token});
            let options = new RequestOptions({headers: headers});
            return this.http.get('http://www.blincapp.com/post/nearme/date?lat=' + this.locService.lat + '&lng=' + this.locService.lng + '&page=0', options)
                .map((resp) => {
                    return resp.json();
                })
                .catch(this.handleError);
        }else{
            return Observable.fromPromise(this.geolocation.getCurrentPosition())
                .map((resp) => {
                    this.myLocation = {
                        lat: resp.coords.latitude,
                        lng: resp.coords.longitude
                    }
                    return resp;
                })
                .flatMap((resp) => {
                    let token = this.authService.authToken;
                    let headers = new Headers({'Authorization': token});
                    let options = new RequestOptions({headers: headers});
                    return this.http.get('http://www.blincapp.com/post/nearme/date?lat=' + resp.coords.latitude + '&lng=' + resp.coords.longitude + '&page=0', options)
                        .map((resp) => {
                            return resp.json();
                        })
                })
                .catch(this.handleError);
            }
    }

    getNearbyPostsLikes(){
        if(this.locService.tracking){
            this.myLocation = {
                lat: this.locService.lat,
                lng: this.locService.lng
            }
            let token = this.authService.authToken;
            let headers = new Headers({'Authorization': token});
            let options = new RequestOptions({headers: headers});
            return this.http.get('http://www.blincapp.com/post/nearme/likes?lat=' + this.locService.lat + '&lng=' + this.locService.lng + '&page=0', options)
                .map((resp) => {
                    return resp.json();
                })
                .catch(this.handleError);
        }else{
            return Observable.fromPromise(this.geolocation.getCurrentPosition())
                .map((resp) => {
                    this.myLocation = {
                        lat: resp.coords.latitude,
                        lng: resp.coords.longitude
                    }
                    return resp;
                })
                .flatMap((resp) => {
                    let token = this.authService.authToken;
                    let headers = new Headers({'Authorization': token});
                    let options = new RequestOptions({headers: headers});
                    return this.http.get('http://www.blincapp.com/post/nearme/likes?lat=' + resp.coords.latitude + '&lng=' + resp.coords.longitude + '&page=0', options)
                        .map((resp) => {
                            return resp.json();
                        })
                })
                .catch(this.handleError);
            }
    }

    getLikes(postId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/post/likedby/' + postId, options)
            .map((resp) => {
                return resp.json()
            })
            .catch(this.handleError);
    }

    loadDate(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/post/nearme/date?lat=' + this.myLocation.lat + '&lng=' + this.myLocation.lng + '&page=' + this.datePage, options)
            .map((resp) => {
                this.datePage += 1;
                return resp.json();
            })
            .catch(this.handleError);
    }

    loadLikes(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/post/nearme/likes?lat=' + this.myLocation.lat + '&lng=' + this.myLocation.lng + '&page=' + this.likesPage, options)
            .map((resp) => {
                this.likesPage += 1;
                return resp.json();
            })
            .catch(this.handleError);
    }

    likePost(postId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            id: postId
        }
        return this.http.put('http://www.blincapp.com/post/like', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    unlikePost(postId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            id: postId
        }
        return this.http.put('http://www.blincapp.com/post/unlike', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    postText(post){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        post["geolocation"] = {
            lat: this.locService.lat,
            lng: this.locService.lng
        };
        return this.http.post('http://www.blincapp.com/post/text/', post, options).map((response: Response) => {
            return response.json();
        }).catch(this.handleError);
    }

    postPhoto(post, image){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        post["geolocation"] = {
            lat: this.locService.lat,
            lng: this.locService.lng
        };
        post["imageData"] = image;
        console.log(image);
        return this.http.post('http://www.blincapp.com/post/picture/', post, options).map((response: Response) => {
            return response.json();
        }).catch(this.handleError);
    }

    getMapMarkers(distance, location){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/post/mapmarkers?distance=' + distance + '&lat=' + location.lat+ '&lng=' + location.lng, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getMapPosts(distance, location){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/post/mapposts?distance=' + distance + '&lat=' + location.lat+ '&lng=' + location.lng, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);    
    }

    getMarkerPost(postId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/post/mappost/' + postId, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getTopPost(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/post/toppost', options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    deletePost(post){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});

        return this.http.delete('http://www.blincapp.com/post/delete/' + post._id, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    reportPost(post){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            id: post._id
        }

        return this.http.put('http://www.blincapp.com/post/report', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    private handleError(error){
        return Observable.throw(error);
    }
}