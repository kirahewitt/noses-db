import { Component, OnInit, ViewChild } from '@angular/core';
import { SpreadsheetTuple } from '../_supporting_classes/SpreadsheetTuple';
import { MatSnackBar } from '@angular/material';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { AuthService } from '../_services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidationService } from '../_services/validation.service';
import {MdbTableDirective} from 'angular-bootstrap-md';
import { SealDataService } from "../_services/seal-data.service";
import { Router } from "@angular/router";
import { User_Observer_Obj } from '../_supporting_classes/sqlUser';
import { BacklogSpreadsheetTuple } from '../_supporting_classes/BacklogSpreadsheetTuple';
import { assertNotNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-edit-backlog',
  templateUrl: './edit-backlog.component.html',
  styleUrls: ['./edit-backlog.component.scss']
})
export class EditBacklogComponent implements OnInit {

    public form : FormGroup;

    public observationTuple : BacklogSpreadsheetTuple;
    public observationTuples : BacklogSpreadsheetTuple[];
    public oldObservationTuple: BacklogSpreadsheetTuple;
    public currentUserEmail : string;

    public sealNum = "None"
    public newSeal = true;

    public loggedInUser: User_Observer_Obj;
    public currentUserIsValid: boolean;

    public stagedId: number;

    /**
     * 
     * @param formBuilder 
     * @param snackbarService 
     * @param apiService 
     * @param authService
     * @param sealData
     * @param router
     */ 
    @ViewChild(MdbTableDirective, { static: true })
    public mdbTable: MdbTableDirective; 
    public elements: any = []; 
    public headElements = ['SealID', 'Tags', 'Marks', 'Sex', 'Age Class', 'View Seal', 'Select' ];
    public searchText: string = ''; 
    public previous: string;
    public locations: Array<any>;
    constructor( private formBuilder : FormBuilder , 
        private snackbarService : MatSnackBar, 
        private apiService: FlaskBackendService, 
        private sealData: SealDataService,
        private authService : AuthService,
        public router: Router) 
    { 
      this.loggedInUser = new User_Observer_Obj();
      this.currentUserIsValid = false;
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

        let loggedInUser_datastream = this.authService.IH_getUserData_bs();
        loggedInUser_datastream.subscribe( (retval : User_Observer_Obj ) => {
          this.loggedInUser = retval;
        });

        let currentUserIsValid_datastream = this.authService.IH_getUserIsValid_bs();
        currentUserIsValid_datastream.subscribe( (retval : boolean) => {
          this.currentUserIsValid = retval;
        });

         let newObject = window.localStorage.getItem("currentObs");
         this.stagedId = parseInt(window.localStorage.getItem("currentStagedId"));
         this.observationTuple = JSON.parse(newObject);
         this.oldObservationTuple = JSON.parse(newObject);
        //  var jsonData = window.localStorage.getItem("currentObs");
        //  console.log("jsonData");
        //  console.log(jsonData.toString());
        //  if (jsonData != null) {
        //     // var bTuple = new BacklogSpreadsheetTuple(jsonData);
        //     // bTuple.validateTupleData();
        //     // this.observationTuple = bTuple;
        //     // console.log("TUPLE SUCCESSFULLY LOADED");
        //     // console.log(jsonData);
        //     // console.log(this.observationTuple)
        //  }

        // set up the form and its validation
        this.form = this.formBuilder.group({
            originalJsonInput: [this.observationTuple.originalJsonInput, []],

            fieldLeaderList: [this.observationTuple.fieldLeaderInitials, []],
            dateOfRecording : [this.observationTuple.dateOfRecording, []],
            locationCode : [this.observationTuple.locationCode, []],

            sealSex : [this.observationTuple.sealSex, [ValidationService.validate_sealSex]],
            sealAgeCode : [this.observationTuple.sealAgeCode, [ValidationService.validate_sealAgeCode]],
            sealHasPupQuantity : [this.observationTuple.sealHasPup, []],
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
            sealCurvilinearLength : [this.observationTuple.sealCurvilinearLength, []],
            sealAxillaryGirth : [this.observationTuple.sealAxillaryGirth, []],
            sealMass : [this.observationTuple.sealMass, []],
            sealTare : [this.observationTuple.sealTare, []],
            sealLastSeenAsPupDate : [this.observationTuple.sealLastSeenAsPupDate, []],
            sealFirstSeenAsWeaner : [this.observationTuple.sealFirstSeenAsWeaner, []],
            comments : [this.observationTuple.comments, []],
        });
        let sealsObservable = this.apiService.readSeals();
        sealsObservable.subscribe( (observations: any) => {
            this.elements = observations.map(x => Object.assign({}, x));;
            observations.forEach((element, ind) => {
                this.elements[ind].Tags = element.Tags.filter(this.onlyUnique).join(', ');
                this.elements[ind].Marks = element.Marks.filter(this.onlyUnique).join(', ');

            });
            this.mdbTable.setDataSource(this.elements);
            console.log(this.elements);
            console.log(this.mdbTable.getDataSource());
            this.previous = this.mdbTable.getDataSource();
        });
        this.observationTuple.locationCode = "ACL";
    }


    /**
     * 
     */
    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    async onSubmit() {
        var changes = BacklogSpreadsheetTuple.getEditedFields(this.oldObservationTuple, this.observationTuple)
        console.log(JSON.stringify(changes))
        console.log(this.oldObservationTuple)
        if (Object.keys(changes).length > 0) {
            var json_changes = JSON.stringify({'stagedID': this.stagedId, 'changes': changes});
            console.log(json_changes)
            await this.apiService.updateBacklogItem(json_changes)
            this.router.navigate(["approve-obs"]);
        }
        else {
            this.router.navigate(["approve-obs"]);
        }
    }


//    /**
//      * Receives an object representing the csv file as json. For each element of the list, 
//      * it calls the constructor of the SpreadsheetTuple object.
//      * @param fileData 
//      */
//     public SpreadsheetTuple(tupleList: SpreadsheetTuple[]): SpreadsheetTuple[] {
//         var tupleList: SpreadsheetTuple[] = [];

//         for (var tuple of tupleList) {
//             var newTupleObj = new SpreadsheetTuple(tuple);
//             newTupleObj.validateTupleData();
//             tupleList.push(newTupleObj);
//         }

//         return tupleList;
//     }



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
    public searchItems() {
        const prev = this.mdbTable.getDataSource();
        console.log(this.searchText);
        if (!this.searchText) {
            this.mdbTable.setDataSource(this.previous); 
            this.elements = this.mdbTable.getDataSource(); 
        } 
        if (this.searchText) {
            this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['Tags','Marks', 'Sex', 'AgeClass']); 
            this.mdbTable.setDataSource(prev); 
        } 
    }
    public viewSeal(row) {
        this.sealData.setCurrentSealState(row);
        this.router.navigate(["seal-page"]);
      }
    public selectSeal(id){
        this.observationTuple.sealId = id;
        console.log(this.observationTuple.sealId)
    }
    public sealSelected(id){
        console.log("here");
        return !!id && id > 0;
    }
    public onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }
}

