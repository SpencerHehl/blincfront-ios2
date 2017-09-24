import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import 'rxjs/add/operator/filter';

@Injectable()
export class LocationService {
    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    public tracking: boolean = false;

    constructor(public zone: NgZone, public geolocation: Geolocation, 
        private diagnostic: Diagnostic){}

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
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.tracking = true;
            })
        })
    }
}