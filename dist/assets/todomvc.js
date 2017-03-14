"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('todomvc/app', ['exports', 'ember', 'todomvc/resolver', 'ember-load-initializers', 'todomvc/config/environment'], function (exports, _ember, _todomvcResolver, _emberLoadInitializers, _todomvcConfigEnvironment) {

	var App = undefined;

	_ember['default'].MODEL_FACTORY_INJECTIONS = true;

	App = _ember['default'].Application.extend({
		modulePrefix: _todomvcConfigEnvironment['default'].modulePrefix,
		podModulePrefix: _todomvcConfigEnvironment['default'].podModulePrefix,
		Resolver: _todomvcResolver['default']
	});

	(0, _emberLoadInitializers['default'])(App, _todomvcConfigEnvironment['default'].modulePrefix);

	exports['default'] = App;
});
define('todomvc/components/todo-item', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		repo: _ember['default'].inject.service(),
		tagName: 'li',
		editing: false,
		classNameBindings: ['todo.completed', 'editing'],
		showCalendar: false,

		actions: {
			startEditing: function startEditing() {
				this.get('onStartEdit')();
				this.set('editing', true);
				_ember['default'].run.scheduleOnce('afterRender', this, 'focusInput');
			},

			doneEditing: function doneEditing(todoTitle) {
				if (!this.get('editing')) {
					return;
				}
				if (_ember['default'].isBlank(todoTitle)) {
					this.send('removeTodo');
				} else {
					this.set('todo.title', todoTitle.trim());
					this.set('editing', false);
					this.get('onEndEdit')();
				}
			},

			handleKeydown: function handleKeydown(e) {
				if (e.keyCode === 13) {
					e.target.blur();
				} else if (e.keyCode === 27) {
					this.set('editing', false);
				}
			},

			toggleCompleted: function toggleCompleted(e) {
				var todo = this.get('todo');
				_ember['default'].set(todo, 'completed', e.target.checked);
				this.get('repo').persist();
			},

			removeTodo: function removeTodo() {
				this.get('repo')['delete'](this.get('todo'));
			},

			showCalendar: function showCalendar() {
				this.set('showCalendar', true);
			}
		},

		focusInput: function focusInput() {
			this.element.querySelector('input.edit').focus();
		}
	});
});
define('todomvc/components/todo-list', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({
		repo: _ember['default'].inject.service(),
		tagName: 'section',
		elementId: 'main',
		canToggle: true,
		allCompleted: _ember['default'].computed('todos.@each.completed', function () {
			return this.get('todos').isEvery('completed');
		}),

		actions: {
			enableToggle: function enableToggle() {
				this.set('canToggle', true);
			},

			disableToggle: function disableToggle() {
				this.set('canToggle', false);
			},

			toggleAll: function toggleAll() {
				var allCompleted = this.get('allCompleted');
				this.get('todos').forEach(function (todo) {
					return _ember['default'].set(todo, 'completed', !allCompleted);
				});
				this.get('repo').persist();
			}
		}
	});
});
define('todomvc/controllers/active', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Controller.extend({
		todos: _ember['default'].computed.filterBy('model', 'completed', false)
	});
});
define('todomvc/controllers/application', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Controller.extend({
		repo: _ember['default'].inject.service(),
		remaining: _ember['default'].computed.filterBy('model', 'completed', false),
		completed: _ember['default'].computed.filterBy('model', 'completed'),
		actions: {
			createTodo: function createTodo(e) {
				if (e.keyCode === 13 && !_ember['default'].isBlank(e.target.value)) {
					this.get('repo').add({ title: e.target.value.trim(), completed: false });
					e.target.value = '';
				}
			},

			clearCompleted: function clearCompleted() {
				this.get('model').removeObjects(this.get('completed'));
				this.get('repo').persist();
			}
		}
	});
});
define('todomvc/controllers/completed', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Controller.extend({
		todos: _ember['default'].computed.filterBy('model', 'completed', true)
	});
});
define('todomvc/helpers/app-version', ['exports', 'ember', 'todomvc/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _todomvcConfigEnvironment, _emberCliAppVersionUtilsRegexp) {
  exports.appVersion = appVersion;
  var version = _todomvcConfigEnvironment['default'].APP.version;

  function appVersion(_) {
    var hash = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (hash.hideSha) {
      return version.match(_emberCliAppVersionUtilsRegexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_emberCliAppVersionUtilsRegexp.shaRegExp)[0];
    }

    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('todomvc/helpers/gt', ['exports', 'ember'], function (exports, _ember) {
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	exports.gt = gt;

	function gt(_ref /*, hash*/) {
		var _ref2 = _slicedToArray(_ref, 2);

		var n1 = _ref2[0];
		var n2 = _ref2[1];

		return n1 > n2;
	}

	exports['default'] = _ember['default'].Helper.helper(gt);
});
define('todomvc/helpers/pluralize', ['exports', 'ember', 'ember-inflector'], function (exports, _ember, _emberInflector) {
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	exports.pluralizeHelper = pluralizeHelper;

	function pluralizeHelper(_ref /*, hash*/) {
		var _ref2 = _slicedToArray(_ref, 2);

		var singular = _ref2[0];
		var count = _ref2[1];

		return count === 1 ? singular : (0, _emberInflector.pluralize)(singular);
	}

	exports['default'] = _ember['default'].Helper.helper(pluralizeHelper);
});
define('todomvc/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('todomvc/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'todomvc/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _todomvcConfigEnvironment) {
  var _config$APP = _todomvcConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('todomvc/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('todomvc/initializers/export-application-global', ['exports', 'ember', 'todomvc/config/environment'], function (exports, _ember, _todomvcConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_todomvcConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _todomvcConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_todomvcConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('todomvc/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('todomvc/router', ['exports', 'ember', 'todomvc/config/environment'], function (exports, _ember, _todomvcConfigEnvironment) {

	var Router = _ember['default'].Router.extend({
		location: _todomvcConfigEnvironment['default'].locationType,
		rootURL: _todomvcConfigEnvironment['default'].rootURL
	});

	Router.map(function () {
		this.route('active');
		this.route('completed');
	});

	exports['default'] = Router;
});
define('todomvc/routes/application', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Route.extend({
		repo: _ember['default'].inject.service(),
		model: function model() {
			return this.get('repo').findAll();
		}
	});
});
define('todomvc/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('todomvc/services/repo', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Service.extend({
		lastId: 0,
		data: null,
		findAll: function findAll() {
			return this.get('data') || this.set('data', JSON.parse(window.localStorage.getItem('todos') || '[]'));
		},

		add: function add(attrs) {
			var todo = Object.assign({ id: this.incrementProperty('lastId') }, attrs);
			this.get('data').pushObject(todo);
			this.persist();
			return todo;
		},

		'delete': function _delete(todo) {
			this.get('data').removeObject(todo);
			this.persist();
		},

		persist: function persist() {
			window.localStorage.setItem('todos', JSON.stringify(this.get('data')));
		}
	});
});
define("todomvc/templates/active", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "8O3lZSvu", "block": "{\"statements\":[[\"append\",[\"helper\",[\"todo-list\"],null,[[\"todos\"],[[\"get\",[\"todos\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "todomvc/templates/active.hbs" } });
});
define("todomvc/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QNmHycYw", "block": "{\"statements\":[[\"open-element\",\"section\",[]],[\"static-attr\",\"id\",\"todoapp\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"header\",[]],[\"static-attr\",\"id\",\"header\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"todos\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"text\"],[\"static-attr\",\"id\",\"new-todo\"],[\"dynamic-attr\",\"onkeydown\",[\"helper\",[\"action\"],[[\"get\",[null]],\"createTodo\"],null],null],[\"static-attr\",\"placeholder\",\"What needs to be done?\"],[\"static-attr\",\"autofocus\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"helper\",[\"gt\"],[[\"get\",[\"model\",\"length\"]],0],null]],null,4],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"footer\",[]],[\"static-attr\",\"id\",\"info\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Double-click to edit a todo\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"\\n    Created by\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"http://github.com/cibernox\"],[\"flush-element\"],[\"text\",\"Miguel Camba\"],[\"close-element\"],[\"text\",\",\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"http://github.com/addyosmani\"],[\"flush-element\"],[\"text\",\"Addy Osmani\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Part of \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"http://todomvc.com\"],[\"flush-element\"],[\"text\",\"TodoMVC\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"          \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"id\",\"clear-completed\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"clearCompleted\"],null],null],[\"flush-element\"],[\"text\",\"Clear completed\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Completed\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Active\"]],\"locals\":[]},{\"statements\":[[\"text\",\"All\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"footer\",[]],[\"static-attr\",\"id\",\"footer\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"id\",\"todo-count\"],[\"flush-element\"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"remaining\",\"length\"]],false],[\"close-element\"],[\"text\",\" \"],[\"append\",[\"helper\",[\"pluralize\"],[\"item\",[\"get\",[\"remaining\",\"length\"]]],null],false],[\"text\",\" left\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"id\",\"filters\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"index\"],[[\"activeClass\"],[\"selected\"]],3],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"active\"],[[\"activeClass\"],[\"selected\"]],2],[\"close-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"completed\"],[[\"activeClass\"],[\"selected\"]],1],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"completed\",\"length\"]]],null,0],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "todomvc/templates/application.hbs" } });
});
define("todomvc/templates/completed", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "7qyGvTPX", "block": "{\"statements\":[[\"append\",[\"helper\",[\"todo-list\"],null,[[\"todos\"],[[\"get\",[\"todos\"]]]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "todomvc/templates/completed.hbs" } });
});
define("todomvc/templates/components/todo-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "BXqB+g8h", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"view\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"checkbox\"],[\"static-attr\",\"class\",\"toggle\"],[\"dynamic-attr\",\"checked\",[\"unknown\",[\"todo\",\"completed\"]],null],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"toggleCompleted\"],null],null],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"label\",[]],[\"dynamic-attr\",\"ondblclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"startEditing\"],null],null],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"todo\",\"title\"]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"date\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"unless\"],[[\"get\",[\"showCalendar\"]]],null,1,0],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"removeTodo\"],null],null],[\"static-attr\",\"class\",\"destroy\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"text\"],[\"static-attr\",\"class\",\"edit\"],[\"dynamic-attr\",\"value\",[\"unknown\",[\"todo\",\"title\"]],null],[\"dynamic-attr\",\"onblur\",[\"helper\",[\"action\"],[[\"get\",[null]],\"doneEditing\"],[[\"value\"],[\"target.value\"]]],null],[\"dynamic-attr\",\"onkeydown\",[\"helper\",[\"action\"],[[\"get\",[null]],\"handleKeydown\"],null],null],[\"static-attr\",\"autofocus\",\"\"],[\"flush-element\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"date\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"button\",[]],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showCalendar\"],null],null],[\"flush-element\"],[\"text\",\"calendar\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "todomvc/templates/components/todo-item.hbs" } });
});
define("todomvc/templates/components/todo-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+yC2joV7", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"todos\",\"length\"]]],null,2]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"append\",[\"helper\",[\"todo-item\"],null,[[\"todo\",\"onStartEdit\",\"onEndEdit\"],[[\"get\",[\"todo\"]],[\"helper\",[\"action\"],[[\"get\",[null]],\"disableToggle\"],null],[\"helper\",[\"action\"],[[\"get\",[null]],\"enableToggle\"],null]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"todo\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"checkbox\"],[\"static-attr\",\"id\",\"toggle-all\"],[\"dynamic-attr\",\"checked\",[\"unknown\",[\"allCompleted\"]],null],[\"dynamic-attr\",\"onchange\",[\"helper\",[\"action\"],[[\"get\",[null]],\"toggleAll\"],null],null],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"canToggle\"]]],null,1],[\"text\",\"  \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"id\",\"todo-list\"],[\"static-attr\",\"class\",\"todo-list\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"todos\"]]],null,0],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "todomvc/templates/components/todo-list.hbs" } });
});
define("todomvc/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "StDDpEzJ", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"model\",\"length\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"append\",[\"helper\",[\"todo-list\"],null,[[\"todos\"],[[\"get\",[\"model\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "todomvc/templates/index.hbs" } });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('todomvc/config/environment', ['ember'], function(Ember) {
  var prefix = 'todomvc';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("todomvc/app")["default"].create({"name":"todomvc","version":"0.0.0+2251d722"});
}

/* jshint ignore:end */
//# sourceMappingURL=todomvc.map
