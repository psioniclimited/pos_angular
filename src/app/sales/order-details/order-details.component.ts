import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { takeUntil } from 'rxjs/operators';
import { Loader } from '../../_model/loader';
import { LoaderService } from '../../shared/service/loader.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrderService } from '../service/order.service';
import { _ } from 'underscore';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  showClient: any;
  id: number;

  orderDetails: any[];
  subTotal = 0;
  discount = 0;
  calculatedTotal = 0;
  cols: any[];
  loading = true;

  constructor(
    private orderService: OrderService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.cols = [
      // { field: 'paid_with', subfield: 'name', header: 'Paid With' },
      { field: 'option', subfield: 'type', header: 'Option Type' },
      { field: 'product', subfield: 'name', header: 'Product Name' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'addons', header: 'Addons' },
      { field: 'addons_price', header: 'Addons Total Price' },
      { field: 'total', header: 'Product Total' }
    ];

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      if (this.id) {
        this.orderService
          .show(this.id)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              this.showClient = data.client;
              this.orderDetails = data.order_details;
              this.calculateTotal();

              // this.editFormInit();
            },
            error => {
              console.log(error);
            }
          );
      }
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  calculateTotal() {
    this.discount = this.showClient.discount;
    for (let i = 0; i < this.orderDetails.length; i++) {
      this.subTotal += Number(this.orderDetails[i].total);
      if (this.orderDetails[i].addons.length > 0) {
        for (let j = 0; j < this.orderDetails[i].addons.length; j++) {
          this.subTotal += Number(this.orderDetails[i].addons[j].price) * Number(this.orderDetails[i].quantity);
        }
      }
    }
    const discountValue = (this.showClient.discount / 100) * this.subTotal;
    this.calculatedTotal = this.subTotal - discountValue;
  }

  calculateAddonTotal(addons) {
    let sum = 0;
    for (let i = 0; i < addons.length; i++) {
      sum += parseFloat(addons[i].price);
    }
    return sum;
  }

  loadOrderDetailsLazy($event) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
  }
}
