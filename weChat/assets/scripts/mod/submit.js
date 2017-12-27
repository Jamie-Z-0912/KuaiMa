define(function(require, exports, module) {
	var Ajax = require('./base');
    window.Ajax = Ajax;

    String.prototype.isEmail = function() {
        return (new RegExp(
                /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/)
            .test(this));
    };
	String.prototype.isMobile = function(){
	    return (new RegExp(/^1[3|4|5|7|8]\d{9}$/).test(this));
	}
	String.prototype.isChinese = function(){
	    return (/^[\u4E00-\uFA29]*$/.test(this))&&!(/^[\uE7C7-\uE7F3]*$/).test(this);
	}
    String.prototype.isEmpty = function() {
        return (/^\s*$/.test(this));
    };
    String.prototype.isVerifyCode = function() {
        return (new RegExp(/^\d*$/).test(this));
    };
	String.prototype.isNum = function(){
	    return (/^[0-9]+$/.test(this));
	}

	exports.fun = function(options, callback){
        var formData,
            isForm = typeof options.data != 'string' && !!options.data.length,
            btnSubmit;

        if (isForm) {
            formData = options.data.serializeArray();
            btnSubmit = options.data.find('[type="submit"]');
            btnSubmit.attr('disabled', true);
        } else {
            formData = options.data;
        }
        $.each(formData, function(){
            this.value = this.value.replace(/\s/ig,'');
        })

        options.data = formData;
        options.type = options.type || 'GET';
        options.logtype = 'submit';

        Ajax.baseAjax(options, function(response, textStatus, jqXHR) {
            if (isForm) {
                btnSubmit.removeAttr('disabled');
            }
            if (typeof callback == 'function') {
                callback(response);
            }
        }, function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.statusText);
            if (isForm) {
                btnSubmit.removeAttr('disabled');
            }
            if (typeof callbackError == 'function') {
                callbackError(jqXHR, textStatus, errorThrown);
            }
        });
    };
    exports.sendSms = function(btnSend, options, callback){
        var opt = {
            phone: '',
            uid:'',
            type: 'SMS',
            useto: ''
        }
        for (var i in opt) {
            opt[i] = options[i] || opt[i];
        };
        var inte, duration = 60;
        if(inte){ clearInterval(inte); }
        btnSend.addClass('disabled').text('发送中···');
        Ajax.custom({
            url: 'api/v1/verify_code/web',
            data: opt
        }, function(data){
            if(data.status == 1000){
                inte = setInterval(function(){
                    duration--;
                    if(duration == 0){
                        clearInterval(inte);
                        btnSend.removeClass('disabled').text('重发验证码');
                        return;
                    }
                    btnSend.text('还剩' + duration + '秒');
                },1000);
            }else{
                if(data.status == 2003){
                    Tools.alertDialog({
                        title: "获取失败",
                        text: "获取验证码太频繁，请明日再试"
                    },function(){
                        btnSend.text('明日再获取');
                    });
                }else{
                    Tools.alertDialog({
                        title: data.status,
                        text: data.desc
                    });
                }
            }
            $.isFunction(callback) && callback(data);
        });
    }
});