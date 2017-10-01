import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Rx';
import { LocationService } from './location.service';

@Injectable()
export class EventService{
    eventFeedDate: any[];
    eventFeedLikes: any[];
    eventFeedMine: any[];
    datePage: number;
    likesPage: number;
    minePage: number;
    apiKey: string = "2e92c55343cc6cf9e55266f5f65235363c99c53";

    constructor(private http: Http, private authService: AuthService,
         private locService: LocationService){
             this.minePage = 1;
             this.likesPage = 1;
             this.datePage = 1;
         }

    createEvent(values, lat, lng){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            event: values,
            lat: lat,
            lng: lng
        }
        return this.http.post('http://www.blincapp.com/events/createevent', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    loadMine(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/events/nearme/mine?page=' + this.minePage + '&lat=' + this.locService.lat + '&lng=' + this.locService.lng, options)
            .map((resp) => {
                this.minePage += 1;
                return resp.json();
            })
            .catch(this.handleError);
    }

    loadDate(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/events/nearme/date?page=' + this.datePage + '&lat=' + this.locService.lat + '&lng=' + this.locService.lng, options)
            .map((resp) => {
                this.datePage += 1
                return resp.json();
            })
            .catch(this.handleError);
    }

    loadAttending(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com:8082/events/nearme/attending?page=' + this.likesPage + '&lat=' + this.locService.lat + '&lng=' + this.locService.lng, options)
            .map((resp) => {
                this.likesPage += 1;
                return resp.json();
            })
            .catch(this.handleError);
    }

    getMyEvents(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/events/nearme/mine?page=0' + '&lat=' + this.locService.lat + '&lng=' + this.locService.lng, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getEventsDate(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/events/nearme/date?page=0' + '&lat=' + this.locService.lat + '&lng=' + this.locService.lng, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getEventsAttending(){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/events/nearme/attending?page=0' + '&lat=' + this.locService.lat + '&lng=' + this.locService.lng, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    inviteAttendees(user, eventId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            user: user,
            eventId: eventId
        }
        return this.http.post('http://www.blincapp.com/events/attendees/invite', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    acceptInvite(eventId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            eventId: eventId
        }
        return this.http.put('http://www.blincapp.com/events/attendees/accept', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    declineInvite(eventId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            eventId: eventId
        }
        return this.http.put('http://www.blincapp.com/events/attendees/decline', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    tentativeInvite(eventId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            eventId: eventId
        }
        return this.http.post('http://www.blincapp.com/events/attendees/tentative', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getFollowList(eventId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/events/attendees/getfollowlist?eventId=' + eventId, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    postEventText(post, eventId, lng, lat){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        post["geolocation"] = {
            lat: lat,
            lng: lng
        };
        post["eventId"] = eventId;
        return this.http.post('http://www.blincapp.com/events/posttext/', post, options).map((response: Response) => {
            return response.json();
        }).catch(this.handleError);
    }

    postEventPhoto(post, image, eventId, lng, lat){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        post["geolocation"] = {
            lat: lat,
            lng: lng
        };
        post["imageData"] = image;
        post["eventId"] = eventId;
        console.log(image);
        return this.http.post('http://www.blincapp.com/events/postphoto/', post, options).map((response: Response) => {
            return response.json();
        }).catch(this.handleError);
    }

    geoCode(street, city, state){
        var formattedStreet = street.replace(' ', '+');
        console.log('https://api.geocod.io/v1/geocode?q=' + formattedStreet + "," + city + state + "&api_key=" + this.apiKey);
        return this.http.get('https://api.geocod.io/v1/geocode?street=' + formattedStreet + "&city=" + city + "&state=" + state + "&api_key=" + this.apiKey)
            .map((response: Response) => {
                console.log(response);
                return response.json();
            })
            .catch(this.handleError);
    }

    getEventStatus(eventId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/events/attendees/eventstatus?userid=' + this.authService.mongoUser._id + '&eventId=' + eventId, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    getEvent(eventId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/events/getevent?eventId=' + eventId, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    cancelEvent(eventId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        let body = {
            eventId: eventId
        }
        return this.http.put('http://www.blincapp.com/events/cancelEvent', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    editEvent(eventId, formValues, lat, lng){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            event: formValues,
            lat: lat,
            lng: lng,
            eventId: eventId
        }
        return this.http.put('http://www.blincapp.com/events/editEvent', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    private handleError(error){
        return Observable.throw(error);
    }
}