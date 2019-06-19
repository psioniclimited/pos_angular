import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-layout',
  template: `
    <app-loader></app-loader>
    <app-header></app-header>
    <p-toast position="top-right"></p-toast>
    <router-outlet></router-outlet>
    <app-footer class="mt-auto"></app-footer>
  `,
  styles: []
})
export class HomeLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
