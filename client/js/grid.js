String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

var pageSize = 10;

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
				params.q = '';
				var filters = data.filter.filters;

				for (var i = 0; i < filters.length; i++) {
					var filter = filters[i];
					var q = '';

					if (filter.operator === 'doesnotcontain') {
						q = '!';
					}

					q = q + filter.value;

					if (filter.operator === 'contains') {
						params.q = params.q + ' ' + filter.field + ':*' + q + '*';
					} else if (filter.operator === 'eq') {
						params.q = params.q + ' ' + filter.field + ':' + q;
					}
				}
			}
			return params;
		}
	},
	schema: {
		data: 'data',
		total: 'total'
	}
});

var formatName = function(name) {
	return name.toLowerCase().capitalize();
};

var formatCnae = function(cnae) {
	if (cnae.length > 50) {
		var words = cnae.split(" ");
		var size = words.length - 1;
		while (cnae.length >= 40) {
			cnae = words.slice(0, size).join(" ");
			size--;
		}
	}

	return cnae;
}

var columns = [
	{ 
		field: 'name',
		title: 'Name',
		width: 500,
		template: '#= formatName(name) #'
	},
	{
		field: 'fantasy_name',
		title: 'Fantasy Name',
		width: 150,
		template: '#= formatName(fantasy_name) #'
	},
	{
		field: 'neighborhood',
		title: 'Neighborhood',
		width: 120
	},
	{
		field: 'city',
		title: 'City',
		width: 150
	},
	{
		field: 'state',
		title: 'State',
		width: 80
	},
	{
		field: 'cnae_p_label',
		title: 'CNAE Primary',
		width: 110,
		template: '<div title= "#= cnae_p_label #"> #= formatCnae(cnae_p_label) # </div>'
	}
];

var filterOptions = {
	extra: false,
	operators: {
		string: {
			contains: 'Contains',
			doesnotcontain: 'Doesn\'t contain',
			equals: 'Equals'
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
  	navigable: true,
  	filterable: filterOptions
});
