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

  public isSuperAdmin: boolean;
  public isAdmin: boolean;
  public privilegeLevel: any;
  public currentUserEmail : string;
  

  /**
   * 
   * @param authService 
   * @param adminStatus 
   */
  constructor(public authService : AuthService, public adminStatus: AdminService) { 
    this.privilegeLevel = -42;
    this.currentUserEmail = "";
    this.isSuperAdmin = false;
    this.isAdmin = false;
  }


  /**
   * We only set the value of userData if it isn't undefined.
   * subscribes to the current state of the adminStatus variable.
   * subscribes to the state of the userData variable
   */
  ngOnInit() {

    this.adminStatus.currentPermissionStatus.subscribe(currentStatus  => {
      this.privilegeLevel = currentStatus;
      this.setPrivelege();
    });
    
    this.authService.getUserData_obs().subscribe(userData => {
      if (userData) {
        this.currentUserEmail = userData.email;
      }
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
