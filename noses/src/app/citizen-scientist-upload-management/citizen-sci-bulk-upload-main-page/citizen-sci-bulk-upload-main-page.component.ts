import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-citizen-sci-bulk-upload-main-page',
  templateUrl: './citizen-sci-bulk-upload-main-page.component.html',
  styleUrls: ['./citizen-sci-bulk-upload-main-page.component.scss']
})
export class CitizenSciBulkUploadMainPageComponent implements OnInit {

  private fileName: string = "No File Selected"
  private fileData: any[];


  constructor(private papa: Papa) { }

  ngOnInit() {
  }


  /**
   * 
   * @param event 
   */
  public handleFileSelect(event) {
    var files = event.target.files; // FileList object
    var file = files[0];
    this.fileName = file.name;

    console.log(file);

    var reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file
      
      this.papa.parse(csv, {
        skipEmptyLines: true,
        header: true,
        complete: (results) => {
          this.fileData = [results.data, {"isApproved" : 0}];
        }
      });
    }
  }

}
