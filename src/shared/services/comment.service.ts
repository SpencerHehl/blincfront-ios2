import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service';

@Injectable()
export class CommentService{
    constructor(private http: Http, private authService: AuthService){}

    getComments(postId){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return this.http.get('http://www.blincapp.com/comment/' + postId, options)
            .map((resp) => {
                return resp.json()
            })
            .catch(this.handleError);
    }

    postPictureComment(formValues, imgData, postId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        formValues["imageData"] = imgData;
        formValues["postId"] = postId;
        return this.http.post('http://www.blincapp.com/comment/picture/', formValues, options).map((response: Response) => {
            return response.json();
        }).catch(this.handleError);
    }

    postTextComment(formValues, postId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        formValues["postId"] = postId;
        return this.http.post('http://www.blincapp.com/comment/text/', formValues, options).map((response: Response) => {
            return response.json();
        }).catch(this.handleError);
    }

    likeComment(commentId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            id: commentId
        }
        return this.http.put('http://www.blincapp.com/comment/like', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    unlikeComment(commentId){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            id: commentId
        }
        return this.http.put('http://www.blincapp.com/comment/unlike', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    deleteComment(comment){
        let token = this.authService.authToken;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});

        return this.http.delete('http://www.blincapp.com/comment/delete/' + comment._id, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    reportComment(comment){
        let headers = new Headers({'Content-type': 'application/json'});
        let token = this.authService.authToken;
        headers.append('Authorization', token);
        let options = new RequestOptions({headers: headers});
        let body = {
            id: comment._id
        }

        return this.http.put('http://www.blincapp.com/comment/report', body, options)
            .map((resp) => {
                return resp.json();
            })
            .catch(this.handleError);
    }

    private handleError(error){
        return Observable.throw(error);
    }
}