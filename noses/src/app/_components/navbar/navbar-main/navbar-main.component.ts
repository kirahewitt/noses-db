import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';



@Component({
  selector: 'app-navbar-main',
  templateUrl: './navbar-main.component.html',
  styleUrls: ['./navbar-main.component.scss']
})
export class NavbarMainComponent implements OnInit {

  constructor(private authService : AuthService) { }

  ngOnInit() {
  }


  logoutClicked() {
    this.authService.SignOut();
  }
}
