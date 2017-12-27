define(function(require, exports, module) {
	var Ajax = require('./base');
    var doT = require('../plugs/doT.min');
   	exports.fun = function(renderEle, renderFor, data, secTpl, isFirst){
		if ($(renderFor).length > 0 && data) {
	        var st = secTpl || undefined;
	        var gettpl = $(renderFor).text();
	        var result = doT.template(gettpl, undefined, st);
	        if(isFirst){
	            $(renderEle).html( result(data) );
	        }else{
	            $(renderEle).append( result(data) );
	        }
	    }
	}
})