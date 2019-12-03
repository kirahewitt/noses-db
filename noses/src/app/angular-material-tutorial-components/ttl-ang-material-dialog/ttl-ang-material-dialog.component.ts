import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ValidationService } from '../../_services/validation.service';



export class CrossFieldErrorMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null) : boolean {
		return control.dirty && form.invalid;
	}
}


/**
 * 
 */
@Component({
  selector: 'app-ttl-ang-material-dialog',
  templateUrl: './ttl-ang-material-dialog.component.html',
  styleUrls: ['./ttl-ang-material-dialog.component.scss']
})
export class TtlAngMaterialDialogComponent implements OnInit {


    public form : FormGroup;
    public description : string;
    public potatoPedestal : string;
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
        private validationService: ValidationService,
        private dialogRef: MatDialogRef<TtlAngMaterialDialogComponent>,
        @Inject(MAT_DIALOG_DATA) injectedData) 
    { 
        this.description = injectedData.curDescriptionState;
        this.potatoPedestal = injectedData.curPotatoPedestalState;
        this.title = injectedData.title;
    }


    /**
     * Once the component has been created, this method will run. It performs setup.
     */
    public ngOnInit() {
        this.form = this.formBuilder.group({
            description: [this.description, [Validators.required, 
                                             Validators.minLength(3), 
                                             Validators.maxLength(10),
                                             ValidationService.customValidator]],
            potatoPedestal: [this.potatoPedestal, [Validators.required]]
        }, 
        { validator: this.descriptionNeedsPotatoValidator }
        // this.descriptionNeedsPotatoValidator
        );
    }


    /**
     * 
     */
    public hasError = (controlName: string, errorName: string) => {
      return this.form.controls[controlName].hasError(errorName);
    }


    /**
     * 
     */
    public hasError_formLevel = (errorName: string) => {
      return this.form.hasError(errorName);
    }


	/**
	 * 
	 * @param fg 
	 */
	public descriptionNeedsPotatoValidator(fg: FormGroup) {
        const condition = fg.get('potatoPedestal').value !== "potato";
        return condition ? { potatoNotOnPedestal : true } : null;
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
