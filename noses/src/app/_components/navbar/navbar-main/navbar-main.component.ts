import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { AdminService } from 'src/app/_services/admin.service';
import { User_Observer_Obj } from 'src/app/_supporting_classes/sqlUser';



@Component({
  selector: 'app-navbar-main',
  templateUrl: './navbar-main.component.html',
  styleUrls: ['./navbar-main.component.scss']
})
export class NavbarMainComponent implements OnInit {

  isSuperAdmin: boolean;
  isAdmin: boolean;

  public loggedInUser: User_Observer_Obj;
  public currentUserIsValid: boolean;
  

  /**
   * 
   * @param authService 
   * @param adminStatus 
   */
  constructor(private authService : AuthService, private adminStatus: AdminService) { 
    this.isSuperAdmin = false;
    this.isAdmin = false;

    this.loggedInUser = new User_Observer_Obj();
    this.currentUserIsValid = false;
  }


  /**
   * 
   */
  public ngOnInit() {
    let loggedInUser_datastream = this.authService.IH_getUserData_bs();
    loggedInUser_datastream.subscribe( (retval : User_Observer_Obj ) => {
      this.loggedInUser = retval;
      this.updatePrivelege();
    });

    let currentUserIsValid_datastream = this.authService.IH_getUserIsValid_bs();
    currentUserIsValid_datastream.subscribe( (retval : boolean) => {
      this.currentUserIsValid = retval;
      this.updatePrivelege();
    });
  }

  /**
   * 
   */
  public logoutClicked() {
    this.authService.IH_SignOut();
  }


  /**
   * Maintains the state of convenient variables that will be used to decide
   * whether we display links or not.
   */
  public updatePrivelege() {
    if (this.currentUserIsValid == false) {
      this.isSuperAdmin = false;
      this.isAdmin = false;
    }
    else {
      if (this.loggedInUser.isAdmin == 3) {
        this.isSuperAdmin = true;
        this.isAdmin = true;
      } 
      else if(this.loggedInUser.isAdmin == 2) {
        this.isSuperAdmin = false;
        this.isAdmin = true;
      } 
      else  {
        this.isSuperAdmin = false;
        this.isAdmin = false;
      }
    }


     
  }

}
