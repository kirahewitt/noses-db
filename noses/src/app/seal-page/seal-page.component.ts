import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SealDataService } from "../_services/seal-data.service";
import { FlaskBackendService } from '../_services/flask-backend.service';
import { MatTableModule, MatTableDataSource, MatPaginator } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Observations } from '../_supporting_classes/Observations';

@Component({
  selector: 'app-seal-page',
  templateUrl: './seal-page.component.html',
  styleUrls: ['./seal-page.component.scss']
})
export class SealPageComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  seal: any;
  sealRow: Observations;
  jseal: any;
  dataSource: any;
  datas: any;
  displayedColumns: string[] = ['ObservationID', 'AgeClass', 'sex', 'date', 'SLOCode','Comments',  'Edit', 'actions'];
  show: any = false

  sealForm = new FormGroup({
    ageClass: new FormControl(''),
    sex: new FormControl(''),
    date: new FormControl(''),
    slo: new FormControl(''),
    comments: new FormControl('')
  });


  /**
   * 
   * @param sealDataService 
   * @param apiService 
   */
  constructor(private sealDataService: SealDataService, private apiService: FlaskBackendService) { }


  /**
   * This method needs to be rewritten. 
   */
  ngOnInit() {
    this.sealDataService.currentSeal_observable.subscribe(currentSeal  => {
      this.seal = currentSeal;
      this.jseal = JSON.stringify(currentSeal);
      // this.obsID = { 'SealID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
      this.datas = this.apiService.getSeal(this.jseal).then(msg => {
        this.dataSource = new MatTableDataSource(<any> msg);
        this.dataSource.paginator = this.paginator;
      });

    });
  }


  /**
   * 
   * @param row 
   */
  editObs(row) {
    this.sealRow = row;
    this.show = !this.show;
    if(this.show == true) {
      // implement scroll to bottom
    }
  }


  /**
   * this function needs to be rewritten to use BehaviorSubjects/Observables properly. 
   * I'm pretty sure async/await isn't necessary.
   * DO NOT CHANGE THIS RIGHT NOW
   */
  async onSubmit() {

    if(this.sealForm.value.ageClass != "") {

      var json_sealIdentifier = JSON.stringify({'obsID': this.sealRow.ObservationID, 'age': this.sealForm.value.ageClass});
      
      await this.apiService.updateAgeClass(json_sealIdentifier).subscribe(() => {

        this.apiService.readObs();

        this.sealDataService.currentSeal_observable.subscribe(subscription_response => {
          this.seal = subscription_response;
          this.jseal = JSON.stringify(subscription_response);

          // this.obsID = { 'SealID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
          this.datas = this.apiService.getSeal(this.jseal);

          this.datas.then(msg => {
            this.dataSource = new MatTableDataSource(<any> msg);
            this.sealForm.reset();
            this.show = false;
          });

        });
      });

    }
  }


  /**
   * 
   */
  toggleForm() {
    console.log(this.show);
  }

}
