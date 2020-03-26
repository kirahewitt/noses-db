import { Component, OnInit } from '@angular/core';
import { SpreadsheetTuple } from '../_supporting_classes/SpreadsheetTuple';
import { MatSnackBar } from '@angular/material';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { AuthService } from '../_services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidationService } from '../_services/validation.service';
import {MdbTableDirective} from 'angular-bootstrap-md'

@Component({
  selector: 'app-new-observation',
  templateUrl: './new-observation.component.html',
  styleUrls: ['./new-observation.component.scss']
})
export class NewObservationComponent implements OnInit {

    public form : FormGroup;

    public observationTuple : SpreadsheetTuple;
    public observationTuples : SpreadsheetTuple[];
    public currentUserEmail : string;

    public sealNum = "None"
    public newSeal = true;


    /**
     * 
     * @param formBuilder 
     * @param snackbarService 
     * @param apiService 
     * @param authService 
     */ 
    mdbTable: MdbTableDirective; 
    elements: any = []; 
    headElements = ['ID', 'First', 'Last', 'Handle']; 
    searchText: string = ''; previous: string;
    constructor( private formBuilder : FormBuilder , 
        private snackbarService : MatSnackBar, 
        private apiService: FlaskBackendService, 
        private authService : AuthService) 
    { 

    }

    

    setToNone (){
        this.sealNum = "None"
    }

    setToNew (){
        this.sealNum = "New Seal"
    }


    /**
     * 
     */
    ngOnInit() {
        this.authService.getUserData_obs().subscribe(userData => {
            this.currentUserEmail = userData.email;
         });

         this.observationTuple = new SpreadsheetTuple(null);

        // set up the form and its validation
        this.form = this.formBuilder.group({
            originalJsonInput: [this.observationTuple.originalJsonInput, []],

            fieldLeaderList: [this.observationTuple.fieldLeaderList, []],
            year : [this.observationTuple.year, []],
            dateOfRecording : [this.observationTuple.dateOfRecording, []],
            locationCode : [this.observationTuple.locationCode, []],


            currentSeason : [this.observationTuple.currentSeason, []],
            sealSex : [this.observationTuple.sealSex, [ValidationService.validate_sealSex]],
            sealAgeCode : [this.observationTuple.sealAgeCode, [ValidationService.validate_sealAgeCode]],
            sealHasPupQuantity : [this.observationTuple.sealHasPupQuantity, []],
            isPup : false,
            mark1_idValue : [this.observationTuple.mark1_idValue, []],
            mark1_isNew : [this.observationTuple.mark1_isNew, []],
            mark1_positionCode : [this.observationTuple.mark1_positionCode, [ValidationService.validate_markPositionCode]],
            mark2_idValue : [this.observationTuple.mark2_idValue, []],
            mark2_isNew : [this.observationTuple.mark2_isNew, []],
            mark2_positionCode : [this.observationTuple.mark2_positionCode, [ValidationService.validate_markPositionCode]],
            tag1_idValue : [this.observationTuple.tag1_idValue, []],
            tag1_isNew : [this.observationTuple.tag1_isNew, []],
            tag1_positionCode : [this.observationTuple.tag1_positionCode, [ValidationService.validate_tagPositionCode]],
            tag2_idValue : [this.observationTuple.tag2_idValue, []],
            tag2_isNew : [this.observationTuple.tag2_isNew, []],
            tag2_positionCode : [this.observationTuple.tag2_positionCode, [ValidationService.validate_tagPositionCode]],
            sealMoltPercentage : [this.observationTuple.sealMoltPercentage, []],
            sealStandardLength : [this.observationTuple.sealStandardLength, []],
            sealStandardLength_units : [this.observationTuple.sealStandardLength_units, []],
            sealCurvilinearLength : [this.observationTuple.sealCurvilinearLength, []],
            sealCurvilinearLength_units : [this.observationTuple.sealCurvilinearLength_units, []],
            sealAxillaryGirth : [this.observationTuple.sealAxillaryGirth, []],
            sealAxillaryGirth_units : [this.observationTuple.sealAxillaryGirth_units, []],
            sealMass : [this.observationTuple.sealMass, []],
            sealMass_units : [this.observationTuple.sealMass_units, []],
            sealTare : [this.observationTuple.sealTare, []],
            sealTare_units : [this.observationTuple.sealTare_units, []],
            sealMassTare : [this.observationTuple.sealMassTare, []],
            sealMassTare_units : [this.observationTuple.sealMassTare_units, []],
            sealLastSeenAsPupDate : [this.observationTuple.sealLastSeenAsPupDate, []],
            sealFirstSeenAsWeaner : [this.observationTuple.sealFirstSeenAsWeaner, []],
            weanDateRange : [this.observationTuple.weanDateRange, []],
            observationEnteredInAno : [this.observationTuple.observationEnteredInAno, []],
            comments : [this.observationTuple.comments, []],
            isApproved : [this.observationTuple.isApproved, []]
        });
        for (let i = 1; i <= 10; i++) { 
            this.elements.push({ id:
            i.toString(), first: 'Wpis' + (Math.floor(Math.random() * i *
            10)).toString(), last: 'Last' + (Math.floor(Math.random() * i *
            10)).toString(), handle: 'Handle' + (Math.floor(Math.random() * i *
            10)).toString() }); 
        } 
        this.mdbTable.setDataSource(this.elements);
        this.previous = this.mdbTable.getDataSource();
    }


