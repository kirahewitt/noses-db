import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { FlaskBackendService } from '../flask-backend.service';
import { Observations } from  '../Observations';
import { MatTableModule, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  observations: Observations[];
  dataSource: Observations[];
  displayedColumns: string[] = ['ObservationID', 'AgeClass', 'sex', 'date', 'email', 'Year', 'Comments' ];


  constructor(private apiService: FlaskBackendService) { }

  ngOnInit() {
    this.apiService.readUsers().subscribe((observations: Observations[])=>{
      this.observations = observations;
      this.dataSource = observations;
      while(this.dataSource == undefined)
      {
        console.log("undefined")
      }
    })
  }

}
