import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { SpreadsheetTuple, TupleProcessingError } from '../../_supporting_classes/SpreadsheetTuple';

// imports that will let us use modal windows
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
import { EditObservationDialogComponent } from 'src/app/edit-observation-dialog/edit-observation-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material';


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
     * @param dialogMaterialService 
     */
    constructor(private papa: Papa, public dialogMaterialService: MatDialog) {
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
                tupleToOverwrite.sealAuxiliaryGirth = result.sealAuxiliaryGirth;
                tupleToOverwrite.sealAuxiliaryGirth_units = result.sealAuxiliaryGirth_units;
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

}





