import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { SpreadsheetTuple, TupleProcessingError } from '../../_supporting_classes/SpreadsheetTuple';

// imports that will let us use modal windows
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModalSingleObservationComponent } from '../../form-modal-single-observation/form-modal-single-observation.component';


/**
 * -------------------------------------------------------------------------------------
 * Interface for the datatype that represents what our JSON object looks like after
 *  using papa.parse to convert the csv to a json object.
 * -------------------------------------------------------------------------------------
 */
interface TupleJSON {

}


/**
 * -------------------------------------------------------------------------------------
 * Need to figure out a way to make these be in ONE file only.
 * -------------------------------------------------------------------------------------
 */
var jsonName_fieldLeaderInitials = "Field Leader Initials";
var jsonName_year = "Year";
var jsonName_dateOfRecording = "Date";
var jsonName_locationCode = "Loc.";
var jsonName_sealSex = "Sex";
var jsonName_sealAgeCode = "Age";
var jsonName_sealHasPupQuantity = "Pup?";
var jsonName_mark1_isNew = "New Mark 1?";
var jsonName_mark1_idValue = "Mark 1";
var jsonName_mark1_positionCode = "Mark 1 Position";

var jsonName_mark2_isNew = "New Mark 2?";
var jsonName_mark2_idValue = "Mark 2";
var jsonName_mark2_positionCode = "Mark 2 Position";

var jsonName_tag1_isNew = "New Tag1?";
var jsonName_tag1_idValue = "Tag1 #"
var jsonName_tag1_positionCode = "Tag 1 Pos."

var jsonName_tag2_isNew = "New Tag2?";
var jsonName_tag2_idValue = "Tag2 #"
var jsonName_tag2_positionCode = "Tag 2 Pos."

var jsonName_sealMoltPercentage = "Molt (%)";
var jsonName_currentSeason = "Season";
var jsonName_sealStandardLength =  "St. Length";
var jsonName_sealCurvilinearLength = "Crv. Length";
var jsonName_sealAuxiliaryGirth = "Ax. Girth";
var jsonName_sealMass = "Mass";
var jsonName_sealTare = "Tare";
var jsonName_sealMassTare = "Mass-Tare";
var jsonName_sealLastSeenAsPupDate = "Last seen as P";
var jsonName_sealFirstSeenAsWeaner = "1st seen as W";
var jsonName_weanDateRange = "Range (days)";
var jsonName_comments = "Comments";
var jsonName_observationEnteredInAno = "Entered in Ano";





/**
 * ------------------------------------------------------------------------------------------------
 * 
 * ------------------------------------------------------------------------------------------------
 */
@Component({
  selector: 'app-citizen-sci-bulk-upload-main-page',
  templateUrl: './citizen-sci-bulk-upload-main-page.component.html',
  styleUrls: ['./citizen-sci-bulk-upload-main-page.component.scss']
})
export class CitizenSciBulkUploadMainPageComponent implements OnInit {

  private fileName: string = "No File Selected"
  private fileData: any[];
  public observationTuples : SpreadsheetTuple[];


  constructor(private papa: Papa, private modalService: NgbModal) { }

  ngOnInit() {
  }

  /**
   * -------------------------------------------------------------------------------------
   * 
   * -------------------------------------------------------------------------------------
   */
  openFormModal() {
    const modalRef = this.modalService.open(FormModalSingleObservationComponent);
    
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }


  /**
   * -------------------------------------------------------------------------------------
   * @param event 
   * -------------------------------------------------------------------------------------
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
          //this.fileData = [results.data, {"isApproved" : 0}];
          this.fileData = results.data;
          
          // console.log("\nWithin Papa-parse: ");
          // console.log(this.fileData);
          // console.log(this.fileData)


          // console.log("\nBELOW IS THE RESULT OF CONVERTING THE JSON TO A Map OBJECT:");
          let jsonString = JSON.stringify(this.fileData);
          // console.log(jsonString);

          // let jsonString_parsed = JSON.parse(jsonString);
          // console.log(jsonString_parsed);

          // console.log(new Map(jsonString_parsed));

          this.observationTuples = this.processSpreadsheetFile(this.fileData);

        }
      });
    }
  }


  /**
   * -------------------------------------------------------------------------------------
   * Receives an object representing the csv file as json. For each element of the list, 
   * it calls the constructor of the SpreadsheetTuple object.
   * @param fileData 
   * -------------------------------------------------------------------------------------
   */
  processSpreadsheetFile(fileTupleList: any[]): SpreadsheetTuple[] {
    var tupleList: SpreadsheetTuple[] = [];

    // console.log("\nWITHIN processSpreadsheetFile - fileTupleList:");
    // console.log(fileTupleList);

    for (var tuple of fileTupleList) {
      var newTupleObj = new SpreadsheetTuple(tuple);
      this.validateTupleData(newTupleObj)
      tupleList.push(newTupleObj);
    }

    // console.log("\nGenerated tuple list as object:");
    // console.log(tupleList)

    return tupleList;
  }


