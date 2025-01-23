import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITrip } from '../interfaces/trip.interface';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class TripService {
  private apiUrl = 'http://localhost:3000/trips'; 

  constructor(private http: HttpClient) {}

  getTrips(): Observable<ITrip[]> {
    return this.http.get<ITrip[]>(this.apiUrl); 
  }

  addTrip(newTrip: ITrip): Observable<any> {
    return this.http.post(this.apiUrl, newTrip);
  }
}
