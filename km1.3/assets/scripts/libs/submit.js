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
        return (new RegExp(/^\d{4}?$/).test(this));
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
});