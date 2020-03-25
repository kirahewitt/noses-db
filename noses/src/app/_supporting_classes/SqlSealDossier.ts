export class SqlSealDossier {

  public sealId? : number;
  public identifyingObservationId? : number;
  public sex? : string;
  public isDeprecated? : number;

  constructor() {
    this.sealId = null;
    this.identifyingObservationId = null;
    this.sex = null;
    this.isDeprecated = null;
  }
}