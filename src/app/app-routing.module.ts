import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TripComponent } from './components/trip/trip.component';
import { ApproverTripListComponent } from './components/approver/approver-trip-list.component';
import { FinanceTripListComponent } from './components/finance/finance-trip-list.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: TripComponent,  canActivate: [AuthGuard], data: { roles: ['END_USER']}},
  { path: 'approver', component: ApproverTripListComponent,  canActivate: [AuthGuard], data: { roles: ['APPROVER'] }},
  { path: 'finance', component: FinanceTripListComponent,  canActivate: [AuthGuard], data: { roles: ['FINANCE']  }},
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
