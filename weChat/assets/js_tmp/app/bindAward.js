define("app/bindAward", [ "../mod/base", "../plugs/popups.js" ], function(require, exports, module) {
    var Ajax = require("../mod/base"), popups = require("../plugs/popups.js");
    Ajax.custom({
        url: "api/v1/business/wx_mp/bind_reward/status"
    }, function(data) {
        if (data.status == 1e3) {
            var d = data.data;
            if (d.received) {
                $("#status,#bind").remove();
                $("#km_wechat").show();
                $("#msg").html("<p>您的微信号与" + d.phone + "绑定成功</p><p>已收入" + d.coin + "金币到快马小报账户了</p>");
                $("#msg").parent().show();
            } else {
                $("#msg").html("<p>您的微信号与" + d.phone + "绑定成功</p><p>送您" + d.coin + "金币奖励！</p>");
                $("#bind").html('<a class="get200" href="javascript:void(0)">立即领取</a>');
                $("#msg").parent().show();
            }
        } else {
            Tools.alertDialog({
                text: data.desc
            });
        }
    });
    $("#bind").on("click", ".get200", function() {
        Ajax.custom({
            url: "api/v1/business/wx_mp/bind_reward/receive"
        }, function(data) {
            if (data.status == 1e3) {
                new popups({
                    title: "成功领取200金币",
                    img: "../image/ok.png",
                    sureTxt: "去快马小报查看"
                }, function(a) {
                    if (a) {
                        window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser";
                    }
                });
            } else {
                Tools.alertDialog({
                    text: data.desc
                });
            }
        });
    });
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
                auth_token: "",
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
            var us = navigator.userAgent, key = config.key, auth_token = Storage.getCache(Storage.AUTH) || Tools.getQueryValue("auth_token");
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
});