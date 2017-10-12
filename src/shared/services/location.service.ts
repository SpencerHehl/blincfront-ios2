import { Injectable, NgZone } from '@angular/core';
import { Events } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import 'rxjs/add/operator/filter';

@Injectable()
export class LocationService {
    public watch: any;
    public viewlat: number = 0;
    public viewlng: number = 0;
    public postlat: number = 0;
    public postlng: number = 0;
    public tracking: boolean = false;

    constructor(public zone: NgZone, public geolocation: Geolocation, 
        private diagnostic: Diagnostic, public events: Events){}

    checkLocationEnabled(){
        return this.diagnostic.isLocationEnabled();
    }

    checkLocationAuth(){
        return this.diagnostic.isLocationAuthorized();
    }
    
    initializeLocation(){
        return this.geolocation.getCurrentPosition();
    }

    startTracking(){
        let options = {
            maximumAge: 2000,
            enableHighAccuracy: true
        }

        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
            this.zone.run(() => {
                this.postlat = position.coords.latitude;
                this.postlng = position.coords.longitude;
                this.tracking = true;
                var distance = this.getDistance(this.viewlat, this.viewlng, this.postlat, this.postlng);
                if(distance >= .805){
                    this.viewlat = this.postlat;
                    this.viewlng = this.postlng;
                    this.events.publish("location:updated");
                }
            })
        })
    }

    getDistance(lat1, lng1, lat2, lng2){
        var R = 6371
        var dLat = this.deg2rad(lat2 - lat1);
        var dLng = this.deg2rad(lng2 - lng1);
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
    }

    deg2rad(deg){
        return deg * (Math.PI/180)
    }
}