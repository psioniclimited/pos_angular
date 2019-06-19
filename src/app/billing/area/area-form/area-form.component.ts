import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AreaService } from '../../service/area.service';
import { Area } from '../../../_model/area';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.scss']
})
export class AreaFormComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  areaForm: FormGroup;
  editArea: Area;
  id: any;

  displayDialog = false;
  @Output()
  closeDisplayDialog = new EventEmitter<boolean>();
  @Output()
  reloadAreaTable = new EventEmitter<boolean>();

  @Input()
  set editAreaId(id: any) {
    this.id = id;
    if (this.id) {
      this.areaService
        .show(this.id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          data => {
            this.editArea = data;
            this.editFormInit();
          },
          error => {
            console.log(error);
          }
        );
    }
    this.formInit();
  }

  constructor(
    private areaService: AreaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.editArea = new Area();
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params['id'];
    //
    // });
    if (this.id) {
      this.areaService
        .show(this.id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          data => {
            this.editArea = data;
          },
          error => {
            console.log(error);
          }
        );
    }
    this.formInit();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  editFormInit() {
    this.areaForm.get('name').setValue(this.editArea.name);
    this.areaForm.get('description').setValue(this.editArea.description);
  }

  private formInit() {
    this.areaForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      description: new FormControl(null, [Validators.required])
    });
  }
  // change the id at the later address
  onSubmit() {
    const area = new Area(
      this.areaForm.value['name'],
      this.areaForm.value['description']
    );

    if (this.areaForm.valid) {
      if (this.id) {
        // call the update function
        this.areaService
          .update(this.id, area)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            response => {
              console.log(response);
              this.displayDialogFalse();
              this.markFieldsAsNotTouched();
              this.reloadAreaTable.emit(this.displayDialog);
              // this.router.navigate(['../area']);
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.areaService
          .store(area)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(response => {
            console.log(response);
            this.displayDialogFalse();
            this.markFieldsAsNotTouched();
            this.reloadAreaTable.emit(this.displayDialog);
            // this.router.navigate(['../area/' + response.id + '/edit']);
          });
      }

      // this.displayDialogFalse();
    } else {
      Object.keys(this.areaForm.controls).forEach(field => {
        const control = this.areaForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  markFieldsAsNotTouched() {
    Object.keys(this.areaForm.controls).forEach(field => {
      const control = this.areaForm.get(field);
      control.markAsUntouched({ onlySelf: true });
    });
  }

  displayDialogFalse() {
    this.editArea = new Area();
    this.id = null;
    this.areaForm.get('name').setValue(this.editArea.name);
    this.areaForm.get('description').setValue(this.editArea.description);
    this.closeDisplayDialog.emit(this.displayDialog);
  }
}
