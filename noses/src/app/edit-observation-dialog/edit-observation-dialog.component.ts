// import { Component, OnInit, Inject, HostListener } from '@angular/core';
// import { Papa } from 'ngx-papaparse';
// import { SpreadsheetTuple, TupleProcessingError } from './../_supporting_classes/SpreadsheetTuple';

// // imports that will let us use modal windows
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { FormGroup, FormBuilder } from '@angular/forms';
// import { ValidationService } from '../_services/validation.service';



// //
// export interface DialogData {
//   obsList : SpreadsheetTuple[];
//   obsIndex : number;
// }

// @Component({
//   selector: 'app-edit-observation-dialog',
//   templateUrl: './edit-observation-dialog.component.html',
//   styleUrls: ['./edit-observation-dialog.component.scss']
// })
// export class EditObservationDialogComponent implements OnInit {

//     public form : FormGroup;
//     public tuple: SpreadsheetTuple;
//     public tupleList : SpreadsheetTuple[];
//     public tupleIndex : number;
    
//     /**
//      * @param formBuilder : Provides syntactic sugar for creating instances of objects related to Forms.
//      * @param dialogRef : A direct reference to the dialog opened by the MatDialog service. (that would be THIS dialog)
//      *  It's purpose is to let us close the dialog and return any/all updated data to the component that created 
//      *  this dialog.
//      * @param injectedData : The data provided to this dialog which will be initially displayed in the
//      *  form it contains, and ultimately modified.
//      */
//     constructor(private formBuilder : FormBuilder,
//         public dialogRef: MatDialogRef<EditObservationDialogComponent>, 
//         @Inject(MAT_DIALOG_DATA) public injectedData) 
//     {
//         this.tupleList = injectedData.obsList;
//         this.tupleIndex = injectedData.obsIndex;
//         this.tuple = this.tupleList[this.tupleIndex];
//     }


//     /**
//      * Converts a received list of field leaders into a single string rather than a list of strings.
//      * @param listofStrs a list of strings, one for each field leader.
//      */
//     public fll_to_str(listofStrs : string[]) {
//         var fullString = "";

//         var i = 0;
//         for (var element of listofStrs) {
//             fullString += element;
//             if (i != listofStrs.length - 1) {
//                 fullString += ", ";
//             }
//             i++;
//         }
//         return fullString;
//     }

//     /**
//      * 
//      */
//     ngOnInit() {

//         console.log("OUTPUT ORIGINAL DATE JSON INPUT");
//         console.log(this.tuple.originalJsonInput['Date']);

//         this.form = this.formBuilder.group({
//             originalJsonInput: [this.tuple.originalJsonInput, []],
//             fieldLeaderList: [this.tuple.fieldLeaderList, []],
//             year : [this.tuple.year, []],

//             dateOfRecording : [this.tuple.dateOfRecording, []],
//             locationCode : [this.tuple.locationCode, []],
//             currentSeason : [this.tuple.currentSeason, []],
//             sealSex : [this.tuple.sealSex, [ValidationService.validate_sealSex]],
//             sealAgeCode : [this.tuple.sealAgeCode, [ValidationService.validate_sealAgeCode]],
//             sealHasPupQuantity : [this.tuple.sealHasPupQuantity, []],
//             mark1_idValue : [this.tuple.mark1_idValue, []],
//             mark1_isNew : [this.tuple.mark1_isNew, []],
//             mark1_positionCode : [this.tuple.mark1_positionCode, [ValidationService.validate_markPositionCode]],
//             mark2_idValue : [this.tuple.mark2_idValue, []],
//             mark2_isNew : [this.tuple.mark2_isNew, []],
//             mark2_positionCode : [this.tuple.mark2_positionCode, [ValidationService.validate_markPositionCode]],
//             tag1_idValue : [this.tuple.tag1_idValue, []],
//             tag1_isNew : [this.tuple.tag1_isNew, []],
//             tag1_positionCode : [this.tuple.tag1_positionCode, [ValidationService.validate_tagPositionCode]],
//             tag2_idValue : [this.tuple.tag2_idValue, []],
//             tag2_isNew : [this.tuple.tag2_isNew, []],
//             tag2_positionCode : [this.tuple.tag2_positionCode, [ValidationService.validate_tagPositionCode]],
//             sealMoltPercentage : [this.tuple.sealMoltPercentage, []],
//             sealStandardLength : [this.tuple.sealStandardLength, []],
//             sealStandardLength_units : [this.tuple.sealStandardLength_units, []],
//             sealCurvilinearLength : [this.tuple.sealCurvilinearLength, []],
//             sealCurvilinearLength_units : [this.tuple.sealCurvilinearLength_units, []],
//             sealAxillaryGirth : [this.tuple.sealAxillaryGirth, []],
//             sealAxillaryGirth_units : [this.tuple.sealAxillaryGirth_units, []],
//             sealMass : [this.tuple.sealMass, []],
//             sealMass_units : [this.tuple.sealMass_units, []],
//             sealTare : [this.tuple.sealTare, []],
//             sealTare_units : [this.tuple.sealTare_units, []],
//             sealMassTare : [this.tuple.sealMassTare, []],
//             sealMassTare_units : [this.tuple.sealMassTare_units, []],
//             sealLastSeenAsPupDate : [this.tuple.sealLastSeenAsPupDate, []],
//             sealFirstSeenAsWeaner : [this.tuple.sealFirstSeenAsWeaner, []],
//             weanDateRange : [this.tuple.weanDateRange, []],
//             comments : [this.tuple.comments, []],
//             isApproved : [this.tuple.isApproved, []]
//         });
//     }


//     public formatDateMMDDYY(date : Date) {
//         var dateString = "";

//         let monthNum = date.getMonth() + 1;
//         let monthStr = monthNum.toPrecision(2);

//         let dayNum = date.getDate();
//         let dayStr = dayNum.toPrecision(2);

//         let yearNum = date.getFullYear();
//         let yearStr = yearNum.toString().substr(2, 2);

//         dateString += monthStr + "/" + dayStr + "/" + yearStr;

//         console.log("CONSTRUCTED FORMATTED DATE");
//         console.log(dateString);

//         return dateString;
//     }


//     /**
//      * Note this interesting syntax... We've defined this using the same structure as other callback functions
//      * Very similar to the syntax we use when interacting with subscriptions.
//      */
//     public hasError = (controlName: string, errorName: string) => {
//         return this.form.controls[controlName].hasError(errorName);
//     }


//     /**
//      * Closes the form and returns the value of the form as its current state.
//      */
//     public save() {
//         this.dialogRef.close(this.form.value);
//     }


//     /**
//      * This method is used to close the form when the data it contains is not updated.
//      */
//     public close() {
//         this.dialogRef.close();
//     }


//     // /**
//     //  * 
//     //  */
//     // private outputListState() {
//     //     var i: number;
//     //     console.log("Outputting list state...");
//     //     console.log("\n   List State - 'tupleList_master': ");
//     //     i = 0;
//     //     for (var element of this.tupleList_master) {
//     //     console.log("      " + (i+1).toString() + ". " + element.comments);
//     //     i++;
//     //     }
//     //     console.log("\n   List State - 'tupleList_copy': ");
//     //     i = 0;
//     //     for (var element of this.tupleList_copy) {
//     //     console.log("      " + (i+1).toString() + ". " + element.comments);
//     //     i++;
//     //     }
//     // }

// }


