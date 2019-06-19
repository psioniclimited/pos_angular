import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Paginate } from '../../../_model/paginate';
import { LazyLoadEvent } from 'primeng/api';
import { AreaService } from '../../service/area.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../shared/service/loader.service';
import { Loader } from '../../../_model/loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-area-table',
  templateUrl: './area-table.component.html',
  styleUrls: ['./area-table.component.scss']
})
export class AreaTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  areas: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  cols: any[];
  loading = true;
  @Output()
  editAreaEvent = new EventEmitter<any>();
  oldAreaEvent: LazyLoadEvent;
  areaID: any;
  deleteDisplay = false;

  constructor(
    private areaService: AreaService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' }
    ];
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadAreaLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.oldAreaEvent = event;
    this.areaService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        this.areas = data.data;
      });
  }

  @Input()
  set reloadArea(event) {
    console.log(event);
    if (this.oldAreaEvent) {
      this.loadAreaLazy(this.oldAreaEvent);
    }
  }

  editArea(id: number) {
    this.router.navigate(['/area/', id, 'edit'], {
      relativeTo: this.route
    });
  }

  showDeleteDialog(customerID) {
    this.areaID = customerID;
    this.deleteDisplay = true;
  }

  onDeleteSubmit() {
    this.areaService
      .delete(this.areaID)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        console.log(response);
        this.loadAreaLazy(this.oldAreaEvent);
      });
    this.deleteDisplay = false;
  }

  closeDeleteDialog() {
    this.deleteDisplay = false;
  }

  scrollToTop(event) {
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }
}
