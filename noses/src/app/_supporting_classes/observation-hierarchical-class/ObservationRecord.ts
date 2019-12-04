import {FallibleAttribute} from "./FallibleAttribute";
import {ObservedMark} from "./ObservedMark";
import {ObservedTag} from "./ObservedTag";
import {MeasuredValue} from "./MeasuredValue"


/**
 * All the fields are fallible attributes which can store error messages.
 */
export class ObservationRecord {
  observerName : FallibleAttribute<string>;
  currentSeason : FallibleAttribute<string>;
  dateOfRecording : FallibleAttribute<Date>; 
  locationCode : FallibleAttribute<string>;
  fieldLeader : FallibleAttribute<string>;

  // seal attributes
  sealSex : FallibleAttribute<string>;
  sealAgeCode : FallibleAttribute<string>;
  
  // only applicable to females
  pupsNumbers : FallibleAttribute<number>;
  pupsAge : FallibleAttribute<number>;

  markList : FallibleAttribute<ObservedMark>[];
  tagList : FallibleAttribute<ObservedTag>[];

  moltPercentage : FallibleAttribute<MeasuredValue>;
  sealStandardLength : FallibleAttribute<MeasuredValue>;
  sealCurvilinearLength : FallibleAttribute<MeasuredValue>;
  sealAuxiliaryGirth : FallibleAttribute<MeasuredValue>;
  sealMass : FallibleAttribute<MeasuredValue>;
  sealTare : FallibleAttribute<MeasuredValue>;
  sealMassTare : FallibleAttribute<MeasuredValue>;

  // only applicable to pups
  sealLastSeenAsPupDate : FallibleAttribute<Date>; // date-LSAP
  sealFirstSeenAsWeanerDate : FallibleAttribute<Date>; // date-FSAW
  weanDateRange : FallibleAttribute<number>; // difference (in days) between date-FSAW and date-LSAP

  comments : FallibleAttribute<string>;    
  isApproved : FallibleAttribute<boolean>; // always default false for citizens' observations
  flagForReview: FallibleAttribute<boolean>;


  constructor() {
    this.observerName = new FallibleAttribute<string>();
    this.currentSeason = new FallibleAttribute<string>();
    this.dateOfRecording = new FallibleAttribute<Date>();
    this.locationCode = new FallibleAttribute<string>();
    this.fieldLeader = new FallibleAttribute<string>();

    this.sealSex = new FallibleAttribute<string>();
    this.sealAgeCode = new FallibleAttribute<string>();

    this.pupsNumbers = new FallibleAttribute<number>();
    this.pupsAge = new FallibleAttribute<number>();

    this.markList = [];
    this.tagList = [];

    this.moltPercentage = new FallibleAttribute<MeasuredValue>();
    this.sealStandardLength = new FallibleAttribute<MeasuredValue>();
    this.sealCurvilinearLength = new FallibleAttribute<MeasuredValue>();
    this.sealAuxiliaryGirth = new FallibleAttribute<MeasuredValue>();
    this.sealMass = new FallibleAttribute<MeasuredValue>();
    this.sealTare = new FallibleAttribute<MeasuredValue>();
    this.sealMassTare = new FallibleAttribute<MeasuredValue>();

    this.sealLastSeenAsPupDate = new FallibleAttribute<Date>();
    this.sealFirstSeenAsWeanerDate = new FallibleAttribute<Date>();
    this.weanDateRange = new FallibleAttribute<number>();

    this.comments = new FallibleAttribute<string>();
    this.isApproved = new FallibleAttribute<boolean>();
    this.flagForReview = new FallibleAttribute<boolean>();
  }

}