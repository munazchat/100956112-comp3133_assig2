import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, Validator } from "@angular/forms";

@Injectable({providedIn: 'root'})
export class PassMatchValidator implements Validator {
    validate(formGroup: AbstractControl) {
        const { password, passwordConfirmation } = formGroup.value;
        if(password === passwordConfirmation)
            return null;
        else 
            return { passwordsDontMatch: true };
    }
}
