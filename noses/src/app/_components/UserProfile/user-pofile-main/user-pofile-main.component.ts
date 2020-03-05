import { Component, OnInit } from '@angular/core';
import { FlaskBackendService } from 'src/app/_services/flask-backend.service';
import { sqlUser_full } from 'src/app/_supporting_classes/sqlUser';
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

  public userData : sqlUser_full;

  constructor(public apiService: FlaskBackendService, public authService: AuthService) { 
    this.userData = {UserID: 0, Username: "", Password: "", Initials: "", isAdmin: 0, Affiliation: "", Email: "", ObsID: 0, HashedPassword: ""};
  }

  ngOnInit() {

    // get the userData object out of memory.
    // NEED TO REPLACE THIS AFTER IMPLEMENTING STORING THE USER OBJECT in "localStorage"!!
    let userEmail = this.authService.getUserData().email;

    let emailAsJson = '{"email": "' + userEmail + '"}';
    let userSource_obs = this.apiService.getUser_obs(emailAsJson);
    userSource_obs.subscribe(retval => {
      console.log("THIS SHOULD BE DOING SOMETHING");
      console.log("Result of getting user with password: ");
      console.log(JSON.stringify(retval));
      this.userData = retval[0];
    });


  }

}
