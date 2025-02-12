import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITrip } from '../interfaces/trip.interface';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class TripService {
  private apiUrl = 'http://localhost:3000/trips'; 
  private tripDataUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getTrips(): Observable<ITrip[]> {
    return this.http.get<ITrip[]>(this.apiUrl); 
  }

  updateTripData(updatedTrip: ITrip): Observable<any> {
    const url = `${this.apiUrl}/${updatedTrip.id}`; 
    return this.http.put(url, updatedTrip); 
  }

  addTrip(newTrip: ITrip): Observable<any> {
    return this.http.post(this.apiUrl, newTrip);
  }

  updateTrip(tripId: string, updatedTrip: any): Observable<any> {
    const url = `${this.apiUrl}/${tripId}`; 
    return this.http.patch(url, updatedTrip);
  }

  getCars(): Observable<string[]> {
    return this.http.get<string[]>(`${this.tripDataUrl}/cars`);
  }

  getPickupLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.tripDataUrl}/pickup-locations`);
  }

  getDropOffLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.tripDataUrl}/dropoff-locations`);
  }

  getAirlines(): Observable<string[]> {
    return this.http.get<string[]>(`${this.tripDataUrl}/airlines`);
  }

  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.tripDataUrl}/locations`);
  }

  getHotels(): Observable<string[]> {
    return this.http.get<string[]>(`${this.tripDataUrl}/hotels`);
  }

  getHotelLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.tripDataUrl}/hotel-locations`);
  }

  getTaxiLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.tripDataUrl}/taxi-locations`);
  }
}
