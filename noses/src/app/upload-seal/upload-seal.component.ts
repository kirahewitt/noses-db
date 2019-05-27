import { Component, OnInit } from '@angular/core';
import { Papa} from 'ngx-papaparse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SimpleUser } from '../simpleUser';
import { FlaskBackendService } from '../flask-backend.service';

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

  url = `http://httpbin.org/post`;
  FLASK_API_SERVER = "http://127.0.0.1:5000";

  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file
      console.log(csv)
      this.papa.parse(csv, {
        skipEmptyLines: true,
        header: true,
        complete: (results) => {
          //console.log(JSON.stringify(results.data));
          // this.user = {name: 'raquel', email: 'mail', pwd: '111'};
          //const user: SimpleUser = {name: 'raquel', email: 'mail', pwd: '111'};

          // console.log(this.user);
          //console.log(user);

          this.apiService.addUser(JSON.stringify(results.data)).subscribe(() => this.apiService.readObs());
        }
      });
    }
  }

  ConvertCSVtoJSON() {
    // let csvData = '"Hello","World!"';
    // this.papa.parse(csvData, {
    //   complete: (results) => {
    //     console.log('Parsed  : ', results.data[0][1]);
    //     // console.log(results.data.length);
    //   }
    // });
  }
}
