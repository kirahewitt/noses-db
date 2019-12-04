
/**
 * represents a measured value. That is a record that includes both a numeric value and a unit type
 */
export class MeasuredValue {
  numericValue : number;
  unitTypeName : string;

  constructor() {
    this.numericValue = null;
    this.unitTypeName = null;
  }
}