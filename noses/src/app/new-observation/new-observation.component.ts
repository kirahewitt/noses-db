import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-observation',
  templateUrl: './new-observation.component.html',
  styleUrls: ['./new-observation.component.scss']
})
export class NewObservationComponent implements OnInit {

  constructor() { }

  sealNum = "None"

  setToNone (){
    this.sealNum = "None"
  }

  setToNew (){
    this.sealNum = "New Seal"
  }

  ngOnInit() {
    
  }

}

