import { Component, OnInit } from '@angular/core';
import { TripComponent } from '../trip/trip.component';
import { MatDialog } from '@angular/material/dialog';

export interface Trip {
  tripName: string;
  tripDuration: string;
  tripStartDate: Date;
  tripEndDate: Date;
  carName: string;
  hotelName: string;
  flightAirline: string;
  totalPrice: number;
}

@Component({
  selector: 'trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {
  displayedColumns: string[] = ['tripName', 'tripDuration', 'tripStartDate', 'tripEndDate', 'carName', 'hotelName', 'flightAirline', 'totalPrice'];
  trips: Trip[] = [
    {
      tripName: 'Beach Vacation',
      tripDuration: '7 Days',
      tripStartDate: new Date('2025-06-01'),
      tripEndDate: new Date('2025-06-07'),
      carName: 'Toyota Corolla',
      hotelName: 'Oceanfront Resort',
      flightAirline: 'Delta Airlines',
      totalPrice: 1200
    },
    {
      tripName: 'Mountain Adventure',
      tripDuration: '5 Days',
      tripStartDate: new Date('2025-07-10'),
      tripEndDate: new Date('2025-07-15'),
      carName: 'Ford Explorer',
      hotelName: 'Mountain Lodge',
      flightAirline: 'United Airlines',
      totalPrice: 900
    }
  ];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openTripStepper(trip: Trip): void {
    const dialogRef = this.dialog.open(TripComponent, {
      width: '800px',
      data: trip
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any action
    });
  }
}
