  window.ub.form.customValidators.UKPostalCode = {
    isValid: function(value) {
      return /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/.test(value);
    },

    message: 'Please enter a valid UK postcode',
  };
