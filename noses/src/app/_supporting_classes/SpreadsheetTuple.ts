
/**
 * A tuple processing error instance is used to indicate when there is a problem with the 
 * value supplied for a particular attribute of a tuple. 
 */
export class TupleProcessingError {
  attributeName : String;
  errorMessage: String;


  constructor(attributeName : string, msg : string) {
    this.attributeName = attributeName;
    this.errorMessage = msg;
  }
}


var jsonName_fieldLeaderInitials = "Field Leader Initials";
var jsonName_year = "Year";
var jsonName_dateOfRecording = "Date";
var jsonName_locationCode = "Loc.";
var jsonName_sealSex = "Sex";
var jsonName_sealAgeCode = "Age";
var jsonName_sealIsPup = "Pup?";
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


var SpreadsheetAttributeList = [jsonName_fieldLeaderInitials,
                                jsonName_year,
                                jsonName_dateOfRecording,
                                jsonName_locationCode,
                                jsonName_sealSex,
                                jsonName_sealAgeCode,
                                jsonName_sealIsPup,
                                jsonName_mark1_isNew,
                                jsonName_mark1_idValue,
                                jsonName_mark1_positionCode,
                                jsonName_mark2_isNew,
                                jsonName_mark2_idValue,
                                jsonName_mark2_positionCode,
                                jsonName_tag1_isNew,
                                jsonName_tag1_idValue,
                                jsonName_tag1_positionCode,
                                jsonName_tag2_isNew,
                                jsonName_tag2_idValue,
                                jsonName_tag2_positionCode,
                                jsonName_sealMoltPercentage,
                                jsonName_currentSeason,
                                jsonName_sealStandardLength,
                                jsonName_sealCurvilinearLength,
                                jsonName_sealAuxiliaryGirth,
                                jsonName_sealMass,
                                jsonName_sealTare,
                                jsonName_sealMassTare,
                                jsonName_sealLastSeenAsPupDate,
                                jsonName_sealFirstSeenAsWeaner,
                                jsonName_weanDateRange,
                                jsonName_comments,
                                jsonName_observationEnteredInAno]


