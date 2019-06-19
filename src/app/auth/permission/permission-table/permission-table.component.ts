import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Paginate } from '../../../_model/paginate';
import { LazyLoadEvent } from 'primeng/api';
import { PermissionService } from '../../service/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../shared/service/loader.service';
import { Loader } from '../../../_model/loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-permission-table',
  templateUrl: './permission-table.component.html',
  styleUrls: ['./permission-table.component.scss']
})
export class PermissionTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @ViewChildren('dt')
  table;
  permissions: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  cols: any[];
  loading = true;

  constructor(
    private permissionService: PermissionService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'display_name', header: 'Display Name' },
      { field: 'description', header: 'Description' }
    ];
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadPermissionsLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.permissionService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(permissions => {
        this.totalRecords = permissions.total;
        this.from = permissions.from;
        this.to = permissions.to;
        this.permissions = permissions.data;
      });
  }

  editPermission(id: number) {
    this.router.navigate(['/auth/permissions/', id, 'edit'], {
      relativeTo: this.route
    });
  }
}
