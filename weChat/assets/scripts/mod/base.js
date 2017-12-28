define(function(require, exports, module) {
    var $ = require('zepto'), Zepto, jQuery;
    jQuery = Zepto = $;
    require('./tools');
    require('./storageCache');
	var config = {
	    key: '29817749',
	    km_api: server + 'km_task/'
	};
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

    function weChatAuth(){
        var ss = window.location.pathname.split('.html')[0], sArr = ss.split('/');
        $.ajax({
            url: config.km_api + 'api/v1/wx/mp/oauth2/build_authorize_url',
            data: {
                app_key: config.key,
                auth_token: Tools.auth_token(),
                state: sArr[sArr.length-1]
            },
            type: 'GET',
            dataType: "jsonp",
            xhrFields: {
                withCredentials: true
            },
            jsonpCallback:"jsonp"+Math.ceil(Math.random()*1000),
            success: function(data){
                window.location = data.data.url;
            }
        });
    }
    var we_chat = {
        user: Storage.getCache(Storage.AUTH),
        setAuth: function(auth){
            var expire = 60*60*24*3;
            Storage.setCache(Storage.AUTH, auth, expire);
        }
    }
    function check_weChat_accredit(){
        if(we_chat.user){
            return we_chat.user;
        }else{
            if(Tools.auth_token()){
                we_chat.setAuth(Tools.auth_token());
                 return Tools.auth_token();
            }else{
                weChatAuth();
            }
        }
    }

	function preCheck(data){
        var opt, fun = function(){};
        if(!data.status){
            Tools.alertDialog({
                title: "出错了",
                text: "没有返回status"
            });
            return;
        }
        if(/1001|1002|1003|1009|1101|1015/.test(data.status)){
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
        }else if(/1004|1013|10005/.test(data.status)){
            weChatAuth();
            return false;
        }else{
            opt = null; return true;
        }
        if(opt != null ) {  Tools.alertDialog(opt, fun); return false; }
    }
    module.exports = {
        checkAccredit: check_weChat_accredit,
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
            check_weChat_accredit();
            var us = navigator.userAgent, key = config.key, auth_token = check_weChat_accredit();
    		var appkey = {name: 'app_key', value: key};
    		if (options.showLoading) {
                if($('.ui-loading-block').length == 0)
                    $('body').append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>');
                else
                    $('.ui-loading-block').addClass('show');
	        }
	        if(!options.data) options.data={};
	        if($.isFunction(options.data.push)){
	            options.data.push(appkey);
	        }else{
	            options.data.app_key = key;
	        }
            if($.isFunction(options.data.push)){
                options.data.push({name: 'auth_token', value: auth_token});
            }else{
                options.data.auth_token = auth_token;
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
		             }
		            if(preCheck(data)){
		                callback(data);
		            }
		        },
		        error: function(xhr,errorType , error) {
		            console.log(xhr);
		            if(options.showLoading){
                        $('.ui-loading-block').removeClass('show');
		            }
		        }
		    });
    	},
        custom: function(options, callback){
            var that = this;
            options = options || {};
            that.baseAjax(options, callback);
        }
    };

});