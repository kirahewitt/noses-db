import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { SpreadsheetTuple, TupleProcessingError } from '../../_supporting_classes/SpreadsheetTuple';

// imports that will let us use modal windows
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
import { EditObservationDialogComponent } from 'src/app/edit-observation-dialog/edit-observation-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { FlaskBackendService } from 'src/app/_services/flask-backend.service';
import { AuthService } from 'src/app/_services/auth.service';
// import { DatePipe } from '@angular/common';


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

    public fileName: string;
    private fileData: any[];
    private tupleTableStructList: TupleStructForTable[];

    public observationTuples : SpreadsheetTuple[];
    public displayedColumns: string[];
    public dataSource: MatTableDataSource<TupleStructForTable>;
    public currentUserEmail : string;

    public dateForDisplay : string;


    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


    /**
     * Injection site for Papa Parse and the Dialog Material we use to display our modal popup 
     *  for editing.
     * @param papa 
     * @param dialogMaterialService 
     */
    constructor(private papa: Papa, 
        public dialogMaterialService: MatDialog, 
        private snackbarService : MatSnackBar,
        private apiService: FlaskBackendService,
        private authService : AuthService) 
    {
        this.fileName = "No File Selected";
        this.displayedColumns = ["position", "tag1_idValue"];
        this.fileData = [];
        this.observationTuples = [];
        this.tupleTableStructList = []; 

        this.currentUserEmail = "";
        this.dateForDisplay = "";
        
    }


    /**
     * 
     */
    ngOnInit() {
      this.authService.getUserData_obs().subscribe(userData => {
        this.currentUserEmail = userData.email;
      });
    }



    /**
     * Causes a dialog to appear that contains a form, which is used to edit the records uploaded
     *  to the browser, validated and corrected, and sent to the DB.
     * @param observationIndex: The index of the observation in the list provided by the
     *  user.
     */
    public openDialog(observationIndex: number): void {
        event.preventDefault();

        // establish the settings for our dialog
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "50%";

        // establish the data that will be passed to the dialog
        dialogConfig.data = {
            obsList : this.observationTuples,
            obsIndex : observationIndex
        };

        // set up a subcription to receive any modified data from the dialog after it is closed
        const dialogRef = this.dialogMaterialService.open(EditObservationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe( result => {
            console.log("Dialog output: ", result);

            if (result != undefined) {
                this.overwriteModifiedTuple(observationIndex, result);
            }
        });

    }


    /**
     * Receives a Javascript Date object and converts it to a string of the form MM/DD/YYYY
     */
    public convertDateObjToDateString(dateObj : Date) {
        let result : string = "";
        result += (dateObj.getMonth() + 1).toString() + "/" + (dateObj.getDate()).toString() + "/" + dateObj.getFullYear().toString();
        return result;
    }


    private overwriteModifiedTuple(observationIndex: number, result: any)
    {
        var tupleToOverwrite = this.observationTuples[observationIndex];
        tupleToOverwrite.originalJsonInput = result.originalJsonInput;
        // observation bookkeeping section
        tupleToOverwrite.fieldLeaderList = result.fieldLeaderList;
        tupleToOverwrite.year = result.year;
        tupleToOverwrite.dateOfRecording = result.dateOfRecording;
        tupleToOverwrite.locationCode = result.locationCode;
        tupleToOverwrite.currentSeason = result.currentSeason;
        // seal attribute section
        tupleToOverwrite.sealSex = result.sealSex;
        tupleToOverwrite.sealAgeCode = result.sealAgeCode;
        tupleToOverwrite.sealHasPupQuantity = result.sealHasPupQuantity;
        // mark section
        tupleToOverwrite.mark1_idValue = result.mark1_idValue;
        tupleToOverwrite.mark1_isNew = result.mark1_isNew;
        tupleToOverwrite.mark1_positionCode = result.mark1_positionCode;
        tupleToOverwrite.mark2_idValue = result.mark2_idValue;
        tupleToOverwrite.mark2_isNew = result.mark2_isNew;
        tupleToOverwrite.mark2_positionCode = result.mark2_positionCode;
        // tag section
        tupleToOverwrite.tag1_idValue = result.tag1_idValue;
        tupleToOverwrite.tag1_isNew = result.tag1_isNew;
        tupleToOverwrite.tag1_positionCode = result.tag1_positionCode;
        tupleToOverwrite.tag2_idValue = result.tag2_idValue;
        tupleToOverwrite.tag2_isNew = result.tag2_isNew;
        tupleToOverwrite.tag2_positionCode = result.tag2_positionCode;
        // measurement section
        tupleToOverwrite.sealMoltPercentage = result.sealMoltPercentage;
        tupleToOverwrite.sealStandardLength = result.sealStandardLength;
        tupleToOverwrite.sealStandardLength_units = result.sealStandardLength_units;
        tupleToOverwrite.sealCurvilinearLength = result.sealCurvilinearLength;
        tupleToOverwrite.sealCurvilinearLength_units = result.sealCurvilinearLength_units;
        tupleToOverwrite.sealAxillaryGirth = result.sealAxillaryGirth;
        tupleToOverwrite.sealAxillaryGirth_units = result.sealAxillaryGirth_units;
        tupleToOverwrite.sealMass = result.sealMass;
        tupleToOverwrite.sealMass_units = result.sealMass_units;
        tupleToOverwrite.sealTare = result.sealTare;
        tupleToOverwrite.sealTare_units = result.sealTare_units;
        tupleToOverwrite.sealMassTare = result.sealMassTare;
        tupleToOverwrite.sealMassTare_units = result.sealMassTare_units;
        // last section
        tupleToOverwrite.sealLastSeenAsPupDate = new Date(result.sealLastSeenAsPupDate.toString());
        tupleToOverwrite.sealFirstSeenAsWeaner = new Date(result.sealFirstSeenAsWeaner.toString());
        tupleToOverwrite.weanDateRange = result.weanDateRange;
        tupleToOverwrite.comments = result.comments;
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
                    console.log(results);
                    console.log(this.observationTuples);
                }
            });
        }
    }


    /**
     * Receives an object representing the csv file as json. For each element of the list, 
     * it calls the constructor of the SpreadsheetTuple object.
     * @param fileData 
     */
    public processSpreadsheetFile(fileTupleList: any[]): SpreadsheetTuple[] {
        var tupleList: SpreadsheetTuple[] = [];

        for (var tuple of fileTupleList) {
            var newTupleObj = new SpreadsheetTuple(tuple);
            newTupleObj.validateTupleData();
            tupleList.push(newTupleObj);
        }

        return tupleList;
    }


  /**
   * Checks whether the data is valid and can be uploaded. Displays a message answering that
   *  question. Then if it can be uploaded, it extacts the list of json objects from the SpreadsheetTuple
   *  list and sends it to the server.
   */
  public uploadData() {
    var snackbarMessage: string;
    
    if (this.getErroneousObservationIndices().length > 0) {
      snackbarMessage = "WARNING: You cannot submit this upload until you correct all errors.";
      this.displaySnackbarMessage(snackbarMessage);
    }
    else {
      snackbarMessage = "SUCCESS: This data has been successfully validated. Sending to DB.";
      this.displaySnackbarMessage(snackbarMessage);

      var extractedJsonData = this.getExtractedJsonData();

      console.log("EXTRACTED JSON DATA");
      console.log(extractedJsonData);


      var fullData = [extractedJsonData, {"isApproved" : 0}];
      this.apiService.addObservations(JSON.stringify(fullData)).subscribe(() => this.apiService.readObs());
    }    
  }


    public getExtractedJsonData() {
        let extractedJsonList = [];
        
        for (var tuple of this.observationTuples) {
            extractedJsonList.push(tuple.toJson());
        }

        return extractedJsonList;
    }


    public displaySnackbarMessage(snackbarMessage : string) {
        this.snackbarService.open(snackbarMessage, "Close", {
            duration: 5000,
        });
    }


    /** Returns true if any of our tuples have a non-empty list of errors */
    private getErroneousObservationIndices() {
        
        var indexList: number[] = [];

        var i = 0;
        for (var tuple of this.observationTuples) {
            if (tuple.processingErrorList.length > 0) {
                indexList.push(i);
                let testErrorMessage = "ERRONEOUS OBSERVATION # -- " + i.toString();
                console.log(testErrorMessage);
            }
            i++;
        }
        
        return indexList;
    }


    /**
     * Retrieves the username of the individual that is currently logged in.
     */
    private getSelfUserName() {

    }

}





