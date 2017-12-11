define("app/qunfa", [ "../mod/base", "../plugs/version.js", "../plugs/cookieStorage.js" ], function(require, exports, module) {
    var Ajax = require("../mod/base");
    window.jQuery = window.Zepto;
    var km = require("../plugs/version.js");
    require("../plugs/cookieStorage.js");
    const myurl = "http://share.51xiaoli.cn/inviteReg.html";
    var QR = {
        qrTag: "",
        qr_base64: Storage.get("qr"),
        channel: function() {
            var channel = "", userAgent = km.userAgent;
            if (userAgent.split("ssy=").length == 2) {
                var _ssy = userAgent.split("ssy=")[1];
                if (/iOS|Android/.test(_ssy.split(";")[0])) {
                    channel = _ssy.split(";")[3];
                } else {
                    channel = _ssy.split(";")[2];
                }
            }
            return channel;
        },
        drawimg: function(el, x, y) {
            var cas_gx = $("#canvasGX")[0], ctx_gx = cas_gx.getContext("2d");
            var bg = el[0];
            ctx_gx.fillStyle = "#fff";
            ctx_gx.drawImage(bg, 0, 0, 560, 800);
            ctx_gx.beginPath();
            ctx_gx.fill();
            ctx_gx.drawImage(QR.qrTag, x + 9, y + 9, 220, 220);
            el.attr("src", cas_gx.toDataURL("image/png"));
            ctx_gx.clearRect(0, 0, 560, 800);
        },
        makeQrImg: function() {
            QR.drawimg($(".qr_bg1"), 158, 458);
        },
        make_qr: function(uid) {
            var self = this;
            if (/Android/.test(km.userAgent) && self.qr_base64 && self.qr_base64[0] == uid) {
                $("#userQrCode").append('<img src="' + self.qr_base64[1] + '"/>');
                QR.qrTag = $("#userQrCode img")[0];
                self.makeQrImg();
            } else {
                var mylink = myurl + "?uid=" + uid + "&channel=" + this.channel();
                seajs.use("./scripts/lib/jquery.qrcode.min", function() {
                    var qr = $("#userQrCode").qrcode({
                        logo: "data:image/png;base64,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",
                        width: 190,
                        height: 190,
                        correctLevel: 2,
                        text: mylink
                    });
                });
                var makeQrTime = setInterval(function() {
                    if ($("#userQrCode img").length > 0) {
                        clearInterval(makeQrTime);
                        var qr = [ uid, $("#userQrCode img").attr("src") ];
                        Storage.set("qr", qr);
                        QR.qrTag = $("#userQrCode img")[0];
                        self.makeQrImg();
                    }
                }, 100);
            }
        }
    };
    Ajax.custom({
        url: "api/v1/userinfo/base"
    }, function(d) {
        QR.make_qr(d.data.uid);
    });
    $("#step1").on("click", function() {
        $("#wrap1").hide();
        $("#wrap2").show();
    });
    $("#wrap2").on("click", ".copy", function() {
        var self = $(this), txt = self.prev().text();
        window.location = "kmb://QQ=" + encodeURIComponent(txt);
        $("#wrap2 .copy").removeClass("copied").text("复制");
        self.addClass("copied").text("已复制");
        $("#step2").hasClass("disabled") && $("#step2").removeClass("disabled");
    });
    $("#step2").on("click", function() {
        if (!$(this).hasClass("disabled")) {
            $("#wrap2").hide();
            $("#wrap3").show();
        }
    });
    function play() {
        var i = 0;
        $("#teachCon ul li").eq(i).show();
        var t = setInterval(function() {
            i++;
            $("#teachCon ul li").eq(i).show().siblings().hide();
            if (i == $("#teachCon ul li").length) {
                $("#teacher").removeClass("disabled");
                clearInterval(t);
            }
        }, 1e3);
    }
    $("#teacher").on("click", function() {
        var self = $(this);
        $("#wrap3_con").hide();
        $("#teachCon").show();
        if (!self.hasClass("disabled")) {
            play();
        }
        self.text("重新播放").addClass("disabled").addClass("white");
    });
});define("mod/base", [ "zepto", "../plugs/doT.min", "./tools" ], function(require, exports, module) {
    var $ = require("zepto"), Zepto, jQuery;
    jQuery = Zepto = $;
    var doT = require("../plugs/doT.min");
    var config = {
        key: "26817749",
        magic_key: "24817749",
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
                title: "出错了",
                text: "没有返回status"
            });
            return;
        }
        if (/1001|1002|1003|1004|1009|1015/.test(data.status)) {
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
        } else if (data.status == 1101) {
            opt = {
                title: "提醒",
                text: "请打开设置->通用->日期与时间校准您的系统时间"
            };
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
            var us = navigator.userAgent, key = config.key;
            if (/magic/.test(us)) {
                key = config.magic_key;
            }
            var appkey = {
                name: "app_key",
                value: key
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
                options.data.app_key = key;
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
    util.isKM = /KuaiMa/.test(userAgent);
    if (util.isKM) {
        var _ssy = userAgent.split("ssy=")[1];
        if (/iOS|Android/.test(_ssy.split(";")[0])) {
            version = _ssy.split(";")[2];
        } else {
            version = _ssy.split(";")[1];
        }
        util.version = version.replace("V", "");
    }
    util.userAgent = userAgent;
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
});