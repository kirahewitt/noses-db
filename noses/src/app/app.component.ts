import { Component, OnInit } from '@angular/core';
import { MatToolbarModule, MatTableModule, MatTableDataSource } from '@angular/material';
import { FlaskBackendService } from './flask-backend.service';
import { AdminService } from "./admin.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'noses';
  isAdmin = false;
  loggedInUser: any;
  priv: any;

  constructor(private apiService: FlaskBackendService,
              private adminStatus: AdminService) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));
    this.adminStatus.currentStatus.subscribe(currentStatus  => {
      this.priv = currentStatus;
      // console.log(typeof this.priv);
      this.setPrivelege();
    });


  }

  setPrivelege() {
    if(this.priv == 3) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }


}

