import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ChartOfAccountService } from '../service/chart-of-account.service';
import { JournalService } from '../service/journal.service';
import { ChartOfAccount } from '../../_model/chart-of-account';
import { Posting } from '../../_model/posting';
import { Journal } from '../../_model/journal';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-journal-entry-form',
  templateUrl: './journal-entry-form.component.html',
  styleUrls: ['./journal-entry-form.component.scss']
})
export class JournalEntryFormComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  journalForm: FormGroup;
  allAccounts: ChartOfAccount[];

  constructor(
    private chartOfAccountService: ChartOfAccountService,
    private journalService: JournalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.formInit();
    this.journalForm.get('transaction_date').setValue(moment().toDate());
    this.loadChartOfAccounts();
  }

  loadChartOfAccounts() {
    const filters = { parent_account_id: null };
    this.chartOfAccountService
      .index(filters)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(chartOfAccounts => {
        this.allAccounts = chartOfAccounts;
      });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  private formInit() {
    this.journalForm = new FormGroup({
      transaction_date: new FormControl(null, [Validators.required]),
      note: new FormControl(null, [Validators.required]),
      debitAccount: new FormControl(null, [Validators.required]),
      creditAccount: new FormControl(null, [Validators.required]),
      debit: new FormControl(null, [Validators.required]),
      credit: new FormControl(null, [Validators.required])
    });
  }

  calculateCredit(debitAmount) {
    this.journalForm.get('credit').setValue(debitAmount);
  }

  onSubmit() {
    if (this.journalForm.valid) {
      const transaction_date = new Date(
        this.journalForm.value['transaction_date']
      ).toDateString();

      const debitPosting = new Posting(
        transaction_date,
        this.journalForm.value['debit'],
        null,
        this.journalForm.value['debitAccount'].id
      );

      const creditPosting = new Posting(
        transaction_date,
        null,
        this.journalForm.value['credit'],
        this.journalForm.value['creditAccount'].id
      );

      const journal = new Journal(
        transaction_date,
        this.journalForm.value['note'],
        this.journalForm.value['note'],
        [debitPosting, creditPosting]
      );

      this.journalService
        .store(journal)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          response => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => this.router.navigate(['/journal-entry']));
          },
          error => {
            console.log(error);
          }
        );
    } else {
      Object.keys(this.journalForm.controls).forEach(field => {
        // {1}
        const control = this.journalForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }
}
