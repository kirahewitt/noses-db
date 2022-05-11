import { ParentTuple } from "./ParentTuple";
import { StagedObservations } from "./StagedObservation";

/**
 * A tuple processing error instance is used to indicate when there is a problem with the 
 * value supplied for a particular attribute of a tuple. 
 */
 export class TupleProcessingError {
  attributeName : string;
  errorMessage: string;


  constructor(attributeName : string, msg : string) {
    this.attributeName = attributeName;
    this.errorMessage = msg;
  }
}

/**
 * A tuple processing error instance is used to indicate when there is a problem with the 
 * value supplied for a particular attribute of a tuple. 
 */
 export class TupleProcessingFatal {
  attributeName : string;
  errorMessage: string;


  constructor(attributeName : string, msg : string) {
    this.attributeName = attributeName;
    this.errorMessage = msg;
  }
}

/*
 * Users who submit bulk uploads receive a pre-formatted spreadsheet with fields for the various criteria
 *  of their observations.
 * 
 * The fields on the spreadsheets received by the citizen scientists do not need to be the
 *  same as the fields on the spreadsheets received by researchers. For instance, citizen 
 *  scientists won't be taking measurements of Seals, so they don't need measurement fields.
 *  However, they are included for the sake of simplicity.
 * 
 * We need to record not only the data, but also the invalid inputs. That means we need to be able to
 *  store the original value placed in the file. Thus, each field will have an rawValue and a validatedValue
 *  
 */
export class BacklogSpreadsheetTuple extends ParentTuple {

  // other bookkeeping
  dateOfRecording : string;

  // seal attributes
  sealHasPup : string;

  // Measurements
  sealMoltPercentage : string;
  sealStandardLength : string;
  sealCurvilinearLength : string;
  sealAxillaryGirth : string;
  sealMass : string;
  sealTare : string;
  sealMassMinusTare : string;

  // other
  sealLastSeenAsPupDate : string; // date-LSAP
  sealFirstSeenAsWeaner : string; // date-FSAW
  weanDateRange : string; // difference (in days) between date-FSAW and date-LSAP

  processingErrorList : TupleProcessingError[]; // records whether the data provided for each of the fields is valid.

  fatalErrorList: TupleProcessingFatal[];

  /**
   * 
   * @param tupleAsJson : A json object that represents a spreadsheet with columns named according to the types listed above.
   */
  constructor(tupleAsJson : any) {
    super(tupleAsJson);

    //Initialize the entire object to blank attributes
    this.dateOfRecording = "";
    this.sealHasPup = "";
    
    this.sealMoltPercentage = "";
    this.sealStandardLength = "";
    this.sealCurvilinearLength = "";
    this.sealAxillaryGirth = "";
    this.sealMass = "";
    this.sealTare = "";
    this.sealMassMinusTare = "";

    this.sealLastSeenAsPupDate = "";
    this.sealFirstSeenAsWeaner = "";
    this.weanDateRange = "";

    this.processingErrorList = [];
    this.fatalErrorList = []

    if (tupleAsJson != null) {
      // the json field
      let dataSourceAsString : string = JSON.stringify(tupleAsJson);
      let definitelyAnewDataSource : any = JSON.parse(dataSourceAsString);
      this.originalJsonInput = definitelyAnewDataSource;
    }
    else {
      this.originalJsonInput = "";
    }
    
  }
    

  // }

  /**
   * We need this function to perform a deep copy. These classes have three kinds of
   *  data so it needs to have three methods of copying.
   *     
   *     1. numbers                         - '=' operator
   *     2. string (primitive type)         - Object.assign("", source.desiredAttribute)
   *     3. lists/dates (complex objs)      - JSON.parse(JSON.stringify(source.desiredAttribute))
   * @param source 
   */
  public copy (source : BacklogSpreadsheetTuple) {
    super.copy(source)
    this.dateOfRecording = Object.assign("", source.dateOfRecording);
    this.sealHasPup = Object.assign("", source.sealHasPup);
    this.sealMoltPercentage = Object.assign("", source.sealMoltPercentage);
    this.sealStandardLength = Object.assign("", source.sealStandardLength);
    this.sealCurvilinearLength = Object.assign("", source.sealCurvilinearLength);
    this.sealAxillaryGirth = Object.assign("", source.sealAxillaryGirth);
    this.sealMass = Object.assign("", source.sealMass);
    this.sealTare = Object.assign("", source.sealTare);
    this.sealMassMinusTare = Object.assign("", source.sealMassMinusTare);
    this.sealLastSeenAsPupDate = Object.assign("", source.sealLastSeenAsPupDate);
    this.sealFirstSeenAsWeaner = Object.assign("", source.sealFirstSeenAsWeaner);
    this.weanDateRange = Object.assign("", source.weanDateRange);
  }

