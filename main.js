require.load = function(context, moduleName, url) {
	var config = (context || context.config) || {},
		isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
		isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
		makeError = function (id, msg, err, requireModules) {
            var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
            e.requireType = id;
            e.requireModules = requireModules;
            if (err) e.originalError = err;
            return e;
        },
        _method,
        _setting;

    _method = "GET";

    _setting = {
				method: _method,
				mode: "no-cors",
				synchronous_flag: false,
				cache: "default"
				};

    if (isBrowser) {
        fetch(url, _setting).then(function(response) {
        	if (response.headers.get('Content-Type') === 'application/json') {
        		response.clone().json().then(function(json) {
        			new Function(json)();

        			context.completeLoad(moduleName);
        		}); 
        	} else {
        		response.clone().text().then(function(text) {
        			new Function(text)();

        			context.completeLoad(moduleName);

        		});
        	}
        }).catch(function(err) {
        	context.onError(makeError('scripterror', 'executing script failed for ' + moduleName + ' at ' + url, err, [moduleName]));
       	});
    } else {
    	try {
            importScripts(url);
            context.completeLoad(moduleName);
        } catch (e) {
            context.onError(makeError('importscripts', 'importScripts failed for ' + moduleName + ' at ' + url, e, [moduleName]));
        }
    }
};

require(["./modules/lodash/index.js"], function(_) {
		var a = _.assign({ 'a': 1 }, { 'b': 2 }, { 'c': 3 });
		var b = _.map([1, 2, 3], function(n) { return n * 3; });

		document.getElementById( 'lodash-code' ).innerHTML = '<p>' + JSON.stringify( a ) + '<br/>' + JSON.stringify( b ) + '</p>';
	} 
);

require(['./modules/async/index.js'], function(async) {
		var arr = ['1','2'];

		async.map(arr, getInfo, function (e, r) {
			document.getElementById( 'async-code' ).innerHTML =  '<p>async: ' + JSON.stringify( r ) + '</p>';
		});

		function getInfo(name, callback) {
  			setTimeout(function() {
    			callback(null, name + 'new');
			}, 1000);
		}
	} 
);
require(['./modules/gsap/index.js'], function() {
		var box = document.getElementById("greenBox"),
			count = 0,
			tween;

		tween = TweenMax.to(box, 2, {left:"100%", repeat:10, yoyo:true, onRepeat:onRepeat, repeatDelay:0.5, ease:Linear.easeNone});

		function onRepeat() {
    		count++;
    		box.innerHTML = count;
    		TweenLite.set(box, {backgroundColor:"hsl(" + Math.random() * 255 + ", 90%, 60%)"});
		}
	}
);

// lodash code

//var a = _.assign({ 'a': 1 }, { 'b': 2 }, { 'c': 3 });
//var b = _.map([1, 2, 3], function(n) { return n * 3; });



// async code



// gsap - tweenmax code
