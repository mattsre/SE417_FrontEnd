/**
 * Validation State Enum
 * @description Used to set intent values on form inputs and perform validity checks before making server calls
 * @enum {number}
 * @readonly
 */
export enum ValidState {
  /**
   * @property {number} ValidState.Empty - Usually used to initialize form inputs validity
   */
  Empty,
  /**
   * @property {number} ValidState.Not_Valid - Used when the input value does not pass validaton rules
   */
  Not_Valid,
  /**
   * @property {number} ValidState.Valid - Used when the input value passes all validation rules
   */
  Valid
}

export function handleUserDataStateChange(this: any, event: React.FormEvent<HTMLInputElement>): void {
  let name = event.currentTarget.name;
  let val = event.currentTarget.value;
  this.setState((prevState: any) => ({
    user_data: {
      ...prevState.user_data,
      [name]: val
    }
  }))
}