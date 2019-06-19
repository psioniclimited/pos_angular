import { Component, OnInit } from '@angular/core';
import { AuthenticatedUserService } from '../service/authenticated-user.service';
import { User } from '../../_model/user';

@Component({
  selector: 'app-authenticated-user',
  templateUrl: './authenticated-user.component.html',
  styleUrls: ['./authenticated-user.component.scss']
})
export class AuthenticatedUserComponent implements OnInit {
  private user: User;
  constructor(private authenticatedUser: AuthenticatedUserService) {}

  ngOnInit() {
    // this.authenticatedUser.getAuthenticatedUser().subscribe(user => {
    //   console.log(user);
    //   this.user = user.user;
    //   console.log(this.user.name);
    // });
  }
}
