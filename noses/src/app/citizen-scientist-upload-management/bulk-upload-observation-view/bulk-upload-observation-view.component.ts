import { Component, OnInit, Input } from '@angular/core';
import { SpreadsheetTuple } from '../../_supporting_classes/SpreadsheetTuple';

@Component({
  selector: 'app-bulk-upload-observation-view',
  templateUrl: './bulk-upload-observation-view.component.html',
  styleUrls: ['./bulk-upload-observation-view.component.scss']
})
export class BulkUploadObservationViewComponent implements OnInit {

  @Input() observationTuple : SpreadsheetTuple;

  constructor() { }

  ngOnInit() {
  }

}
