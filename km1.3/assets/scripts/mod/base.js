define(function(require, exports, module) {
    var $ = require('zepto'), Zepto, jQuery;
    jQuery = Zepto = $;
    var doT = require('../plugs/doT.min');
	var config = {
	    key: '26817749',
	    km_api: server + 'km_task/'
	};
    require('./tools');
    function format(date, pattern) {
        var that = date;
        var o = {
            "M+": that.getMonth() + 1,
            "d+": that.getDate(),
            "h+": that.getHours(),
            "m+": that.getMinutes(),
            "s+": that.getSeconds(),
            "q+": Math.floor((that.getMonth() + 3) / 3),
            "S": that.getMilliseconds()
        };
        if (/(y+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (that.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(pattern)) {
                pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return pattern;
    };
	function preCheck(data){
        var opt, fun = function(){};
        if(!data.status){
            Tools.alertDialog({
                title: "出错了",
                text: "没有返回status"
            });
            return;
        }
        if(/1001|1002|1003|1004|1008|1009|1015/.test(data.status)){
            opt = { title: "提醒", text: data.desc };
        }else if(/1006/.test(data.status)){
            var n = 5;
            opt = { title: "提醒", text:"访问太过频繁，<span id='closeTimer'>"+ n +"</span>s后自动刷新" };
            var ct = setInterval(function(){
                n--;
                if(n<1){
                    clearInterval(ct);
                    window.location.reload();
                }
                $('#closeTimer').text(n);
            },1000);
        }else if(data.status == 1101){
            opt = { title: "提醒", text:"请打开设置->通用->日期与时间校准您的系统时间"};
        }else{
            opt = null; return true;
        }
        if(opt != null ) {  Tools.alertDialog(opt, fun); return false; }
    }

    module.exports = {
        formatDate: function(content, type){
            var pattern = type || "yyyy-MM-dd hh:mm";
            if (isNaN(content) || content == null) {
                return content;
            } else if (typeof(content) == 'object') {
                var y = dd.getFullYear(),
                    m = dd.getMonth() + 1,
                    d = dd.getDate();
                if (m < 10) {
                    m = '0' + m;
                }
                var yearMonthDay = y + "-" + m + "-" + d;
                var parts = yearMonthDay.match(/(\d+)/g);
                var date = new Date(parts[0], parts[1] - 1, parts[2]);
                return format(date, pattern);
            } else {
                var date = new Date(parseInt(content));
                return format(date, pattern);
            }
        },
    	baseAjax: function(options, callback){
    		var appkey = {name: 'app_key', value: config.key};
    		if (options.showLoading) {
                if($('.ui-loading-block').length == 0)
                    $('body').append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>');
                else
                    $('.ui-loading-block').addClass('show');
	            if(options.logtype != 'paging' || options.data.skip == 0){
	                $(options.renderEle).hide();
	            }
	        }

	        if(!options.data) options.data={};
	        if($.isFunction(options.data.push)){
	            options.data.push(appkey);
	        }else{
	            options.data.app_key = config.key;
	        }
            if($.isFunction(options.data.push)){
                options.data.push({name: 'auth_token', value: Tools.auth_token()});
            }else{
                options.data.auth_token = Tools.auth_token();
            }
    		$.ajax({
		        url: config.km_api + options.url,
		        data: options.data,
		        type: 'GET',
		        dataType: "jsonp",
		        xhrFields: {
		            withCredentials: true
		        },
		        jsonpCallback:"jsonp"+Math.ceil(Math.random()*1000),
		        success: function(data){
		            if (options.showLoading) {
                        $('.ui-loading-block').removeClass('show');
		                if(options.logtype != 'paging' || options.data.skip == 0){
		                    $(options.renderEle).show();
		                }
		             }
		            if(preCheck(data)){
		                callback(data)
		            }
		        },
		        error: function(xhr,errorType , error) {
		            console.log(xhr);
		            if(options.showLoading){
                        $('.ui-loading-block').removeClass('show');
		            }
		            if(options.logtype != 'paging'){
		                $(options.renderEle).show();
		            }
		        }
		    });
    	},
    	render: function(renderEle, renderFor, data, secTpl, isFirst){
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
    	},
        custom: function(options, callback){
            var that = this;
            options = options || {};
            options.logtype = 'custom';
            that.baseAjax(options, callback);
        }
    };

});