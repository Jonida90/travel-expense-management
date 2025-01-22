import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TripComponent } from './components/trip/trip.component';
import { ApproverTripListComponent } from './components/approver/approver-trip-list.component';
import { FinanceTripListComponent } from './components/finance/finance-trip-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: TripComponent },
  { path: 'approver', component: ApproverTripListComponent },
  { path: 'finance', component: FinanceTripListComponent },
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     { path: 'user', component: EndUserDashboardComponent },
  //     { path: 'approver', component: ApproverDashboardComponent },
  //     { path: 'finance', component: FinanceDashboardComponent },
  //   ],
  // },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
