import { Component, OnInit } from '@angular/core';
import { AuthService } from "../_services/auth.service";

/** 
 * Simple component class that only displays a "Thank you for registering" message box 
 * */
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(public authService: AuthService) { }
  
  ngOnInit() {}
}
