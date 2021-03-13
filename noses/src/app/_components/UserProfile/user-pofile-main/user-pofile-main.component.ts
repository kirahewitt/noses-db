import { Component, OnInit } from '@angular/core';
import { FlaskBackendService } from 'src/app/_services/flask-backend.service';
import { sqlUser_full, User_Observer_Obj } from 'src/app/_supporting_classes/sqlUser';
import { AuthService } from 'src/app/_services/auth.service';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EditUserDialogComponent } from 'src/app/edit-user-dialog/edit-user-dialog.component';


// export interface sqlUser_full {
//   UserID: number;
//   Username: string;
//   Password: string;
//   Initials: string;
//   isAdmin: string;
//   Affiliation: string;
//   Email: string;
//   ObsID: number;
//   HashedPassword: string;
// }

@Component({
  selector: 'app-user-pofile-main',
  templateUrl: './user-pofile-main.component.html',
  styleUrls: ['./user-pofile-main.component.scss']
})
export class UserPofileMainComponent implements OnInit {
  
  public loggedInUser: User_Observer_Obj;
  public currentUserIsValid: boolean;
  public fileName: string;
  public selectedFile: File;
  public selectedImageFileData: string;

  public imageDataSource:string;


  /**
   * 
   * @param apiService 
   * @param authService 
   * @param dialogMaterialService 
   */
  constructor(public apiService: FlaskBackendService, public authService: AuthService, public dialogMaterialService: MatDialog) { 
    this.loggedInUser = new User_Observer_Obj();
    this.currentUserIsValid = false;
    this.fileName = "";
    this.selectedFile = null;
    this.selectedImageFileData = "";
    this.imageDataSource = "";
  }


  /**
   * 
   */
  public ngOnInit() {
    let loggedInUser_datastream = this.authService.IH_getUserData_bs();
    loggedInUser_datastream.subscribe( (retval : User_Observer_Obj ) => {
      this.loggedInUser = retval;
    });

    let currentUserIsValid_datastream = this.authService.IH_getUserIsValid_bs();
    currentUserIsValid_datastream.subscribe( (retval : boolean) => {
      this.currentUserIsValid = retval;
    });

    let currentUserImage_datastream = this.authService.getUserImage_bs();
    currentUserImage_datastream.subscribe( (imageAsString : string) => {

      // console.log("\n\nInitializing the current user image\n\n");
      // console.log("Current User Image:");
      // console.log(imageAsString);

      if (imageAsString == "") {
        this.imageDataSource = "assets/userimg.png";
      }
      else {
        this.imageDataSource = imageAsString;
      }
    });
  }


  /**
   * Causes a dialog to appear that contains a form, which is used to edit the records uploaded
   *  to the browser, validated and corrected, and sent to the DB.
   * @param userObsObj : An object containing all the main fields of the User.
   */
  public openEditUserDialog(): void {
    event.preventDefault();

    // establish the settings for our dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";

    console.log("Editing Own Account:");
    console.log(this.loggedInUser);
    
    // establish the data that will be passed to the dialog
    dialogConfig.data = { masterObj: this.loggedInUser,  editPermissions: false };

    // create a reference to the dialog
    const dialogRef = this.dialogMaterialService.open(EditUserDialogComponent, dialogConfig);
     
    // set up a subcription to receive any modified data from the dialog after it is closed
    dialogRef.afterClosed().subscribe( (result: User_Observer_Obj) => {
      if (result != undefined) {
        console.log("Resulting object we receive from the edit dialog");
        console.log(result);
        console.log("Now sending the combined user observer object to the DB")
        this.authService.updateUserObserverTuplePair(result);
      }
    });
  }


  /**
   * Parses the file received and produces a json representation of the object.
   * @param event 
   */
  public handleFileSelect(event) {
    var files: FileList = event.target.files; // FileList object
    var file: File = files[0];

    // set local variables
    this.selectedFile = file;
    this.fileName = this.selectedFile.name;
    
    // console.log(file);

    // specify a callback function for the reader that will read the image file's data
    var reader = new FileReader();
    reader.onloadend = (event: any) => {
      var fileContent:string;
      
      fileContent = event.target.result;
      console.log(fileContent);

      this.authService.updateUserImage(fileContent);
    }
    
    // this method turns the item into a base64 string by default.
    reader.readAsDataURL(file);
  }
}
