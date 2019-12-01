import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ttl-ang-material-dialog',
  templateUrl: './ttl-ang-material-dialog.component.html',
  styleUrls: ['./ttl-ang-material-dialog.component.scss']
})
export class TtlAngMaterialDialogComponent implements OnInit {


    public form : FormGroup;
    public description : string;
    public title : string;


    /**
     * 
     * @param formBuilder : Provides syntactic sugar for creating instances of objects related to Forms.
     * @param dialogRef : A direct reference to the dialog opened by the MatDialog service. (that would be THIS dialog)
     *  It's purpose is to let us close the dialog and return any/all updated data to the component that created 
     *  this dialog.
     * @param injectedData : The data provided to this dialog which will be initially displayed in the
     *  form it contains, and ultimately modified.
     */
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TtlAngMaterialDialogComponent>,
        @Inject(MAT_DIALOG_DATA) injectedData) 
    { 
        this.description = injectedData.curDescriptionState;
        this.title = injectedData.title;
    }


    /**
     * Once the component has been created, this method will run. It performs setup.
     */
    public ngOnInit() {
        this.form = this.formBuilder.group({
            description: [this.description, []]
        });
    }

    
    /**
     * Closes the form and returns the value of the form as its current state.
     */
    public save() {
        this.dialogRef.close(this.form.value);
    }


    /**
     * This method is used to close the form when the data it contains is not updated.
     */
    public close() {
        this.dialogRef.close();
    }

}
