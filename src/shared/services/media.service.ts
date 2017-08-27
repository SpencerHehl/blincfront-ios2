import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class MediaService{
    constructor(private http: Http){}

    getMedia(id){
        return this.http.get('http://104.238.138.146:80/media/' + id)
            .map((resp) =>{
                return resp.json();
            })
            .catch(this.handleError);
    }

    private handleError(error: Response){
        return Observable.throw(error.statusText);
    }
}