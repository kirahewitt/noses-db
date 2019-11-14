import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-citizen-sci-bulk-upload-data-preview',
  templateUrl: './citizen-sci-bulk-upload-data-preview.component.html',
  styleUrls: ['./citizen-sci-bulk-upload-data-preview.component.scss']
})
export class CitizenSciBulkUploadDataPreviewComponent implements OnInit {

  @Input() uploadData : any;

  constructor() { }

  ngOnInit() {
  }


  // onSubmit() {

  //   if(this.isAdmin >= 2) {
  //     this.approvalStatus = 0;
  //   } 
  //   else if(this.isAdmin ==1) {
  //     this.approvalStatus = 1;
  //   } 
  //   else {
  //     alert('you dont have priveleges');
  //     return;
  //   }

  //   this.sealUpload = [[{"Field Leader Initials": this.sealForm.value.FieldLeaderInitials, "Year": this.sealForm.value.Year,
  //                       "Date": this.sealForm.value.Date, "Loc.": this.sealForm.value.Loc, "Sex": this.sealForm.value.Sex,
  //                       "Age": this.sealForm.value.Age, "Pup?": this.sealForm.value.Pup, "New Mark 1?": this.sealForm.value.NewMark1,
  //                       "Mark 1": this.sealForm.value.Mark1, "Mark 1 Position": this.sealForm.value.Mark1Pos, "New Mark 2?": this.sealForm.value.NewMark2,
  //                       "Mark 2": this.sealForm.value.NewMark2, "Mark 2 Position": this.sealForm.value.Mark2Pos, "New Tag1?": this.sealForm.value.NewTag1,
  //                       "Tag1 #": this.sealForm.value.Tag1, "Tag 1 Pos.": this.sealForm.value.Tag1Pos, "New Tag2?": this.sealForm.value.NewTag2,
  //                       "Tag2 #": this.sealForm.value.Tag2, "Tag 2 Pos.": this.sealForm.value.Tag2Pos, "Molt (%)": this.sealForm.value.Molt,
  //                       "Season": this.sealForm.value.Season, "St. Length": this.sealForm.value.stLength, "Crv. Length": this.sealForm.value.crvLength,
  //                       "Ax. Girth": this.sealForm.value.axGirth, "Mass": this.sealForm.value.Mass, "Tare": this.sealForm.value.Tare,
  //                       "Mass-Tare": this.sealForm.value.massTare, "Last seen as P": this.sealForm.value.lastSeenP, "1st seen as W": this.sealForm.value.fstWeen,
  //                       "Range (days)": this.sealForm.value.Range, "Comments": this.sealForm.value.Comments, "Entered in Ano": this.sealForm.value.enterAno}],
  //                       {"isApproved": this.approvalStatus}];

  //   this.apiService.addObservations(JSON.stringify(this.sealUpload)).subscribe(() => this.apiService.readObs());
  //}

}
