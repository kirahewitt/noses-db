import { Component, OnInit } from '@angular/core';
import { NumberCounterService } from '../_services/location.service';
import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-component-for-ang-service',
  templateUrl: './component-for-ang-service.component.html',
  styleUrls: ['./component-for-ang-service.component.scss']
})
export class ComponentForAngServiceComponent implements OnInit {

  public locationDataStream : BehaviorSubject<String>;
  public locationData : String = "no data from rest service yet";

  constructor(private locationService : NumberCounterService) { }

  ngOnInit() {
    this.locationDataStream = this.locationService.getLocationStream();

    this.locationDataStream.subscribe(resp => {
      this.locationData = resp;
    });
  }

}
