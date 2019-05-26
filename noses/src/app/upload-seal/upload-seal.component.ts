import { Component, OnInit } from '@angular/core';
import { Papa} from 'ngx-papaparse';

@Component({
  selector: 'app-upload-seal',
  templateUrl: './upload-seal.component.html',
  styleUrls: ['./upload-seal.component.scss']
})
export class UploadSealComponent implements OnInit {

  constructor(private papa: Papa) {
  }

  ngOnInit() {
  }

  test = [];
  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file
      this.papa.parse(csv, {
        skipEmptyLines: true,
        header: true,
        complete: (results) => {
          for (let i = 0; i < results.data.length; i++) {
            let orderDetails = {
              order_id: results.data[i].Address,
              age: results.data[i].Age
            };
           this.test.push(orderDetails);
          }
          // console.log(this.test);
          console.log('Parsed: k', results.data);
        }
      });
    }
  }

  ConvertCSVtoJSON() {
    console.log(JSON.stringify(this.test));
    // let csvData = '"Hello","World!"';
    // this.papa.parse(csvData, {
    //   complete: (results) => {
    //     console.log('Parsed  : ', results.data[0][1]);
    //     // console.log(results.data.length);
    //   }
    // });
  }
}
