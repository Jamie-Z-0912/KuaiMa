define("app/inviteReg", [ "../mod/submit", "../plugs/cookieStorage.js", "../plugs/secondPage.js" ], function(require, exports, module) {
    var isPC = function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    };
    var submit = require("../mod/submit");
    require("../plugs/cookieStorage.js");
    var SecondPage = require("../plugs/secondPage.js");
    if (isPC()) {
        $("#hongbao").html('<h1 style="color:#fff;text-align:center;" id="pcView">请在手机端查看</h1>');
        $("#pcView").css("margin-top", innerHeight / 2);
        return;
    }
    $(".hongbao").css({
        "margin-top": (innerHeight - $("#hbT").height()) / 2 + "px",
        opacity: 1
    });
    (function() {
        $.extend($.fn, {
            fadeOut: function(speed, easing, complete) {
                if (typeof speed === "undefined") speed = 400;
                if (typeof easing === "undefined" || typeof easing !== "string") easing = "swing";
                $(this).css({
                    opacity: 1
                }).animate({
                    opacity: 0
                }, speed, easing, function() {
                    $(this).css("display", "none");
                    if (typeof easing === "function") {
                        easing();
                    } else if (typeof complete === "function") {
                        complete();
                    }
                });
                return this;
            }
        });
    })();
    $("#hbk").on("click", function() {
        $(this).addClass("rotate");
        setTimeout(function() {
            $("#hbk").parent().remove();
            $("#hbT").animate({
                transform: "translateY(-600px)"
            }, 800, "swing");
            $("#hbB").animate({
                transform: "translateY(600px)"
            }, 800, "swing");
            $('input[name="fu"]').val(Tools.uid());
            $('input[name="channel"]').val(Tools.getQueryValue("channel"));
            var code = Tools.getQueryValue("code");
            var code_ = location.href.split(code)[1];
            if (code_.length > 0) {
                code_ = code_.split("&")[0];
                code += code_;
            }
            $('input[name="code"]').val(code);
            Ajax.custom({
                url: "api/v1/withdrawList/now"
            }, function(d) {
                var len = d.data.length;
                Ajax.render("#marquee", "#marquee-tmpl", d.data);
                var w = $("#marquee li").width();
                $("#marquee").width(w * len);
                var marFun = function() {
                    $("#marquee li:first-child").width(0);
                    setTimeout(function() {
                        $("#marquee li:first-child").remove();
                    }, 3e3);
                };
                marFun();
                var timer = setInterval(function() {
                    var li = $("#marquee li:first-child").clone();
                    $("#marquee").append(li);
                    marFun();
                }, 3010);
            });
            $("#hongbao").fadeOut(800, "", function() {
                $("#hongbao").remove();
            });
        }, 500);
    });
    var nowList = {
        text: function(type, num) {
            if (type == 0) return "充值了" + num + "元到手机";
            if (type == 1) return "提现了" + num + "元到银行卡";
            if (type == 2) return "提现了" + num + "元到支付宝";
        },
        append: function(d) {
            if (d == null) {
                $("#marquee li").first().before("<li></li>");
            } else {
                $("#marquee li").first().before("<li>" + "用户 " + d.uid + this.text(d.type, d.amount) + "<span>" + d.time + "</span>" + "</li>");
            }
        }
    };
    var gvCode = Math.random().toFixed(4).substring(2);
    $("#gvCodeInput, #gvCode").text(gvCode);
    $("#gvCodeInput").bind("input propertychange", function(e) {
        var that = $(this), gv = that.val();
        if (gv.length > 3) {
            if (gv == gvCode) {
                that.attr("disabled", "disabled");
                that.parent().next().show();
                return;
            } else {
                that.val("");
                return;
            }
        }
    });
    seajs.use("./scripts/lib/jquery.base64", function() {
        $("#repeatSend").on("click", function() {
            var phone = $('input[name="phone"]').val();
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
                Ajax.custom({
                    url: "api/v1/account/exists",
                    data: {
                        phone: phone
                    }
                }, function(data) {
                    if (data.data.exists) {
                        Tools.alertDialog({
                            text: '您已经注册过啦快去赚钱吧<br><br><a href="javascript:;" id="openAppBtn" style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;">下载#ProjectName#</a>',
                            time: "0"
                        });
                        $("#openAppBtn").on("click", function() {
                            window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser";
                        });
                    } else {
                        Cookie.set("_KKMMMMMCMMM", Ajax.formatDate(new Date().getTime(), "yyyyMMdd"));
                        submit.sendSms($("#repeatSend"), {
                            phone: base64.encode(phone),
                            useto: "register"
                        });
                    }
                });
            }
        });
    });
    $("#inviteForm").submit(function(e) {
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
            url: "api/v1/register/invite",
            data: $(this)
        }, function(data) {
            if (data.status == 2001) {
                Tools.alertDialog({
                    text: "验证码错误，请新获取"
                });
            } else {
                Tools.alertDialog({
                    title: data.status == 1e3 ? "注册成功" : "",
                    text: '注册完成，快去赚钱吧<br><br><a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser" id="openAppBtn" style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;">下载#ProjectName#</a>',
                    time: "0"
                }, function() {
                    window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser";
                });
            }
        });
    });
    var pageProtocol = new SecondPage("#page_protocol");
    $("#protocolCon").on("click", function() {
        pageProtocol.openSidebar();
        $("#agreeBtn").off().on("click", function() {
            pageProtocol.closeSidebar();
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
                title: "出错了",
                text: "没有返回status"
            });
            return;
        }
        if (/1001|1002|1003|1004|1008|1009|1013|1015/.test(data.status)) {
            opt = {
                title: "提醒",
                text: data.desc
            };
        } else if (/1006|1007/.test(data.status)) {
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
});define("plugs/secondPage", [], function(require, exports, module) {
    var tempPage = 0;
    var SecondPage = function(pageName) {
        var that = this;
        that.targetPage = $(pageName);
        $(pageName + " .ui-icon-return").click(function(e) {
            e.preventDefault();
            that.closeSidebar();
        });
    };
    SecondPage.prototype = {
        targetPage: undefined,
        openPage: function(fn) {
            var container = $(window), w = container.width(), h = container.height(), that = this;
            this.targetPage.addClass("open").css({
                width: w,
                height: h
            }).show();
            tempPage++;
            if (!$("body").hasClass("move")) {
                $("body").addClass("move");
            }
            $("#sidebar-bg").show();
            fn && fn();
        },
        openSidebar: function(fn) {
            var container = $(window), w = container.width(), h = container.height(), that = this;
            this.targetPage.show().css({
                width: w,
                height: h
            });
            setTimeout(function() {
                that.targetPage.addClass("open");
            }, 100);
            $("#sidebar-bg").show();
            tempPage++;
            if (!$("body").hasClass("move")) {
                $("body").addClass("move");
            }
            fn && fn();
        },
        closeSidebar: function(fn) {
            var that = this;
            that.targetPage.removeClass("open");
            tempPage--;
            setTimeout(function() {
                that.targetPage.hide();
                hasOpend = false;
                if (tempPage <= 0) {
                    $("body").removeClass("move");
                }
                fn && fn();
            }, 220);
            $("#sidebar-bg").hide();
            window.location.hash = "";
        }
    };
    module.exports = SecondPage;
});