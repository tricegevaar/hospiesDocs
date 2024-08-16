import { Component, OnInit } from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {AuthService} from '../../services/auth.service';
import * as firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems = [];

  cartTotal = 0;

  currentUser: firebase.User;

  constructor(private bs: BackendService, public afAuth: AngularFireAuth) { }

  ngOnInit() {

    this.afAuth.authState.subscribe(user => {
      this.currentUser = user;

      this.fetchCartItems(user.uid);

    });
  }

  fetchCartItems(id: any) {

    this.bs.getCartItems(id).subscribe((res) => {

      this.cartItems = res;

      let i;

      for (i = 0; i < this.cartItems.length; i++) {

        this.cartTotal = this.cartTotal + this.cartItems[i].cost;

      }

    });

  }

}
