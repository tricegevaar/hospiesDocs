import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class BackendService {
    url = 'https://tree-of-light-mail-handler.vercel.app/send';

    currentOrderId = '';

    constructor(private afs: AngularFirestore, private http: HttpClient) {}

    // create order
    createNewOrder(orderDetails: any) {
        return this.afs
            .collection('orders')
            .doc(orderDetails.reference)
            .set(orderDetails);
    }

    setCurrentOrderIdForUser(userId: string, reference: string) {
        return this.afs
            .collection('currentOrders')
            .doc(userId)
            .set({ orderId: reference });
    }

    getCurrentOrderNumber(userId) {
        return this.afs
            .collection('currentOrders')
            .doc(userId)
            .valueChanges();
    }

    // update order status
    updateCustomerOrderStatus(orderNumber: string, message: string) {
        return this.afs
            .collection('orders')
            .doc(orderNumber)
            .update({ status: message });
    }

    // update buyer billing details
    updateBillingDetails(data: any, id: string) {
        return this.afs
            .collection('customers')
            .doc(id)
            .set(data);
    }

    // list donation globes
    getDonationGlobes() {
        return this.afs.collection('bulbs', ref => ref.orderBy('cost')).snapshotChanges();
    }

    // search globe
    findTreeGlobe(name: string) {
        return this.afs.collection('treeGlobes', ref => ref.where('forWho', '==', name)).snapshotChanges();
    }

    // add globe to tree
    addGlobeToTree(globe: any) {
        return this.afs.collection('treeGlobes').add(globe);
    }

    // tree globes
    showGlobesOnTree() {
        return this.afs.collection('treeGlobes').snapshotChanges();
    }

    // show globe by title
    showGlobesByTitle(title: string) {
        return this.afs.collection('treeGlobes', ref => ref.where('title', '==', title)).snapshotChanges();
    }

    // add globe to cart
    addGlobeToCart(globe: any) {
        return this.afs.collection('cartItems').add(globe);
    }

    // get cart items
    getCartItems(buyerId: any) {
        return this.afs.collection('cartItems', ref => ref.where('buyerId', '==', buyerId)).snapshotChanges();
    }

    // delete cart items
    deleteCartItem(cartItemId: any) {
        return this.afs
            .collection('cartItems')
            .doc(cartItemId)
            .delete();
    }

    // addCartItem(data: any) {
    //
    //   return this.afs.collection('carts')
    //     .doc(data.buyerId).collection('items').add(data);
    //
    // }
    //
    // getCartItems(id: string) {
    //
    //   return this.afs.collection('carts')
    //     .doc(id)
    //     .collection('items').valueChanges();
    //
    // }
    //
    // createBulb(data: any) {
    //
    //   return this.afs.collection('bulbs').add(data);
    // }
    //
    // addBulbToTree(data: any) {
    //
    //   return this.afs.collection('treeBulbs').add(data);
    // }
    //
    // updateBulb(data: any) {
    //
    //   return this.afs.collection('bulbs').doc(data.id).update(data);
    //
    // }
    //
    // deleteBulb(id: string) {
    //
    //   return this.afs.collection('bulbs').doc(id).delete();
    //
    // }
    //
    // getGlobes() {
    //
    //   return this.afs.collection('bulbs', ref => ref.orderBy('cost')).snapshotChanges();
    //
    // }
    //
    // getAllBoughtGlobes() {
    //
    //   return this.afs.collection('treeBulbs').snapshotChanges();
    //
    // }
    //
    // deleteCartItems(id: any) {
    //
    //   return this.afs.collection('carts').doc(id).delete();
    //
    // }
    //
    // createOrder(data: any) {
    //
    //   console.log(data);
    //
    //   return this.afs.collection('orders').doc(data.id).set(data);
    //
    // }
    //
    sendMessage(messageContent: any) {
        return this.http.post(this.url, JSON.stringify(messageContent), {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            responseType: 'text',
        });
    }
}
