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

  createTripFormGroup: FormGroup;
  carRentalFormGroup: FormGroup;
  hotelFormGroup: FormGroup;
  flightFormGroup: FormGroup;
  taxiFormGroup: FormGroup;
  trip: ITrip;
  isApprover: boolean;
  userLoggedIn: any;

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

  constructor(
    private _formBuilder: FormBuilder,
    private tripService: TripService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) @Optional() public data: any
  ) {
    this.trip = data?.trip;
    this.isApprover = data?.isApprover || false;

    this.createTripFormGroup = this.buildCreateTripFormGroup();
    this.carRentalFormGroup = this.buildCarRentalFormGroup();
    this.hotelFormGroup = this.buildHotelFormGroup();
    this.flightFormGroup = this.buildFlightFormGroup();
    this.taxiFormGroup = this.buildTaxiFormGroup();

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

  private buildCreateTripFormGroup(): FormGroup {
    return this._formBuilder.group({
      tripName: [this.trip?.name || '', Validators.required],
      tripDuration: [this.trip?.duration || '', [Validators.required, Validators.pattern(/^\d+$/)]],
      tripStartDate: [this.trip?.startDate || '', Validators.required],
      tripEndDate: [this.trip?.endDate || '', Validators.required],
    });
  }

  private buildCarRentalFormGroup(): FormGroup {
    return this._formBuilder.group({
      carName: [''],
      pickUpDateTime: [''],
      dropOffDateTime: [''],
      pickUpLocation: [''],
      dropOffLocation: [''],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });
  }

  private buildHotelFormGroup(): FormGroup {
    return this._formBuilder.group({
      hotelName: [''],
      hotelLocation: [''],
      checkInDate: [''],
      checkOutDate: [''],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });
  }

  private buildFlightFormGroup(): FormGroup {
    return this._formBuilder.group({
      airline: [''],
      fromLocation: [''],
      toLocation: [''],
      departureDateTime: [''],
      arrivalDateTime: [''],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });
  }

  private buildTaxiFormGroup(): FormGroup {
    return this._formBuilder.group({
      fromLocation: [''],
      toLocation: [''],
      dateTime: [''],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });
  }

  private initForms() {
    this.carRentalFormGroup.get('carName')?.valueChanges.subscribe((carName) => this.updateCarRentalTotalPrice(carName));
    this.flightFormGroup.get('airline')?.valueChanges.subscribe((airline) => this.updateFlightTotalPrice(airline));
    this.hotelFormGroup.get('hotelName')?.valueChanges.subscribe((hotelName) => this.updateHotelTotalPrice(hotelName));
    this.taxiFormGroup.get('fromLocation')?.valueChanges.subscribe(() => this.updateTaxiTotalPrice());
    this.taxiFormGroup.get('toLocation')?.valueChanges.subscribe(() => this.updateTaxiTotalPrice());
  }

  private fetchTripsData() {
    forkJoin({
      cars: this.tripService.getCars(),
      pickupLocations: this.tripService.getPickupLocations(),
      dropOffLocations: this.tripService.getDropOffLocations(),
      airlines: this.tripService.getAirlines(),
      locations: this.tripService.getLocations(),
      hotels: this.tripService.getHotels(),
      hotelLocations: this.tripService.getHotelLocations(),
      taxiLocations: this.tripService.getTaxiLocations(),
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
      },
    });
  }

  private initializeExpenses() {
    if (this.trip?.expenses) {
      this.initializeExpenseForm('CAR_RENTAL', this.carRentalFormGroup);
      this.initializeExpenseForm('HOTEL', this.hotelFormGroup);
      this.initializeExpenseForm('FLIGHT', this.flightFormGroup);
      this.initializeExpenseForm('TAXI', this.taxiFormGroup);
    }
  }

  private initializeExpenseForm(expenseType: string, formGroup: FormGroup) {
    const expense = this.trip.expenses.find((expense) => expense.type === expenseType);
    if (expense) {
      formGroup.patchValue({
        ...expense.details,
      });
    }
  }

  updateCarRentalTotalPrice(carName: string): void {
    const carPrices = this.getPriceData('carRental');
    this.updateTotalPrice(carName, carPrices, this.carRentalFormGroup);
  }

  updateFlightTotalPrice(airline: string): void {
    const airlinePrices = this.getPriceData('flight');
    this.updateTotalPrice(airline, airlinePrices, this.flightFormGroup);
  }

  updateHotelTotalPrice(hotelName: string): void {
    const hotelPrices = this.getPriceData('hotel');
    this.updateTotalPrice(hotelName, hotelPrices, this.hotelFormGroup);
  }

  updateTaxiTotalPrice(): void {
    const taxiPrices = this.getPriceData('taxi');
    const fromLocation = this.taxiFormGroup.get('fromLocation')?.value;
    const toLocation = this.taxiFormGroup.get('toLocation')?.value;
    const key = `${fromLocation} - ${toLocation}`;
    const totalPrice = taxiPrices[key] || 0;
    this.taxiFormGroup.patchValue({ totalPrice });
  }

  private getPriceData(type: string): { [key: string]: number } {
    const priceData = {
      carRental: {
        'Toyota Corolla': 250,
        'Honda Civic': 200,
        'Ford Mustang': 300,
        'Chevrolet Malibu': 280,
        'BMW 3 Series': 350,
      },
      flight: {
        'Delta Airlines': 500,
        'American Airlines': 550,
        'United Airlines': 600,
        'Southwest Airlines': 450,
        'JetBlue Airways': 480,
      },
      hotel: {
        'Hilton Garden Inn': 200,
        'Marriott Hotel': 250,
        'Holiday Inn': 180,
        'Sheraton': 220,
        'Hyatt Regency': 300,
      },
      taxi: {
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
      },
    };
    return priceData[type as keyof typeof priceData]; // Type assertion
  }


  private updateTotalPrice(item: string, priceData: { [key: string]: number }, formGroup: FormGroup): void {
    const totalPrice = priceData[item] || 0;
    formGroup.patchValue({ totalPrice });
  }

  submitTripData() {
    const newTrip: ITrip = this.createNewTrip();
    this.tripService.addTrip(newTrip).subscribe(
      () => this.handleSuccess('Trip added successfully!'),
      () => this.handleError('Something went wrong while adding trip')
    );
  }

  private createNewTrip(): ITrip {
    return {
      id: '',
      name: this.createTripFormGroup.value.tripName,
      duration: this.createTripFormGroup.value.tripDuration,
      startDate: this.createTripFormGroup.value.tripStartDate,
      endDate: this.createTripFormGroup.value.tripEndDate,
      userCreatorId: this.userLoggedIn,
      status: 'PENDING',
      expenses: this.createExpenses(),
    };
  }

  private createExpenses() {
    return [
      { id: 1, type: 'CAR_RENTAL' as 'CAR_RENTAL', details: this.carRentalFormGroup.value },
      { id: 2, type: 'HOTEL' as 'HOTEL', details: this.hotelFormGroup.value },
      { id: 3, type: 'FLIGHT' as 'FLIGHT', details: this.flightFormGroup.value },
      { id: 4, type: 'TAXI' as 'TAXI', details: this.taxiFormGroup.value },
    ];
  }

  private handleSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
    this.stepper.reset();
  }

  private handleError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  disableAllInputs() {
    this.createTripFormGroup.disable();
    this.carRentalFormGroup.disable();
    this.hotelFormGroup.disable();
    this.flightFormGroup.disable();
    this.taxiFormGroup.disable();
  }

  approveTrip(): void {
    this.openConfirmationDialog('Are you sure you want to <strong>Approve</strong> this trip?').subscribe((result) => {
      if (result) {
        this.updateTripStatus('APPROVED');
      }
    });
  }

  cancelTrip(): void {
    this.openConfirmationDialog('Are you sure you want to <strong>Cancel</strong> this trip?').subscribe((result) => {
      if (result) {
        this.updateTripStatus('CANCELLED');
      }
    });
  }

  private updateTripStatus(status: any) {
    const updatedTrip: ITrip = { ...this.trip, status, approverId: this.userLoggedIn };
    this.tripService.updateTripData(updatedTrip).subscribe({
      next: () => {
        this.snackBar.open('Trip status changed successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
      },
      error: (err) => {
        console.error(`Error updating trip status: ${err}`);
      },
    });
  }

  openConfirmationDialog(confirmationMessage: string) {
    this.dialogRef = this.dialog.open(this.confirmDialogTemplate, {
      width: '300px',
      data: { message: confirmationMessage },
    });
    return this.dialogRef.afterClosed();
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

  closeDialog(result: boolean): void {
    if (this.dialogRef) {
      this.dialogRef.close(result);
    }
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
        this.trip = { ...this.trip, ...response };
      },
      (error) => {
        console.error('Error saving note:', error);
      }
    );
  }
}
