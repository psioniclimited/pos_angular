import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Paginate } from '../../../_model/paginate';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { FeeTypeService } from '../../service/fee-type.service';
import { Subject, Subscription } from 'rxjs';
import { LoaderService } from '../../../shared/service/loader.service';
import { Loader } from '../../../_model/loader';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-fee-types-table',
  templateUrl: './fee-types-table.component.html',
  styleUrls: ['./fee-types-table.component.scss']
})
export class FeeTypesTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @ViewChildren('dt')
  table;
  feeTypes: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  cols: any[];
  loading = true;
  oldFeeTypeEvent: LazyLoadEvent;
  feeTypeID: any;
  deleteDisplay = false;

  private subscription: Subscription;

  constructor(
    private feeService: FeeTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'amount', header: 'Amount' },
      { field: 'description', header: 'Description' }
    ];
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadFeeTypesLazy(event: LazyLoadEvent) {
    this.subscription = this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.oldFeeTypeEvent = event;
    this.feeService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        this.feeTypes = data.data;
      });
  }

  editFeeType(id: number) {
    this.router.navigate(['/fee-types/', id, 'edit'], {
      relativeTo: this.route
    });
  }

  showDeleteDialog(customerID) {
    this.feeTypeID = customerID;
    this.deleteDisplay = true;
  }

  onDeleteSubmit() {
    this.feeService
      .delete(this.feeTypeID)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        this.loadFeeTypesLazy(this.oldFeeTypeEvent);
      });
    this.deleteDisplay = false;
  }

  closeDeleteDialog() {
    this.deleteDisplay = false;
  }
}
