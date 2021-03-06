define("app/video", [ "../mod/base", "../plugs/version", "../plugs/cookieStorage", "../plugs/validread" ], function(require, exports, module) {
    var Ajax = require("../mod/base");
    var km = require("../plugs/version");
    require("../plugs/cookieStorage");
    if (km.less("1.2.2")) {
        if (!Storage.get("HASWARNING_")) {
            Storage.set("HASWARNING_", 1);
            alertDialog({
                title: "升级通知",
                text: '请升级至新版本1.3.0，活动多多奖励多多，提现立即到账！现有版本近期将停止提现功能！<br><br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">马上更新</a>',
                time: "0"
            });
        }
    }
    var a_id = Tools.getQueryValue("id") || "";
    if (a_id == "" || !/^[0-9]+$/.test(a_id)) {
        window.location = "http://news.kuaima.cn/404.html";
        return;
    }
    var Fun = {
        isEmpty: function(str) {
            return /^\s*$/.test(str);
        }
    };
    function doCon() {
        $("#videoplayer")[0].addEventListener("play", function() {
            _hmt.push([ "_trackEvent", "video", "play" ]);
            var iframe = document.createElement("iframe");
            if (km.isNews) {
                iframe.src = "kmxb://article?height=" + innerHeight;
            }
            if (km.isBrowser) {
                iframe.src = "kmb://article?height=" + innerHeight;
            }
            iframe.style.display = "none";
            $("body").append(iframe);
            $(iframe).remove();
        });
        if (km.gEq("1.2.2")) {
            var iframe = document.createElement("iframe");
            if (km.isNews) {
                iframe.src = "kmxb://article?refreshheight=" + $("#MainCon").parent().height();
            }
            if (km.isBrowser) {
                iframe.src = "kmb://article?refreshheight=" + $("#MainCon").parent().height();
            }
            iframe.style.display = "none";
            $("body").append(iframe);
            $(iframe).remove();
        }
    }
    function v1_article() {
        var validread = require("../plugs/validread");
        Ajax.custom({
            url: "api/v1/article/" + a_id
        }, function(d) {
            var data = d.data, article = data.article;
            document.title = article.title;
            if (!article.origin_url && article.source == "风行网") {
                var str = article.content.split("<iframe")[1];
                str = str.split("</iframe>")[0];
                article.fx_origin = "<iframe" + str + "</iframe>";
            } else {
                if (article.origin_url != "") $("#originUrl").attr("href", article.origin_url);
            }
            try {
                Ajax.render("#MainCon", "#MainCon-tmpl", article);
            } catch (e) {
                console.log(e);
            }
            if ($("#videoplayer").length > 0) {
                doCon();
            }
            if (!article.origin_url && article.source == "风行网") {
                $("#originUrl").attr("href", $('iframe[name="ext_urlIframe"]').attr("src"));
                setTimeout(function() {
                    var iframe = document.createElement("iframe");
                    if (km.isNews) {
                        iframe.src = "kmxb://article?height=" + innerHeight;
                    }
                    if (km.isBrowser) {
                        iframe.src = "kmb://article?height=" + innerHeight;
                    }
                    iframe.style.display = "none";
                    $("body").append(iframe);
                    $(iframe).remove();
                }, 1e4);
            }
            var contpl = {
                tags: '<span class="tag red-tag">热门</span>'
            };
            Ajax.render("#recommend", "#recommend-tmpl", data.recomArticles, contpl);
            $(".recommend-wrap").show();
            if (Tools.getQueryValue("login") == "1") {
                if (data.idx && data.seconds && Tools.auth_token() != "null") validread(a_id, data.idx, data.seconds);
            }
            if (Tools.getQueryValue("login") == "0") {
                if (Tools.notPC == "Android") {
                    alertDialog({
                        text: '登录之后看文章有奖励哦~<br><br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="kmb://alertlogin">马上登录</a>'
                    });
                } else {
                    window.location = "kmb://alertlogin";
                }
            }
            $("#recommend").on("click", "a", function() {
                var url = $(this).data("url"), id = $(this).data("id");
                window.location.href = "kmb://recommend?url=" + url + "&id=" + id;
            });
        });
    }
    if (km.gEq("1.2.0")) {
        $(".recommend-wrap").remove();
        Ajax.custom({
            url: "api/v2/article/details/" + a_id
        }, function(d) {
            var article = d.data.article;
            document.title = article.title;
            if (!article.origin_url && article.source == "风行网") {
                var str = article.content.split("<iframe")[1];
                str = str.split("</iframe>")[0];
                article.fx_origin = "<iframe" + str + "</iframe>";
            } else {
                if (article.origin_url != "") $("#originUrl").attr("href", article.origin_url);
            }
            try {
                Ajax.render("#MainCon", "#MainCon-tmpl", article);
            } catch (e) {
                console.log(e);
            }
            if ($("#videoplayer").length > 0) {
                doCon();
            }
            if (!article.origin_url && article.source == "风行网") {
                $("#originUrl").attr("href", $('iframe[name="ext_urlIframe"]').attr("src"));
                setTimeout(function() {
                    var iframe = document.createElement("iframe");
                    if (km.isNews) {
                        iframe.src = "kmxb://article?height=" + innerHeight;
                    }
                    if (km.isBrowser) {
                        iframe.src = "kmb://article?height=" + innerHeight;
                    }
                    iframe.style.display = "none";
                    $("body").append(iframe);
                    $(iframe).remove();
                }, 1e4);
            }
        });
    } else {
        v1_article();
    }
});define("mod/base", [ "zepto", "../plugs/doT.min", "./tools" ], function(require, exports, module) {
    var $ = require("zepto"), Zepto, jQuery;
    jQuery = Zepto = $;
    var doT = require("../plugs/doT.min");
    var config = {
        key: "26817749",
        km_api: server + "km_task/"
    };
    require("./tools");
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
    function preCheck(data) {
        var opt, fun = function() {};
        if (!data.status) {
            Tools.alertDialog({
                title: "提醒",
                text: "系统错误，请稍后重试！"
            });
            return;
        }
        switch (data.status) {
          case 1101:
            opt = {
                title: "提醒",
                text: "请打开设置->通用->日期与时间校准您的系统时间"
            };
            break;

          case 1004:
            opt = {
                title: "提醒",
                text: "请在快马浏览器中登录再访问！"
            };
            break;

          case 1002:
            opt = {
                title: "提醒",
                text: "请在快马浏览器中访问！"
            };
            break;

          case 1006:
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
            break;

          default:
            opt = null;
            return true;
            break;
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
            var appkey = {
                name: "app_key",
                value: config.key
            };
            if (options.showLoading) {
                if ($(".ui-loading-block").length == 0) $("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'); else $(".ui-loading-block").addClass("show");
                if (options.logtype != "paging" || options.data.skip == 0) {
                    $(options.renderEle).hide();
                }
            }
            if (!options.data) options.data = {};
            if ($.isFunction(options.data.push)) {
                options.data.push(appkey);
            } else {
                options.data.app_key = config.key;
            }
            if ($.isFunction(options.data.push)) {
                options.data.push({
                    name: "auth_token",
                    value: Tools.auth_token()
                });
            } else {
                options.data.auth_token = Tools.auth_token();
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
                        if (options.logtype != "paging" || options.data.skip == 0) {
                            $(options.renderEle).show();
                        }
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
                    if (options.logtype != "paging") {
                        $(options.renderEle).show();
                    }
                }
            });
        },
        render: function(renderEle, renderFor, data, secTpl, isFirst) {
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
        },
        custom: function(options, callback) {
            var that = this;
            options = options || {};
            options.logtype = "custom";
            that.baseAjax(options, callback);
        }
    };
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
        uid: function() {
            return this.getQueryValue("uid") || "null";
        },
        auth_token: function() {
            return this.getQueryValue("auth_token") || "null";
        },
        isKM: function() {
            var myNav = navigator.userAgent;
            return /KuaiMa/.test(myNav);
        },
        notPC: function() {
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            var flag = false;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = Agents[v];
                    break;
                }
            }
            return flag;
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
});define("plugs/version", [], function(require, exports, module) {
    var util = {}, version;
    var userAgent = navigator.userAgent;
    util.userAgent = userAgent;
    util.isKM = /KuaiMa/.test(userAgent);
    util.isNews = /KuaiMaNews/.test(userAgent);
    util.isBrowser = /KuaiMaBrowser/.test(userAgent);
    if (util.isKM) {
        var _ssy = userAgent.split("ssy=")[1];
        if (/iOS|Android/.test(_ssy.split(";")[0])) {
            version = _ssy.split(";")[2];
        } else {
            version = _ssy.split(";")[1];
        }
        util.version = version.replace("V", "");
    }
    console.log(util.version);
    util.equal = function(v) {
        if (util.isKM) {
            if (v == this.version) {
                return true;
            } else {
                return false;
            }
        } else return false;
    };
    util.greater = function(v) {
        if (util.isKM) {
            var cur = this.version.split("."), v_arr = v.split("."), flag = false;
            for (var i = 0; i < cur.length; i++) {
                if (cur[i] < v_arr[i]) {
                    break;
                } else {
                    if (cur[i] > v_arr[i]) {
                        flag = true;
                    }
                }
            }
            return flag;
        } else return false;
    };
    util.less = function(v) {
        if (util.isKM) {
            var cur = this.version.split("."), v_arr = v.split("."), flag = false;
            for (var i = 0; i < cur.length; i++) {
                if (cur[i] > v_arr[i]) {
                    break;
                } else {
                    if (cur[i] < v_arr[i]) {
                        flag = true;
                    }
                }
            }
            return flag;
        } else return false;
    };
    util.gEq = function(v) {
        if (this.equal(v) || this.greater(v)) return true; else return false;
    };
    util.lEq = function(v) {
        if (this.equal(v) || this.less(v)) return true; else return false;
    };
    module.exports = util;
});define("plugs/cookieStorage", [], function() {
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
    var Storage = {
        AUTH: "KMAUTH",
        LNAME: "MY-LNAME",
        ACCOUNT: "MY-NAME",
        HEADIMG: "MY-HEADIMG",
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
});define("plugs/validread", [ "../mod/base" ], function(require, exports, module) {
    var Ajax = require("../mod/base");
    var oo = function(a_id, idx, seconds) {
        var _this = this;
        this.open = false;
        this.listH = false;
        this.isTime = false;
        this.hasRecord = false;
        this.idx = idx;
        this.rid = $("#rec_" + idx).data("id");
        this._ajax = function() {
            if (_this.open && _this.listH && _this.isTime && !_this.hasRecord) {
                _this.hasRecord = true;
                Ajax.custom({
                    url: "api/v1/article/view",
                    data: {
                        articleId: a_id,
                        rid: _this.rid
                    }
                }, function(data) {
                    if (data.status == 1e3) {
                        if (data.data.coin_num != 0) {
                            Tools.alertDialog({
                                text: "获得" + data.data.coin_num + "金币",
                                img: "image/coin.png",
                                time: 1800
                            });
                        }
                        _this.hasRecord = true;
                        var iframe = document.createElement("iframe");
                        iframe.src = "kmb://refreshgold";
                        iframe.style.display = "none";
                        $("body").append(iframe);
                        $(iframe).remove();
                    } else _this.hasRecord = false;
                });
            }
        };
        setTimeout(function() {
            _this.isTime = true;
            _this._ajax();
        }, seconds * 1e3);
        $(window).scroll(function() {
            var elTop = $("#rec_" + _this.idx).offset().top - innerHeight;
            var scrollt = document.documentElement.scrollTop || document.body.scrollTop;
            if (elTop < scrollt) {
                _this.listH = true;
                _this._ajax();
            }
        });
        if ($("#videoplayer").length > 0) {
            $("#videoplayer")[0].addEventListener("play", function() {
                _this.open = true;
                _this._ajax();
            });
        } else {
            $("#unfold").on("click", function() {
                _this.open = true;
                _this._ajax();
            });
        }
    };
    module.exports = oo;
});