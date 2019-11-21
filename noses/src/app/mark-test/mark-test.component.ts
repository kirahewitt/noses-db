import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'app-mark-test',
  templateUrl: './mark-test.component.html'
})
export class MarkTestComponent implements OnInit {
  filters: string[] = ['mark', 'ilya'];

  constructor() { }

  clickHandle() {$(function () {
    $(document).ready(function(){
      $("#chkPassport").click(function () {
          if ($(this).is(":checked")) {
              $("#dvPassport").show();
          } else {
              $("#dvPassport").hide();
          }
      });
    });
  })}

  addFilter(f) {
    this.filters.push(f);
  }

  ngOnInit() {
  }

}
