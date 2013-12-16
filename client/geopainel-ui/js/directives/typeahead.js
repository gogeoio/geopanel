"use strict";

App.directive('appTypeahead', ['$parse', '$filter', function($parse, $filter) {
	'use strict';

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function postLink(scope, element, attrs, controller) {

			var value = $parse(attrs.appTypeahead)(scope);
			var selection = $parse(attrs.selection)(scope);

			scope.$watch(attrs.appTypeahead, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					value = newValue;
				}
			});

			element.attr('data-provide', 'typeahead');
			element.typeahead({

				source: function (query, callback) {
					return angular.isFunction(value) ? value.apply(null, arguments) : value;
				},
				minLength: attrs.minLength || 1,
				items: attrs.items,
				updater: function(value) {

					if (angular.isFunction(selection)) {
						selection.apply(null, arguments);
					}
					return value;
				},
				matcher: function(value) {
					var val = $filter('removeAccents')(value);
					var query = $filter('removeAccents')(this.query);

					return ~val.indexOf(query);
				},
				highlighter : function(value) {

					var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
					query = query.replace(/a/i, '[aáÁàÀâÂäÄãÃ]');
					query = query.replace(/e/i, '[eéÉèÈêÊëË]');
					query = query.replace(/i/i, '[iíÍìÌîÎïÏ]');
					query = query.replace(/o/i, '[oóÓòÒôÔöÖõÕ]');
					query = query.replace(/u/i, '[uúÚùÙûÛüÜ]');
					query = query.replace(/c/i, '[cçÇ]');

					return value.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
						return '<strong>' + match + '</strong>';
					});
				},
				sorter: function(items) {

					var beginswith = []
					, caseSensitive = []
					, caseInsensitive = []
					, item
					, expression;

					while (item = items.shift()) {
						expression = $filter('removeAccents')(item);

						if (expression.indexOf(this.query) == 0) {
							beginswith.push(item)
						} else if (~expression.indexOf(this.query)) {
							caseSensitive.push(item) 
						} else {
							caseInsensitive.push(item)
						}
					}
					return beginswith.concat(caseSensitive, caseInsensitive)
				}
			});

			var typeahead = element.data('typeahead');

			typeahead.lookup = function (ev) {
				var items;
				this.query = this.$element.val() || '';
				if (this.query.length < this.options.minLength) {
					return this.shown ? this.hide() : this;
				}
				items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source;
				return items ? this.process(items) : this;
			};

			if (attrs.minLength === "0") {
				setTimeout(function() {
					element.on('focus', function() {
						setTimeout(element.typeahead.bind(element, 'lookup'), 200);
					});
				});
			}

		}
	};

}]);

