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

//create AutoComplete UI component
var autocomplete = $('#autocomplete').kendoAutoComplete({
  dataSource: dataSource,
  dataTextField: "nm_nng",
  placeholder: "Type at least 3 letters",
  minLength: 3,
  suggest: true,
  filter: "contains",
  template: '<a href="/v1/companies/#:id#"> #:nm_nng# - #:uf#</a>'
});