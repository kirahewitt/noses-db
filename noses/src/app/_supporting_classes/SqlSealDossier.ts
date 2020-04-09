export class SqlSealDossier {
  public sealId? : number;
  public identifyingObservationId? : number;
  public sex? : string;
  public isDeprecated? : number;

  constructor() {
    this.sealId = -1;
    this.identifyingObservationId = -1;
    this.sex = "";
    this.isDeprecated = -1;
  }
}