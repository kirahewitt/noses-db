import { Component, OnInit } from '@angular/core';
import { Papa} from 'ngx-papaparse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SimpleUser } from '../_supporting_classes/simpleUser';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload-seal',
  templateUrl: './upload-seal.component.html',
  styleUrls: ['./upload-seal.component.scss']
})
export class UploadSealComponent implements OnInit {

  constructor(private papa: Papa,
              private http: HttpClient,
              private apiService: FlaskBackendService) {
  }

  ngOnInit() {
  }

  fileName: string = "No File Selected"
  sealUpload: any;
  isAdmin = 3;
  approvalStatus: number;

  sealForm = new FormGroup({
    FieldLeaderInitials: new FormControl(''),
    Year: new FormControl(''),
    Date: new FormControl(''),
    Loc: new FormControl(''),
    Sex: new FormControl(''),
    Age: new FormControl(''),
    Pup: new FormControl(''),
    NewMark1: new FormControl(''),
    Mark1: new FormControl(''),
    Mark1Pos: new FormControl(''),
    NewMark2: new FormControl(''),
    Mark2: new FormControl(''),
    Mark2Pos: new FormControl(''),
    NewTag1: new FormControl(''),
    Tag1: new FormControl(''),
    Tag1Pos: new FormControl(''),
    NewTag2: new FormControl(''),
    Tag2: new FormControl(''),
    Tag2Pos: new FormControl(''),
    Molt: new FormControl(''),
    Season: new FormControl(''),
    stLength: new FormControl(''),
    crvLength: new FormControl(''),
    axGirth: new FormControl(''),
    Mass: new FormControl(''),
    Tare: new FormControl(''),
    massTare: new FormControl(''),
    lastSeenP: new FormControl(''),
    fstWeen: new FormControl(''),
    Range: new FormControl(''),
    Comments: new FormControl(''),
    enterAno: new FormControl(''),

  });

  FLASK_API_SERVER = "http://127.0.0.1:5000";

  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    console.log(file);
    this.fileName = file.name;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file
      // console.log(csv)
      this.papa.parse(csv, {
        skipEmptyLines: true,
        header: true,
        complete: (results) => {
          console.log(results.data);
          var strjson = JSON.stringify(results.data);
          var tmp = [results.data, {"isApproved" : 0}];
          // console.log(tmp);
          this.apiService.addObservations(JSON.stringify(tmp)).subscribe(() => this.apiService.readObs());
        }
      });
    }
  }

  onSubmit() {

    if(this.isAdmin >= 2) {
      this.approvalStatus = 0;
    } 
    else if(this.isAdmin ==1) {
      this.approvalStatus = 1;
    } 
    else {
      alert('you dont have priveleges');
      return;
    }

    this.sealUpload = [[{"Field Leader Initials": this.sealForm.value.FieldLeaderInitials, "Year": this.sealForm.value.Year,
                        "Date": this.sealForm.value.Date, "Loc.": this.sealForm.value.Loc, "Sex": this.sealForm.value.Sex,
                        "Age": this.sealForm.value.Age, "Pup?": this.sealForm.value.Pup, "New Mark 1?": this.sealForm.value.NewMark1,
                        "Mark 1": this.sealForm.value.Mark1, "Mark 1 Position": this.sealForm.value.Mark1Pos, "New Mark 2?": this.sealForm.value.NewMark2,
                        "Mark 2": this.sealForm.value.NewMark2, "Mark 2 Position": this.sealForm.value.Mark2Pos, "New Tag1?": this.sealForm.value.NewTag1,
                        "Tag1 #": this.sealForm.value.Tag1, "Tag 1 Pos.": this.sealForm.value.Tag1Pos, "New Tag2?": this.sealForm.value.NewTag2,
                        "Tag2 #": this.sealForm.value.Tag2, "Tag 2 Pos.": this.sealForm.value.Tag2Pos, "Molt (%)": this.sealForm.value.Molt,
                        "Season": this.sealForm.value.Season, "St. Length": this.sealForm.value.stLength, "Crv. Length": this.sealForm.value.crvLength,
                        "Ax. Girth": this.sealForm.value.axGirth, "Mass": this.sealForm.value.Mass, "Tare": this.sealForm.value.Tare,
                        "Mass-Tare": this.sealForm.value.massTare, "Last seen as P": this.sealForm.value.lastSeenP, "1st seen as W": this.sealForm.value.fstWeen,
                        "Range (days)": this.sealForm.value.Range, "Comments": this.sealForm.value.Comments, "Entered in Ano": this.sealForm.value.enterAno}],
                        {"isApproved": this.approvalStatus}];

    this.apiService.addObservations(JSON.stringify(this.sealUpload)).subscribe(() => this.apiService.readObs());
  }
}
