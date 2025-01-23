import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ITrip } from 'src/app/core/interfaces/trip.interface';
import { TripService } from 'src/app/core/services/trip.service';

@Component({
  selector: 'finance-trip-list',
  templateUrl: './finance-trip-list.component.html',
  styleUrls: ['./finance-trip-list.component.css']
})
export class FinanceTripListComponent implements OnInit {

  public trips: Array<ITrip> = [];
  displayedColumns: string[] = ['name', 'duration', 'startDate', 'endDate', 'status', 'action'];

  constructor(public tripService: TripService, private dialog: MatDialog) { }

  @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;


  ngOnInit(): void {
    this.getApprovedTripsList();
  }

  private getApprovedTripsList(): void {
    this.tripService.getTrips().subscribe(
      (data: ITrip[]) => {
        this.trips = data.filter(t => t.status === 'APPROVED');
        console.log('Trips fetched:', data);
      },
      (error) => {
        console.error('Error fetching trips:', error);
      }
    );
  }

  markTripAsRefunded(trip: ITrip): void {
    this.openConfirmationDialog(trip, 'Are you sure you want to mark this trip as <strong>Refunded</strong>?')
      .subscribe((result) => {
        if (result) {
          trip.status = 'REFUNDED';
        }
      });
  }
  
  markAsInProcess(trip: ITrip): void {
    this.openConfirmationDialog(trip, 'Are you sure you want to mark this trip as <strong>In Process</strong>?')
      .subscribe((result) => {
        if (result) {
          trip.status = 'IN_PROCESS';
        }
      });
  }
  
  openConfirmationDialog(trip: ITrip, confirmationMessage: string) {
    this.dialogRef = this.dialog.open(this.confirmDialogTemplate, {
      width: '300px',
      data: { trip, message: confirmationMessage },
    });
  
    return this.dialogRef.afterClosed();
  }
  
  closeDialog(result: boolean): void {
    if (this.dialogRef) {
      this.dialogRef.close(result);
    }
  }
}
