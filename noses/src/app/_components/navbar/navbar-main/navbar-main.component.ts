import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { AdminService } from 'src/app/_services/admin.service';
import { User_Observer_Obj } from 'src/app/_supporting_classes/sqlUser';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';



@Component({
  selector: 'app-navbar-main',
  templateUrl: './navbar-main.component.html',
  styleUrls: ['./navbar-main.component.scss']
})
export class NavbarMainComponent implements OnInit {

  isAdmin: boolean;
  isAtLeastFieldLeader: boolean;

  public loggedInUser: User_Observer_Obj;
  public currentUserIsValid: boolean;

  url: String;
  

  /**
   * 
   * @param authService 
   * @param adminStatus 
   */
  constructor(private authService : AuthService, private adminStatus: AdminService) { 
    this.isAdmin = false;
    this.isAtLeastFieldLeader = false;

    this.loggedInUser = new User_Observer_Obj();
    this.currentUserIsValid = false;

    this.url = window.location.pathname;
  }


  /**
   * 
   */
  public ngOnInit() {
    let loggedInUser_datastream = this.authService.IH_getUserData_bs();
    loggedInUser_datastream.subscribe( (retval : User_Observer_Obj ) => {
      this.loggedInUser = retval;
      this.updatePrivelege();
      console.log(this.url)
      console.log(this.url === "/approve-obs")
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
      this.isAdmin = false;
      this.isAtLeastFieldLeader = false;
    }
    else {
      if (this.loggedInUser.isAdmin == 3) {
        this.isAdmin = true;
        this.isAtLeastFieldLeader = true;
      } 
      else if(this.loggedInUser.isAdmin == 2) {
        this.isAdmin = false;
        this.isAtLeastFieldLeader = true;
      } 
      else  {
        this.isAdmin = false;
        this.isAtLeastFieldLeader = false;
      }
    }


     
  }

}
