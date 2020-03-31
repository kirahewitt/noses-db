import { Component, OnInit } from '@angular/core';
import { FlaskBackendService } from 'src/app/_services/flask-backend.service';
import { sqlUser_full, User_Observer_Obj } from 'src/app/_supporting_classes/sqlUser';
import { AuthService } from 'src/app/_services/auth.service';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';


// export interface sqlUser_full {
//   UserID: number;
//   Username: string;
//   Password: string;
//   Initials: string;
//   isAdmin: string;
//   Affiliation: string;
//   Email: string;
//   ObsID: number;
//   HashedPassword: string;
// }

@Component({
  selector: 'app-user-pofile-main',
  templateUrl: './user-pofile-main.component.html',
  styleUrls: ['./user-pofile-main.component.scss']
})
export class UserPofileMainComponent implements OnInit {
  
  public loggedInUser: User_Observer_Obj;
  public currentUserIsValid: boolean;

  constructor(public apiService: FlaskBackendService, public authService: AuthService) { 
    this.loggedInUser = new User_Observer_Obj();
    this.currentUserIsValid = false;
  }

  ngOnInit() {
    let loggedInUser_datastream = this.authService.IH_getUserData_bs();
    loggedInUser_datastream.subscribe( (retval : User_Observer_Obj ) => {
      this.loggedInUser = retval;
    });

    let currentUserIsValid_datastream = this.authService.IH_getUserIsValid_bs();
    currentUserIsValid_datastream.subscribe( (retval : boolean) => {
      this.currentUserIsValid = retval;
    });
  }

}
