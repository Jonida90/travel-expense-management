import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITrip } from '../interfaces/trip.interface';


@Injectable({ providedIn: 'root' })
export class TripService {
  private trips = new BehaviorSubject<ITrip[]>(JSON.parse(localStorage.getItem('trips') || '[]'));

  getTrips() {
    return this.trips.asObservable();
  }

  addTrip(trip: ITrip) {
    const updatedTrips = [...this.trips.value, trip];
    this.trips.next(updatedTrips);
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  }

  updateTrip(updatedTrip: ITrip) {
    const trips = this.trips.value.map(trip =>
      trip.id === updatedTrip.id ? updatedTrip : trip
    );
    this.trips.next(trips);
    localStorage.setItem('trips', JSON.stringify(trips));
  }
}
