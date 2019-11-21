import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * This is going to represent the modal form
 */
@Component({
  selector: 'app-form-modal-single-observation',
  templateUrl: './form-modal-single-observation.component.html',
  styleUrls: ['./form-modal-single-observation.component.scss']
})
export class FormModalSingleObservationComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal // reference to the activeModal service
    ) { }

  ngOnInit() {
  }


  /**
   * Closes the modal and passes a string back to the trigger method.
   */
  closeModal() {
    this.activeModal.close('Modal Closed');
  }

}
