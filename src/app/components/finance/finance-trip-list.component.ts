import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ITrip } from 'src/app/core/interfaces/trip.interface';
import { TripService } from 'src/app/core/services/trip.service';

@Component({
  selector: 'finance-trip-list',
  templateUrl: './finance-trip-list.component.html',
  styleUrls: ['./finance-trip-list.component.css']
})
export class FinanceTripListComponent implements OnInit {

  public trips: Array<ITrip> = [];
  public userLoggedIn: any;
  displayedColumns: string[] = ['name', 'duration', 'startDate', 'endDate', 'status', 'action'];

  constructor(public tripService: TripService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;


  ngOnInit(): void {
    this.userLoggedIn = JSON.parse(localStorage.getItem('userData') || '{}').id;
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
    const financeId = JSON.parse(localStorage.getItem('userData') || '{}').id;

    this.openConfirmationDialog(trip, 'Are you sure you want to mark this trip as <strong>Refunded</strong>?')
      .subscribe((result) => {
        if (result) {
          const updatedTrip: ITrip = {
            ...trip,
            status: 'REFUNDED', 
            financeId: financeId
          };
          this.tripService.updateTripData(updatedTrip).subscribe({
            next: (updatedTrip) => {
              this.snackBar.open('Trip status changed successfully!', 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom'
              });
              this.getApprovedTripsList();
            },
            error: (err) => {
              console.error('Error updating trip status:', err);
            },
          });
        }
      });
  }
  
  markAsInProcess(trip: ITrip): void {
    this.openConfirmationDialog(trip, 'Are you sure you want to mark this trip as <strong>In Process</strong>?')
      .subscribe((result) => {
        if (result) {
          const updatedTrip: ITrip = {
            ...trip,
            status: 'PROCESS', 
            financeId: this.userLoggedIn
          };
          this.tripService.updateTripData(updatedTrip).subscribe({
            next: (updatedTrip) => {
              this.snackBar.open('Trip status changed successfully!', 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom'
              });
              this.getApprovedTripsList();
            },
            error: (err) => {
              console.error('Error updating trip status:', err);
            },
          });
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
