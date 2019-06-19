import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../service/profile.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  user: any;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadProfileData();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadProfileData() {
    this.user = this.profileService
      .index();
      // .pipe(takeUntil(this.onDestroy$))
      // .subscribe(data => {
      //   this.user = data;
      // });
  }
}
