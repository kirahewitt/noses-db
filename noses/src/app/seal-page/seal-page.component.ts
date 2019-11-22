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

  constructor(private sealData: SealDataService,
              private apiService: FlaskBackendService) { }

  seal: any;
  sealRow: Observations;
  jseal: any;
  dataSource: any;
  datas: any;
  displayedColumns: string[] = ['ObservationID', 'AgeClass', 'sex', 'date', 'SLOCode','Comments',  'actions', 'Edit'];
  show: any = false

  sealForm = new FormGroup({
    ageClass: new FormControl(''),
    sex: new FormControl(''),
    date: new FormControl(''),
    slo: new FormControl(''),
    comments: new FormControl('')
  });

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  ngOnInit() {
    this.sealData.currentSeal.subscribe(currentSeal  => {
      this.seal = currentSeal;
      this.jseal = JSON.stringify(currentSeal);
      // this.obsID = { 'SealID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
      this.datas = this.apiService.getSeal(this.jseal).then(msg => {
        this.dataSource = new MatTableDataSource(<any> msg);
        this.dataSource.paginator = this.paginator;
      });

    });
  }

  editObs(row) {
    this.sealRow = row;
    this.show = !this.show;
    if(this.show == true) {
      // implement scroll to bottom
    }

  }

  async onSubmit() {
    if(this.sealForm.value.ageClass != "") {
      await this.apiService.updateAgeClass(JSON.stringify({'obsID': this.sealRow.ObservationID, 'age': this.sealForm.value.ageClass}))
      .subscribe(() => {
        this.apiService.readObs()
        this.sealData.currentSeal.subscribe(currentSeal  => {
        this.seal = currentSeal;
        this.jseal = JSON.stringify(currentSeal);

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

  toggleForm() {
    console.log(this.show);
  }

}
