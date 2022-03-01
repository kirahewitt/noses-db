
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
 * List of variables that are the names of each of the columns in the spreadsheet submitted by the user.
 */
var jsonName_fieldLeaderInitials = "Initials";
var jsonName_dateOfRecording = "Date";
var jsonName_locationCode = "Loc.";
var jsonName_mark1_isNew = "New Mark 1?";
var jsonName_mark1_idValue = "Mark 1";
var jsonName_mark1_positionCode = "Mark 1 Position";

var jsonName_tag1_isNew = "New Tag1?";
var jsonName_tag1_idValue = "Tag1 #"
var jsonName_tag1_positionCode = "Tag1 Pos."

var jsonName_sealAgeCode = "Age";
var jsonName_sealSex = "Sex";
var jsonName_sealHasPupQuantity = "Pup?";

var jsonName_mark2_isNew = "New Mark 2?";
var jsonName_mark2_idValue = "Mark 2";
var jsonName_mark2_positionCode = "Mark 2 Position";

var jsonName_tag2_isNew = "New Tag2?";
var jsonName_tag2_idValue = "Tag2 #"
var jsonName_tag2_positionCode = "Tag2 Pos."

var jsonName_sealMoltPercentage = "Molt (%)";
var jsonName_sealStandardLength =  "St. Length";
var jsonName_sealCurvilinearLength = "Crv. Length";
var jsonName_sealAxillaryGirth = "Ax. Girth";
var jsonName_sealMass = "Mass";
var jsonName_sealTare = "Tare";
var jsonName_sealMassTare = "Mass-Tare";
var jsonName_sealLastSeenAsPupDate = "Last seen as P";
var jsonName_sealFirstSeenAsWeaner = "1st seen as W";
var jsonName_weanDateRange = "Range (days)";
var jsonName_comments = "Comments";
// var jsonName_year = "Year";
// var jsonName_currentSeason = "Season";



/**
 * Each of the above defined variables in a list.
 */
var SpreadsheetAttributeList = [jsonName_fieldLeaderInitials,
                                jsonName_dateOfRecording,
                                jsonName_locationCode,
                                jsonName_mark1_isNew,
                                jsonName_mark1_idValue,
                                jsonName_mark1_positionCode,
                                jsonName_tag1_isNew,
                                jsonName_tag1_idValue,
                                jsonName_tag1_positionCode,
                                jsonName_sealAgeCode,
                                jsonName_sealSex,
                                jsonName_sealHasPupQuantity,
                                jsonName_mark2_isNew,
                                jsonName_mark2_idValue,
                                jsonName_mark2_positionCode,
                                jsonName_tag2_isNew,
                                jsonName_tag2_idValue,
                                jsonName_tag2_positionCode,
                                jsonName_sealMoltPercentage,
                                jsonName_sealStandardLength,
                                jsonName_sealCurvilinearLength,
                                jsonName_sealAxillaryGirth,
                                jsonName_sealMass,
                                jsonName_sealTare,
                                jsonName_sealMassTare,
                                jsonName_sealLastSeenAsPupDate,
                                jsonName_sealFirstSeenAsWeaner,
                                jsonName_weanDateRange,
                                jsonName_comments
                                ]

/**
 * This list is actually a map of jsonNames to objectNames, which will make it easier
 */
