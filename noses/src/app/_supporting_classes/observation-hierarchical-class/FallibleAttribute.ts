
/**
 * A generic class for which each of our attributes will be represented by.
 * Stores a last attempted value in case a user tries to store "potato" for an integer value
 * We don't have to use all these fields, just wanted to give us the option.
 */
export class FallibleAttribute<T> {
  isValid : boolean;
  lastAttemptedValue : string;
  currentValue : T;
  errorMessage: string;  

  constructor() {
    this.isValid = null;
    this.lastAttemptedValue = null;
    this.currentValue = null;
    this.errorMessage = null;
  }
}