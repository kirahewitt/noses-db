import { Component, OnInit } from '@angular/core';
import { MatToolbarModule, MatTableModule, MatTableDataSource } from '@angular/material';
import { FlaskBackendService } from './_services/flask-backend.service';
import { AdminService } from "./_services/admin.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'noses';
  isSuperAdmin = false;
  isAdmin = false;
  loggedInUser: any;
  priv: any;

  /**
   * 
   * @param apiService 
   * @param adminStatus 
   * @param modalService 
   */
  constructor(private apiService: FlaskBackendService,
              private adminStatus: AdminService
              ) { }


  /**
   * 
   */
  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));
    this.adminStatus.currentStatus.subscribe(currentStatus  => {
      this.priv = currentStatus;
      // console.log(typeof this.priv);
      this.setPrivelege();
    });
  }


  /**
   * 
   */
  setPrivelege() {
    if(this.priv == 3) {
      this.isSuperAdmin = true;
      this.isAdmin = true;
    } else if(this.priv == 2) {
      this.isSuperAdmin = false;
      this.isAdmin = true;
    } else  {
      this.isSuperAdmin = false;
      this.isAdmin = false;
    }
  }

}

