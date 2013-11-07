String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

var dataSource = new kendo.data.DataSource({
  serverPaging: true,
  transport: {
    read: {
      url: '/v1/companies/find',
      dataType: 'json'
    },
    parameterMap: function() {
      return {
        q: $('#autocomplete').data('kendoAutoComplete').value()
      }
    }
  },
  serverFiltering: true
});

var formatDisplay = function(name, neighborhood, city) {
  var string = name.toLowerCase().capitalize();
  if (neighborhood && neighborhood.length > 0) {
    string = string + " - " + neighborhood;
  }

  if (city && city.length > 0) {
    string = string + " - " + city;
  }
  return string;
};

//create AutoComplete UI component
var autocomplete = $('#autocomplete').kendoAutoComplete({
  dataSource: dataSource,
  dataTextField: "name.toLowerCase().capitalize()",
  placeholder: "Type at least 3 letters",
  minLength: 3,
  suggest: true,
  filter: "contains",
  template: '<a href="/v1/companies/#: id #"> #: formatDisplay(name, neighborhood, city) #</a>'
});

// $("#autocomplete").data("kendoAutoComplete").list.width(700);