import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { SpreadsheetTuple, TupleProcessingError } from '../../_supporting_classes/SpreadsheetTuple';

// imports that will let us use modal windows
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditObservationDialogComponent } from 'src/app/edit-observation-dialog/edit-observation-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material';


export interface DialogData {
  obsList : SpreadsheetTuple[];
  obsIndex : number;
}



// /**
//  * -------------------------------------------------------------------------------------
//  * Need to figure out a way to make these be in ONE file only.
//  * -------------------------------------------------------------------------------------
//  */
// var jsonName_fieldLeaderInitials = "Field Leader Initials";
// var jsonName_year = "Year";
// var jsonName_dateOfRecording = "Date";
// var jsonName_locationCode = "Loc.";
// var jsonName_sealSex = "Sex";
// var jsonName_sealAgeCode = "Age";
// var jsonName_sealHasPupQuantity = "Pup?";
// var jsonName_mark1_isNew = "New Mark 1?";
// var jsonName_mark1_idValue = "Mark 1";
// var jsonName_mark1_positionCode = "Mark 1 Position";

// var jsonName_mark2_isNew = "New Mark 2?";
// var jsonName_mark2_idValue = "Mark 2";
// var jsonName_mark2_positionCode = "Mark 2 Position";

// var jsonName_tag1_isNew = "New Tag1?";
// var jsonName_tag1_idValue = "Tag1 #"
// var jsonName_tag1_positionCode = "Tag 1 Pos."

// var jsonName_tag2_isNew = "New Tag2?";
// var jsonName_tag2_idValue = "Tag2 #"
// var jsonName_tag2_positionCode = "Tag 2 Pos."

// var jsonName_sealMoltPercentage = "Molt (%)";
// var jsonName_currentSeason = "Season";
// var jsonName_sealStandardLength =  "St. Length";
// var jsonName_sealCurvilinearLength = "Crv. Length";
// var jsonName_sealAuxiliaryGirth = "Ax. Girth";
// var jsonName_sealMass = "Mass";
// var jsonName_sealTare = "Tare";
// var jsonName_sealMassTare = "Mass-Tare";
// var jsonName_sealLastSeenAsPupDate = "Last seen as P";
// var jsonName_sealFirstSeenAsWeaner = "1st seen as W";
// var jsonName_weanDateRange = "Range (days)";
// var jsonName_comments = "Comments";
// var jsonName_observationEnteredInAno = "Entered in Ano";

export interface TupleStructForTable {
  position: number;
  date : Date;
  locationCode : string;
  comment : string;
}



/**
 * ------------------------------------------------------------------------------------------------
 * CitizenSciBulkUploadMainPageComponent
 * ------------------------------------------------------------------------------------------------
 */
@Component({
  selector: 'app-citizen-sci-bulk-upload-main-page',
  templateUrl: './citizen-sci-bulk-upload-main-page.component.html',
  styleUrls: ['./citizen-sci-bulk-upload-main-page.component.scss']
})
export class CitizenSciBulkUploadMainPageComponent implements OnInit {

  private fileName: string;
  private fileData: any[];
  private tupleTableStructList: TupleStructForTable[];

  public observationTuples : SpreadsheetTuple[];
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<TupleStructForTable>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  /**
   * Injection site for Papa Parse and the Dialog Material we use to display our modal popup 
   *  for editing.
   * @param papa 
   * @param dialogMaterial 
   */
  constructor(private papa: Papa, public dialogMaterial: MatDialog) {
    this.fileName = "No File Selected";
    this.displayedColumns = ["position", "date", "locationCode", "comment"];
    this.fileData = [];
    this.observationTuples = [];
    this.tupleTableStructList = []; 
  }


  /**
   * 
   */
  ngOnInit() {}

  

  /**
   * Causes a dialog to appear that contains a form, which is used to edit the records uploaded
   *  to the browser, validated and corrected, and sent to the DB.
   * @param observationIndex: The index of the observation in the list provided by the
   *  user.
   */
  openDialog(observationIndex: number): void {

    let dialogOptions = { width: '50%', data: {obsList : this.observationTuples, obsIndex : observationIndex}};
    const dialogRef = this.dialogMaterial.open(EditObservationDialogComponent, dialogOptions);

    let obs_dialog = dialogRef.afterClosed();
    obs_dialog.subscribe(result => {
      console.log('The dialog was closed');
      this.observationTuples = result;
    });
  }



  /**
   * Parses the file received and produces a json representation of the object.
   * @param event 
   */
  public handleFileSelect(event) {
    var files = event.target.files; // FileList object
    var file = files[0];
    this.fileName = file.name;

    console.log(file);

    var reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file
      
      this.papa.parse(csv, {
        skipEmptyLines: true,
        header: true,
        complete: (results) => {
          this.fileData = results.data;          
          this.observationTuples = this.processSpreadsheetFile(this.fileData);

          // at this moment, we have the tuples. now we need to map them onto tupleTableStructList so we have stuff to put in that giant table
          // this.tupleTableStructList = this.generateTableStructList(this.observationTuples);
        }
      });
    }
  }


  // /**
  //  * 
  //  * @param observationTuples 
  //  */
  // generateTableStructList(observationTuples: SpreadsheetTuple[]): TupleStructForTable[] {
  //   var newTableStructList: TupleStructForTable[] = [];

  //   var i : number = 1;
  //   for (var tuple of observationTuples) {
  //     var newTableStruct: TupleStructForTable = {position: i, date: tuple.dateOfRecording, locationCode: tuple.locationCode, comment: tuple.locationCode};
  //     newTableStructList.push(newTableStruct);
  //   }

  //   return newTableStructList;
  // }


  /**
   * Receives an object representing the csv file as json. For each element of the list, 
   * it calls the constructor of the SpreadsheetTuple object.
   * @param fileData 
   */
  processSpreadsheetFile(fileTupleList: any[]): SpreadsheetTuple[] {
    var tupleList: SpreadsheetTuple[] = [];

    for (var tuple of fileTupleList) {
      var newTupleObj = new SpreadsheetTuple(tuple);
      newTupleObj.validateTupleData();
      tupleList.push(newTupleObj);
    }

    return tupleList;
  }

}





