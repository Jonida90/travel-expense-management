import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(private _formBuilder: FormBuilder, private tripService: TripService, @Inject(MAT_DIALOG_DATA) @Optional() public trip: ITrip) {
    this.createTripFormGroup = this._formBuilder.group({
      tripName: this.trip?.name || '',
      tripDuration: this.trip?.duration || '',
      tripStartDate: this.trip?.startDate || '',
      tripEndDate: this.trip?.endDate || '',
    });

    this.carRentalFormGroup = this._formBuilder.group({
      carName: ['', Validators.required],
      pickUpDateTime: ['', Validators.required],
      dropOffDateTime: ['', Validators.required],
      pickUpLocation: ['', Validators.required],
      dropOffLocation: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.hotelFormGroup = this._formBuilder.group({
      hotelName: ['', Validators.required],
      hotelLocation: ['', Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.flightFormGroup = this._formBuilder.group({
      airline: ['', Validators.required],
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      departureDateTime: ['', Validators.required],
      arrivalDateTime: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.taxiFormGroup = this._formBuilder.group({
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      dateTime: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.initializeExpenses();
  }

  ngOnInit() {
   
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
          departureDateTime:flightExpense.details.departureDateTime,
          arrivalDateTime: flightExpense.details.arrivalDateTime,
          totalPrice: flightExpense.details.totalPrice,
        });
      }

      const taxiExpense = this.trip.expenses.find(expense => expense.type === 'TAXI');
      if (taxiExpense) {
        this.taxiFormGroup.patchValue({
          fromLocation: taxiExpense.details.from || '',
          toLocation: taxiExpense.details.to || '',
          dateTime: taxiExpense.details.timeDate || '',
          totalPrice: taxiExpense.details.totalPrice || ''
        });
      }
    }
  }

  submitTripData() {
    // if (this.formCreateTripGroup.valid &&
    //   this.formCarRentalGroup.valid &&
    //   this.formHotelGroup.valid &&
    //   this.formFlightGroup.valid &&
    //   this.formTaxiGroup.valid) {
  
      const newTrip: ITrip = {
        id: "",  // Let the server assign the ID
        name: this.createTripFormGroup.value.tripName,
        duration: this.createTripFormGroup.value.tripDuration,
        startDate: this.createTripFormGroup.value.tripStartDate,
        endDate: this.createTripFormGroup.value.tripEndDate,
        userId: 1, // Assuming current user is (ID: 1)
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
  
      //send the new trip to the server
      this.tripService.addTrip(newTrip).subscribe(
        (response) => {
          console.log('New trip added:', response);
         // this.resetForms();  // Reset forms after submission
        },
        (error) => {
          console.error('Error adding trip:', error);
        }
      );
    //}
  }
}