  public addFromStaged(source: StagedObservations) {
    this.fieldLeaderInitials = source.Initials;
    this.sealAgeCode = source.AgeClass;
    this.comments = source.Comments; //
    this.dateOfRecording = source.Date;
    this.locationCode = source.Location;
    this.sealSex = source.Sex;
    this.mark1_isNew = source.NewMark1;
    this.mark1_idValue = source.Mark1;
    this.mark1_positionCode = source.MarkPos1;
    this.mark2_isNew = source.NewMark2;
    this.mark2_idValue = source.Mark2;
    this.mark2_positionCode = source.MarkPos2;
    this.tag1_isNew = source.NewTag1;
    this.tag1_idValue = source.Tag1;
    this.tag1_positionCode = source.TagPos1;
    this.tag2_isNew = source.NewTag2;
    this.tag2_idValue = source.Tag2;
    this.tag2_positionCode = source.TagPos2;
    this.sealMoltPercentage = source.MoltPercent;
    this.sealHasPup = source.Pup;
    this.sealStandardLength = source.StLength;
    this.sealCurvilinearLength = source.CrvLength;
    this.sealAxillaryGirth = source.AxGirth;
    this.sealMass = source.Mass;
    this.sealTare = source.Tare;
    this.sealLastSeenAsPupDate = source.LastSeenP;
    this.sealFirstSeenAsWeaner = source.FirstSeenW;
  }
  