var jsonName_to_objectName_map =  [ {jsonName: jsonName_fieldLeaderInitials, objectName: "fieldLeaderList"},
                                    {jsonName: jsonName_year, objectName: "year"},
                                    {jsonName: jsonName_dateOfRecording, objectName: "dateOfRecording"},
                                    {jsonName: jsonName_locationCode, objectName: "locationCode"},
                                    {jsonName: jsonName_sealSex, objectName: "sealSex"},
                                    {jsonName: jsonName_sealAgeCode, objectName: "sealAgeCode"},
                                    {jsonName: jsonName_sealIsPup, objectName: "sealIsPup"},
                                    {jsonName: jsonName_mark1_isNew, objectName: "mark1_isNew?"},
                                    {jsonName: jsonName_mark1_idValue, objectName: "mark1_idValue"},
                                    {jsonName: jsonName_mark1_positionCode, objectName: "mark1_positionCode"},
                                    {jsonName: jsonName_mark2_isNew, objectName: "mark2_isNew?"},
                                    {jsonName: jsonName_mark2_idValue, objectName: "mark2_idValue"},
                                    {jsonName: jsonName_mark2_positionCode, objectName: "mark2_positionCode"},
                                    {jsonName: jsonName_tag1_isNew, objectName: "tag1_isNew?"},
                                    {jsonName: jsonName_tag1_idValue, objectName: "tag1_idValue"},
                                    {jsonName: jsonName_tag1_positionCode, objectName: "tag1_positionCode"},
                                    {jsonName: jsonName_tag2_isNew, objectName: "tag2_isNew?"},
                                    {jsonName: jsonName_tag2_idValue, objectName: "tag2_idValue"},
                                    {jsonName: jsonName_tag2_positionCode, objectName: "tag2_positionCode"},
                                    {jsonName: jsonName_sealMoltPercentage, objectName: "sealMoltPercentage"},
                                    {jsonName: jsonName_currentSeason, objectName: "currentSeason"},
                                    {jsonName: jsonName_sealStandardLength, objectName: "sealStandardLength"},
                                    {jsonName: jsonName_sealCurvilinearLength, objectName: "sealCurvilinearLength"},
                                    {jsonName: jsonName_sealAuxiliaryGirth, objectName: "sealAuxiliaryGirth"},
                                    {jsonName: jsonName_sealMass, objectName: "sealMass"},
                                    {jsonName: jsonName_sealTare, objectName: "sealTare"},
                                    {jsonName: jsonName_sealMassTare, objectName: "sealMassTare"},
                                    {jsonName: jsonName_sealLastSeenAsPupDate, objectName: "sealLastSeenAsPupDate"},
                                    {jsonName: jsonName_sealFirstSeenAsWeaner, objectName: "sealFirstSeenAsWeaner"},
                                    {jsonName: jsonName_weanDateRange, objectName: "weanDateRangeange"},
                                    {jsonName: jsonName_comments, objectName: "comments"},
                                    {jsonName: jsonName_observationEnteredInAno, objectName: "observationEnteredInAno"}
                                    
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

  fieldLeaderList : String[] = null;
  year : number = null;
  dateOfRecording : Date = null;
  locationCode : String  = null;
  currentSeason : String  = null;

  // seal attributes
  sealSex : String = null;
  sealAgeCode : String = null;
  sealHasPupQuantity : number = null;
  
  // marks
  mark1_idValue : String = null;
  mark1_isNew? : Boolean = null;
  mark1_positionCode : String = null;

  mark2_idValue : String = null;
  mark2_isNew? : Boolean = null;
  mark2_positionCode : String = null;

  // tags
  tag1_idValue : String = null;
  tag1_isNew? : Boolean = null;
  tag1_positionCode : String = null;

  tag2_idValue : String = null;
  tag2_isNew? : Boolean = null;
  tag2_positionCode : String = null;

  // Measurements
  sealMoltPercentage : Number = null;
  sealStandardLength : Number = null;
  sealStandardLength_units : String = null;
  sealCurvilinearLength : Number = null;
  sealCurvilinearLength_units : String = null;
  sealAuxiliaryGirth : Number = null;
  sealAuxiliaryGirth_units : String = null;
  sealMass : Number = null;
  sealMass_units : String = null;
  sealTare : Number = null;
  sealTare_units : String = null;
  sealMassTare : Number = null;
  sealMassTare_units : String = null;

  // other
  sealLastSeenAsPupDate : Date = null; // date-LSAP
  sealFirstSeenAsWeaner : Date = null; // date-FSAW
  comments : String = null;
  observationEnteredInAno : Boolean = null;

  // difference (in days) between date-FSAW and date-LSAP
  weanDateRange : number = null;

  // will be false initially, this tuple will have to be approved by someone else later
  isApproved : Boolean = null;

  // if
  processingErrorList : TupleProcessingError[];


  /**
   * Creates an instance of this class to represent a json tuple. If there is an error while processing one
   * of the fields, the error is placed in "processingErrorList".
   * 
   * Can use a map to map a field name to one of the classes attribute names. and we can reference attributes
   * by building a string and using that string for the attribute name.
   * 
   * Easiest way to do this is to store the original list, and then have all the above fields, and the map
   *
   * For each of the items in "jsonName_to_objectName_map", there is a jsonValue and an objectValue.
   * We want to:
   *     1. Determine which field we're looking at
   *     2. perform the appropriate processing for that field
   *     3. if processing == success --> assign it to the objectValue
   *     4. if processing == fail    --> record the failure in the processingErrorList
   *  
   * @param tupleAsJson 
   */
  constructor(tupleAsJson : any) {
    // console.log("WITHIN CONSTRUCTOR -- actual parameter: " );
    // console.log(tupleAsJson)
    this.originalJsonInput = tupleAsJson;
    this.processingErrorList = [];

  }
}