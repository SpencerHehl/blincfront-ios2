import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LocationService {
    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    public tracking: boolean = false;

    constructor(public zone: NgZone, public backgroundGeolocation: BackgroundGeolocation,
         public geolocation: Geolocation){}

    startTracking() {
        this.tracking = true;

        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 20,
            distanceFilter: 10,
            debug: false,
            interval: 2000
        }

        this.backgroundGeolocation.configure(config).subscribe(
            (location) => {
                this.zone.run(() => {
                    this.lat = location.latitude;
                    this.lng = location.longitude;
                });
            }, (err) => {
                console.log(err);
            }
        );

        this.backgroundGeolocation.start();

        let options = {
            frequency: 3000,
            enableHighAccuracy: true
        }

        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
            this.zone.run(() => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            })
        })
    }

    stopTracking(){
        this.tracking = false;
        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();
    }

    getMyLocation(){
        return Observable.fromPromise(this.geolocation.getCurrentPosition())
            .map((resp) => {
                    this.lat = resp.coords.latitude,
                    this.lng = resp.coords.longitude
                }
            ).catch(this.handleError);
    }

    private handleError(error){
        return Observable.throw(error);
    }
}