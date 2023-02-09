// Object constructor function Validator
function Validator(options) {
    // Lấy element từ form cần validate
    const selectorRules = {}
    const formElement = document.querySelector(options.form) 
    if (formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault()

            let isFormValid = true

            options.rules.forEach(function(rule) {
                const inputElement = formElement.querySelector(rule.selector)
                const isInValid = validate(inputElement, rule)

                if(isInValid) {
                    isFormValid = false
                }
            })
            if(isFormValid) { 
                if(typeof options.onSubmit === 'function') {
                    const enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    
                    const formValues = Array.from(enableInputs).reduce(function(values, input) {
                        switch(input.type) {
                            case 'radio':
                                if (input.matches(':checked')) {
                                    values[input.name] = input.value;
                                } else if (!(values[input.name])) {
                                    values[input.name] = '';
                                }
                                break
                                // values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value
                                // break
                            case 'checkbox':
                                if (input.matches(':checked')) {
                                    if (!Array.isArray(values[input.name])) {
                                        values[input.name] = [];
                                    }
                                    values[input.name].push(input.value);
                                } else if (!Array.isArray(values[input.name])) {
                                    values[input.name] = '';
                                }
                                break
                            // case 'checkbox':
                            //     if (!input.matches(':checked')) {
                            //         if (!Array.isArray(values[input.name])){
                            //         values[input.name] = ''
                            //        }  
                            //         return values
                            //     }

                            //     if (!Array.isArray(values[input.name])) {
                            //         values[input.name] = []
                            //     }

                            //     values[input.name].push(input.value)
                            //     break

                            case 'file':
                                values[input.name] = input.files
                                break
                            default:
                                values[input.name] = input.value
                        }
                        return values
                    }, {})
                    options.onSubmit (formValues)
                } else {
                    formElement.submit()
                }
            }
        }

        options.rules.forEach(function(rule) {
            // Lưu lại các rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            const inputElements = formElement.querySelectorAll(rule.selector)
            Array.from(inputElements).forEach(function(inputElement) {
                inputElement.onblur = function() {
                    validate(inputElement, rule)
            }

                inputElement.oninput = function() {
                    const errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorElement)
                    errorElement.innerText = ''
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }

                inputElement.onchange = function() {
                    onChangeValues(inputElement, rule)
                }
            })
        })
    }

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    function onChangeValues (inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorElement)
                    
        if(formElement.querySelector(rule.selector).value === '') {
            validate(inputElement, rule);
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
    }

    function showPassword () {
        const togglePassword_1 = formElement.querySelector(options.togglePassword);
        const togglePassword_2 = formElement.querySelector(options.togglePasswordConfirm);
        const password = formElement.querySelector(options.password);
        const passwordConfirm = formElement.querySelector(options.passwordConfirm);
      
        togglePassword_1.addEventListener('click', function (e) {
          // toggle the type attribute
          const type = password.getAttribute('type') === 'password' ? 'text' : 'password'
          password.setAttribute('type', type)
          // toggle the eye slash icon
          this.classList.toggle('fa-eye-slash')

        });
        togglePassword_2.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = passwordConfirm.getAttribute('type') === 'password' ? 'text' : 'password'
        passwordConfirm.setAttribute('type', type)
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash')
        });

    }
    // showPassword()

    // Thực hiện validate element
    function validate(inputElement, rule) {
        const errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorElement)
        let errorMessage
        // Lấy ra các rule của selector
        const rules = selectorRules[rule.selector]
        // Lặp qua từng rule và kiểm tra
        // Nếu có lỗi thì dừng việc kiểm tra
        for (let i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
                break
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if(errorMessage) {
                break
            }
        }

        if(errorMessage) {
            errorElement.innerText = errorMessage
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }

        return !!errorMessage
    }
}


// Định nghĩa các rules cho form
// Function là một object, ta có thể định nghĩa method, property bằng cách object.method
// thì Validator.isRequired tương tự
Validator.isRequired = function (selector, message) {
    return {
        selector,
        test(value) {
            return value ? undefined : message || 'Vui lòng nhập trường này!'
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector,
        test(value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Trường này phải là email!'
        }
    }
}

Validator.minLength = function (selector, minLength, message) {
    return {
        selector,
        test(value) {
            return value.length >= minLength ? undefined : message || `Vui lòng nhập ít nhất ${minLength} kí tự!`
        }
    }
}

Validator.specialChar = function (selector, message) {
    return {
        selector,
        test(value) {
            const special = new RegExp('(?=.*[!@#\$%\^&|*])')
            return special.test(value) ? undefined : message || `Vui lòng nhập ít nhất 1 kí tự đặc biệt!`
        }
    }
}

Validator.upperCase = function (selector, message) {
    return {
        selector,
        test(value) {
            const upperCase = new RegExp('(?=.*[A-Z])')
            return upperCase.test(value) ? undefined : message || `Vui lòng nhập ít nhất 1 kí tự viết hoa!`
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmedValue, message) {
    return {
        selector,
        test(value) {
            return value === getConfirmedValue() ? undefined : message || 'Giá trị nhập lại không chính xác!'
        }
    }
}