import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Bulb } from 'src/app/models/bulb.model';
import { BackendService } from 'src/app/services/backend.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserBulb } from 'src/app/models/userBulb.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { GlobeModel } from '../../models/globe.model';
import { SendmailService } from '../../services/sendmail.service';
import { error } from 'util';
import * as jsPDF from 'jspdf';

declare var xepOnline: any;

@Component({
    selector: 'app-donate',
    templateUrl: './donate.component.html',
    styleUrls: ['./donate.component.css'],
})
export class DonateComponent implements OnInit {
    @ViewChild('content', { static: false }) content: ElementRef;

    dedicationMessageForm: FormGroup;

    billingDetailsForm: FormGroup;

    currentStep = 1; // control steps views

    // track steps wizard
    completed1 = false;

    completed2 = false;

    completed3 = false;

    completed4 = false;

    completed5 = false;

    donationGlobes: GlobeModel[] = []; // donation globes;

    dedicationGlobe: any; // purchased globe;

    globeFor = ''; // name of purpose the globe is for

    buyerId: any;

    cartItems: any[];

    cartTotalAmountDue = 0;

    invoiceDetails: any = {};

    orderNumber = Date.now();

    stringTitle = 'DONATE A GLOBE';

    stringDescription =
        'Select and dedicate a timeless place for a loved one with a \npersonalised globe on our virtual Tree of Light. ';

    constructor(
        private af: AuthService,
        private sms: SendmailService,
        private router: Router,
        private afAuth: AngularFireAuth,
        private bs: BackendService,
        private toaster: ToastrService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.afAuth.authState.subscribe(user => {
            if (user != null) {
                this.buyerId = user.uid;
            } else {
                this.buyerId = null;
            }
        });

        this.bs.getDonationGlobes().subscribe(returnedGlobes => {
            this.donationGlobes = [];

            returnedGlobes.forEach(a => {
                const globe: any = a.payload.doc.data();

                globe.id = a.payload.doc.id;

                this.donationGlobes.push(globe);
            });
        });
    }

    private buildDedicationMessageForm() {
        this.dedicationMessageForm = this.fb.group({
            message: ['', Validators.required],
            tol: ['', Validators.required],
        });
    }

    // selecting globe STEP 1 going to STEP 2
    private selectedGlobe(globe: GlobeModel): void {
        // check if globeFor is not NULL

        if (this.globeFor === '') {
            this.toaster.error(
                'Please enter the name and surname for a person you are buying a globe for',
                ' Required Field Empty'
            );
        } else {
            if (this.buyerId == null) {
                this.router.navigate(['/login']);
            } else {
                this.stringTitle = 'PICK GLOBE COLOUR';

                this.stringDescription = 'Now that you have selected your globe, pick a colour';

                this.dedicationGlobe = globe;

                this.dedicationGlobe.forWho = this.globeFor
                    .toString()
                    .toUpperCase()
                    .trim();

                // update steps counter
                this.currentStep = 2;

                this.completed1 = true;
            }
        }
    }

    private setGlobeColor(event: any): void {
        // set globe color
        this.dedicationGlobe.color = event.color.hex;

        // set globe tree location
        this.dedicationGlobe.left = Math.floor(Math.random() * (650 - 95) + 95) + 'px';

        this.dedicationGlobe.top = Math.floor(Math.random() * (350 - 10) + 10) + 'px';

        // set tree url
        const bulbColor = event.color.hex;

        this.dedicationGlobe.treeUrl = '../../../assets/' + bulbColor.substring(1) + '.png';
    }

    private writeYourMessage(): void {
        if (this.dedicationGlobe.color === undefined) {
            this.toaster.error('Please select globe colour', 'Pick Globe Colour');
        } else {
            this.buildDedicationMessageForm();

            // update STEP counter
            this.currentStep = 3;

            this.completed2 = true;

            this.stringTitle = 'WRITE YOUR MESSAGE';

            this.stringDescription = 'Write a special message for the person you would like to celebrate.';
        }
    }

    private addDedicationMessage(formData: any): void {
        this.dedicationGlobe.message = formData.message;

        this.dedicationGlobe.tol = formData.tol;

        this.dedicationGlobe.reference = this.orderNumber;

        // add globe details to cart
        this.addGlobeToCart(this.dedicationGlobe);
    }

    private addGlobeToCart(dedicationGlobe: any) {
        this.dedicationGlobe.buyerId = this.buyerId; // set buyer id so we can track the cart

        this.bs
            .addGlobeToCart(dedicationGlobe)
            .then(() => {
                this.toaster.success('Globe added to cart', 'Tree of Light');

                // update step counter
                this.currentStep = 4;

                this.completed3 = true;

                this.showCartItems();
            })
            .catch(err => {
                this.toaster.error(err, 'Unexpected Error');
            });
    }

    // remove item from cart
    private removeCartItem(itemId: string): void {
        this.bs
            .deleteCartItem(itemId)
            .then(() => {
                this.toaster.success('Globe removed from cart', 'TOL');

                this.showCartItems();
            })
            .catch(err => {
                this.toaster.error(err, 'An Error Occurred!!!');
            });
    }

