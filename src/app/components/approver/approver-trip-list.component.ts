import { Component, OnInit } from '@angular/core';
import { TripComponent } from '../trip/trip.component';
import { MatDialog } from '@angular/material/dialog';
import { TripService } from 'src/app/core/services/trip.service';
import { ITrip } from 'src/app/core/interfaces/trip.interface';

@Component({
  selector: 'approver-trip-list',
  templateUrl: './approver-trip-list.component.html',
  styleUrls: ['./approver-trip-list.component.css']
})
export class ApproverTripListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'duration', 'startDate', 'endDate', 'status', 'notes'];
  public trips: Array<ITrip> = [];

  constructor(public dialog: MatDialog, public tripService: TripService) { }

  ngOnInit(): void {
    this.getTripsList();
  }

  private getTripsList(): void {
    this.tripService.getTrips().subscribe(
      (data: ITrip[]) => {
        this.trips = data; 
        console.log('Trips fetched:', data);
      },
      (error) => {
        console.error('Error fetching trips:', error); 
      }
    );
  }

  openTripStepper(trip: ITrip): void {
    const dialogRef = this.dialog.open(TripComponent, {
      width: '800px',
      data: {
        trip: trip,
        isApprover: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getTripsList();
    });
  }
}
