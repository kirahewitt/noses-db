import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SealDataService } from "../_services/seal-data.service";
import { FlaskBackendService } from '../_services/flask-backend.service';
import { MatTableModule, MatTableDataSource, MatPaginator } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Observations } from '../_supporting_classes/Observations';
import { DossierViewStructure } from '../_supporting_classes/DossierViewStructure';
import { DossierViewHelperService } from '../_services/dossier-view-helper.service';
import { SqlTag } from '../_supporting_classes/SqlTag';


/**
 * 
 */
@Component({
  selector: 'app-seal-page',
  templateUrl: './seal-page.component.html',
  styleUrls: ['./seal-page.component.scss']
})
export class SealPageComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  public seal: any;
  public sealRow: Observations;
  public jseal: any;
  public dataSource: any;
  public datas: any;
  public displayedColumns: string[] = ['ObservationID', 'AgeClass', 'sex', 'date', 'SLOCode','Comments',  'Edit', 'actions'];
  public show: any = false;

  public sealForm = new FormGroup({
    ageClass: new FormControl(''),
    sex: new FormControl(''),
    date: new FormControl(''),
    slo: new FormControl(''),
    comments: new FormControl('')
  });


  // CREATE A NEW LOCAL VARIABLE TO STORE THE SEAL INFORMATION
  public sealDossier_main: DossierViewStructure;
  public observedTagList: SqlTag[];
  public tagListDisplayString: string;


  /**
   * 
   * @param sealDataService 
   * @param apiService 
   */
  constructor(private sealDataService: SealDataService, private apiService: FlaskBackendService, private dossierHelperService : DossierViewHelperService) { 
    this.sealDossier_main = new DossierViewStructure();
  }


  /**
   * Initializes the local attributes of this class by calling the initSubscriptions method.
   */
  ngOnInit() {
    this.initSubscriptions();
  }


  /**
   * Subscribes to relevant datastreams.
   */
  private initSubscriptions() {

    // original subscription for seal information
    this.sealDataService.currentSeal_observable.subscribe(currentSeal  => {
      this.seal = currentSeal;
      this.jseal = JSON.stringify(currentSeal);

      // this.obsID = { 'SealID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
      this.datas = this.apiService.getSeal(this.jseal).then(msg => {
        this.dataSource = new MatTableDataSource(<any> msg);
        this.dataSource.paginator = this.paginator;
      });

    });

    // Subscription via the NEW SERVICE
    let obs_DossierState_stream = this.dossierHelperService.getDossierDatastream();
    obs_DossierState_stream.subscribe((retval : DossierViewStructure) => {
      this.sealDossier_main = retval;
    });

    // Subscription to unique tags via NEW SERVICE
    this.dossierHelperService.getUniqueTagListDatastream().subscribe((retval : SqlTag[]) => {
      this.observedTagList = retval;

      this.tagListDisplayString = "";
      for (let tag of this.observedTagList) {
        this.tagListDisplayString += tag.TagNumber + " "
      }
    });

    // trigger the dossier helper service to populate based on the desired seal Id
    this.dossierHelperService.populateViaSealId(2);
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
