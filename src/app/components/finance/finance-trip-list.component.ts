import { Component, OnInit } from '@angular/core';
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
  status: 'Approved' | 'Refunded' | 'In Process'; // New field for status
}

@Component({
  selector: 'finance-trip-list',
  templateUrl: './finance-trip-list.component.html',
  styleUrls: ['./finance-trip-list.component.css']
})
export class FinanceTripListComponent implements OnInit {
  displayedColumns: string[] = ['tripName', 'tripDuration', 'tripStartDate', 'tripEndDate', 'carName', 'hotelName', 'flightAirline', 'totalPrice', 'status', 'action'];
  
  trips: Trip[] = [
    {
      tripName: 'Beach Vacation',
      tripDuration: '7 Days',
      tripStartDate: new Date('2025-06-01'),
      tripEndDate: new Date('2025-06-07'),
      carName: 'Toyota Corolla',
      hotelName: 'Oceanfront Resort',
      flightAirline: 'Delta Airlines',
      totalPrice: 1200,
      status: 'Approved'
    },
    {
      tripName: 'Mountain Adventure',
      tripDuration: '5 Days',
      tripStartDate: new Date('2025-07-10'),
      tripEndDate: new Date('2025-07-15'),
      carName: 'Ford Explorer',
      hotelName: 'Mountain Lodge',
      flightAirline: 'United Airlines',
      totalPrice: 900,
      status: 'Approved'
    }
  ];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  markAsRefunded(trip: Trip): void {
    trip.status = 'Refunded';
  }

  markAsInProcess(trip: Trip): void {
    trip.status = 'In Process';
  }
}
