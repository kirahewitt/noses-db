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
export class ParentTuple {

    /**
   * List of variables that are the names of each of the columns in the spreadsheet submitted by the user.
   */
  jsonName_fieldLeaderInitials = "Initials";
  jsonName_dateOfRecording = "Date";
  jsonName_locationCode = "Loc.";
  jsonName_mark1_isNew = "New Mark 1?";
  jsonName_mark1_idValue = "Mark 1";
  jsonName_mark1_positionCode = "Mark 1 Position";

  jsonName_tag1_isNew = "New Tag1?";
  jsonName_tag1_idValue = "Tag1 #"
  jsonName_tag1_positionCode = "Tag1 Pos."

  jsonName_sealAgeCode = "Age";
  jsonName_sealSex = "Sex";
  jsonName_sealHasPupQuantity = "Pup?";

  jsonName_mark2_isNew = "New Mark 2?";
  jsonName_mark2_idValue = "Mark 2";
  jsonName_mark2_positionCode = "Mark 2 Position";

  jsonName_tag2_isNew = "New Tag2?";
  jsonName_tag2_idValue = "Tag2 #"
  jsonName_tag2_positionCode = "Tag2 Pos."

  jsonName_sealMoltPercentage = "Molt (%)";
  jsonName_sealStandardLength =  "St. Length";
  jsonName_sealCurvilinearLength = "Crv. Length";
  jsonName_sealAxillaryGirth = "Ax. Girth";
  jsonName_sealMass = "Mass";
  jsonName_sealTare = "Tare";
  jsonName_sealMassTare = "Mass-Tare";
  jsonName_sealLastSeenAsPupDate = "Last seen as P";
  jsonName_sealFirstSeenAsWeaner = "1st seen as W";
  jsonName_weanDateRange = "Range (days)";
  jsonName_comments = "Comments";


  /**
   * Each of the above defined variables in a list.
   */
  SpreadsheetAttributeList = [this.jsonName_fieldLeaderInitials,
                                  this.jsonName_dateOfRecording,
                                  this.jsonName_locationCode,
                                  this.jsonName_mark1_isNew,
                                  this.jsonName_mark1_idValue,
                                  this.jsonName_mark1_positionCode,
                                  this.jsonName_tag1_isNew,
                                  this.jsonName_tag1_idValue,
                                  this.jsonName_tag1_positionCode,
                                  this.jsonName_sealAgeCode,
                                  this.jsonName_sealSex,
                                  this.jsonName_sealHasPupQuantity,
                                  this.jsonName_mark2_isNew,
                                  this.jsonName_mark2_idValue,
                                  this.jsonName_mark2_positionCode,
                                  this.jsonName_tag2_isNew,
                                  this.jsonName_tag2_idValue,
                                  this.jsonName_tag2_positionCode,
                                  this.jsonName_sealMoltPercentage,
                                  this.jsonName_sealStandardLength,
                                  this.jsonName_sealCurvilinearLength,
                                  this.jsonName_sealAxillaryGirth,
                                  this.jsonName_sealMass,
                                  this.jsonName_sealTare,
                                  this.jsonName_sealMassTare,
                                  this.jsonName_sealLastSeenAsPupDate,
                                  this.jsonName_sealFirstSeenAsWeaner,
                                  this.jsonName_weanDateRange,
                                  this.jsonName_comments
                                  ]