  /**
   * Creates an instance of this class to represent a json tuple. If there is an error while processing one
   *  of the fields, the error is placed in "processingErrorList".
   * 
   * This method requires that the originalJsonInput field be already filled in.
   * 
   * Can use a map to map a field name to one of the classes attribute names. and we can reference attributes
   *  by building a string and using that string for the attribute name.
   * 
   * Easiest way to do this is to store the original list, and then have all the above fields, and the map
   *
   * For each of the items in "jsonName_to_objectName_map", there is a jsonValue and an objectValue.
   * We want to:
   *     1. Determine which field we're looking at
   *     2. perform the appropriate processing for that field
   *     3. if processing == success --> assign it to the objectValue
   *     4. if processing == fail    --> record the failure in the processingErrorList
   */
   public validateTupleData() {
    let tuple : BacklogSpreadsheetTuple = this;
    let jsonInput = tuple.originalJsonInput;

    for (var field of Object.entries(jsonInput) ) {
      let KEY : number = 0;
      let VALUE : number = 1;
      let valueAsString: string = field[VALUE] as string;        
      console.log(valueAsString);

      // field leader initials
      if (field[KEY] == this.jsonName_fieldLeaderInitials) {
        tuple.fieldLeaderInitials = valueAsString;
        if (tuple.fieldLeaderInitials.length != 2) {
          var push_error = new TupleProcessingError(this.jsonName_dateOfRecording, "Initials: Not entered in AB format");
          tuple.processingErrorList.push(push_error);
        }
      }

      // date the observation was recorded
      else if (field[KEY] == this.jsonName_dateOfRecording) {
        tuple.dateOfRecording = valueAsString;
        try {
          var value: Date = new Date(valueAsString);  
        //   let calYear = value.getFullYear()
        //   let calMonth = value.getMonth()
        //   if (calMonth > 7) {
        //     calYear = calYear + 1
        //   }

        //   tuple.year = calYear
        //   tuple.currentSeason = calYear.toString()
          
        }
        catch (error) {
          var push_error = new TupleProcessingError(this.jsonName_dateOfRecording, "Date: something that wasn't a date (MM/DD/YYYY)" + error.toString());
          tuple.processingErrorList.push(push_error);
        }
      }

      // location code
      else if (field[KEY] == this.jsonName_locationCode) {
        // verify they gave us a location code that already exists ()
        // var value
        // for now, trust
        tuple.locationCode = valueAsString;
      }

      // sex of the seal the observation is about.. verify the value is either 'M' or 'F'
      else if (field[KEY] == this.jsonName_sealSex) {
        tuple.sealSex = valueAsString;
        
        if (tuple.sealSex != "M" && tuple.sealSex != "F") {
          var error = new TupleProcessingError(this.jsonName_sealSex, "Sex: received value for seal sex that wasn't M or F: " + tuple.sealSex);
          tuple.processingErrorList.push(error);
        }
      }

      // age code for the seal the observation is about. Valid age codes: "pup", "weanling", "juvenile", "adult female", "SA1"..."SA4", "adult male"
      // if adult female --> verify the sex is also female
      // if adult male   --> verify the sex is also male
      // if pup          --> verify the sealIsPup is set to true
      else if (field[KEY] == this.jsonName_sealAgeCode) { 
        let acceptableValueList = ["P", "W", "J", "SA1", "SA2", "SA3", "SA4", "A"]; //    

        if ((acceptableValueList.indexOf(valueAsString) > -1) == false) {
          let value = parseInt(valueAsString);

          if (value == NaN) {
            var error = new TupleProcessingError(this.jsonName_sealAgeCode, "Age: received invalid age code: " + valueAsString);
            tuple.processingErrorList.push(error);
          }
          else {
            tuple.sealAgeCode = valueAsString;
          }
        }
        else {
          tuple.sealAgeCode = valueAsString;
        }
      }


      // must be (Y/N)
      else if (field[KEY] == this.jsonName_mark1_isNew) {
        if (valueAsString == "") {
          valueAsString = "N"
        }
        tuple.mark1_isNew = valueAsString;

        if (valueAsString != "Y" && valueAsString != "N") {
          var error = new TupleProcessingError(this.jsonName_mark1_isNew, "New Mark 1: expected Y, N, or empty. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
      }


      // really could be anything
      else if (field[KEY] == this.jsonName_mark1_idValue) {
        tuple.mark1_idValue = valueAsString;
      }


      // aka the STAMP // verify composed of one of the valid positions: "L" "R" "B"
      else if (field[KEY] == this.jsonName_mark1_positionCode) {
        tuple.mark1_positionCode = valueAsString
        let regexMatcher = /[L]*[R]*[B]*/gm;
        if (valueAsString != "" && (!valueAsString.match(regexMatcher))) {
          var error = new TupleProcessingError(this.jsonName_mark1_positionCode, "Mark 1 Position: expected something in the set [LRB LR RB LB L R B]. Instead: " + value);
          tuple.processingErrorList.push(error);
          }
        }

      // mark 2 - indicates whether it is a newly placed mark
      else if (field[KEY] == this.jsonName_mark2_isNew) {
        if (valueAsString == "") {
          valueAsString = "N"
        }
        tuple.mark2_isNew = valueAsString;

        if (valueAsString != "Y" && valueAsString != "N") {
          var error = new TupleProcessingError(this.jsonName_mark1_isNew, "New Mark 2: expected Y, N, or empty. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
      }

      else if (field[KEY] == this.jsonName_mark2_idValue) {
        // really could be anything
        tuple.mark2_idValue = valueAsString;
      }

      else if (field[KEY] == this.jsonName_mark2_positionCode) {
        // aka the STAMP (can be stamped multiple times)
        // verify composed of one or more of the valid positions: "L" "R" "B"
        tuple.mark2_positionCode = valueAsString
        let regexMatcher = /[L]*[R]*[B]*/gm;
        if (valueAsString != "" && (!valueAsString.match(regexMatcher))) {
          var error = new TupleProcessingError(this.mark2_positionCode, "Mark 2 Position: expected something in the set [LRB LR RB LB L R B]. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
      }

      // verify either "Y" or "N"
      else if (field[KEY] == this.jsonName_tag1_isNew) {
        if (valueAsString == "") {
          valueAsString = "N"
        }
        tuple.tag1_isNew = valueAsString;

        if (valueAsString != "Y" && valueAsString != "N") {
          var error = new TupleProcessingError(this.tag1_isNew, "New Tag 1: expected Y, N, or empty. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
      }

      // anything
      else if (field[KEY] == this.jsonName_tag1_idValue) {
        tuple.tag1_idValue = valueAsString;
      }

      // 3 parts
        //    Flipper side       - "L" or "R"
        //    Flipper Location   - "1" "2" "3" "4"
        //    Spike Orientation  - "so" "si"
      else if (field[KEY] == this.jsonName_tag1_positionCode) {
        // let positionCodeRegex = /^([LR][1234]-(so|si))$/gm;
        // let value = valueAsString;

        // if (value.match(positionCodeRegex)) {
        //   tuple.tag1_positionCode = value;
        // }
        // else {
        //   if (value != "") {
        //     var error = new TupleProcessingError(jsonName_tag1_positionCode, "Error: expected something in the set [L1-so L1-si L2-so L2-si L3-so L3-si L4-so L4-si R1-so R1-si R2-so R2-si R3-so R3-si R4-so R4-si]. Instead: " + value);
        //     tuple.processingErrorList.push(error);
        //   }
        //   else {
        //     tuple.tag1_positionCode;
        //   }
        // }
        tuple.tag1_positionCode = valueAsString;
        // if (valueAsString.charAt(0) == 'L' || valueAsString.charAt(0) == 'R' || valueAsString == "") {
        //   tuple.tag1_positionCode = valueAsString;
        // }
        // else {
        //   var error = new TupleProcessingError(jsonName_tag1_positionCode, "Error: expected something in the set [L1-so L1-si L2-so L2-si L3-so L3-si L4-so L4-si R1-so R1-si R2-so R2-si R3-so R3-si R4-so R4-si]. Instead: " + value);
        //   tuple.processingErrorList.push(error);
        // }
      }

      // Y or N
      else if (field[KEY] == this.jsonName_tag2_isNew) {
        
        let value = valueAsString;

        if (value != "Y" && value != "N" && value != "") {
          var error = new TupleProcessingError(this.jsonName_tag2_isNew, "New Tag 2: expected Y or N. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.tag2_isNew = value;
        }
      }

      // anything
      else if (field[KEY] == this.jsonName_tag2_idValue) {
        tuple.tag2_idValue = valueAsString;
      }

      // 3 parts
      //    Flipper side       - "L" or "R"
      //    Flipper Location   - "1" "2" "3" "4"
      //    Spike Orientation  - "so" "si"
      // L1-so L1-si L2-so L2-si L3-so L3-si L4-so L4-si 
      // R1-so R1-si R2-so R2-si R3-so R3-si R4-so R4-si
      // regex: "/ ([LR][1234]-(so|si)) /gm"
      else if (field[KEY] == this.jsonName_tag2_positionCode) {
        
        // let positionCodeRegex = /([LR][1234]-(so|si))/gm;
        // let value = valueAsString;

        // if (value.match(positionCodeRegex)) {
        //   tuple.tag2_positionCode = value;
        // }
        // else {
        //   if (value != "") {
        //     var error = new TupleProcessingError(jsonName_tag2_positionCode, "Error: expected something in the set [L1-so L1-si L2-so L2-si L3-so L3-si L4-so L4-si R1-so R1-si R2-so R2-si R3-so R3-si R4-so R4-si]. Instead: " + value);
        //     tuple.processingErrorList.push(error);
        //   }
        //   else {
        //     tuple.tag2_positionCode;
        //   }
        // }
        tuple.tag2_positionCode = valueAsString;
        // if (valueAsString.charAt(0) == 'L' || valueAsString.charAt(0) == 'R' || valueAsString == "") {
        //   tuple.tag2_positionCode = valueAsString;
        // }
        // else {
        //   var error = new TupleProcessingError(jsonName_tag2_positionCode, "Error: expected something in the set [L1-so L1-si L2-so L2-si L3-so L3-si L4-so L4-si R1-so R1-si R2-so R2-si R3-so R3-si R4-so R4-si]. Instead: " + value);
        //   tuple.processingErrorList.push(error);
        // }
      }

      // / \b\d{1,3}\b[%]* /gm
      // conditions
      //    integer 1-3 chars w/% or w/o%
      //    ""
      else if (field[KEY] == this.jsonName_sealMoltPercentage) {        
        
          // integer 1-3 characters w/ %
          tuple.sealMoltPercentage = valueAsString
          if (valueAsString.match(/\b\d{1,3}[%]\b/gm)) {
            let strlength = valueAsString.length;
            try {
              let value = parseInt(valueAsString.slice(0, strlength - 1));
              if (value < 0 || value > 100) {  
                var error = new TupleProcessingError(this.jsonName_sealMoltPercentage, "Molt Percentage: not between 0 and 100. expected an integer value 1-3 digits, between 0 and 100, w or w/o % sign. Instead: " + value);
                tuple.processingErrorList.push(error);
                //tuple.sealMoltPercentage = null;
              }
            }
            catch (error) {
              var error = new TupleProcessingError(this.jsonName_sealMoltPercentage, "Molt Percentage: not between 0 and 100. expected an integer value 1-3 digits, between 0 and 100, w or w/o % sign. Instead: " + valueAsString);
              tuple.processingErrorList.push(error);
            }
          }

          //    integer 1-3 chars w/o %
          else if (valueAsString.match(/\b\d{1,3}\b/gm)) {
            let value = parseInt(valueAsString);
            if (value < 0 || value > 100) {
              var error = new TupleProcessingError(this.jsonName_sealMoltPercentage, "Molt Percentage: not between 0 and 100. expected an integer value 1-3 digits, between 0 and 100, w or w/o % sign. Instead: " + value);
              tuple.processingErrorList.push(error);
            }
          }

          else if (valueAsString == "") {
            
          }

          // can be left blank
          // else if (valueAsString == "") {
          //   tuple.sealMoltPercentage;
          // }

          //    anything else is an ERROR
          else {
            var error = new TupleProcessingError(this.jsonName_sealMoltPercentage, "Molt Percentage: expected an integer value 1-3 digits, between 0 and 100, w or w/o % sign. Instead: " + value);
            tuple.processingErrorList.push(error);
          }
      }


      // for mother elephant seals, indicates the number of pups they are caring for
      else if (field[KEY] == this.jsonName_sealHasPupQuantity) {
        if (valueAsString == "") {
          valueAsString = "N"
        }
        tuple.sealHasPup = valueAsString;

        if (valueAsString != "Y" && valueAsString != "N") {
          var error = new TupleProcessingError(this.jsonName_sealHasPupQuantity, "Pup: expected Y, N, or empty. Instead: " + value);
          tuple.processingErrorList.push(error);
        }        
      }

      else if (field[KEY] == this.jsonName_sealStandardLength) {
        tuple.sealStandardLength = valueAsString;
        try {
          if (tuple.sealStandardLength != "") {
            var sealNum: Number = parseFloat(tuple.sealStandardLength);  
          }
        }
        catch (error) {
          var error = new TupleProcessingError(this.jsonName_sealStandardLength, "St. Length: expected number, or empty. Instead: " + value);
          tuple.processingErrorList.push(error);
        }  
      }

      else if (field[KEY] == this.jsonName_sealCurvilinearLength) {
        tuple.sealCurvilinearLength = valueAsString;
        try {
          if (tuple.sealCurvilinearLength != "") {
            var sealNum: Number = parseFloat(tuple.sealCurvilinearLength);  
          }
        }
        catch (error) {
          var error = new TupleProcessingError(this.jsonName_sealCurvilinearLength, "Crv. Length: expected number, or empty. Instead: " + value);
          tuple.processingErrorList.push(error);
        }  
      }

      else if (field[KEY] == this.jsonName_sealAxillaryGirth) {
        tuple.sealAxillaryGirth = valueAsString;
        try {
          if (tuple.sealAxillaryGirth != "") {
            var sealNum: Number = parseFloat(tuple.sealAxillaryGirth);  
          }
        }
        catch (error) {
          var error = new TupleProcessingError(this.jsonName_sealAxillaryGirth, "Ax. Girth: expected number, or empty. Instead: " + value);
          tuple.processingErrorList.push(error);
        }  
      }

      else if (field[KEY] == this.jsonName_sealMass) {
        tuple.sealMass = valueAsString;
        try {
          if (tuple.sealMass != "") {
            var sealNum: Number = parseFloat(tuple.sealMass);  
          }
        }
        catch (error) {
          var error = new TupleProcessingError(this.jsonName_sealMass, "Mass: expected number, or empty. Instead: " + value);
          tuple.processingErrorList.push(error);
        }  
      }

      else if (field[KEY] == this.jsonName_sealTare) {  
        tuple.sealTare = valueAsString;
        try {
          if (tuple.sealTare != "") {
            var sealNum: Number = parseFloat(tuple.sealTare);  
          }
        }
        catch (error) {
          var error = new TupleProcessingError(this.jsonName_sealTare, "Tare: expected number, or empty. Instead: " + value);
          tuple.processingErrorList.push(error);
        }  
      }

      else if (field[KEY] == this.jsonName_sealLastSeenAsPupDate) {
        // for now just require that it work nicely with Javascript Date constructor
        tuple.sealLastSeenAsPupDate = valueAsString;

        try {
          if (valueAsString != "") {
          var value: Date = new Date(valueAsString); 
          } 
        }
        catch (error) {
          var error = new TupleProcessingError(this.jsonName_sealLastSeenAsPupDate, "Last Seen as P: something that wasn't a date (MM/DD/YYYY). received: " + valueAsString);
          tuple.processingErrorList.push(error);
        }
      }

      else if (field[KEY] == this.jsonName_sealFirstSeenAsWeaner) {
        tuple.sealFirstSeenAsWeaner = valueAsString
        try {
          if (valueAsString != "") {
            var value: Date = new Date(valueAsString); 
            } 
          }
        catch (error) {
          var error = new TupleProcessingError(this.jsonName_sealFirstSeenAsWeaner, "First Seen as W: something that wasn't a date (MM/DD/YYYY). received: " + valueAsString);
          tuple.processingErrorList.push(error);
        }
      }

      else if (field[KEY] == (this.jsonName_weanDateRange)) {
      }

      else if (field[KEY] == (this.jsonName_comments)) {
        tuple.comments = valueAsString;
      }

      else if (field[KEY] == (this.jsonName_sealMassTare)) {
      }

      else {
        // somehow we received a field that wasn't in our known list of fields
        console.log("ERROR: NO MATCH");
        console.log(field[KEY]);
        var error = new TupleProcessingFatal(field[KEY] as string, "Error: expected known field. Instead: " + field[KEY] + " " + valueAsString);
        tuple.fatalErrorList.push(error);
      }
    }

  }

  public toJson() {

    var pupQuantityStr: string;
    var sealMoltPrcnt: string;
    var sealStdLen: string;
    var sealCurvLen: string;
    var sealAuxG: string;
    var sealMass: string;
    var sealTare: string;
    var sealMassTare: string;
    var sealLSAP: string;
    var sealFSAW: string;
    var weanRange: string;
    
    pupQuantityStr = (this.sealHasPup == null) ? "" : this.sealHasPup.toString();
    sealMoltPrcnt = (this.sealMoltPercentage == null) ? "" : this.sealMoltPercentage.toString();

    sealStdLen = (this.sealStandardLength == null) ? "" : this.sealStandardLength.toString();
    sealCurvLen = (this.sealCurvilinearLength == null) ? "" : this.sealCurvilinearLength.toString();
    sealAuxG = (this.sealAxillaryGirth == null) ? "" : this.sealAxillaryGirth.toString();
    sealMass = (this.sealMass == null) ? "" : this.sealMass.toString();
    sealTare = (this.sealTare == null) ? "" : this.sealTare.toString();
    sealMassTare = (this.sealMassMinusTare == null) ? "" : this.sealMassMinusTare.toString();
    sealLSAP = (this.sealLastSeenAsPupDate == null || this.sealLastSeenAsPupDate.toString() == "Invalid Date") ? "" : this.sealLastSeenAsPupDate;
    sealFSAW = (this.sealFirstSeenAsWeaner == null || this.sealFirstSeenAsWeaner.toString() == "Invalid Date") ? "" : this.sealFirstSeenAsWeaner;
    weanRange = (this.weanDateRange == null) ? "" : this.weanDateRange.toString();

    let result = {'Field Leader Initials' : this.fieldLeaderInitials,
                                "Date" : this.dateOfRecording,
                                "Loc." : this.locationCode,
                                "Sex" : this.sealSex,
                                "Age" : this.sealAgeCode,
                                "Pup?" : this.sealHasPup,
                                "New Mark 1?" : this.mark1_isNew,
                                "Mark 1" : this.mark1_idValue,
                                "Mark 1 Position" : this.mark1_positionCode,
                                "New Mark 2?" : this.mark2_isNew,
                                "Mark 2" : this.mark2_idValue,
                                "Mark 2 Position" : this.mark2_positionCode,
                                "New Tag1?" : this.tag1_isNew,
                                "Tag1 #" : this.tag1_idValue,
                                "Tag 1 Pos." : this.tag1_positionCode,
                                "New Tag2?": this.tag2_isNew,
                                "Tag2 #" : this.tag2_idValue,
                                "Tag 2 Pos." : this.tag2_positionCode,
                                "Molt (%)" : sealMoltPrcnt,
                                "St. Length" : sealStdLen,
                                "Crv. Length" : sealCurvLen,
                                "Ax. Girth" : sealAuxG,
                                "Mass" : this.sealMass,
                                "Tare" : sealTare,
                                "Last seen as P" : sealLSAP,
                                "1st seen as W" : sealFSAW,
                                "Comments" : this.comments
    }

    

    return result;
  }


}