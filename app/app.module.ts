import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';
import { ColorCircleModule } from 'ngx-color/circle';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DedicationsComponent } from './shared/dedications/dedications.component';
import { ContactComponent } from './shared/contact/contact.component';
import { HomeComponent } from './shared/home/home.component';
import { environment } from 'src/environments/environment';
import { BackendService } from './services/backend.service';
import { ToastrModule } from 'ngx-toastr';
import { DonateComponent } from './shared/donate/donate.component';
import { LoginComponent } from './users/login/login.component';
import { AccountComponent } from './users/account/account.component';
import { AuthService } from './services/auth.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import { OrderComponent } from './shared/order/order.component';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './shared/cart/cart.component';
import { PaymentComponent } from './shared/payment/payment.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { CancelledComponent } from './shared/cancelled/cancelled.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { InvoiceComponent } from './shared/invoice/invoice.component';
import {SendmailService} from './services/sendmail.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DedicationsComponent,
    ContactComponent,
    HomeComponent,
    DonateComponent,
    LoginComponent,
    AccountComponent,
    OrderComponent,
    CartComponent,
    PaymentComponent,
    CancelledComponent,
    InvoiceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgxSpinnerModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({positionClass: 'toast-top-center', progressBar: true}),
    Ng2LoadingSpinnerModule.forRoot({}),
    ColorCircleModule,
    ShareButtonsModule,
    DragDropModule
  ],
  providers: [BackendService, AuthService, SendmailService],
  bootstrap: [AppComponent]
})
export class AppModule { }