var jsonName_to_objectName_map =  [ {jsonName: jsonName_fieldLeaderInitials, objectName: "fieldLeaderList"},
                                    {jsonName: jsonName_dateOfRecording, objectName: "dateOfRecording"},
                                    {jsonName: jsonName_locationCode, objectName: "locationCode"},
                                    {jsonName: jsonName_mark1_isNew, objectName: "mark1_isNew?"},
                                    {jsonName: jsonName_mark1_idValue, objectName: "mark1_idValue"},
                                    {jsonName: jsonName_mark1_positionCode, objectName: "mark1_positionCode"},
                                    {jsonName: jsonName_tag1_isNew, objectName: "tag1_isNew?"},
                                    {jsonName: jsonName_tag1_idValue, objectName: "tag1_idValue"},
                                    {jsonName: jsonName_tag1_positionCode, objectName: "tag1_positionCode"},
                                    {jsonName: jsonName_sealAgeCode, objectName: "sealAgeCode"},
                                    {jsonName: jsonName_sealSex, objectName: "sealSex"},
                                    {jsonName: jsonName_sealHasPupQuantity, objectName: "sealHasPupQuantity"},
                                    {jsonName: jsonName_mark2_isNew, objectName: "mark2_isNew?"},
                                    {jsonName: jsonName_mark2_idValue, objectName: "mark2_idValue"},
                                    {jsonName: jsonName_mark2_positionCode, objectName: "mark2_positionCode"},
                                    {jsonName: jsonName_tag2_isNew, objectName: "tag2_isNew?"},
                                    {jsonName: jsonName_tag2_idValue, objectName: "tag2_idValue"},
                                    {jsonName: jsonName_tag2_positionCode, objectName: "tag2_positionCode"},
                                    {jsonName: jsonName_sealMoltPercentage, objectName: "sealMoltPercentage"},
                                    {jsonName: jsonName_sealStandardLength, objectName: "sealStandardLength"},
                                    {jsonName: jsonName_sealCurvilinearLength, objectName: "sealCurvilinearLength"},
                                    {jsonName: jsonName_sealAxillaryGirth, objectName: "sealAxillaryGirth"},
                                    {jsonName: jsonName_sealMass, objectName: "sealMass"},
                                    {jsonName: jsonName_sealTare, objectName: "sealTare"},
                                    {jsonName: jsonName_sealMassTare, objectName: "sealMassTare"},
                                    {jsonName: jsonName_sealLastSeenAsPupDate, objectName: "sealLastSeenAsPupDate"},
                                    {jsonName: jsonName_sealFirstSeenAsWeaner, objectName: "sealFirstSeenAsWeaner"},
                                    {jsonName: jsonName_weanDateRange, objectName: "weanDateRangeange"},
                                    {jsonName: jsonName_comments, objectName: "comments"},
                                    
                                  ];

