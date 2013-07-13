var app = window.app || {};
app = (function () {
	var method, api;
	method = {boot: function () {app.Harness.boot();}};
	api    = {boot: function () {method.boot();}};
	return api;
}());

app.Harness = (function () {
	var property, method, api;
	method = {
		boot: function () {//boot all the things!
			app.Analytics.boot();
			//app.Module.boot();
		}
	};
	api = {boot: method.boot};
	return api;
}());

app.Module = (function () {
	var property, method, api;
	property = {
		locale: {}
	};
	method = {
		boot: function () {
			method.helloWorld();
			//method.getLocation();
		},
		helloWorld: function () {
			app.Dev.log('hello world!');
		},
		getLocation: function () {
			navigator.geolocation.getCurrentPosition(function (position) {method.setLocation(position);});
		},
		setLocation: function (position) {
			property.locale.lat = position.coords.latitude;
			property.locale.lon = position.coords.longitude;
			app.Dev.log('you seem to be here: ', property.locale);
		}
	};
	api = {
		boot: method.boot
	};
	return api;
}());

app.Analytics = (function () {
	var cfg, method, api;
	cfg = {
		domain: 'www.thehotticket.us',
		account_prod: 'UA-36087733-1',
		account_dev: 'UA-36087733-1',
		account: null
	};
	method = {
		boot: function () {
			cfg.account = cfg.account_dev;
			if (window.location.host.indexOf(cfg.domain) !== -1) {
				cfg.account = cfg.account_prod;
			}

			window._gaq = window._gaq || [];
			window._gaq.push(['_setAccount', cfg.account]);
			window._gaq.push(['_trackPageview']);

			app.Dev.log('cfg.account: ' + cfg.account);

			var g = document.createElement('script'),
				s = document.getElementsByTagName('script')[0];

			g.type = 'text/javascript';
			g.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			g.async = true;

			s.parentNode.insertBefore(g, s);
		}
	};
	api = {boot: function () {method.boot();}};
	return api;
}());

app.Dev = (function () {
	var property, method, api;
	property = {
		debugMode: true,
		label: null
	};
	method = {
		consoleLog: function (message, thing) {
			if (property.debugMode && typeof (console) !== 'undefined') {
				if (thing) {
					console.log(message, thing);
				} else {
					console.log(message);
				}
			}
		},
		consoleGroup: function (label) {
			if (property.debugMode && typeof (console) !== 'undefined' && console.groupCollapsed) {
				console.groupCollapsed(label);
			}
		},
		consoleGroupEnd: function () {
			if (property.debugMode && typeof (console) !== 'undefined' && console.groupEnd) {
				console.groupEnd();
			}
		},
		time: function (label) {
			if (property.debugMode && typeof (console) !== 'undefined' && console.time) {
				property.label = label;
				console.time(label);
			}
		},
		timeEnd: function () {
			if (property.debugMode && typeof (console) !== 'undefined' && console.timeEnd) {
				console.timeEnd(property.label);
				property.label = null;
			}
		}
	};
	api = {
		log: method.consoleLog,
		logGroupStart: method.consoleGroup,
		logGroupEnd: method.consoleGroupEnd
	};
	return api;
}());