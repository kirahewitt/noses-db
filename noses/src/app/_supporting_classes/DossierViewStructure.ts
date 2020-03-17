
/**
 * Represents a Dossier for the DossierView page. Organizes all the data needed by this page into one convenient object.
 * I made all the fields nullable by appending a '?' to the end of their names. This should make it easy to identify objects which have not yet received a value from asynchronous processes.
 */
export class DossierViewStructure {
  public dossierId?: number;
  public sex?: string;
  public identifyingObservationId?: number;

  constructor() {
    this.dossierId = null;
    this.sex = null;
    this.identifyingObservationId = null;
  }
}


/**
 * Represents all the data which must be compiled across multiple observations
 */
export class DossierViewStructure_compiledData {
  public ageClass?: string;
  public knownTagList?: TagViewStructure[];
  public knownMarkList?: MarkViewStructure[];
  public dateLastSeen?: Date;


  constructor() {
    this.ageClass = null;
    this.knownTagList = null;
    this.knownMarkList = null;
    this.dateLastSeen = null;
  }
}





/**
 * Reperesents a Tag so it can be displayed on the Dossier View page
 */
export class TagViewStructure {
  public tagId?: string;

  constructor() {
    this.tagId = null;
  }
}

/**
 * Represents a mark so it can be displayed on the Dossier View page
 */
export class MarkViewStructure {
  public markId?: string;
  public markSeason?: string;

  constructor() {
    this.markId = null;
    this.markSeason = null;
  }
}