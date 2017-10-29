import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { PostService } from '../../../shared/services/post.service';
import { ListViewPage } from '../listview/listview.component';
import { PostPage } from '../../posts/single/post.component';
import { LocationService } from '../../../shared/services/location.service';
import { EventService } from '../../../shared/services/event.service';
import { EventPage } from '../../events/event/event.component';

declare var google: any;

@Component({
    templateUrl: 'mapview.component.html',
    styles: [`
        #map {
            height: 100%
        }
    `]
})
export class MapViewPage{
    myLocation: any;
    postMarkers: any;
    eventMarkers: any;
    map: any;
    center: any;
    zoom: any;
    markerCluster: any;
    post: any;

    constructor(public navCtrl: NavController, private navParams: NavParams,
        public alertCtrl: AlertController, private postService: PostService,
        private locService: LocationService, private eventService: EventService){}

    /*ionViewDidLoad(){
        this.post = this.navParams.get('post');
        if(this.post){
            this.myLocation = {
                lat: this.post.geolocation[1],
                lng: this.post.geolocation[0]
            }
            this.initMap(this.myLocation, 15);
        }else{
            this.centerLocation();
        }
    }*/

    ionViewDidEnter(){
        this.post = this.navParams.get('post');
        if(this.post){
            this.myLocation = {
                lat: this.post.geolocation[1],
                lng: this.post.geolocation[0]
            }
            this.initMap(this.myLocation, 15);
        }else{
            if(this.center){
                this.initMap(this.center, this.zoom);
            }else{
                this.centerLocation();
            }
        }
    }

    centerLocation(){
        this.myLocation = {
            lat: this.locService.viewlat,
            lng: this.locService.viewlng
        };
        this.initMap(this.myLocation, 15);
    }

    initMap(mapCenter, zoom){
        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: zoom,
          center: mapCenter,
          disableDefaultUI: true
        });
        this.updateMarkers(15, this.myLocation);
        var self = this;
        this.map.addListener('bounds_changed', function(){
            var newZoom = self.map.getZoom();
            var newCenter = self.map.getCenter();
            var centerLatLng = {'lat': newCenter.lat(), 'lng': newCenter.lng()};
            self.center = newCenter;
            self.zoom = newZoom;
            self.updateMarkers(newZoom, centerLatLng);
        }, {passive: true});
    }

    updateMarkers(zoom, location){
        var distance = this.calcDistance(location.lat, zoom);
        this.postService.getMapMarkers(distance, location).subscribe(
            resp => {
                this.postMarkers = resp.map((post) => {
                    var postLocation = {
                        lat: post.geolocation[1],
                        lng: post.geolocation[0]
                    }
                    var marker;
                    if(this.post){
                        if(post._id == this.post._id){
                            marker = new google.maps.Marker({
                                position: postLocation,
                                map: this.map,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                postId: post._id
                            })
                        }else{
                            marker = new google.maps.Marker({
                                position: postLocation,
                                map: this.map,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                postId: post._id
                            })
                        }
                    }else{
                        marker = new google.maps.Marker({
                            position: postLocation,
                            map: this.map,
                            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            postId: post._id
                        })
                    }
                    var self = this;
                    
                    marker.addListener('click', function(){
                        self.postService.getMarkerPost(marker.postId).subscribe(
                            response => {
                                self.navCtrl.push(PostPage, {post: response});
                            },
                            err => self.failAlert(err)
                        )
                    })
                    return marker;
                })
            },
            err => this.failAlert(err)
        )
    }

    viewPosts(){
        var currZoom = this.map.getZoom();
        var mapCenter = this.map.getCenter();
        var currCenter = {lat: mapCenter.lat(), lng: mapCenter.lng()};
        var distance = this.calcDistance(currCenter.lat, currZoom);
        this.navCtrl.push(ListViewPage, {'distance': distance, 'center': currCenter});
    }

    calcDistance(lat, zoom){
        var metersPerPixel = Math.cos(lat * Math.PI/180) * 2 * Math.PI * 6378137 / (256 * Math.pow(2, zoom));
        var distance = metersPerPixel * this.map.getDiv().offsetHeight;
        return distance;
    }

    failAlert(message){
        let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: message,
        buttons: ['OK']
        });
        alert.present();
    }
}