  /**
   * This list is actually a map of jsonNames to objectNames, which will make it easier
   */
  jsonName_to_objectName_map =  [ {jsonName: this.jsonName_fieldLeaderInitials, objectName: "fieldLeaderList"},
                                      {jsonName: this.jsonName_dateOfRecording, objectName: "dateOfRecording"},
                                      {jsonName: this.jsonName_locationCode, objectName: "locationCode"},
                                      {jsonName: this.jsonName_mark1_isNew, objectName: "mark1_isNew?"},
                                      {jsonName: this.jsonName_mark1_idValue, objectName: "mark1_idValue"},
                                      {jsonName: this.jsonName_mark1_positionCode, objectName: "mark1_positionCode"},
                                      {jsonName: this.jsonName_tag1_isNew, objectName: "tag1_isNew?"},
                                      {jsonName: this.jsonName_tag1_idValue, objectName: "tag1_idValue"},
                                      {jsonName: this.jsonName_tag1_positionCode, objectName: "tag1_positionCode"},
                                      {jsonName: this.jsonName_sealAgeCode, objectName: "sealAgeCode"},
                                      {jsonName: this.jsonName_sealSex, objectName: "sealSex"},
                                      {jsonName: this.jsonName_sealHasPupQuantity, objectName: "sealHasPupQuantity"},
                                      {jsonName: this.jsonName_mark2_isNew, objectName: "mark2_isNew?"},
                                      {jsonName: this.jsonName_mark2_idValue, objectName: "mark2_idValue"},
                                      {jsonName: this.jsonName_mark2_positionCode, objectName: "mark2_positionCode"},
                                      {jsonName: this.jsonName_tag2_isNew, objectName: "tag2_isNew?"},
                                      {jsonName: this.jsonName_tag2_idValue, objectName: "tag2_idValue"},
                                      {jsonName: this.jsonName_tag2_positionCode, objectName: "tag2_positionCode"},
                                      {jsonName: this.jsonName_sealMoltPercentage, objectName: "sealMoltPercentage"},
                                      {jsonName: this.jsonName_sealStandardLength, objectName: "sealStandardLength"},
                                      {jsonName: this.jsonName_sealCurvilinearLength, objectName: "sealCurvilinearLength"},
                                      {jsonName: this.jsonName_sealAxillaryGirth, objectName: "sealAxillaryGirth"},
                                      {jsonName: this.jsonName_sealMass, objectName: "sealMass"},
                                      {jsonName: this.jsonName_sealTare, objectName: "sealTare"},
                                      {jsonName: this.jsonName_sealMassTare, objectName: "sealMassTare"},
                                      {jsonName: this.jsonName_sealLastSeenAsPupDate, objectName: "sealLastSeenAsPupDate"},
                                      {jsonName: this.jsonName_sealFirstSeenAsWeaner, objectName: "sealFirstSeenAsWeaner"},
                                      {jsonName: this.jsonName_weanDateRange, objectName: "weanDateRangeange"},
                                      {jsonName: this.jsonName_comments, objectName: "comments"},
                                      
                                    ];

  // the original json input used to construct an instance of this class
  originalJsonInput : any;

  // other bookkeeping
  fieldLeaderInitials : string;
  locationCode : string;

  // seal attributes
  sealSex : string;
  sealAgeCode : string;
  sealHasPup: string;
  
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

  sealId : number

  comments : string;    

  /**
   * 
   * @param tupleAsJson : A json object that represents a spreadsheet with columns named according to the types listed above.
   */
  constructor(tupleAsJson : any) {

    //Initialize the entire object to blank attributes
    this.originalJsonInput = null;
    this.fieldLeaderInitials = "";
    // this.year = null;
    this.locationCode = "";
    this.sealSex = "";
    this.sealAgeCode = "";
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
  public copy (source : ParentTuple) {
    this.sealHasPup = Object.assign("", source.sealHasPup)
    this.comments = Object.assign("", source.comments);
    this.locationCode = Object.assign("", source.locationCode);
    this.mark1_idValue = Object.assign("", source.mark1_idValue);
    this.mark1_isNew = Object.assign("", source.mark1_isNew);
    this.mark1_positionCode = Object.assign("", source.mark1_positionCode);
    this.mark2_idValue = Object.assign("", source.mark2_idValue);
    this.mark2_isNew = Object.assign("", source.mark2_isNew);
    this.mark2_positionCode = Object.assign("", source.mark2_positionCode);
    this.originalJsonInput = JSON.parse(JSON.stringify(source.originalJsonInput));
    this.sealAgeCode = Object.assign("", source.sealAgeCode);
    this.sealSex = Object.assign("", source.sealSex);
    this.tag1_idValue = Object.assign("", source.tag1_idValue);
    this.tag1_isNew = Object.assign("", source.tag1_isNew);
    this.tag1_positionCode = Object.assign("", source.tag1_positionCode);
    this.tag2_idValue = Object.assign("", source.tag2_idValue);
    this.tag2_isNew = Object.assign("", source.tag2_isNew);
    this.tag2_positionCode = Object.assign("", source.tag2_positionCode);
  }

}