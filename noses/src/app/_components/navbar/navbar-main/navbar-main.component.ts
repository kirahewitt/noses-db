import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { AdminService } from 'src/app/_services/admin.service';



@Component({
  selector: 'app-navbar-main',
  templateUrl: './navbar-main.component.html',
  styleUrls: ['./navbar-main.component.scss']
})
export class NavbarMainComponent implements OnInit {

  isSuperAdmin: boolean;
  isAdmin: boolean;
  privilegeLevel: any;


  /**
   * 
   * @param authService 
   * @param adminStatus 
   */
  constructor(private authService : AuthService, private adminStatus: AdminService) { 
    this.privilegeLevel = -42;
    this.isSuperAdmin = false;
    this.isAdmin = false;
    console.log("Current permission Status: ");
    console.log(this.privilegeLevel);
  }


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
