import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { DonateComponent } from './shared/donate/donate.component';
import { DedicationsComponent } from './shared/dedications/dedications.component';
import { ContactComponent } from './shared/contact/contact.component';
import { LoginComponent } from './users/login/login.component';
import {OrderComponent} from './shared/order/order.component';
import {CartComponent} from './shared/cart/cart.component';
import {PaymentComponent} from './shared/payment/payment.component';
import {CancelledComponent} from './shared/cancelled/cancelled.component';
import {InvoiceComponent} from './shared/invoice/invoice.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dedications', component: DedicationsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'donate', component: DonateComponent },
  { path: 'login', component: LoginComponent },
  { path: 'order', component: OrderComponent },
  { path: 'cancel', component: CancelledComponent },
  { path: 'cart', component: CartComponent },
  { path: 'payment', component: PaymentComponent },
  {path: 'invoice', component: InvoiceComponent}

  // Password: SilverFork12
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
