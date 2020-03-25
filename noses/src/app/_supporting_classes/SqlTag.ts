export class SqlTag {

  public TagNumber? : string;
  public TagColor? : string;
  public TagPosition? : string;
  public TagDate? : string;
  public TagSeal? : number;
  public isLost? : number;

  constructor() {
    this.TagNumber = null;
    this.TagColor = null;
    this.TagPosition = null;
    this.TagDate = null;
    this.TagSeal = null;
    this.isLost = null;
  }
}