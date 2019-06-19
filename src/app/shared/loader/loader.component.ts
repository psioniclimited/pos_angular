import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../service/loader.service';
import { Loader } from '../../_model/loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  show = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService) { }
  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: Loader) => {
        this.show = state.show;
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
