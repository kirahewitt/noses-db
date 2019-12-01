import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TtlAngMaterialDialogComponent } from '../ttl-ang-material-dialog/ttl-ang-material-dialog.component';

@Component({
  selector: 'app-ttl-ang-material-start-page',
  templateUrl: './ttl-ang-material-start-page.component.html',
  styleUrls: ['./ttl-ang-material-start-page.component.scss']
})
export class TtlAngMaterialStartPageComponent implements OnInit {


    private currentDescriptionState = "Fool! I am the default description!";

    constructor(private dialogService : MatDialog) { }


    ngOnInit() {
    }


    /**
     * This function is declared public because it is supposed to be accessed by the html template
     *  of this component. 'diableClose' makes it so clicking outside the window of the dialog
     *  won't close the dialog. 'autoFocus' will cause the first form field of the dialog box to
     *  receive the focus.
     */
    public openDialog() {

        // establish the settings for our dialog.
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "50%";

        // establish the data that will be passed to the dialog
        dialogConfig.data = {
            id: 1,
            title: "Angular For Beginners",
            curDescriptionState: this.currentDescriptionState
        };

        // set up a subcription to receive any modified data from the dialog after it is closed
        const dialogRef = this.dialogService.open(TtlAngMaterialDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe( data => {
            console.log("Dialog output:", data);

            // if the data has changed, change our local state!
            if (data != undefined) {
                this.currentDescriptionState = data.description;
            }
        });

    }

}
