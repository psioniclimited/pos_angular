import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../service/dashboard.service';
import * as moment from 'moment';
import { _ } from 'underscore';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Paginate } from '../../_model/paginate';
import { Loader } from '../../_model/loader';
import { LoaderService } from '../../shared/service/loader.service';
import { ReportService } from '../../shared/service/report.service';
import { ReportTypes } from '../../_model/report-types';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dailyBill: any;
  targetBill: any;
  areaBill: any;
  connectionData: any;
  collectorPerformance: any;
  dish_customers: any;
  internet_customers: any;
  customer_limit: any;
  this_month_collection = 0;
  customer_due = 0;
  total_expense = 0;
  connectedItems: MenuItem[];
  connectedActiveItem: MenuItem;
  connectedLazyEvent: LazyLoadEvent;
  connectedCols: any[];
  connectedLoading = true;
  customers: Paginate[]; // customers
  connectedTotalRecords: number;
  connectedFrom: number;
  connectedTo: number;
  connectedCustomers: any;
  disconnectedCustomers: any;
  rankingItems: MenuItem[];
  rankingActiveItem: MenuItem;
  rankingLazyEvent: LazyLoadEvent;
  rankingCols: any[];
  rankingLoading = true;
  collectors: Paginate[]; // Collectors
  rankingTotalRecords: number;
  rankingFrom: number;
  rankingTo: number;
  thisMonthRanking: any;
  lastMonthRanking: any;
  currentMonthHeader: any;
  reportTypes: ReportTypes;
  reportItems: MenuItem[];
  // Report Dates
  thisMonthDate: Date[] = [];
  lastMonthDate: Date[] = [];
  todayDate: Date[] = [];
  yesterdayDate: Date[] = [];
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private loaderService: LoaderService,
    private reportService: ReportService
  ) {
    this.reportTypes = new ReportTypes();
  }

  ngOnInit() {
    this.thisMonthDate.push(
      moment()
        .date(1)
        .toDate()
    );
    this.thisMonthDate.push(
      moment()
        .date(1)
        .endOf('month')
        .toDate()
    );
    this.lastMonthDate.push(
      moment()
        .subtract(1, 'month')
        .date(1)
        .toDate()
    );
    this.lastMonthDate.push(
      moment()
        .subtract(1, 'month')
        .date(1)
        .endOf('month')
        .toDate()
    );

    this.todayDate.push(moment().toDate());

    this.yesterdayDate.push(
      moment()
        .subtract(1, 'days')
        .toDate()
    );

    this.reportItems = [
      {
        label: 'Today\'s Report',
        icon: 'pi pi-refresh',
        command: () => {
          this.generateReport(this.reportTypes.pdf, 'daily_report', this.todayDate);
        }
      },
      {
        label: 'Yesterday\'s Report',
        icon: 'pi pi-refresh',
        command: () => {
          this.generateReport(this.reportTypes.pdf, 'daily_report', this.yesterdayDate);
        }
      },
      {
        label: 'Last Month\'s Report',
        icon: 'pi pi-refresh',
        command: () => {
          this.generateReport(this.reportTypes.pdf, 'monthly_report', this.lastMonthDate);
        }
      }
    ];

    this.currentMonthHeader = moment().format('MMMM, YYYY');

    this.connectedCols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'phone', header: 'Phone' },
      { field: 'area', header: 'Area' },
      { field: 'address', header: 'Address' },
      { field: 'subscription_type', header: 'Subscription' }
    ];

    this.connectedItems = [
      {
        label: 'Connections',
        icon: 'pi pi-chart-bar',
        style: 'background-color: green',
        command: () => {
          this.thisMonthConnected();
        }
      },
      {
        label: 'Disconnections',
        icon: 'pi pi-chart-bar',
        command: () => {
          this.thisMonthDisconnected();
        }
      }
    ];

    this.connectedActiveItem = this.connectedItems[0];

    this.rankingCols = [
      { field: 'collector', header: 'Collector' },
      { field: 'collected', header: 'Collected' }
    ];

    this.rankingItems = [
      {
        label: 'This Month',
        icon: 'pi pi-chart-bar',
        command: () => {
          this.currentMonthRanking();
        }
      },
      {
        label: 'Last Month',
        icon: 'pi pi-chart-bar',
        command: () => {
          this.previousMonthRanking();
        }
      }
    ];

    this.rankingActiveItem = this.rankingItems[0];

    this.dashboardService
      .index(null)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        // @ts-ignore
        this.dish_customers = data.dishCustomers;
        // @ts-ignore
        this.internet_customers = data.internetCustomers;
        // @ts-ignore
        this.customer_limit = data.customerLimit;
        // @ts-ignore
        this.this_month_collection = data.thisMonthCollection;
        // @ts-ignore
        this.customer_due = data.customerDue[0].total;
        // @ts-ignore
        this.total_expense = data.totalExpense;

        // daily bill structure
        this.dailyBill = {
          labels: [],
          datasets: [
            {
              label: 'Daily Bill Collection',
              backgroundColor: '#2ecc71',
              data: []
            }
          ]
        };

        // daily bill data
        let today = moment();
        let before = moment().subtract(30, 'days');
        while (today.isAfter(before)) {
          before.add(1, 'days');
          // @ts-ignore
          const index = _.find(data.dailyBillCollections, function(data) {
            return data.created_at === before.format('YYYY-MM-DD');
          });
          // index ? dataSet.push(index.total) : dataSet.push(0);
          index
            ? this.dailyBill.datasets[0].data.push(index.total)
            : this.dailyBill.datasets[0].data.push(0);

          this.dailyBill.labels.push(before.format('DD MMM'));
        }

        // area bill structure
        this.areaBill = {
          labels: [],
          datasets: [
            {
              label: 'Area Collection',
              backgroundColor: [],
              borderColor: '#f5f6fb',
              data: []
            }
          ]
        };

        // area bill data
        const colors = [
          '#1abc9c',
          '#2ecc71',
          '#3498db',
          '#9b59b6',
          '#16a085',
          '#27ae60',
          '#2980b9',
          '#8e44ad',
          '#f1c40f',
          '#e67e22',
          '#e74c3c',
          '#f39c12',
          '#d35400',
          '#c0392b'
        ];

        let colorCount = 0;
        // @ts-ignore
        for (let i = 0; i < data.areaLabels.length; i++) {
          // @ts-ignore
          this.areaBill.labels.push(data.areaLabels[i].name);
          // @ts-ignore
          const index = _.find(data.areaCollection, function(collections) {
            // @ts-ignore
            return Number(collections.area_id) === data.areaLabels[i].id;
          });
          index
            ? this.areaBill.datasets[0].data.push(index.total)
            : this.areaBill.datasets[0].data.push(0);

          this.areaBill.datasets[0].backgroundColor.push(colors[colorCount]);
          colorCount++;

          if (colorCount >= colors.length) {
            colorCount = 0;
          }
        }

        // target bill structure
        this.targetBill = {
          labels: [],
          datasets: [
            {
              label: 'Collection',
              backgroundColor: '#2ecc71',
              borderColor: '#eaf9f4',
              data: []
            }
          ]
        };

        // target bill data
        const this_month = moment().add(1, 'month');
        const two_months_back = moment().subtract(2, 'months');

        while (this_month.isAfter(two_months_back)) {
          this.targetBill.labels.push(two_months_back.format('MMMM'));
          two_months_back.add(1, 'months');
        }
        // @ts-ignore
        this.targetBill.datasets[0].data.push(data.secondLastMonthCollection);
        // @ts-ignore
        this.targetBill.datasets[0].data.push(data.lastMonthCollection);
        // @ts-ignore
        this.targetBill.datasets[0].data.push(data.thisMonthCollection);

        // // connectionData
        // this.connectionData = {
        //   labels: [],
        //   datasets: [
        //     {
        //       label: 'Connection Data',
        //       backgroundColor: '#2ecc71',
        //       borderColor: '#eaf9f4',
        //       data: []
        //     }
        //   ]
        // };
        //
        // // connection data
        // const endOfMonth = moment().endOf('month');
        // const startOfMonth = moment().startOf('month');
        // console.log(data.connectionData.original.data);
        // while (endOfMonth.isAfter(startOfMonth)) {
        //   // @ts-ignore
        //   const index = _.find(data.connectionData.original.data, function(data) {
        //     console.log((new Date(data.created_at).toLocaleDateString() === startOfMonth.format('D/M/YYYY')));
        //     return (new Date(data.created_at).toLocaleDateString())  === startOfMonth.format('D/M/YYYY');
        //   });
        //   // index ? dataSet.push(index.total) : dataSet.push(0);
        //   index
        //     ? this.connectionData.datasets[0].data.push(index)
        //     : this.connectionData.datasets[0].data.push(0);
        //
        //   this.connectionData.labels.push(startOfMonth.format('DD MMM'));
        //   startOfMonth.add(1, 'days');
        // }

        // collector performance structure
        this.collectorPerformance = {
          labels: [],
          datasets: [
            {
              label: [],
              backgroundColor: '#2ecc71',
              fill: false,
              data: []
            }
          ]
        };


        // daily bill data
        today = moment();
        before = moment().subtract(30, 'days');
        while (today.isAfter(before)) {
          before.add(1, 'days');
          // @ts-ignore
          const index = _.find(data.collectorPerformance, function(data) {
            return new Date(data.created_at).toLocaleDateString() === before.format('M/D/YYYY');
          });
          // index ? dataSet.push(index.total) : dataSet.push(0);
          index
            ? this.collectorPerformance.datasets[0].data.push(index.total)
            : this.collectorPerformance.datasets[0].data.push(0);

          this.collectorPerformance.labels.push(before.format('DD MMM'));
        }
      });
  }

  loadConnectedLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.connectedLoading = state.show;
      });
    this.connectedLazyEvent = event;
    this.dashboardService
      .connected_index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        // collector ranking

        // @ts-ignore
        this.connectedCustomers = data.connectedCustomers.original;
        // @ts-ignore
        this.disconnectedCustomers = data.disconnectedCustomers.original;

        if (this.connectedActiveItem === this.connectedItems[0]) {
          this.connectedTotalRecords = this.connectedCustomers.total;
          this.connectedFrom = this.connectedCustomers.from;
          this.connectedTo = this.connectedCustomers.to;
          this.customers = this.connectedCustomers.data;
        }

        if (this.connectedActiveItem === this.connectedItems[1]) {
          this.connectedTotalRecords = this.disconnectedCustomers.total;
          this.connectedFrom = this.disconnectedCustomers.from;
          this.connectedTo = this.disconnectedCustomers.to;
          this.customers = this.disconnectedCustomers.data;
        }
      });
  }

  thisMonthConnected() {
    this.connectedActiveItem = this.connectedItems[0];
    this.connectedTotalRecords = this.connectedCustomers.total;
    this.connectedFrom = this.connectedCustomers.from;
    this.connectedTo = this.connectedCustomers.to;
    this.customers = this.connectedCustomers.data;
  }

  thisMonthDisconnected() {
    this.connectedActiveItem = this.connectedItems[1];
    this.connectedTotalRecords = this.disconnectedCustomers.total;
    this.connectedFrom = this.disconnectedCustomers.from;
    this.connectedTo = this.disconnectedCustomers.to;
    this.customers = this.disconnectedCustomers.data;
  }

  loadRankingLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.rankingLoading = state.show;
      });
    this.rankingLazyEvent = event;
    this.dashboardService
      .collector_index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        // collector ranking

        // @ts-ignore
        this.thisMonthRanking = data.thisMonthRanking.original;
        // @ts-ignore
        this.lastMonthRanking = data.lastMonthRanking.original;

        if (this.rankingActiveItem === this.rankingItems[0]) {
          this.rankingTotalRecords = this.thisMonthRanking.total;
          this.rankingFrom = this.thisMonthRanking.from;
          this.rankingTo = this.thisMonthRanking.to;
          this.collectors = this.thisMonthRanking.data;
        }

        if (this.rankingActiveItem === this.rankingItems[1]) {
          this.rankingTotalRecords = this.lastMonthRanking.total;
          this.rankingFrom = this.lastMonthRanking.from;
          this.rankingTo = this.lastMonthRanking.to;
          this.collectors = this.lastMonthRanking.data;
        }
      });
  }

  currentMonthRanking() {
    this.rankingActiveItem = this.rankingItems[0];
    this.rankingTotalRecords = this.thisMonthRanking.total;
    this.rankingFrom = this.thisMonthRanking.from;
    this.rankingTo = this.thisMonthRanking.to;
    this.collectors = this.thisMonthRanking.data;
  }

  previousMonthRanking() {
    this.rankingActiveItem = this.rankingItems[1];
    this.rankingTotalRecords = this.lastMonthRanking.total;
    this.rankingFrom = this.lastMonthRanking.from;
    this.rankingTo = this.lastMonthRanking.to;
    this.collectors = this.lastMonthRanking.data;
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  generateReport(reportType, reportName, date) {
    const event = {
      filters: {
        date_range: date
      }
    };
    this.reportService
      .download(reportType, reportName, event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename =
            reportName + moment().format('DD_MM_YYYY_HH_mm_s') + '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], { type: 'text/xlsx' });
          filename =
            reportName + moment().format('DD_MM_YYYY_HH_mm_s') + '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename =
            reportName + moment().format('DD_MM_YYYY_HH_mm_s') + '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
