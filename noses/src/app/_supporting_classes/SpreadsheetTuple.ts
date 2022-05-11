import { BacklogSpreadsheetTuple } from "./BacklogSpreadsheetTuple";
import { ParentTuple } from "./ParentTuple";

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
export class SpreadsheetTuple extends ParentTuple {

  // other bookkeeping
  year : number;
  dateOfRecording : Date;
  currentSeason : string;

  // seal attributes
  sealId : number;

  // Measurements
  sealMoltPercentage : number;
  sealStandardLength : number;
  sealCurvilinearLength : number;
  sealAxillaryGirth : number;
  sealMass : number;
  sealTare : number;
  sealMassTare: number;

  // other
  sealLastSeenAsPupDate : Date; // date-LSAP
  sealFirstSeenAsWeaner : Date; // date-FSAW

  /**
   * 
   * @param tupleAsJson : A json object that represents a spreadsheet with columns named according to the types listed above.
   */
  constructor(tupleAsJson : any) {
    
    super(tupleAsJson)

    //Initialize the entire object to blank attributes
    this.year = null;
    this.dateOfRecording = null;
    this.sealMoltPercentage = null;

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
    super.copy(source)
    this.year = source.year;
    this.sealId = source.sealId
    this.currentSeason = Object.assign("", source.currentSeason);
    this.dateOfRecording = JSON.parse(JSON.stringify(source.dateOfRecording));
    this.sealAxillaryGirth = source.sealAxillaryGirth;
    this.sealCurvilinearLength = source.sealCurvilinearLength;
    this.sealFirstSeenAsWeaner = JSON.parse(JSON.stringify(source.sealFirstSeenAsWeaner));
    this.sealLastSeenAsPupDate = JSON.parse(JSON.stringify(source.sealLastSeenAsPupDate));
    this.sealMass = source.sealMass;
    this.sealMoltPercentage = source.sealMoltPercentage;
    this.sealStandardLength = source.sealStandardLength;
    this.sealTare = source.sealTare;
  }

  public addFromBacklog(source: BacklogSpreadsheetTuple) {
    this.fieldLeaderInitials = source.fieldLeaderInitials;
    this.dateOfRecording = new Date(source.dateOfRecording);
    let calYear = this.dateOfRecording.getFullYear()
    let calMonth = this.dateOfRecording.getMonth()
    if (calMonth > 7) {
      calYear = calYear + 1
    }
    this.year = calYear
    this.currentSeason = calYear.toString()
    this.locationCode = source.locationCode;
    this.sealSex = source.sealSex;
    this.sealAgeCode = source.sealAgeCode;
    this.mark1_isNew = source.mark1_isNew;
    this.mark1_idValue = source.mark1_idValue;
    this.mark1_positionCode = source.mark1_positionCode;
    this.mark2_isNew = source.mark2_isNew;
    this.mark2_idValue = source.mark2_idValue;
    this.mark2_positionCode = source.mark2_positionCode;
    this.tag1_isNew = source.tag1_isNew;
    this.tag1_idValue = source.tag1_idValue;
    this.tag1_positionCode = source.tag1_positionCode;
    this.tag2_isNew = source.tag2_isNew;
    this.tag2_idValue = source.tag2_idValue;
    this.tag2_positionCode = source.tag2_positionCode;
    this.comments = source.comments;
    if (source.sealMoltPercentage != "") {
      this.sealMoltPercentage = parseInt(source.sealMoltPercentage.slice(0, source.sealMoltPercentage.length - 1));
    }
    this.sealHasPup = source.sealHasPup;
    if (source.sealStandardLength != "") {
      this.sealStandardLength = parseFloat(source.sealStandardLength)
    }
    if (source.sealCurvilinearLength != "") {
      this.sealCurvilinearLength = parseFloat(source.sealCurvilinearLength)
    }
    if (source.sealAxillaryGirth != "") {
      this.sealAxillaryGirth = parseFloat(source.sealAxillaryGirth)
    }
    if (source.sealMass != "") {
      this.sealMass = parseFloat(source.sealMass)
    }
    if (source.sealStandardLength != "") {
      this.sealTare = parseFloat(source.sealTare)
      this.sealMassTare = this.sealMass - this.sealTare;
    }
    if (source.sealLastSeenAsPupDate != "") {
      this.sealLastSeenAsPupDate = new Date(source.sealLastSeenAsPupDate)
    }
    if (source.sealFirstSeenAsWeaner != "") {
      this.sealFirstSeenAsWeaner = new Date(source.sealFirstSeenAsWeaner)
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
    var comments: string;
    var sealId : number;
    var range: string;
    
    pupQuantityStr = (this.sealHasPup == null) ? "" : this.sealHasPup.toString();
    sealMoltPrcnt = (this.sealMoltPercentage == null) ? "" : this.sealMoltPercentage.toString();
    comments = (this.comments == null || this.comments == "NULL") ? "" : this.comments.toString();
    sealStdLen = (this.sealStandardLength == null) ? "" : this.sealStandardLength.toString();
    sealCurvLen = (this.sealCurvilinearLength == null) ? "" : this.sealCurvilinearLength.toString();
    sealAuxG = (this.sealAxillaryGirth == null) ? "" : this.sealAxillaryGirth.toString();
    sealMass = (this.sealMass == null) ? "" : this.sealMass.toString();
    sealTare = (this.sealTare == null) ? "" : this.sealTare.toString();
    sealMassTare = (this.sealMassTare == null) ? "" : this.sealMassTare.toString();
    sealId = (this.sealId == null) ? -1 : this.sealId;
    sealLSAP = (this.sealLastSeenAsPupDate == null || this.sealLastSeenAsPupDate.toString() == "Invalid Date") ? "" : this.sealLastSeenAsPupDate.toLocaleDateString();
    sealFSAW = (this.sealFirstSeenAsWeaner == null || this.sealFirstSeenAsWeaner.toString() == "Invalid Date") ? "" : this.sealFirstSeenAsWeaner.toLocaleDateString();
    // range = (sealLSAP != "Invalid Date" && sealFSAW != "Invalid Date") ? "" : ((this.sealFirstSeenAsWeaner.getTime() - this.sealLastSeenAsPupDate.getTime()) / (1000 * 3600 * 24)).toString()
    range = "";
    let result = {'Field Leader Initials' : this.fieldLeaderInitials,
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
                                "St. Length" : sealStdLen,
                                "Crv. Length" : sealCurvLen,
                                "Ax. Girth" : sealAuxG,
                                "Mass" : sealMass,
                                "Tare" : sealTare,
                                "Last seen as P" : sealLSAP,
                                "1st seen as W" : sealFSAW,
                                "Range (days)" : weanRange,
                                "Comments" : comments,
                                "Year" : this.year,
                                "Season" : this.currentSeason,
                                "Mass-Tare" : sealMassTare,
                                "SealID" : sealId,
                                "Range" : range

    }
    console.log("inner result")
    console.log(result);

    return result;
  }


}