import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {BackendService} from '../../services/backend.service';
import {AuthService} from '../../services/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cancelled',
  templateUrl: './cancelled.component.html',
  styleUrls: ['./cancelled.component.css']
})
export class CancelledComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private bs: BackendService, private af: AuthService,
              private spinner: NgxSpinnerService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {

    this.afAuth.authState.subscribe(user => {


      // get current order number
      this.bs.getCurrentOrderNumber(user.uid).subscribe(data => {

        const e: any = data;

        const id = e.orderId;

        // UPDATE ORDER
        this.bs.updateCustomerOrderStatus(id, 'Cancelled').then(r => console.log('succeess id is ' + id));

      });

    });
  }

}
