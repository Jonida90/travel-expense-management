import { Component, Inject, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { forkJoin } from 'rxjs';
import { ITrip } from 'src/app/core/interfaces/trip.interface';
import { TripService } from 'src/app/core/services/trip.service';

@Component({
  selector: 'trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent {

  public createTripFormGroup: FormGroup;
  public carRentalFormGroup: FormGroup;
  public hotelFormGroup: FormGroup;
  public flightFormGroup: FormGroup;
  public taxiFormGroup: FormGroup;
  public trip: ITrip;
  public isApprover: boolean;
  public userLoggedIn: any;

  cars: string[] = [];
  pickupLocations: string[] = [];
  dropOffLocations: string[] = [];
  airlines: string[] = [];
  locations: string[] = [];
  hotels: string[] = [];
  hotelLocations: string[] = [];
  taxiLocations: string[] = [];

  @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<any>;
  @ViewChild('noteDialogTemplate') noteDialogTemplate!: TemplateRef<any>;
  @ViewChild('stepper') stepper!: MatStepper;
  dialogRef!: MatDialogRef<any>;
  noteContent: string = '';

  constructor(private _formBuilder: FormBuilder, private tripService: TripService, private snackBar: MatSnackBar, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) @Optional() public data: any) {
    this.trip = data?.trip;
    this.isApprover = data?.isApprover || false;

    this.createTripFormGroup = this._formBuilder.group({
      tripName: [this.trip?.name || '', Validators.required],
      tripDuration: [this.trip?.duration || '', [Validators.required, Validators.pattern(/^\d+$/)]],
      tripStartDate: [this.trip?.startDate || '', Validators.required],
      tripEndDate: [this.trip?.endDate || '', Validators.required],
    });

    this.carRentalFormGroup = this._formBuilder.group({
      carName: [''],
      pickUpDateTime: [''],
      dropOffDateTime: [''],
      pickUpLocation: [''],
      dropOffLocation: [''],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.hotelFormGroup = this._formBuilder.group({
      hotelName: [''],
      hotelLocation: [''],
      checkInDate: [''],
      checkOutDate: [''],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.flightFormGroup = this._formBuilder.group({
      airline: [''],
      fromLocation: [''],
      toLocation: [''],
      departureDateTime: [''],
      arrivalDateTime: [''],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.taxiFormGroup = this._formBuilder.group({
      fromLocation: [''],
      toLocation: [''],
      dateTime: [''],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.initializeExpenses();
  }

  ngOnInit() {
    if (this.isApprover) {
      this.disableAllInputs();
    }
    this.userLoggedIn = JSON.parse(localStorage.getItem('userData') || '{}').id;

    this.initForms();
    this.fetchTripsData();
  }


  private initForms() {
    this.carRentalFormGroup.get('carName')?.valueChanges.subscribe((carName) => this.updateCarRentalTotalPrice(carName));
    this.flightFormGroup.get('airline')?.valueChanges.subscribe((airline) => this.updateFlightTotalPrice(airline));
    this.hotelFormGroup.get('hotelName')?.valueChanges.subscribe((hotelName) => this.updateHotelTotalPrice(hotelName));
    this.taxiFormGroup.get('fromLocation')?.valueChanges.subscribe(() => this.updateTaxiTotalPrice());
    this.taxiFormGroup.get('toLocation')?.valueChanges.subscribe(() => this.updateTaxiTotalPrice());
  }

  updateCarRentalTotalPrice(carName: string): void {
    const carPrices: { [key: string]: number } = {
      'Toyota Corolla': 250,
      'Honda Civic': 200,
      'Ford Mustang': 300,
      'Chevrolet Malibu': 280,
      'BMW 3 Series': 350,
    };
    const totalPrice = carPrices[carName] || 0;
    this.carRentalFormGroup.patchValue({ totalPrice });
  }

  // Update the total price for flights
  updateFlightTotalPrice(airline: string): void {
    const airlinePrices: { [key: string]: number } = {
      'Delta Airlines': 500,
      'American Airlines': 550,
      'United Airlines': 600,
      'Southwest Airlines': 450,
      'JetBlue Airways': 480,
    };
    const totalPrice = airlinePrices[airline] || 0;
    this.flightFormGroup.patchValue({ totalPrice });
  }

  // Update the total price for hotels
  updateHotelTotalPrice(hotelName: string): void {
    const hotelPrices: { [key: string]: number } = {
      'Hilton Garden Inn': 200,
      'Marriott Hotel': 250,
      'Holiday Inn': 180,
      'Sheraton': 220,
      'Hyatt Regency': 300,
    };
    const totalPrice = hotelPrices[hotelName] || 0;
    this.hotelFormGroup.patchValue({ totalPrice });
  }

  // Update the total price for taxi
  updateTaxiTotalPrice(): void {
    const taxiPrices: { [key: string]: number } = {
      'New York City - Times Square - Los Angeles - Santa Monica Pier': 30,
      'New York City - Times Square - Chicago - Millennium Park': 35,
      'New York City - Times Square - San Francisco - Union Square': 28,
      'New York City - Times Square - Miami - Ocean Drive': 20,
      'Los Angeles - Santa Monica Pier - New York City - Times Square': 25,
      'Los Angeles - Santa Monica Pier - Chicago - Millennium Park': 40,
      'Los Angeles - Santa Monica Pier - San Francisco - Union Square': 32,
      'Los Angeles - Santa Monica Pier - Miami - Ocean Drive': 27,
      'Chicago - Millennium Park - New York City - Times Square': 35,
      'Chicago - Millennium Park - Los Angeles - Santa Monica Pier': 45,
      'Chicago - Millennium Park - San Francisco - Union Square': 38,
      'Chicago - Millennium Park - Miami - Ocean Drive': 30,
      'San Francisco - Union Square - New York City - Times Square': 28,
      'San Francisco - Union Square - Los Angeles - Santa Monica Pier': 32,
      'San Francisco - Union Square - Chicago - Millennium Park': 38,
      'San Francisco - Union Square - Miami - Ocean Drive': 33,
      'Miami - Ocean Drive - New York City - Times Square': 20,
      'Miami - Ocean Drive - Los Angeles - Santa Monica Pier': 27,
      'Miami - Ocean Drive - Chicago - Millennium Park': 30,
      'Miami - Ocean Drive - San Francisco - Union Square': 33,
    };

    const fromLocation = this.taxiFormGroup.get('fromLocation')?.value;
    const toLocation = this.taxiFormGroup.get('toLocation')?.value;

    console.log('From:', fromLocation);
    console.log('To:', toLocation);

    if (fromLocation && toLocation) {
      const key = `${fromLocation} - ${toLocation}`;
      console.log('Generated Key:', key); 

      const totalPrice = taxiPrices[key] || 0;  
      this.taxiFormGroup.patchValue({ totalPrice });
    } else {
      this.taxiFormGroup.patchValue({ totalPrice: 0 });
    }
  }


  private fetchTripsData(): void {
    forkJoin({
      cars: this.tripService.getCars(),
      pickupLocations: this.tripService.getPickupLocations(),
      dropOffLocations: this.tripService.getDropOffLocations(),
      airlines: this.tripService.getAirlines(),
      locations: this.tripService.getLocations(),
      hotels: this.tripService.getHotels(),
      hotelLocations: this.tripService.getHotelLocations(),
      taxiLocations: this.tripService.getTaxiLocations()
    }).subscribe({
      next: (data) => {
        this.cars = data.cars;
        this.pickupLocations = data.pickupLocations;
        this.dropOffLocations = data.dropOffLocations;
        this.airlines = data.airlines;
        this.locations = data.locations;
        this.hotels = data.hotels;
        this.hotelLocations = data.hotelLocations;
        this.taxiLocations = data.taxiLocations;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  private initializeExpenses() {
    if (this.trip?.expenses) {
      const carRentalExpense = this.trip.expenses.find(expense => expense.type === 'CAR_RENTAL');
      if (carRentalExpense) {
        this.carRentalFormGroup.patchValue({
          carName: carRentalExpense.details.carName || '',
          pickUpDateTime: carRentalExpense.details.pickUpDateTime || '',
          dropOffDateTime: carRentalExpense.details.dropOffDateTime || '',
          pickUpLocation: carRentalExpense.details.pickUpLocation || '',
          dropOffLocation: carRentalExpense.details.dropOffLocation || '',
          totalPrice: carRentalExpense.details.totalPrice || ''
        });
      }

      const hotelExpense = this.trip.expenses.find(expense => expense.type === 'HOTEL');
      if (hotelExpense) {
        this.hotelFormGroup.patchValue({
          hotelName: hotelExpense.details.hotelName,
          hotelLocation: hotelExpense.details.hotelLocation,
          checkInDate: hotelExpense.details.checkInDate,
          checkOutDate: hotelExpense.details.checkOutDate,
          totalPrice: hotelExpense.details.totalPrice,
        });
      }

      const flightExpense = this.trip.expenses.find(expense => expense.type === 'FLIGHT');
      if (flightExpense) {
        this.flightFormGroup.patchValue({
          airline: flightExpense.details.airline,
          fromLocation: flightExpense.details.fromLocation,
          toLocation: flightExpense.details.toLocation,
          departureDateTime: flightExpense.details.departureDateTime,
          arrivalDateTime: flightExpense.details.arrivalDateTime,
          totalPrice: flightExpense.details.totalPrice,
        });
      }

      const taxiExpense = this.trip.expenses.find(expense => expense.type === 'TAXI');
      if (taxiExpense) {
        this.taxiFormGroup.patchValue({
          fromLocation: taxiExpense.details.fromLocation || '',
          toLocation: taxiExpense.details.toLocation || '',
          dateTime: taxiExpense.details.dateTime || '',
          totalPrice: taxiExpense.details.totalPrice || ''
        });
      }
    }
  }

  submitTripData() {
    const newTrip: ITrip = {
      id: "",
      name: this.createTripFormGroup.value.tripName,
      duration: this.createTripFormGroup.value.tripDuration,
      startDate: this.createTripFormGroup.value.tripStartDate,
      endDate: this.createTripFormGroup.value.tripEndDate,
      userCreatorId: this.userLoggedIn,
      status: 'PENDING',
      expenses: [
        {
          id: 1,
          type: 'CAR_RENTAL',
          details: this.carRentalFormGroup.value
        },
        {
          id: 2,
          type: 'HOTEL',
          details: this.hotelFormGroup.value
        },
        {
          id: 3,
          type: 'FLIGHT',
          details: this.flightFormGroup.value
        },
        {
          id: 4,
          type: 'TAXI',
          details: this.taxiFormGroup.value
        }
      ]
    };

    this.tripService.addTrip(newTrip).subscribe(
      (response) => {
        this.snackBar.open('Trip added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.stepper.reset();
      },
      (error) => {
        this.snackBar.open('Something went wrong while adding trip', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }
    );
  }

  disableAllInputs() {
    this.createTripFormGroup.disable();
    this.carRentalFormGroup.disable();
    this.hotelFormGroup.disable();
    this.flightFormGroup.disable();
    this.taxiFormGroup.disable();
  }

  approveTrip(): void {
    this.openConfirmationDialog('Are you sure you want to <strong>Approve</strong> this trip?')
      .subscribe((result) => {
        if (result) {
          const updatedTrip: ITrip = {
            ...this.trip,
            status: 'APPROVED',
            approverId: this.userLoggedIn
          };
          this.tripService.updateTripData(updatedTrip).subscribe({
            next: (updatedTrip) => {
              this.dialogRef.close({ success: true, updatedTrip });
              this.snackBar.open('Trip approved successfully!', 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom'
              });
            },
            error: (err) => {
              console.error('Error updating trip status:', err);
            },
          });
        }
      });
  }

  cancelTrip() {
    this.openConfirmationDialog('Are you sure you want to <strong>Cancel</strong> this trip?')
      .subscribe((result) => {
        if (result) {
          const updatedTrip: ITrip = {
            ...this.trip,
            status: 'CANCELLED',
            approverId: this.userLoggedIn
          };
          this.tripService.updateTripData(updatedTrip).subscribe({
            next: (updatedTrip) => {
              this.snackBar.open('Trip cancelled!', 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom'
              });
            },
            error: (err) => {
              console.error('Error updating trip status:', err);
            },
          });
        }
      });
  }

  openConfirmationDialog(confirmationMessage: string) {
    this.dialogRef = this.dialog.open(this.confirmDialogTemplate, {
      width: '300px',
      data: { message: confirmationMessage },
    });

    return this.dialogRef.afterClosed();
  }

  closeDialog(result: boolean): void {
    if (this.dialogRef) {
      this.dialogRef.close(result);
    }
  }

  openNoteDialog(): void {
    this.dialogRef = this.dialog.open(this.noteDialogTemplate, {
      width: '400px',
      data: { message: 'Add your note for the trip' },
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.leaveTripNote();
      } else {
        this.noteContent = '';
      }
    });
  }

  leaveTripNote() {
    const updatedTrip = {
      ...this.trip,
      notes: this.noteContent
    };

    this.tripService.updateTrip(this.trip.id, updatedTrip).subscribe(
      (response) => {
        this.snackBar.open('Note saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.noteContent = '';
      },
      (error) => {
        console.error('Error saving note:', error);
      }
    );
  }
}
