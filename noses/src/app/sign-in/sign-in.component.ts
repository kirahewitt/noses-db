import { Component, OnInit } from '@angular/core';
import { AuthService } from "../_services/auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  
  constructor(public authService: AuthService) { }

  ngOnInit() { }

  public signOutClicked() {
    this.authService.SignOut();
  }


  public signInClicked(username, password) {
    this.authService.SignIn(username, password);
  }
}
