import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent {

  formCreateTripGroup!: FormGroup;
  formCarRentalGroup!: FormGroup;
  formHotelGroup!: FormGroup;
  formFlightGroup!: FormGroup;
  formTaxiGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.formCreateTripGroup = this._formBuilder.group({
      tripName: ['', Validators.required],
      tripDuration: ['', Validators.required],
      tripStartDate: ['', Validators.required],
      tripEndDate: ['', Validators.required],
    });

    this.formCarRentalGroup = this._formBuilder.group({
      carName: ['', Validators.required],
      pickUpDateTime: ['', Validators.required],
      dropOffDateTime: ['', Validators.required],
      pickUpLocation: ['', Validators.required],
      dropOffLocation: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.formHotelGroup = this._formBuilder.group({
      hotelName: ['', Validators.required],
      hotelLocation: ['', Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.formFlightGroup = this._formBuilder.group({
      airline: ['', Validators.required],
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      departureDateTime: ['', Validators.required],
      arrivalDateTime: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.formTaxiGroup = this._formBuilder.group({
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      dateTime: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
    });
  }
}
