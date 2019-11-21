import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mark-test-child',
  templateUrl: './mark-test-child.component.html'
})
export class MarkTestChildComponent implements OnInit {

  @Input() filterName: string;

  constructor() { }

  ngOnInit() {
  }

}
