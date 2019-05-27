import { Component, OnInit } from '@angular/core';
import { SealDataService } from "../seal-data.service";
import { FlaskBackendService } from '../flask-backend.service';
import { MatTableModule, MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-seal-page',
  templateUrl: './seal-page.component.html',
  styleUrls: ['./seal-page.component.scss']
})
export class SealPageComponent implements OnInit {

  constructor(private sealData: SealDataService,
              private apiService: FlaskBackendService) { }

  seal: any;
  jseal: any;
  dataSource: any;
  datas: any;
  displayedColumns: string[] = ['ObservationID', 'AgeClass', 'sex', 'date', 'Comments'];

  ngOnInit() {
    this.sealData.currentSeal.subscribe(currentSeal  => {
      this.seal = currentSeal;
      this.jseal = JSON.stringify(currentSeal);

      // this.obsID = { 'SealID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
      this.datas = this.apiService.getSeal(this.jseal);
      this.datas.then(msg => {
        this.dataSource = new MatTableDataSource(<any> msg);
        console.log(this.dataSource)
      });

    });
  }

}
