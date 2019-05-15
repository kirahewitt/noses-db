import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { FlaskBackendService } from '../flask-backend.service';
import { Policy } from  '../policy';
import { Users } from  '../users';
import { MatTableModule, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  policies:  Policy[];
  users: Users[];
  dataSource: Users[]

  constructor(private apiService: FlaskBackendService) { }

  ngOnInit() {
    this.apiService.readUsers().subscribe((users: Users[])=>{
      this.users = users;
      this.dataSource = users;
      console.log(this.dataSource);
      console.log(this.users);
    })
  }

}
