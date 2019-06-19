import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Paginate } from '../../../_model/paginate';
import { LazyLoadEvent } from 'primeng/api';
import { RoleService } from '../../service/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../shared/service/loader.service';
import { Loader } from '../../../_model/loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-role-table',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss']
})
export class RoleTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @ViewChildren('dt')
  table;
  roles: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  cols: any[];
  loading = true;

  constructor(
    private roleService: RoleService,
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

  loadRolesLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.roleService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(roles => {
        this.totalRecords = roles.total;
        this.from = roles.from;
        this.to = roles.to;
        this.roles = roles.data;
      });
  }

  editRole(id: number) {
    this.router.navigate(['/auth/roles/', id, 'edit'], {
      relativeTo: this.route
    });
  }
}
