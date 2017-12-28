define("app/bind", [ "../mod/submit", "../plugs/popups.js", "../plugs/cookie.js" ], function(require, exports, module) {
    var submit = require("../mod/submit"), popups = require("../plugs/popups.js");
    require("../plugs/cookie.js");
    var we_chat = {
        user: Storage.getCache(Storage.AUTH),
        setAuth: function(auth) {
            var expire = 60 * 60 * 24 * 3;
            Storage.setCache(Storage.AUTH, auth, expire);
        },
        removeAuth: function() {
            Storage.remove(Storage.AUTH);
        }
    };
    if (Tools.getQueryValue("code") == "") {
        var auth = Ajax.checkAccredit();
        new popups({
            topTxt: "您已经绑定过账号了！一个微信号只能绑定一次哦！",
            img: "../image/no.png"
        });
    } else {
        if (we_chat.user) we_chat.removeAuth();
        $('input[name="code"]').val(Tools.getQueryValue("code"));
    }
    var gvCode = Math.random().toFixed(4).substring(2);
    $("#gvCodeInput, #gvCode").text(gvCode);
    $("#gvCodeInput").bind("input propertychange", function(e) {
        var that = $(this), gv = that.val();
        if (gv.length > 3) {
            if (gv == gvCode) {
                that.attr("disabled", "disabled");
                $("#subForm").removeClass("disabled");
                that.parent().next().show();
                $("#yuyin").css("display", "block");
                return;
            } else {
                that.val("");
                return;
            }
        }
    });
    seajs.use("../scripts/lib/jquery.base64", function() {
        $("#repeatSend,#yuyin").on("click", function() {
            var phone = $('input[name="phone"]').val();
            var type = $(this).data("type");
            if (phone.isEmpty()) {
                Tools.alertDialog({
                    text: "手机号不能为空"
                });
                return;
            }
            if (!phone.isMobile()) {
                Tools.alertDialog({
                    text: "手机号格式不正确"
                });
                return;
            }
            if (!$(this).hasClass("disabled")) {
                $("#yuyin").addClass("disabled");
                setTimeout(function() {
                    $("#yuyin").removeClass("disabled");
                }, 6e4);
                Cookie.set("_KKMMMMMCMMM", Ajax.formatDate(new Date().getTime(), "yyyyMMdd"));
                submit.sendSms($("#repeatSend"), {
                    phone: base64.encode(phone),
                    useto: "bindAccount",
                    type: type
                });
            }
        });
    });
    $("#subForm").on("click", function() {
        if (!$(this).hasClass("disabled")) {
            $("#bindUser").submit();
        }
    });
    $("#bindUser").submit(function(e) {
        e.preventDefault();
        var curEl = $(this);
        var phone = $('input[name="phone"]').val();
        var code = $('input[name="verify_code"]').val();
        if (phone.isEmpty()) {
            Tools.alertDialog({
                text: "手机号不能为空"
            });
            return;
        }
        if (!phone.isMobile()) {
            Tools.alertDialog({
                text: "手机号格式不正确"
            });
            return;
        }
        if (code.isEmpty()) {
            Tools.alertDialog({
                text: "验证码不能为空"
            });
            return;
        }
        if (!code.isVerifyCode()) {
            Tools.alertDialog({
                text: "请正确输入收到的验证码"
            });
            return;
        }
        submit.fun({
            url: "api/v1/register/bind_wx",
            data: $(this)
        }, function(data) {
            if (data.status == 1e3) {
                we_chat.setAuth(data.data.auth_token);
                if (Storage.get("kmBindReward")) Storage.remove("kmBindReward");
                new popups({
                    title: '<img src="../image/bind_suc.png"/>',
                    img: "../image/ok.png",
                    botTxt: "3秒后为您自动跳转……"
                });
                setTimeout(function() {
                    window.location = "bindAward.html";
                }, 3e3);
            }
        });
    });
});define("mod/submit", [ "./base" ], function(require, exports, module) {
    var Ajax = require("./base");
    window.Ajax = Ajax;
    String.prototype.isEmail = function() {
        return new RegExp(/^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(this);
    };
    String.prototype.isMobile = function() {
        return new RegExp(/^1[3|4|5|7|8]\d{9}$/).test(this);
    };
    String.prototype.isChinese = function() {
        return /^[\u4E00-\uFA29]*$/.test(this) && !/^[\uE7C7-\uE7F3]*$/.test(this);
    };
    String.prototype.isEmpty = function() {
        return /^\s*$/.test(this);
    };
    String.prototype.isVerifyCode = function() {
        return new RegExp(/^\d*$/).test(this);
    };
    String.prototype.isNum = function() {
        return /^[0-9]+$/.test(this);
    };
    exports.fun = function(options, callback) {
        var formData, isForm = typeof options.data != "string" && !!options.data.length, btnSubmit;
        if (isForm) {
            formData = options.data.serializeArray();
            btnSubmit = options.data.find('[type="submit"]');
            btnSubmit.attr("disabled", true);
        } else {
            formData = options.data;
        }
        $.each(formData, function() {
            this.value = this.value.replace(/\s/gi, "");
        });
        options.data = formData;
        options.type = options.type || "GET";
        options.logtype = "submit";
        Ajax.baseAjax(options, function(response, textStatus, jqXHR) {
            if (isForm) {
                btnSubmit.removeAttr("disabled");
            }
            if (typeof callback == "function") {
                callback(response);
            }
        }, function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.statusText);
            if (isForm) {
                btnSubmit.removeAttr("disabled");
            }
            if (typeof callbackError == "function") {
                callbackError(jqXHR, textStatus, errorThrown);
            }
        });
    };
    exports.sendSms = function(btnSend, options, callback) {
        var opt = {
            phone: "",
            uid: "",
            type: "SMS",
            useto: ""
        };
        for (var i in opt) {
            opt[i] = options[i] || opt[i];
        }
        var inte, duration = 60;
        if (inte) {
            clearInterval(inte);
        }
        btnSend.addClass("disabled").text("发送中···");
        Ajax.custom({
            url: "api/v1/verify_code/web",
            data: opt
        }, function(data) {
            if (data.status == 1e3) {
                inte = setInterval(function() {
                    duration--;
                    if (duration == 0) {
                        clearInterval(inte);
                        btnSend.removeClass("disabled").text("重发验证码");
                        return;
                    }
                    btnSend.text("还剩" + duration + "秒");
                }, 1e3);
            } else {
                if (data.status == 2003) {
                    Tools.alertDialog({
                        title: "获取失败",
                        text: "获取验证码太频繁，请明日再试"
                    }, function() {
                        btnSend.text("明日再获取");
                    });
                } else {
                    Tools.alertDialog({
                        title: data.status,
                        text: data.desc
                    });
                }
            }
            $.isFunction(callback) && callback(data);
        });
    };
});define("mod/base", [ "zepto", "./tools", "./storageCache" ], function(require, exports, module) {
    var $ = require("zepto"), Zepto, jQuery;
    jQuery = Zepto = $;
    require("./tools");
    require("./storageCache");
    var config = {
        key: "29817749",
        km_api: server + "km_task/"
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
            S: that.getMilliseconds()
        };
        if (/(y+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (that.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(pattern)) {
                pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return pattern;
    }
    function weChatAuth() {
        var ss = window.location.pathname.split(".html")[0], sArr = ss.split("/");
        $.ajax({
            url: config.km_api + "api/v1/wx/mp/oauth2/build_authorize_url",
            data: {
                app_key: config.key,
                auth_token: Tools.auth_token(),
                state: sArr[sArr.length - 1]
            },
            type: "GET",
            dataType: "jsonp",
            xhrFields: {
                withCredentials: true
            },
            jsonpCallback: "jsonp" + Math.ceil(Math.random() * 1e3),
            success: function(data) {
                window.location = data.data.url;
            }
        });
    }
    var we_chat = {
        user: Storage.getCache(Storage.AUTH),
        setAuth: function(auth) {
            var expire = 60 * 60 * 24 * 3;
            Storage.setCache(Storage.AUTH, auth, expire);
        }
    };
    function check_weChat_accredit() {
        if (we_chat.user) {
            return we_chat.user;
        } else {
            if (Tools.auth_token()) {
                we_chat.setAuth(Tools.auth_token());
                return Tools.auth_token();
            } else {
                weChatAuth();
            }
        }
    }
    function preCheck(data) {
        var opt, fun = function() {};
        if (!data.status) {
            Tools.alertDialog({
                title: "出错了",
                text: "没有返回status"
            });
            return;
        }
        if (/1001|1002|1003|1009|1101|1015/.test(data.status)) {
            opt = {
                title: "提醒",
                text: data.desc
            };
        } else if (/1006/.test(data.status)) {
            var n = 5;
            opt = {
                title: "提醒",
                text: "访问太过频繁，<span id='closeTimer'>" + n + "</span>s后自动刷新"
            };
            var ct = setInterval(function() {
                n--;
                if (n < 1) {
                    clearInterval(ct);
                    window.location.reload();
                }
                $("#closeTimer").text(n);
            }, 1e3);
        } else if (/1004|1013|10005/.test(data.status)) {
            weChatAuth();
            return false;
        } else {
            opt = null;
            return true;
        }
        if (opt != null) {
            Tools.alertDialog(opt, fun);
            return false;
        }
    }
    module.exports = {
        checkAccredit: check_weChat_accredit,
        formatDate: function(content, type) {
            var pattern = type || "yyyy-MM-dd hh:mm";
            if (isNaN(content) || content == null) {
                return content;
            } else if (typeof content == "object") {
                var y = dd.getFullYear(), m = dd.getMonth() + 1, d = dd.getDate();
                if (m < 10) {
                    m = "0" + m;
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
        baseAjax: function(options, callback) {
            check_weChat_accredit();
            var us = navigator.userAgent, key = config.key, auth_token = check_weChat_accredit();
            var appkey = {
                name: "app_key",
                value: key
            };
            if (options.showLoading) {
                if ($(".ui-loading-block").length == 0) $("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'); else $(".ui-loading-block").addClass("show");
            }
            if (!options.data) options.data = {};
            if ($.isFunction(options.data.push)) {
                options.data.push(appkey);
            } else {
                options.data.app_key = key;
            }
            if ($.isFunction(options.data.push)) {
                options.data.push({
                    name: "auth_token",
                    value: auth_token
                });
            } else {
                options.data.auth_token = auth_token;
            }
            $.ajax({
                url: config.km_api + options.url,
                data: options.data,
                type: "GET",
                dataType: "jsonp",
                xhrFields: {
                    withCredentials: true
                },
                jsonpCallback: "jsonp" + Math.ceil(Math.random() * 1e3),
                success: function(data) {
                    if (options.showLoading) {
                        $(".ui-loading-block").removeClass("show");
                    }
                    if (preCheck(data)) {
                        callback(data);
                    }
                },
                error: function(xhr, errorType, error) {
                    console.log(xhr);
                    if (options.showLoading) {
                        $(".ui-loading-block").removeClass("show");
                    }
                }
            });
        },
        custom: function(options, callback) {
            var that = this;
            options = options || {};
            that.baseAjax(options, callback);
        }
    };
});define("mod/tools", [], function(require) {
    var Tools = {
        getQueryValue: function(key) {
            var q = location.search, keyValuePairs = new Array();
            if (q.length > 1) {
                var idx = q.indexOf("?");
                q = q.substring(idx + 1, q.length);
            } else {
                q = null;
            }
            if (q) {
                for (var i = 0; i < q.split("&").length; i++) {
                    keyValuePairs[i] = q.split("&")[i];
                }
            }
            for (var j = 0; j < keyValuePairs.length; j++) {
                if (keyValuePairs[j].split("=")[0] == key) {
                    return decodeURI(keyValuePairs[j].split("=")[1]);
                }
            }
            return "";
        },
        auth_token: function() {
            return Tools.getQueryValue("auth_token");
        },
        alertDialog: function(options, callback) {
            var opt = {
                title: null,
                text: null,
                img: null,
                time: 3e3
            };
            for (var i in opt) {
                options[i] = options[i] || opt[i];
            }
            var dialogId = "tips" + new Date().getTime();
            var html = '<div id="' + dialogId + '" class="ui-popup-screen km-dialog">' + '<div class="ui-overlay-shadow km-popup">';
            if (options.time < 1) {
                html += '<i class="iconfont icon-close" id="close"></i>';
            }
            html += '<div class="content">';
            if (options.title != null && options.title != "") {
                html += "<h1>" + options.title + "</h1>";
            }
            if (options.text != null && options.text != "") {
                html += "<p>" + options.text + "</p>";
            }
            if (options.img != null && options.img != "") {
                html += '<div class="pic"><img src="' + options.img + '"/></div>';
            }
            html += "</div> </div> </div>";
            var popupDialogObj = $(html).appendTo("body");
            var c_h = $("#" + dialogId + " .km-popup").height();
            var s_h = $(window).height();
            var top = (s_h - c_h) / 2;
            $("#" + dialogId + " .km-popup").css("top", top);
            popupDialogObj.addClass("show-dialog");
            $("#close").click(function() {
                $("#" + dialogId).remove();
                $.isFunction(callback) && callback();
            });
            if (options.time > 0) {
                var t = options.time;
                setTimeout(function() {
                    $("#" + dialogId).remove();
                    $.isFunction(callback) && callback();
                }, t);
            }
        }
    };
    window.Tools = Tools;
});define("mod/storageCache", [], function() {
    var _maxExpireDate = new Date("Fri, 31 Dec 9999 23:59:59 UTC");
    var _defaultExpire = _maxExpireDate.getTime();
    var handleJSON = {
        serialize: function(item) {
            return JSON.stringify(item);
        },
        deserialize: function(data) {
            return data && JSON.parse(data);
        }
    };
    function CacheItem(value, exp) {
        var now = new Date().getTime();
        this.c = now;
        exp = exp || _defaultExpire;
        this.e = now + exp * 1e3;
        this.v = value;
    }
    function _isCacheItem(item) {
        if (typeof item !== "object") {
            return false;
        }
        if (item) {
            if ("c" in item && "e" in item && "v" in item) {
                return true;
            }
        }
        return false;
    }
    function _checkCacheItemIfEffective(cacheItem) {
        var timeNow = new Date().getTime();
        return timeNow < cacheItem.e;
    }
    var Storage = {
        AUTH: "KMAUTH",
        get: function(key, isSession) {
            if (!this.isLocalStorage()) {
                return;
            }
            var value = this.getStorage(isSession).getItem(key);
            if (value) {
                return JSON.parse(value);
            } else {
                return undefined;
            }
        },
        set: function(key, value, isSession) {
            if (!this.isLocalStorage()) {
                return;
            }
            value = JSON.stringify(value);
            this.getStorage(isSession).setItem(key, value);
        },
        remove: function(key, isSession) {
            if (!this.isLocalStorage()) {
                return;
            }
            this.getStorage(isSession).removeItem(key);
        },
        setCache: function(key, value, expire, isSession) {
            if (!this.isLocalStorage()) {
                return;
            }
            var cacheItem = new CacheItem(value, expire);
            this.getStorage(isSession).setItem(key, handleJSON.serialize(cacheItem));
        },
        getCache: function(key, isSession) {
            var cacheItem = null;
            try {
                var value = this.getStorage(isSession).getItem(key);
                cacheItem = handleJSON.deserialize(value);
            } catch (e) {
                return null;
            }
            if (_isCacheItem(cacheItem)) {
                if (_checkCacheItemIfEffective(cacheItem)) {
                    var value = cacheItem.v;
                    return value;
                } else {
                    this.remove(key);
                    return null;
                }
            }
            return null;
        },
        getStorage: function(isSession) {
            return isSession ? sessionStorage : localStorage;
        },
        isLocalStorage: function() {
            try {
                if (!window.localStorage) {
                    console.log("不支持本地存储");
                    return false;
                }
                return true;
            } catch (e) {
                console.log("本地存储已关闭");
                return false;
            }
        }
    };
    window.Storage = Storage;
});define("plugs/popups", [], function(require, exports, module) {
    var popups = function(option, callback) {
        var opt = {
            isClose: "",
            className: "",
            title: "",
            topTxt: "",
            img: "",
            botTxt: "",
            sureTxt: "",
            cancelTxt: ""
        };
        this.option = {};
        for (var i in opt) {
            this.option[i] = option[i] || opt[i];
        }
        this.id = "pop_" + new Date().getTime();
        this.init(callback);
    };
    popups.prototype.init = function(callback) {
        var that = this, opt = that.option;
        var arr = [];
        arr.push('<div class="pop-screen km-dialog" id="' + that.id + '">');
        arr.push('<div class="pop-content ' + opt.className + '">');
        if (opt.isClose == "yes") {
            arr.push('<div class="pop-close">x</div>');
        }
        opt.title != "" && arr.push('<div class="title">' + opt.title + "</div>");
        opt.topTxt != "" && arr.push('<div class="top_txt">' + opt.topTxt + "</div>");
        opt.img != "" && arr.push('<div class="pop-imgbox"><img src="' + opt.img + '" /></div>');
        opt.botTxt != "" && arr.push('<div class="bot_txt">' + opt.botTxt + "</div>");
        arr.push('<div class="pop-btn">');
        opt.sureTxt != "" && arr.push('<a class="yes">' + opt.sureTxt + "</a>");
        opt.cancelTxt != "" && arr.push('<a class="no">' + opt.cancelTxt + "</a>");
        arr.push("</div></div></div>");
        $("body").append(arr.join(""));
        var divId = "#" + that.id;
        var $con = $(divId + " .pop-content");
        $con.css("margin-top", parseInt((innerHeight - $con.height()) / 3));
        $(divId + " .pop-close").on("click", function() {
            that.close();
        });
        $(divId + " .yes").click(function() {
            $(divId).remove();
            $.isFunction(callback) && callback(true);
        });
        $(divId + " .no").click(function() {
            $(divId).remove();
            $.isFunction(callback) && callback(false);
        });
    };
    popups.prototype.close = function() {
        var $el = $("#" + this.id);
        $el.remove();
    };
    module.exports = popups;
});define("plugs/cookie", [], function() {
    var Cookie = {
        get: function(sname) {
            var sre = "(?:;)?" + sname + "=([^;]*);?";
            var ore = new RegExp(sre);
            if (ore.test(document.cookie)) {
                try {
                    return unescape(RegExp["$1"]);
                } catch (e) {
                    return null;
                }
            } else {
                return null;
            }
        },
        set: function(c_name, value, expires) {
            expires = expires || this.getExpDate(7, 0, 0);
            if (typeof expires == "number") {
                expires = this.getExpDate(expires, 0, 0);
            }
            document.cookie = c_name + "=" + escape(value) + (expires == null ? "" : ";expires=" + expires) + "; path=/";
        },
        remove: function(key) {
            this.set(key, "", -1);
        },
        getExpDate: function(e, t, n) {
            var r = new Date();
            if (typeof e == "number" && typeof t == "number" && typeof t == "number") return r.setDate(r.getDate() + parseInt(e)), 
            r.setHours(r.getHours() + parseInt(t)), r.setMinutes(r.getMinutes() + parseInt(n)), 
            r.toGMTString();
        }
    };
    window.Cookie = Cookie;
});