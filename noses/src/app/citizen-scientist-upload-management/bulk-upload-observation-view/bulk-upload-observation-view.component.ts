import { Component, OnInit, Input } from '@angular/core';
import { SpreadsheetTuple } from '../../_supporting_classes/SpreadsheetTuple';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bulk-upload-observation-view',
  templateUrl: './bulk-upload-observation-view.component.html',
  styleUrls: ['./bulk-upload-observation-view.component.scss']
})
export class BulkUploadObservationViewComponent implements OnInit {

  @Input() observationTuple : SpreadsheetTuple;
  @Input() title = `Information`;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
