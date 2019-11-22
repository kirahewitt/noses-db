import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-block',
  templateUrl: './filter-block.component.html',
  styleUrls: ['./filter-block.component.scss']
})
export class FilterBlockComponent implements OnInit {
  filterName = ["Breeding Season"];
  filterValue = ["2019"];

  constructor() { }

  ngOnInit() {
  }

}