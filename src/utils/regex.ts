export const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const passwordRulesRegex = /^(?=.{8,})(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/

export const validateRegex = (isEmail:boolean, value:string) => {
    return isEmail ? 
                    !regexEmail.test(value)         ? false: true
                   :
                    !passwordRulesRegex.test(value) ? false: true
}