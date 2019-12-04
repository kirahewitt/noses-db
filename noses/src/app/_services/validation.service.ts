import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }


  /**
   * Validator i made for testing.
   * @param control 
   */
  static customValidator(control : FormControl) {
    // RFC 2822 compliant regex
    if (control.value.match(/(Fool!)/)) {
      return null;
    } else {
      return { 'missingFoolAccusation': true };
    }
  }


  /**
   * Determines whether the value of the control containing the sealSex is correct.
   * Permits only "M" or "F"
   * @param control A reference to a form control.
   */
  static validate_sealSex(control : FormControl) {
    let value = control.value;

    if (value !== "M" && value !== "F") {
      return { 'invalidSealSex' : true };
    }
    else {
      return null;
    }
  }



  /**
   * 
   * Permits only ["P", "W", "J", "SA1", "SA2", "SA3", "SA4", "A"]
   * @param control 
   */
  static validate_sealAgeCode(control : FormControl) {
    let acceptableValueList = ["P", "W", "J", "SA1", "SA2", "SA3", "SA4", "A"];
    let value = control.value;

    if ((acceptableValueList.indexOf(value) > -1) == false) {
      return { 'invalidSealAgeCode' : true };
    }
    else {
      return null;
    }
  }


  /**
   * 
   * @param control 
   */
  static validate_calendarDateFormat(control : FormControl) {
    
    console.log("FORM CONTROL DURING VALIDATE");
    console.log(control);
    console.log(control.value);

    if (control.value.match(/^[0-9]{2}[\/][0-9]{2}[\/][0-9]{2}$/)) {
      return null;
    }
    else {
      return { 'invalidDateFormat' : true };
    }
  } 

}
