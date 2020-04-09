import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AdminService } from '../_services/admin.service';
import { User_Observer_Obj } from '../_supporting_classes/sqlUser';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public isAdmin: boolean;
  public isAtLeastFieldLeader: boolean;

  public loggedInUser: User_Observer_Obj;
  public currentUserIsValid: boolean;


  /**
   * 
   * @param authService 
   * @param adminStatus 
   */
  constructor(public authService : AuthService, public adminStatus: AdminService) { 
    this.isAdmin = false;
    this.isAtLeastFieldLeader = false;

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