    // show cart items
    private showCartItems(): void {
        this.stringTitle = 'CART';

        this.stringDescription = '';

        this.cartItems = [];

        this.bs.getCartItems(this.buyerId).subscribe(items => {
            this.cartTotalAmountDue = 0;

            items.forEach(a => {
                const item: any = a.payload.doc.data();

                item.id = a.payload.doc.id;

                this.cartTotalAmountDue = this.cartTotalAmountDue + item.cost;

                this.cartItems.push(item);
            });
        });
    }

    logout() {
        this.afAuth.auth.signOut().then(r => this.router.navigate(['/']));
    }

    // check out
    private doCheckOut(): void {
        this.stringTitle = 'YOUR DETAILS';

        this.stringDescription = '';

        this.billingDetailsForm = this.fb.group({
            names: ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.email]],
            address: ['', Validators.required],
            city: ['', Validators.required],
            contactNumber: ['', Validators.required],
            province: ['', Validators.required],
            code: ['', Validators.required],
            gridCheck: [false, Validators.requiredTrue],
        });

        this.currentStep = 5;

        this.completed4 = true;
    }

    // buy another globe
    private buyAnotherGlobe() {
        this.currentStep = 1;

        this.dedicationGlobe = {};

        this.globeFor = '';

        this.completed2 = false;

        this.completed3 = false;

        this.completed4 = false;
    }

    // save billing details
    private updateBillingDetails(formData: any): void {
        // // update customers node where user ID is ID
        this.bs
            .updateBillingDetails(formData, this.buyerId)
            .then(() => {
                this.createOrder(formData);
            })
            .catch(err => {
                console.log(err);

                this.toaster.error(err, 'Error Occurred');
            });
    }

    // create order

    private createOrder(formData: any) {
        const order: any = {};
        // generate order number, order date, order description and total order amount

        // generate order date
        const today = new Date();
        const dd = String(today.getDate());
        const mm = String(today.getMonth() + 1);
        const yyyy = today.getFullYear();

        order.orderDate = dd + '.' + mm + '.' + yyyy;

        order.description = 'Dedication Globes';

        order.total = this.cartTotalAmountDue;

        order.customer = formData.names;

        order.uid = this.af.currentUser.uid;

        order.address =
            formData.address + ', ' + ', ' + formData.city + ', ' + formData.province + ', ' + formData.code;

        order.email = formData.emailAddress;

        order.number = formData.contactNumber;

        order.status = 'Pending';

        order.type = 'Online';

        this.invoiceDetails = order;

        // order.paymentType = 'EFT/DIRECT Deposit';

        order.reference = this.orderNumber + '';

        this.bs
            .createNewOrder(order)
            .then(() => {
                this.stringTitle = 'PAYMENT';

                this.stringDescription = '';

                // order created successfully
                this.toaster.success('Order placed successfully', 'Order Placed');

                this.currentStep = 6;

                this.bs.currentOrderId = order.reference;

                // save current order number to database
                this.bs
                    .setCurrentOrderIdForUser(this.af.currentUser.uid, order.reference)
                    .then()
                    .catch(err => {
                        console.log(err);
                    });

                this.completed5 = true;
            })
            .catch(err => {
                this.toaster.error(err, 'Could Not Create Order');
            });
    }

    private createInvoice(): void {
        // UPDATE ORDER
        this.bs.updateCustomerOrderStatus(this.orderNumber + '', 'Waiting for Payment').then(() => {
            // // send email
            // this.sms.sendInvoice(this.invoiceDetails).subscribe((data) => {
            //
            //   console.log(data);

            // redirect to thank you page for them to check email with invoice
            this.currentStep = 7;

            // this.router.navigate(['/invoice'], {state: {data : this.invoiceDetails}});
        }),
            error(err => {
                console.log(err);
            });
    }

    downloadInvoice() {
        // this.router.navigateByUrl('/home');

        console.log('testing');

        this.toaster.success(
            'Order submitted successfully. Please make invoice payment and email to us',
            'Order Completed'
        );
        let i;
        for (i = 0; i < this.cartItems.length; i++) {
            console.log(this.cartItems[i]);
            this.bs.deleteCartItem(this.cartItems[i].id);
        }

        // const doc = new jsPDF();

        // const specialElementHandlers = {
        //     '#editor': function(element, renderer) {
        //         return true;
        //     },
        // };

        // const content = this.content.nativeElement;

        // doc.fromHTML(content.innerHTML, 15, 15, {
        //     width: 190,
        //     elementHandlers: specialElementHandlers,
        // });

        // doc.save('test.pdf');

        this.toaster.success(
            'Order submitted successfully. Please make invoice payment and email to us',
            'Order Completed'
        );

        this.router.navigateByUrl('/home');

        return xepOnline.Formatter.Format('content', { render: 'download' });
    }
}
