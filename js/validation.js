"use strict"

export const ERROR_PASSWORD_MSG = `Password field:
Minimum 6 Characters
Must Include an Uppercase Character
Must Include an Lowercase Character
Must Include a Number
Must Include a Special Character (!, @, #, etc.). 
Supported special characters are: ! @ # $ % ^ & * ( ) - _ = + \\ 
| [ ] { } ; : / ? . > <`;
export const ERROR_EMAIL_MSG = `Invalid Email address`;
export const ERROR_EMPTY_FILEDS = `All fields must be filled`;
export const ERROR_ONLY_LETTERS = `Names must contain only letters`;

export function onlyLetters(str) {
    return /^[A-Za-z]*$/.test(str);
}

export function validate_email(email) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!email.match(validRegex)){
        return false;
    }
    return true;
}

function contain_lowercase(str){
    return str.match(/[a-z]/);
}

function contain_uppercase(str){
    return str.match(/[A-Z]/);
}

function contain_number(str){
    return str.match(/[0-9]/);
}

function contain_special(str){
    const special_chars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_,', '=', '+', '\\', '|', '[',
     ']', '{', '}', ';', ':', '/', '?', '.', '>', '<'];

    for(let i=0; i<special_chars.length; i++){
        if (str.includes(special_chars[i])){
            return true;
        }
    }
    return false;
}

export function validate_password(password, confirmation) {
    if (password.length < 6){
        return false;
    } else if (!contain_lowercase(password)){
        return false;
    } else if (!contain_uppercase(password)){
        return false;
    } else if (!contain_number(password)){
        return false;
    } else if (!contain_special(password)){
        return false;
    }
    return true;
}

export function validate_password_confirmation(password, confirmation) {
    if (!validate_password(password) || password !== confirmation){
        return false;
    }
    return true;
}

export function isValidDate(dateString) {
    // First, we check that the string is not empty
    if (dateString.trim() === "") return false;
  
    // Then, we check that the string can be parsed into a Date object
    // We use the Date.parse() function for this, which returns the number of milliseconds
    // since the Unix epoch (Jan 1, 1970) if the string is a valid date, or NaN if it is not
    const date = Date.parse(dateString);
    if (isNaN(date)) return false;
  
    // // Finally, we check that the date is not in the future
    // // We do this by creating a new Date object from the date string and comparing it to the current date
    // const inputDate = new Date(dateString);
    // const now = new Date();
    return true;
  }