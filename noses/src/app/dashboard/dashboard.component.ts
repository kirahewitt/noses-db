import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { FlaskBackendService } from '../flask-backend.service';
import { Observations } from  '../Observations';
import { MatTableModule, MatTableDataSource } from '@angular/material';
import { AuthService } from "../auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userData: any;
  observations: Observations[];
  dataSource: Observations[];
  displayedColumns: string[] = ['ObservationID', 'AgeClass', 'sex', 'date', 'email', 'Year', 'Comments' ];


  constructor(private apiService: FlaskBackendService,
              public authService: AuthService,
              public afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.apiService.readUsers().subscribe((observations: Observations[])=>{
      this.observations = observations;
      this.dataSource = observations;
    });
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user"));
        console.log(this.userData)
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });

}
}
