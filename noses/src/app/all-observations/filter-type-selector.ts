import {Component} from '@angular/core';
export interface FilterType {
    value: string;
    viewValue: string;
  }
  
  @Component({
    selector: 'filter-type-selector',
    templateUrl: './filter-type-selector.component.html',
    styleUrls: ['./all-observations.component.scss'],
  })
  export class SelectFilterType {
      selectedOption: string;
    types: FilterType[] = [
      {value: 'tag', viewValue: 'Tag'},
      {value: 'mark', viewValue: 'Mark'},
      {value: 'ageClass', viewValue: 'Age Class'},
      {value: 'sex', viewValue: 'Sex'}
    ];
  }