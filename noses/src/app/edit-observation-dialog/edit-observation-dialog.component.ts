import { Component, OnInit, Inject } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { SpreadsheetTuple, TupleProcessingError } from './../_supporting_classes/SpreadsheetTuple';

// imports that will let us use modal windows
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


//
export interface DialogData {
  obsList : SpreadsheetTuple[];
  obsIndex : number;
}

@Component({
  selector: 'app-edit-observation-dialog',
  templateUrl: './edit-observation-dialog.component.html',
  styleUrls: ['./edit-observation-dialog.component.scss']
})
export class EditObservationDialogComponent implements OnInit {

  public oi : number;
  public ob : SpreadsheetTuple; 
  public oldTupleList_Copy : SpreadsheetTuple[];


  /**
   * 
   * @param dialogRef 
   * @param data 
   */
  constructor(public dialogRef: MatDialogRef<EditObservationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.oi = 0;
    this.ob = null;
    this.oldTupleList_Copy = [];
    
    this.oi = data.obsIndex;
    this.ob = data.obsList[this.oi];
    this.oldTupleList_Copy = this.generateTupleListCopy(data.obsList);
  }


  /**
   * 
   */
  ngOnInit() {}
  

  /**
   * 
   */
  private generateTupleListCopy(originalList : SpreadsheetTuple[]) {
    var listCopy : SpreadsheetTuple[] = [];

    for (var listItem of originalList) {
      var listItemCopy : SpreadsheetTuple;

      let freshJsonObject = JSON.parse(JSON.stringify(listItem.originalJsonInput));

      listItemCopy = new SpreadsheetTuple(freshJsonObject);
      listItemCopy.validateTupleData()
      listCopy.push(listItemCopy)
    }

    return listCopy;
  }


  /**
   * This method is called when the user clicks save.
   * @param newList 
   */
  public updateList(newList : SpreadsheetTuple[]) {
    // this.oldTupleList_Copy = this.generateTupleListCopy(newList);
    this.data.obsList = this.generateTupleListCopy(newList);
    return this.data.obsList;
  }


  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}
