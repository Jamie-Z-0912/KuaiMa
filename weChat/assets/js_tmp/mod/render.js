define("mod/render", [ "./base", "../plugs/doT.min" ], function(require, exports, module) {
    var Ajax = require("./base");
    var doT = require("../plugs/doT.min");
    exports.fun = function(renderEle, renderFor, data, secTpl, isFirst) {
        if ($(renderFor).length > 0 && data) {
            var st = secTpl || undefined;
            var gettpl = $(renderFor).text();
            var result = doT.template(gettpl, undefined, st);
            if (isFirst) {
                $(renderEle).html(result(data));
            } else {
                $(renderEle).append(result(data));
            }
        }
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
});define("plugs/doT.min", [], function(require, exports, module) {
    function p(b, a, d) {
        return ("string" === typeof a ? a : a.toString()).replace(b.define || h, function(a, c, e, g) {
            0 === c.indexOf("def.") && (c = c.substring(4));
            c in d || (":" === e ? (b.defineParams && g.replace(b.defineParams, function(a, b, l) {
                d[c] = {
                    arg: b,
                    text: l
                };
            }), c in d || (d[c] = g)) : new Function("def", "def['" + c + "']=" + g)(d));
            return "";
        }).replace(b.use || h, function(a, c) {
            b.useParams && (c = c.replace(b.useParams, function(a, b, c, l) {
                if (d[c] && d[c].arg && l) return a = (c + ":" + l).replace(/'|\\/g, "_"), d.__exp = d.__exp || {}, 
                d.__exp[a] = d[c].text.replace(new RegExp("(^|[^\\w$])" + d[c].arg + "([^\\w$])", "g"), "$1" + l + "$2"), 
                b + "def.__exp['" + a + "']";
            }));
            var e = new Function("def", "return " + c)(d);
            return e ? p(b, e, d) : e;
        });
    }
    function k(b) {
        return b.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
    }
    var f = {
        version: "1.0.3",
        templateSettings: {
            evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
            interpolate: /\{\{=([\s\S]+?)\}\}/g,
            encode: /\{\{!([\s\S]+?)\}\}/g,
            use: /\{\{#([\s\S]+?)\}\}/g,
            useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
            define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
            defineParams: /^\s*([\w$]+):([\s\S]+)/,
            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
            iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
            varname: "it",
            strip: !0,
            append: !0,
            selfcontained: !1,
            doNotSkipEncoded: !1
        },
        template: void 0,
        compile: void 0
    }, m;
    f.encodeHTMLSource = function(b) {
        var a = {
            "&": "&#38;",
            "<": "&#60;",
            ">": "&#62;",
            '"': "&#34;",
            "'": "&#39;",
            "/": "&#47;"
        }, d = b ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
        return function(b) {
            return b ? b.toString().replace(d, function(b) {
                return a[b] || b;
            }) : "";
        };
    };
    m = function() {
        return this || (0, eval)("this");
    }();
    "undefined" !== typeof module && module.exports ? module.exports = f : "function" === typeof define && define.amd ? define(function() {
        return f;
    }) : m.doT = f;
    var r = {
        start: "'+(",
        end: ")+'",
        startencode: "'+encodeHTML("
    }, s = {
        start: "';out+=(",
        end: ");out+='",
        startencode: "';out+=encodeHTML("
    }, h = /$^/;
    f.template = function(b, a, d) {
        a = a || f.templateSettings;
        var n = a.append ? r : s, c, e = 0, g;
        b = a.use || a.define ? p(a, b, d || {}) : b;
        b = ("var out='" + (a.strip ? b.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "") : b).replace(/'|\\/g, "\\$&").replace(a.interpolate || h, function(b, a) {
            return n.start + k(a) + n.end;
        }).replace(a.encode || h, function(b, a) {
            c = !0;
            return n.startencode + k(a) + n.end;
        }).replace(a.conditional || h, function(b, a, c) {
            return a ? c ? "';}else if(" + k(c) + "){out+='" : "';}else{out+='" : c ? "';if(" + k(c) + "){out+='" : "';}out+='";
        }).replace(a.iterate || h, function(b, a, c, d) {
            if (!a) return "';} } out+='";
            e += 1;
            g = d || "i" + e;
            a = k(a);
            return "';var arr" + e + "=" + a + ";if(arr" + e + "){var " + c + "," + g + "=-1,l" + e + "=arr" + e + ".length-1;while(" + g + "<l" + e + "){" + c + "=arr" + e + "[" + g + "+=1];out+='";
        }).replace(a.evaluate || h, function(a, b) {
            return "';" + k(b) + "out+='";
        }) + "';return out;").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r").replace(/(\s|;|\}|^|\{)out\+='';/g, "$1").replace(/\+''/g, "");
        c && (a.selfcontained || !m || m._encodeHTML || (m._encodeHTML = f.encodeHTMLSource(a.doNotSkipEncoded)), 
        b = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : (" + f.encodeHTMLSource.toString() + "(" + (a.doNotSkipEncoded || "") + "));" + b);
        try {
            return new Function(a.varname, b);
        } catch (q) {
            throw "undefined" !== typeof console && console.log("Could not create a template function: " + b), 
            q;
        }
    };
    f.compile = function(b, a) {
        return f.template(b, null, a);
    };
    module.exports = f;
});