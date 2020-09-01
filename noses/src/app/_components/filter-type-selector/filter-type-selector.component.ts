import { Component, OnInit } from '@angular/core';

export interface FilterType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-filter-type-selector',
  templateUrl: './filter-type-selector.component.html',
  styleUrls: ['./filter-type-selector.component.scss']
})
export class FilterTypeSelectorComponent implements OnInit {

  public selectedOption: string;
  public types: FilterType[];


  constructor() { }

  ngOnInit() {
    this.types = [
      {value: 'tag', viewValue: 'Tag'},
      {value: 'mark', viewValue: 'Mark'},
      {value: 'ageClass', viewValue: 'Age Class'},
      {value: 'sex', viewValue: 'Sex'}
    ];

  }

}

