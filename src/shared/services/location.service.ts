import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

@Injectable()
export class LocationService {
    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    public tracking: boolean = false;

    constructor(public zone: NgZone, public geolocation: Geolocation){}

    startTracking(){
        let options = {
            frequency: 3000,
            enableHighAccuracy: true
        }

        this.geolocation.getCurrentPosition().then((response) => {
            this.lat = response.coords.latitude;
            this.lng = response.coords.longitude;
            this.tracking = true;
        })

        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
            this.zone.run(() => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            })
        })
    }
}