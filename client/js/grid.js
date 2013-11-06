var pageSize = 10;
var searchBy = null;

var dataSource = new kendo.data.DataSource({
	serverPaging: true,
	serverFiltering: true,
	pageSize: pageSize,
	transport: {
		read: {
			url: '/v1/companies/list',
			dataType: 'json'
		},
		parameterMap: function(data, operation) {
			var params = {
				limit: pageSize,
				page: $('#grid').data('kendoGrid').pager.options.dataSource._page
			};

			if (data.filter) {
				// console.log("searchBy", searchBy);
				params.field = 'nm_nng';
				params.q = '*' + searchBy + '*';
				searchBy = null;
			} else if (searchBy) {
				var filter = data.filter.filters[0];
				console.log('filter', JSON.stringify(filter, null, 2));
				params.q = '';

				if (filter.operator === 'doesnotcontain') {
					params.q = params.q + '!';
				}

				params.field = filter.field;
				params.q = params.q + filter.value;
				console.log('q', params.q, 'field', params.field);
			}
			return params;
		}
	},
	schema: {
		data: 'data',
		total: 'total'
	}
});

var columns = [
	{ 
		field: 'nm_nng', title: 'Name',
	    filterable: {
	      ui: 'filter' // use Kendo UI DateTimePicker
	    }
	  },
	{ field: 'grupo', title: 'Grupo' },
	{ field: 'pais', title: 'País' },
	{ field: 'uf', title: 'UF' }
];

var filterOptions = {
	extra: false,
	operators: {
		string: {
			contains: 'Contains',
			doesnotcontain: 'Doesn\'t contain'
		}
	},
	messages: {
		filter: 'Search'
	}
};

var grid = $('#grid').kendoGrid({
	dataSource: dataSource,
	columns: columns,
	pageable: pageSize,
  	scrollable: false,
  	selectable: true,
  	filterable: filterOptions,
  	toolbar: [{
  		name: 'search',
  		template: '<input id="search" class="toolbar"/>',
  		text: 'search'
  	}]
});

grid.find("#search").kendoSearchBox({
	name: "search",
	change: function(e) {
		searchBy = e.sender.options.value;
		var ds = $('#grid').data('kendoGrid').dataSource;
		ds.fetch();
		// console.log('change', searchBy, 'ds', ds);
	}
});