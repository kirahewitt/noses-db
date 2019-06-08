import { Component } from '@angular/core';
import { MatToolbarModule, MatTableModule, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'noses';
  isAdmin = true;
}

