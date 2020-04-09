import { Component, OnInit } from '@angular/core';
import { MatToolbarModule, MatTableModule, MatTableDataSource } from '@angular/material';
import { FlaskBackendService } from './_services/flask-backend.service';
import { AdminService } from "./_services/admin.service";
import { AuthService } from './_services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  /**
   * 
   * @param apiService 
   * @param adminStatus 
   * @param authService 
   */
  constructor(private authService : AuthService) { }


  /**
   * 
   */
  ngOnInit() {
  }



}

