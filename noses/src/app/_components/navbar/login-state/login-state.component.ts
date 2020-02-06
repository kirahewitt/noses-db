import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { MatMenuModule} from '@angular/material/menu';
import { AdminService } from 'src/app/_services/admin.service';


/**
 * The purpose of this component is to indicate to the user their logged in state.
 * When a user is logged in, it will tell them the name of the user they are logged in as.
 * When a user is not logged in, it will provide a way to reach the login page. 
 * The user should know at all times whether they are logged in.
 */
@Component({
  selector: 'app-login-state',
  templateUrl: './login-state.component.html',
  styleUrls: ['./login-state.component.scss']
})
export class LoginStateComponent implements OnInit {

  isSuperAdmin = false;
  isAdmin = false;
  privilegeLevel: any;


  /**
   * 
   * @param authService 
   * @param adminStatus 
   */
  constructor(private authService : AuthService,
              private adminStatus: AdminService) { }


  /**
   * 
   */
  ngOnInit() {
    this.adminStatus.currentPermissionStatus.subscribe(currentStatus  => {
      this.privilegeLevel = currentStatus;
      this.setPrivelege();
    });
  }


  /**
   * 
   */
  logoutClicked() {
    this.authService.SignOut();
  }


  /**
   * 
   */
  setPrivelege() {
    if(this.privilegeLevel == 3) {
      this.isSuperAdmin = true;
      this.isAdmin = true;
    } else if(this.privilegeLevel == 2) {
      this.isSuperAdmin = false;
      this.isAdmin = true;
    } else  {
      this.isSuperAdmin = false;
      this.isAdmin = false;
    }
  }
}
