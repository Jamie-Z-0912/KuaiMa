define("app/bind", [ "../mod/submit", "../plugs/tipsAd.js" ], function(require, exports, module) {
    var submit = require("../mod/submit");
    var tipsAd = require("../plugs/tipsAd.js");
    if (Tools.auth_token() == "null") {
        var opt = {
            title: "提醒",
            text: "请在快马浏览器中登录再访问！",
            time: 5e3
        };
        Tools.alertDialog(opt, function() {
            window.location = "kmb://alertlogin";
        });
        return;
    }
    var notPass = function(opt) {
        Tools.alertDialog(opt, function() {
            $('input[type="submit"]').removeAttr("disabled");
        });
    };
    $("#bindFrom").submit(function(e) {
        e.preventDefault();
        $('input[type="submit"]').attr("disabled", "disabled");
        var name = $('input[name="account_name"]').val();
        var card = $('input[name="bank_card"]').val();
        var branch_name = $('input[name="bank_branch_name"]').val();
        if (name.isEmpty()) {
            var opt = {
                text: "真实姓名不能为空"
            };
            notPass(opt);
            return;
        }
        if (!name.isChinese()) {
            var opt = {
                text: "真实姓名必须为中文名"
            };
            notPass(opt);
            return;
        }
        if (card.isEmpty()) {
            var opt = {
                text: "支付宝号不能为空"
            };
            notPass(opt);
            return;
        }
        submit.fun({
            url: "api/v1/withdraw/account/bind",
            data: $(this)
        }, function(data) {
            if (data.status != 1e3) {
                var opt = {
                    title: "绑定失败",
                    text: data.desc
                };
                notPass(opt);
            } else {
                new tipsAd({
                    type: "rule",
                    subtit: "绑定成功！",
                    hasAd: "0",
                    isClose: "no",
                    btnType: "1"
                });
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
        return new RegExp(/^\d{4}?$/).test(this);
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
    exports.sendSms = function(btnSend, options) {
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
                return;
            }
            if (data.status == 2003) {
                Tools.alertDialog({
                    title: "获取失败",
                    text: "获取验证码太频繁，请明日再试"
                }, function() {
                    btnSend.text("明日再获取");
                });
                return;
            }
            if (data.status == 1008) {
                Tools.alertDialog({
                    text: "您已经注册过啦"
                });
                return;
            }
            if (data.status == 2002) {
                Tools.alertDialog({
                    text: "用户不存在"
                });
                return;
            }
        });
    };
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
});define("plugs/tipsAd", [], function(require, exports, module) {
    var TipsAd = function(option) {
        var opt = {
            isClose: "yes",
            type: "",
            title: "",
            subtit: "",
            text: "",
            btnType: "0",
            hasAd: "1",
            adImg: "image/ad.png",
            adLink: "school_invite_0.html"
        };
        this.option = {};
        for (var i in opt) {
            this.option[i] = option[i] || opt[i];
        }
        this.id = "pop_" + new Date().getTime();
        this.init();
    };
    TipsAd.prototype.init = function(hasAd) {
        var that = this, opt = that.option;
        var arr = [];
        arr.push('<div class="pop-mask km-dialog"></div>');
        arr.push('<div class="pop-screen km-dialog" id="' + that.id + '">');
        arr.push('<div class="box">');
        if (opt.isClose == "yes") {
            arr.push('<i class="iconfont icon-close"></i>');
        }
        arr.push('<div class="hd-img ' + opt.type + '"></div>');
        opt.title != "" && arr.push("<h1>" + opt.title + "</h1>");
        opt.subtit != "" && arr.push("<h3>" + opt.subtit + "</h3>");
        opt.text != "" && arr.push('<div class="text">' + opt.text + "</div>");
        if (opt.hasAd == "1") {
            arr.push('<div class="ad"><a href="' + opt.adLink + '"><img src="' + opt.adImg + '" /></a></div>');
        }
        if (opt.btnType == "1") {
            arr.push('<div class="btnbox"><a class="close">我知道了</a></div>');
        }
        arr.push("</div></div>");
        $("body").append(arr.join(""));
        $("#" + that.id).height($("#" + that.id + " .box").height());
        $("#" + that.id + " .icon-close, #" + that.id + " .close").on("click", function() {
            that.close();
        });
    };
    TipsAd.prototype.close = function() {
        var $el = $("#" + this.id);
        $el.prev().remove();
        $el.remove();
    };
    module.exports = TipsAd;
});