/**
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
export class SpreadsheetTuple {

  // the original json input used to construct an instance of this class
  originalJsonInput : any;

  // other bookkeeping
  fieldLeaderList : string;
  year : number;
  dateOfRecording : Date;
  locationCode : string;
  currentSeason : string;

  // seal attributes
  sealId : number;
  sealSex : string;
  sealAgeCode : string;
  sealHasPupQuantity : number;
  
  // marks
  mark1_idValue : string;
  mark1_isNew : string;
  mark1_positionCode : string;
  mark2_idValue : string;
  mark2_isNew : string;
  mark2_positionCode : string;

  // tags
  tag1_idValue : string;
  tag1_isNew : string;
  tag1_positionCode : string;
  tag2_idValue : string;
  tag2_isNew : string;
  tag2_positionCode : string;

  // Measurements
  sealMoltPercentage : number;
  sealStandardLength : number;
  sealStandardLength_units : string;
  sealCurvilinearLength : number;
  sealCurvilinearLength_units : string;
  sealAxillaryGirth : number;
  sealAxillaryGirth_units : string;
  sealMass : number;
  sealMass_units : string;
  sealTare : number;
  sealTare_units : string;
  sealMassTare : number;
  sealMassTare_units : string;

  // other
  sealLastSeenAsPupDate : Date; // date-LSAP
  sealFirstSeenAsWeaner : Date; // date-FSAW
  weanDateRange : number; // difference (in days) between date-FSAW and date-LSAP
  observationEnteredInAno : string; 
  comments : string;    
  isApproved : boolean; // always default false for citizens' observations
  processingErrorList : TupleProcessingError[]; // records whether the data provided for each of the fields is valid.

  isPup : boolean; // quick way of indicating it is a seal pup
  isProcedure : boolean; // used to indicate that this observation of the seal was part of a procedure performed upon the seal, like that of weighing.
  harem : number; // indicates the number of members in the individual's harem, if this particular individual is a bull.


  /**
   * 
   * @param tupleAsJson : A json object that represents a spreadsheet with columns named according to the types listed above.
   */
  constructor(tupleAsJson : any) {

    //Initialize the entire object to blank attributes
    this.originalJsonInput = null;
    this.fieldLeaderList = "";
    this.year = null;
    this.dateOfRecording = null;
    this.locationCode = "";
    this.currentSeason = "";
    this.sealSex = "";
    this.sealAgeCode = "";
    this.sealHasPupQuantity = null;
    this.mark1_idValue = "";
    this.mark1_isNew = "";
    this.mark1_positionCode = "";
    this.mark2_idValue = "";
    this.mark2_isNew = "";
    this.mark2_positionCode = "";

    this.tag1_idValue = "";
    this.tag1_isNew = "";
    this.tag1_positionCode = "";
    this.tag2_idValue = "";
    this.tag2_isNew = "";
    this.tag2_positionCode = "";
    
    this.sealMoltPercentage = null;

    this.processingErrorList = [];

    this.isPup = null;
    this.isProcedure = null;
    this.harem = null;

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
  public copy (source : SpreadsheetTuple) {
    this.comments = Object.assign("", source.comments);
    this.currentSeason = Object.assign("", source.currentSeason);
    this.dateOfRecording = JSON.parse(JSON.stringify(source.dateOfRecording));
    this.fieldLeaderList = Object.assign("", source.fieldLeaderList);
    this.isApproved = (source.isApproved == true);
    this.locationCode = Object.assign("", source.locationCode);
    this.mark1_idValue = Object.assign("", source.mark1_idValue);
    this.mark1_isNew = Object.assign("", source.mark1_isNew);
    this.mark1_positionCode = Object.assign("", source.mark1_positionCode);
    this.mark2_idValue = Object.assign("", source.mark2_idValue);
    this.mark2_isNew = Object.assign("", source.mark2_isNew);
    this.mark2_positionCode = Object.assign("", source.mark2_positionCode);
    this.originalJsonInput = JSON.parse(JSON.stringify(source.originalJsonInput));
    this.processingErrorList = JSON.parse(JSON.stringify(source.processingErrorList));
    this.sealAgeCode = Object.assign("", source.sealAgeCode);
    this.sealAxillaryGirth = source.sealAxillaryGirth;
    this.sealAxillaryGirth_units = Object.assign("", source.sealAxillaryGirth_units);
    this.sealCurvilinearLength = source.sealCurvilinearLength;
    this.sealCurvilinearLength_units = Object.assign("", source.sealCurvilinearLength_units);
    this.sealFirstSeenAsWeaner = JSON.parse(JSON.stringify(source.sealFirstSeenAsWeaner));
    this.sealHasPupQuantity = source.sealHasPupQuantity;
    this.sealLastSeenAsPupDate = JSON.parse(JSON.stringify(source.sealLastSeenAsPupDate));
    this.sealMass = source.sealMass;
    this.sealMassTare = source.sealMassTare;
    this.sealMassTare_units = Object.assign("", source.sealMassTare_units);
    this.sealMass_units = Object.assign("", source.sealMass_units);
    this.sealMoltPercentage = source.sealMoltPercentage;
    this.sealSex = Object.assign("", source.sealSex);
    this.sealStandardLength = source.sealStandardLength;
    this.sealStandardLength_units = Object.assign("", source.sealStandardLength_units);
    this.sealTare = source.sealTare;
    this.sealTare_units = Object.assign("", source.sealTare_units);
    this.tag1_idValue = Object.assign("", source.tag1_idValue);
    this.tag1_isNew = Object.assign("", source.tag1_isNew);
    this.tag1_positionCode = Object.assign("", source.tag1_positionCode);
    this.tag2_idValue = Object.assign("", source.tag2_idValue);
    this.tag2_isNew = Object.assign("", source.tag2_isNew);
    this.tag2_positionCode = Object.assign("", source.tag2_positionCode);
    this.weanDateRange = source.weanDateRange;
    this.year = source.year;
    this.isPup = source.isPup;
    this.isProcedure = source.isProcedure;
    this.harem = source.harem;
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
    let tuple : SpreadsheetTuple = this;
    let jsonInput = tuple.originalJsonInput;

    for (var field of Object.entries(jsonInput) ) {
      let KEY : number = 0;
      let VALUE : number = 1;
      let valueAsString: string = field[VALUE] as string;        

      // field leader initials
      if (field[KEY] == jsonName_fieldLeaderInitials) {
        let fieldLeaders : string = field[VALUE] as string;

        tuple.fieldLeaderList = fieldLeaders;

        // // delete commas by replacing any commas with ''
        // fieldLeaders = fieldLeaders.replace(/[,]/, '');
        // let fieldLeaderList = fieldLeaders.split(" ");
        
        // we have a string like "ABC" or "ABC, DEF, ..., XYZ"
        // verify each one of those strings is an existing field leader.
        // if not, error
        // if we receive a field leader which does not yet exist, record an error for this field.
      }

      // date the observation was recorded
      else if (field[KEY] == jsonName_dateOfRecording) {
        try {
          var value: Date = new Date(valueAsString);  
          tuple.dateOfRecording = value;
          let dates = valueAsString.split("/")
          let calYear = parseInt(dates[2])
          let calMonth = parseInt(dates[1])
          if (calMonth > 8) {
            calYear = calYear + 1
          }

          tuple.year = calYear
          tuple.currentSeason = calYear.toString()
          
        }
        catch (error) {
          var push_error = new TupleProcessingError(jsonName_dateOfRecording, "Error: something that wasn't a date (MM/DD/YYYY)" + error.toString());
          tuple.processingErrorList.push(push_error);
        }
      }

      // location code
      else if (field[KEY] == jsonName_locationCode) {
        // verify they gave us a location code that already exists ()
        // var value
        // for now, trust
        tuple.locationCode = valueAsString;
      }

      // sex of the seal the observation is about.. verify the value is either 'M' or 'F'
      else if (field[KEY] == jsonName_sealSex) {
        let value = valueAsString;
        
        if (value != "M" && value != "F" && value != "") {
          var error = new TupleProcessingError(jsonName_sealSex, "Error: received value for seal gender that wasn't M or F: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.sealSex = value;
        }
      }

      // age code for the seal the observation is about. Valid age codes: "pup", "weanling", "juvenile", "adult female", "SA1"..."SA4", "adult male"
      else if (field[KEY] == jsonName_sealAgeCode) {  
        let acceptableValueList = ["P", "W", "J", "SA1", "SA2", "SA3", "SA4", "A"]; //    

        if ((acceptableValueList.indexOf(valueAsString) > -1) == false) {
          let value = parseInt(valueAsString);

          if (value == NaN) {
            var error = new TupleProcessingError(jsonName_sealAgeCode, "Error: received invalid age code: " + valueAsString);
            tuple.processingErrorList.push(error);
          }
          else {
            tuple.sealAgeCode = valueAsString;
          }
        }
        else {
          tuple.sealAgeCode = valueAsString;
        }

        // if adult female --> verify the sex is also female
        // if adult male   --> verify the sex is also male
        // if pup          --> verify the sealIsPup is set to true
      }


      // must be (Y/N)
      else if (field[KEY] == jsonName_mark1_isNew) {
        let value = valueAsString;

        if (value != "Y" && value != "N" && value != "") {
          var error = new TupleProcessingError(jsonName_mark1_isNew, "Error: expected Y or N. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.mark1_isNew = value;
        }
      }


      // really could be anything
      else if (field[KEY] == jsonName_mark1_idValue) {
        tuple.mark1_idValue = valueAsString;
      }


      // aka the STAMP // verify composed of one of the valid positions: "L" "R" "B"
      else if (field[KEY] == jsonName_mark1_positionCode) {
        
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
            tuple.mark1_positionCode = "";
          }
        }
      }

      // mark 2 - indicates whether it is a newly placed mark
      else if (field[KEY] == jsonName_mark2_isNew) {
        let value = valueAsString;
        if (value != "Y" && value != "N" && value != "") {
          var error = new TupleProcessingError(jsonName_mark2_isNew, "Error: expected Y or N. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.mark2_isNew = value;
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
            tuple.mark2_positionCode;
          }
          
        }
      }

      // verify either "Y" or "N"
      else if (field[KEY] == jsonName_tag1_isNew) {
        let value = valueAsString;

        if (value != "Y" && value != "N" && value != "") {
          var error = new TupleProcessingError(jsonName_tag1_isNew, "Error: expected Y or N. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.tag1_isNew = value;
        }
      }

      // anything
      else if (field[KEY] == jsonName_tag1_idValue) {
        tuple.tag1_idValue = valueAsString;
      }

      // 3 parts
        //    Flipper side       - "L" or "R"
        //    Flipper Location   - "1" "2" "3" "4"
        //    Spike Orientation  - "so" "si"
      else if (field[KEY] == jsonName_tag1_positionCode) {
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
      else if (field[KEY] == jsonName_tag2_isNew) {
        
        let value = valueAsString;

        if (value != "Y" && value != "N" && value != "") {
          var error = new TupleProcessingError(jsonName_tag2_isNew, "Error: expected Y or N. Instead: " + value);
          tuple.processingErrorList.push(error);
        }
        else {
          tuple.tag2_isNew = value;
        }
      }

      // anything
      else if (field[KEY] == jsonName_tag2_idValue) {
        tuple.tag2_idValue = valueAsString;
      }

      // 3 parts
      //    Flipper side       - "L" or "R"
      //    Flipper Location   - "1" "2" "3" "4"
      //    Spike Orientation  - "so" "si"
      // L1-so L1-si L2-so L2-si L3-so L3-si L4-so L4-si 
      // R1-so R1-si R2-so R2-si R3-so R3-si R4-so R4-si
      // regex: "/ ([LR][1234]-(so|si)) /gm"
      else if (field[KEY] == jsonName_tag2_positionCode) {
        
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
      else if (field[KEY] == jsonName_sealMoltPercentage) {        
        
          // integer 1-3 characters w/ %
          if (valueAsString.match(/\b\d{1,3}[%]\b/gm)) {
            let strlength = valueAsString.length;
            try {
              let value = parseInt(valueAsString.substr(0, strlength - 1));
              if (value < 0 || value > 100) {  
                var error = new TupleProcessingError(jsonName_sealMoltPercentage, "Error: not between 0 and 100. expected an integer value 1-3 digits, between 0 and 100, w or w/o % sign. Instead: " + value);
                tuple.processingErrorList.push(error);
                //tuple.sealMoltPercentage = null;
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
            tuple.sealMoltPercentage;
          }

          //    anything else is an ERROR
          else {
            var error = new TupleProcessingError(jsonName_sealMoltPercentage, "Error: expected an integer value 1-3 digits, between 0 and 100, w or w/o % sign. Instead: " + value);
            tuple.processingErrorList.push(error);
          }
      }


      // for mother elephant seals, indicates the number of pups they are caring for
      else if (field[KEY] == jsonName_sealHasPupQuantity) {
        
        
        if (valueAsString == "") {

        }
        else {
          let value = parseInt(valueAsString);
          if (value == NaN) {
            var error = new TupleProcessingError(jsonName_sealHasPupQuantity, "Error: received non-integer value for number of pups suffered by this parent. Intead: " + value);
            tuple.processingErrorList.push(error);
            tuple.sealHasPupQuantity = null;
          }
          else {
            tuple.sealHasPupQuantity = value;
          }
        }

        
      }

      else if (field[KEY] == jsonName_sealStandardLength) {
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        if (valueAsString == "") {

        }
        else {
          tuple.sealStandardLength = parseFloat(valueAsString);
        }
        
      }

      else if (field[KEY] == jsonName_sealCurvilinearLength) {
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        if (valueAsString == "") {

        }
        else {
          tuple.sealCurvilinearLength = parseFloat(valueAsString);
        }
        
      }

      else if (field[KEY] == jsonName_sealAxillaryGirth) {
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        if (valueAsString == "") {

        }
        else {
          tuple.sealAxillaryGirth = parseFloat(valueAsString);
        }
        
      }

      else if (field[KEY] == jsonName_sealMass) {
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        if (valueAsString == "") {

        }
        else {
          tuple.sealMass = parseFloat(valueAsString);
        }
        
      }

      else if (field[KEY] == jsonName_sealTare) {  
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        if (valueAsString == "") {

        }
        else {
          tuple.sealTare = parseFloat(valueAsString);
        }
        
      }

      else if (field[KEY] == jsonName_sealMassTare) {
        // Gotta hve format of either: 
        //    "<numeric value> <units>"
        //    "<numeric value>"  and then we just assume default units
        if (valueAsString == "") {

        }
        else {
          tuple.sealMassTare = parseFloat(valueAsString);
        }
        
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
        
        if (valueAsString == "") {

        }
        else {
          // first check regex for an integer. 
          let value = parseInt(valueAsString);
          tuple.weanDateRange = value;
        }
        

        //then check that it is equal to the difference of the other two fields
        // (AT THE VERY END, OUTSIDE THE IF CONDITIONS)
      }

      else if (field[KEY] == jsonName_comments) {
        // literally anything
        tuple.comments = valueAsString;
      }

      else {
        // somehow we received a field that wasn't in our known list of fields
        console.log("ERROR: NO MATCH");
        var error = new TupleProcessingError(field[KEY] as string, "Error: known field. Instead: " + field[KEY] + " " + valueAsString);
        tuple.processingErrorList.push(error);
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
    
    pupQuantityStr = (this.sealHasPupQuantity == null) ? "" : this.sealHasPupQuantity.toString();
    sealMoltPrcnt = (this.sealMoltPercentage == null) ? "" : this.sealMoltPercentage.toString();

    sealStdLen = (this.sealStandardLength == null) ? "" : this.sealStandardLength.toString();
    sealCurvLen = (this.sealCurvilinearLength == null) ? "" : this.sealCurvilinearLength.toString();
    sealAuxG = (this.sealAxillaryGirth == null) ? "" : this.sealAxillaryGirth.toString();
    sealMass = (this.sealMass == null) ? "" : this.sealMass.toString();
    sealTare = (this.sealTare == null) ? "" : this.sealTare.toString();
    sealMassTare = (this.sealMassTare == null) ? "" : this.sealMassTare.toString();
    sealLSAP = (this.sealLastSeenAsPupDate == null || this.sealLastSeenAsPupDate.toString() == "Invalid Date") ? "" : this.sealLastSeenAsPupDate.toLocaleDateString();
    sealFSAW = (this.sealFirstSeenAsWeaner == null || this.sealFirstSeenAsWeaner.toString() == "Invalid Date") ? "" : this.sealFirstSeenAsWeaner.toLocaleDateString();
    weanRange = (this.weanDateRange == null) ? "" : this.weanDateRange.toString();



    // let result = {this.jsonName_fieldLeaderInitials : this.fieldLeaderList,
    //                             jsonName_year : this.year.toString(),
    //                             jsonName_dateOfRecording : this.dateOfRecording.toLocaleDateString(),
    //                             jsonName_locationCode : this.locationCode,
    //                             jsonName_sealSex : this.sealSex,
    //                             jsonName_sealAgeCode : this.sealAgeCode,
    //                             jsonName_sealHasPupQuantity : pupQuantityStr,
    //                             jsonName_mark1_isNew : this.mark1_isNew,
    //                             jsonName_mark1_idValue : this.mark1_idValue,
    //                             jsonName_mark1_positionCode : this.mark1_positionCode,
    //                             jsonName_mark2_isNew : this.mark2_isNew,
    //                             jsonName_mark2_idValue : this.mark2_idValue,
    //                             jsonName_mark2_positionCode : this.mark2_positionCode,
    //                             jsonName_tag1_isNew : this.tag1_isNew,
    //                             jsonName_tag1_idValue : this.tag1_idValue,
    //                             jsonName_tag1_positionCode : this.tag1_positionCode,
    //                             jsonName_tag2_isNew : this.tag2_isNew,
    //                             jsonName_tag2_idValue : this.tag2_idValue,
    //                             jsonName_tag2_positionCode : this.tag2_positionCode,
    //                             jsonName_sealMoltPercentage : sealMoltPrcnt,
    //                             jsonName_currentSeason : this.currentSeason,
    //                             jsonName_sealStandardLength : sealStdLen,
    //                             jsonName_sealCurvilinearLength : sealCurvLen,
    //                             jsonName_sealAxillaryGirth : sealAuxG,
    //                             jsonName_sealMass : sealMass,
    //                             jsonName_sealTare : sealTare,
    //                             jsonName_sealMassTare : sealMassTare,
    //                             jsonName_sealLastSeenAsPupDate : sealLSAP,
    //                             jsonName_sealFirstSeenAsWeaner : sealFSAW,
    //                             jsonName_weanDateRange : weanRange,
    //                             jsonName_comments : this.comments,
    //                             jsonName_observationEnteredInAno : this.observationEnteredInAno};

    

    let result = {'Field Leader Initials' : this.fieldLeaderList,
                                "Year" : this.year.toString(),
                                "Date" : this.dateOfRecording.toLocaleDateString(),
                                "Loc." : this.locationCode,
                                "Sex" : this.sealSex,
                                "Age" : this.sealAgeCode,
                                "Pup?" : pupQuantityStr,
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
                                "Season" : this.currentSeason,
                                "St. Length" : sealStdLen,
                                "Crv. Length" : sealCurvLen,
                                "Ax. Girth" : sealAuxG,
                                "Mass" : sealMass,
                                "Tare" : sealTare,
                                "Mass-Tare" : sealMassTare,
                                "Last seen as P" : sealLSAP,
                                "1st seen as W" : sealFSAW,
                                "Range (days)" : weanRange,
                                "Comments" : this.comments
    }

    

    return result;
  }


}