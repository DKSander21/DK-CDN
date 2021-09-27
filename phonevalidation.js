	// Global config for Data8 validation
	var d8Validation = {
        apiKey: "ASWL-2NCE-HJTB-AH5N",
        email: {
            enabled: false,
            level: "Address",
            msg: "Email address is invalid"
        },
        phone: {
            enabled: true,
            defaultCountryCode: 44,
            msg: "Phone number is invalid"
        }
    };
    
    // Runs on form submission
    function startData8Validation(field) {
        if(field.type === "email" && d8Validation.email.enabled && field.value)
          validateEmailAsync(field);
        else if(field.type === "tel" && d8Validation.phone.enabled && field.value)
          validatePhoneAsync(field);
    }
    
    function validateEmailAsync(field, valid) {
        var params = {
            email: field.value,
            level: d8Validation.email.level,
            options: {
                ApplicationName: 'Unbounce'
            }
        }
    
        var req = new XMLHttpRequest();
        req.open("POST", "https://webservices.data-8.co.uk/EmailValidation/IsValid.json?key=" + d8Validation.apiKey);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
    
                if (this.status === 200) {
                    var result = JSON.parse(this.response);
                    if (!result.Status.Success)
                      reportValidationResult({ field: field, valid: true });
                    else if (result.Result !== "Invalid")
                      reportValidationResult({ field: field, valid: true });
                    else
                      reportValidationResult({ field: field, valid: false, msg: d8Validation.email.msg });
                } else {
                  reportValidationResult({ field: field, valid: true });
                }
            }
        };
    
        req.send(window.JSON.stringify(params));
    }
    
    function validatePhoneAsync(field, valid) {
        var params = {
            telephoneNumber: field.value,
            defaultCountry: d8Validation.phone.defaultCountryCode,
            options: {
                ApplicationName: 'Unbounce',
                TreatUnavailableMobileAsInvalid: true,
                ExcludeUnlikelyNumbers: true
            }
        }
    
        var req = new XMLHttpRequest();
        req.open("POST", "https://webservices.data-8.co.uk/PhoneValidation/IsValid.json?key=" + d8Validation.apiKey);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
    
                if (this.status === 200) {
                    var result = JSON.parse(this.response);
                    if (!result.Status.Success)
                    reportValidationResult({ field: field, valid: true });
                    else if (result.Result.ValidationResult !== "Invalid")
                    reportValidationResult({ field: field, valid: true });
                    else
                    reportValidationResult({ field: field, valid: false, msg: d8Validation.phone.msg });
                } else {
                  reportValidationResult({ field: field, valid: true });
                }
            }
        };
    
        req.send(window.JSON.stringify(params));
    }
    
    function reportValidationResult(result) {
        if (result.valid) {
            result.field.setCustomValidity("");
            result.field.classList.remove("data8Error");
        }
        else {
            result.field.setCustomValidity(result.msg);    
            result.field.classList.add("data8Error");
        }
    
        result.field.reportValidity();
    
        return result;
    }
    
    function checkForErrors(form){
      var inputs = jQuery('input', form);
      var validForm = true;
      for(var i=0; i<inputs.length; i++){
        if(inputs[i].classList.contains("data8Error")){
          validForm = false;
          if(inputs[i].type == "email")
            reportValidationResult({ field: inputs[i], valid: false, msg: d8Validation.email.msg });
          else if(inputs[i].type == "tel")
            reportValidationResult({ field: inputs[i], valid: false, msg: d8Validation.phone.msg });
        }
      }
    
      return validForm;
    }

    // Waits until window load to initialize
    function attachData8Validation(){
      jQuery(function($) {
        var form = jQuery(".lp-pom-form form");
        if(form){
          if(form.hasClass("data8-has-attached"))
            return;

          // Attach to form fields onChange events.
          var formFields = form[0].getElementsByTagName('input');
          for(var i=0; i < formFields.length; i++){
            var field = formFields[i];
            field.addEventListener('change', function(e){
              startData8Validation(this);
            });
          }

          // On submit perform check to see if any errors exist.
          $('.lp-pom-form .lp-pom-button').unbind('click tap touchstart').bind('click.formSubmit tap.formSubmit touchstart.formSubmit', function(e) {
            var valid = checkForErrors(form);
            if(!valid){
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          });
          $('form').unbind('keypress').bind('keypress.formSubmit', function(e) {
            if(e.which === 13 && e.target.nodeName.toLowerCase() !== 'textarea'){
              var valid = checkForErrors(form);
              if(!valid){
                e.preventDefault();
                e.stopImmediatePropagation();
              }
            }
          });

          form.addClass("data8-has-attached");
        }
        else{
          setTimeout(attachData8Validation, 100);
        }
      });
    }

    // Waits until window load to initialize
    jQuery(document).ready(function(){
      attachData8Validation();
    });