    /**
     * 
     */
    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }


   /**
     * Receives an object representing the csv file as json. For each element of the list, 
     * it calls the constructor of the SpreadsheetTuple object.
     * @param fileData 
     */
    public processSpreadsheetFile(tupleList: SpreadsheetTuple[]): SpreadsheetTuple[] {
        var tupleList: SpreadsheetTuple[] = [];

        for (var tuple of tupleList) {
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
        var fullData = {};
        console.log(this.observationTuple);
        fullData["Field Leader Initials"] = this.observationTuple.fieldLeaderList;
                fullData["Year"] = 2018;
                fullData["Date"] = "01/01/2020";
                fullData["Loc."] = this.observationTuple.locationCode;
                fullData["Sex"] = this.observationTuple.sealSex;
                fullData["Age"] = this.observationTuple.sealAgeCode;
                fullData["New Mark 1?"] = "true";
                fullData["Mark 1"] = this.observationTuple.mark1_idValue;
                fullData["Mark 1 Position"] = this.observationTuple.mark1_positionCode;
                fullData["New Mark 2?"] = "true";
                fullData["Mark 2"] = this.observationTuple.mark2_idValue;
                fullData["Mark 2 Position"] = this.observationTuple.mark2_positionCode;
                fullData["New Tag1?"] = "true";
                fullData["Tag1 #"] = this.observationTuple.tag1_idValue;
                fullData["Tag 1 Pos."] = this.observationTuple.tag1_positionCode;
                fullData["New Tag2?"] = this.observationTuple.tag2_isNew;
                fullData["Tag2 #"] = this.observationTuple.tag2_idValue;
                fullData["Tag 2 Pos."] = this.observationTuple.tag2_positionCode;
                fullData["Molt (%)"] = this.observationTuple.sealMoltPercentage;
                fullData["Comments"] = this.observationTuple.comments;
                fullData["isApproved"] = 1;
                fullData["St. Length"] = "";
                fullData["Crv. Length"] = "";
                fullData["Ax. Girth"] = "";
                fullData["Mass"] = "";
                fullData["Pup?"] = "false";
                fullData["Tare"] = "";
                fullData["Mass-Tare"] = "";
                fullData["Last seen as P"] = "";
                fullData["1st seen as W"] = "";
                fullData["Range (days)"] = "";
                fullData["Entered in Ano"] = "";
                fullData["Season"] = 2018;
                fullData["LastSeenPup"] = "";
                fullData["FirstSeenWeaner"] = "";
        var dataList = [];
        dataList.push(fullData);
        this.apiService.addObservations(JSON.stringify(dataList)).subscribe(() => this.apiService.readObs());
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
    searchItems() { const
        prev = this.mdbTable.getDataSource(); 
        if (!this.searchText) {
            this.mdbTable.setDataSource(this.previous); this.elements =
            this.mdbTable.getDataSource(); 
        } 
        if (this.searchText) {
            this.elements =
            this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['first','last']); 
            this.mdbTable.setDataSource(prev); 
        } 
    }

}