  /**
   * -------------------------------------------------------------------------------------
   * @param tuple 
   * -------------------------------------------------------------------------------------
   */
  validateTupleData(tuple : SpreadsheetTuple) {
    let jsonInput = tuple.originalJsonInput;

    // console.log("\nVALIDATING TUPLE DATA...");
    // console.log("  jsonInput: ");
    // console.log(jsonInput);

    let objAsListOfEntries: [string, string][] = Object.entries(jsonInput);
    // console.log("list of entries (attributes):");
    // console.log(objAsListOfEntries);

    var i = 0;
    for (var field of Object.entries(jsonInput) ) {
      let KEY = 0;
      let VALUE = 1;

      // console.log("\nProcessing field #" + i);
      // console.log(field);

      let valueAsString: string = field[VALUE] as string;

        // console.log("    field key:   " + field[KEY]);
        // console.log("    field value: " + field[VALUE]);
        

      if (field[KEY] == jsonName_fieldLeaderInitials) {
        
        

        let fieldLeaders : string = field[VALUE] as string;
        let fieldLeaderList = fieldLeaders.split(" ");
        tuple.fieldLeaderList = fieldLeaderList;

        // we have a string like "ABC" or "ABC, DEF, ..., XYZ"
        // verify each one of those strings is an existing field leader.
        // if not, error

        // if we receive a field leader which does not yet exist, record an error for this field.

      }

      else if (field[KEY] == jsonName_year) {
        // verify they gave us an integer
        let value = parseInt(valueAsString);

        if (value == NaN) {
          var error = new TupleProcessingError(jsonName_year, "Error: received non-integer value for year");
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.year = value;
        }
      }

      else if (field[KEY] == jsonName_dateOfRecording) {
        // verify you can convert to a Date object
        try {
          var value: Date = new Date(valueAsString);  
          tuple.dateOfRecording = value;
        }
        catch (error) {
          var error = new TupleProcessingError(jsonName_dateOfRecording, "Error: something that wasn't a date (MM/DD/YYYY)");
          tuple.processingErrorList.push(error);
        }
      }

      else if (field[KEY] == jsonName_locationCode) {
        // verify they gave us a location code that already exists ()
        // var value
        // for now, trust
        tuple.locationCode = valueAsString;
      }

      else if (field[KEY] == jsonName_sealSex) {
        // verify the value is either 'M' or 'F'
        let value = valueAsString;
        
        if (value != "M" && value != "F") {
          var error = new TupleProcessingError(jsonName_sealSex, "Error: received value for seal gender that wasn't M or F: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.sealSex = value;
        }
      }

      else if (field[KEY] == jsonName_sealAgeCode) {
        // verify the value is one of the valid age codes
        //    "pup", "weanling", "juvenile", "adult female", "SA1"..."SA4", "adult male"
        let acceptableValueList = ["P", "W", "J", "SA1", "SA2", "SA3", "SA4", "A"]

        if ((acceptableValueList.indexOf(valueAsString) > -1) == false) {
          var error = new TupleProcessingError(jsonName_sealAgeCode, "Error: received invalid age code: " + valueAsString);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.sealAgeCode = valueAsString;
        }

        // if adult female --> verify the sex is also female
        // if adult male   --> verify the sex is also male
        // if pup          --> verify the sealIsPup is set to true
      }

      else if (field[KEY] == jsonName_sealHasPupQuantity) {
        // verify its either True or False
        // verify the age class is also set to pup.
        let value = parseInt(valueAsString);
        
        if (value == NaN) {
          var error = new TupleProcessingError(jsonName_sealHasPupQuantity, "Error: received non-integer value for number of pups suffered by this parent. Intead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.sealHasPupQuantity = value;
        }
      }

      else if (field[KEY] == jsonName_mark1_isNew) {
        // true or false
        let value = valueAsString;

        if (value != "Y" && value != "N" && value != "") {
          var error = new TupleProcessingError(jsonName_mark1_isNew, "Error: expected Y or N. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.mark1_isNew = (value == "Y")
        }
      }

      else if (field[KEY] == jsonName_mark1_idValue) {
        // really could be anything
        tuple.mark1_idValue = valueAsString;
      }

      else if (field[KEY] == jsonName_mark1_positionCode) {
        // aka the STAMP
        // verify composed of one of the valid positions: "L" "R" "B"
        let regexMatcher = /[L]*[R]*[B]*/gm;
        let value = valueAsString;
        if (value.match(regexMatcher)) {
          tuple.mark1_positionCode = value;
        }
        else {
          if (value != "") {
            var error = new TupleProcessingError(jsonName_mark1_positionCode, "Error: expected something in the set [LRB LR RB LB L R B]. Instead: " + value);
            tuple.processingErrorList.push(error);
          }
          else {
            tuple.mark1_positionCode = null;
          }
        }
      }

      else if (field[KEY] == jsonName_mark2_isNew) {
        // verify either "Y" or "N"
        let value = valueAsString;
        if (value != "Y" && value != "N" && value != "") {
          var error = new TupleProcessingError(jsonName_mark2_isNew, "Error: expected Y or N. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.mark2_isNew = (value == "Y");
        }
      }

      else if (field[KEY] == jsonName_mark2_idValue) {
        // really could be anything
        tuple.mark2_idValue = valueAsString;
      }

      else if (field[KEY] == jsonName_mark2_positionCode) {
        // aka the STAMP (can be stamped multiple times)
        // verify composed of one or more of the valid positions: "L" "R" "B"
        let regexMatcher = /[L]*[R]*[B]*/gm;
        let value = valueAsString;
        if (value.match(regexMatcher)) {
          tuple.mark2_positionCode = value;
        }
        else {

          if (value != "") {
            var error = new TupleProcessingError(jsonName_mark2_positionCode, "Error: expected something in the set [LRB LR RB LB L R B]. Instead: " + value);
            tuple.processingErrorList.push(error);
          }
          else {
            tuple.mark2_positionCode = null;
          }
          
        }
      }

      else if (field[KEY] == jsonName_tag1_isNew) {
        // verify either "Y" or "N"
        let value = valueAsString;

        if (value != "Y" && value != "N" && value != "") {
          var error = new TupleProcessingError(jsonName_tag1_isNew, "Error: expected Y or N. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.tag1_isNew = (value == "Y");
        }
      }

      else if (field[KEY] == jsonName_tag1_idValue) {
        // anything
        tuple.tag1_idValue = valueAsString;
      }

      else if (field[KEY] == jsonName_tag1_positionCode) {
        // 3 parts
        //    Flipper side       - "L" or "R"
        //    Flipper Location   - "1" "2" "3" "4"
        //    Spike Orientation  - "so" "si"
        let positionCodeRegex = /([LR][1234]-(so|si))/gm;
        let value = valueAsString;
        if (value.match(positionCodeRegex)) {
          tuple.tag1_positionCode = value;
        }
        else {
          if (value != "") {
            var error = new TupleProcessingError(jsonName_tag1_positionCode, "Error: expected something in the set [L1-so L1-si L2-so L2-si L3-so L3-si L4-so L4-si R1-so R1-si R2-so R2-si R3-so R3-si R4-so R4-si]. Instead: " + value);
            tuple.processingErrorList.push(error);
          }
          else {
            tuple.tag1_positionCode = null;
          }
          
        }
      }

      else if (field[KEY] == jsonName_tag2_isNew) {
        // Y or N
        let value = valueAsString;

        if (value != "Y" && value != "N" && value != "") {
          var error = new TupleProcessingError(jsonName_tag2_isNew, "Error: expected Y or N. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.tag2_isNew = (value == "Y");
        }
      }

      else if (field[KEY] == jsonName_tag2_idValue) {
        // anything
        tuple.tag2_idValue = valueAsString;
      }

      else if (field[KEY] == jsonName_tag2_positionCode) {
        // 3 parts
        //    Flipper side       - "L" or "R"
        //    Flipper Location   - "1" "2" "3" "4"
        //    Spike Orientation  - "so" "si"
        // L1-so L1-si L2-so L2-si L3-so L3-si L4-so L4-si 
        // R1-so R1-si R2-so R2-si R3-so R3-si R4-so R4-si
        // regex: "/ ([LR][1234]-(so|si)) /gm"
        let positionCodeRegex = /([LR][1234]-(so|si))/gm;
        let value = valueAsString;

        if (value.match(positionCodeRegex)) {
          tuple.tag2_positionCode = value;
        }
        else {
          

          if (value != "") {
            var error = new TupleProcessingError(jsonName_tag2_positionCode, "Error: expected something in the set [L1-so L1-si L2-so L2-si L3-so L3-si L4-so L4-si R1-so R1-si R2-so R2-si R3-so R3-si R4-so R4-si]. Instead: " + value);
            tuple.processingErrorList.push(error);
          }
          else {
            tuple.tag2_positionCode = null;
          }
        }
      }

      // / \b\d{1,3}\b[%]* /gm

        // Either:
        //    Floating point value between 0 and 1
        //    Number between 0 and 100
        
        // conditions

        //    integer 1-3 chars w/%
      else if (field[KEY] == jsonName_sealMoltPercentage) {        
        if (valueAsString.match(/\b\d{1,3}[%]\b/gm)) {
          let strlength = valueAsString.length;

          try {

            
            let value = parseInt(valueAsString.substr(0, strlength - 1));
          
            if (value < 0 || value > 100) {  
              var error = new TupleProcessingError(jsonName_sealMoltPercentage, "Error: not between 0 and 100. expected an integer value 1-3 digits, between 0 and 100, w or w/o % sign. Instead: " + value);
              tuple.processingErrorList.push(error);
            }
            else {
              tuple.sealMoltPercentage = value;
            }
            
          }
          catch (error) {
            var error = new TupleProcessingError(jsonName_sealMoltPercentage, "Error: not between 0 and 100. expected an integer value 1-3 digits, between 0 and 100, w or w/o % sign. Instead: " + valueAsString);
            tuple.processingErrorList.push(error);
          }
          

          

        }

        //    integer 1-3 chars w/o %
        else if (valueAsString.match(/\b\d{1,3}\b/gm)) {
          let value = parseInt(valueAsString);

          if (value < 0 || value > 100) {
            var error = new TupleProcessingError(jsonName_sealMoltPercentage, "Error: not between 0 and 100. expected an integer value 1-3 digits, between 0 and 100, w or w/o % sign. Instead: " + value);
            tuple.processingErrorList.push(error);
          }
          else {
            tuple.sealMoltPercentage = value;
          }
        }

        // can be left blank
        else if (valueAsString == "") {
          tuple.sealMoltPercentage = null;
        }

        //    anything else is an ERROR
        else {

          var error = new TupleProcessingError(jsonName_sealMoltPercentage, "Error: expected an integer value 1-3 digits, between 0 and 100, w or w/o % sign. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
      }

      else if (field[KEY] == jsonName_currentSeason) {
        // Gotta be for the current season or some season in the past
        tuple.currentSeason = valueAsString;

      }

      else if (field[KEY] == jsonName_sealStandardLength) {
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        tuple.sealStandardLength = parseFloat(valueAsString);
      }

      else if (field[KEY] == jsonName_sealCurvilinearLength) {
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        tuple.sealCurvilinearLength = parseFloat(valueAsString);
      }

      else if (field[KEY] == jsonName_sealAuxiliaryGirth) {
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        tuple.sealAuxiliaryGirth = parseFloat(valueAsString);
      }

      else if (field[KEY] == jsonName_sealMass) {
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        tuple.sealMass = parseFloat(valueAsString);
      }

      else if (field[KEY] == jsonName_sealTare) {  
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        tuple.sealTare = parseFloat(valueAsString);
      }

      else if (field[KEY] == jsonName_sealMassTare) {
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        tuple.sealMassTare = parseFloat(valueAsString);
      }

      else if (field[KEY] == jsonName_sealLastSeenAsPupDate) {
        // for now just require that it work nicely with Javascript Date constructor
        try {
          var value: Date = new Date(valueAsString);  
          tuple.sealLastSeenAsPupDate = value;
        }
        catch (error) {
          var error = new TupleProcessingError(jsonName_sealLastSeenAsPupDate, "Error: something that wasn't a date (MM/DD/YYYY). received: " + valueAsString);
          tuple.processingErrorList.push(error);
        }
      }

      else if (field[KEY] == jsonName_sealFirstSeenAsWeaner) {
        try {
          var value: Date = new Date(valueAsString);  
          tuple.sealFirstSeenAsWeaner = value;
        }
        catch (error) {
          var error = new TupleProcessingError(jsonName_sealFirstSeenAsWeaner, "Error: something that wasn't a date (MM/DD/YYYY). received: " + valueAsString);
          tuple.processingErrorList.push(error);
        }
      }

      else if (field[KEY] == jsonName_weanDateRange) {
        // should be an integer... (maybe we let them use floats if they really want to?)
        // sould be the difference in days between seal-LSAP and seal-FSAW

        
        // first check regex for an integer. 
        let value = parseInt(valueAsString);
        tuple.weanDateRange = value;

        //then check that it is equal to the difference of the other two fields
        // (AT THE VERY END, OUTSIDE THE IF CONDITIONS)
      }

      else if (field[KEY] == jsonName_comments) {
        // literally anything
        tuple.comments = valueAsString;
      }

      else if (field[KEY] == jsonName_observationEnteredInAno) {
        // WHAT THE HECK IS THIS FIELD FOR?????
        let value = valueAsString;

        if (value != "Y" && value != "N" && value != "") {
          var error = new TupleProcessingError(jsonName_observationEnteredInAno, "Error: expected Y or N. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.observationEnteredInAno = (value == "Y");
        }
      }

      else {
        // somehow we received a field that wasn't in our known list of fields
        console.log("ERROR: NO MATCH");
        var error = new TupleProcessingError(field[KEY] as string, "Error: expected Y or N. Instead: " + value);
        tuple.processingErrorList.push(error);
      }
    }

  }

}
