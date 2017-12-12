define("app/invite151", [ "../mod/pagelist2", "../plugs/confirmTip.js", "../plugs/version.js", "../plugs/cookieStorage.js" ], function(require, exports, module) {
    var pagelist = require("../mod/pagelist2");
    window.jQuery = window.Zepto;
    var confirmTip = require("../plugs/confirmTip.js");
    var km = require("../plugs/version.js");
    require("../plugs/cookieStorage.js");
    var km_error = location.href;
    $("#kmError").on("click", function() {
        Tools.alertDialog({
            text: '<span style="display:block;width:99%;word-wrap: break-word;">' + location.href + "</span>",
            time: "0"
        });
    });
    $("#nav").on("click", "li", function() {
        var _self = $(this), id = _self.data("id");
        if (!_self.hasClass("active")) {
            _self.addClass("active").siblings().removeClass("active");
            $("#" + id).removeClass("hide").siblings("div").addClass("hide");
        }
    });
    if (Tools.getQueryValue("tab") == "friend") {
        $('#nav li[data-id="friends"]').click();
    }
    function updateApp(type) {
        var txt = "升级到最新版本，更多任务要你收益涨涨涨！";
        new confirmTip({
            text: '<p style="color:#333;padding-left:.15rem;padding-right:.15rem;">' + txt + "</p>",
            sureTxt: "马上更新",
            cancelTxt: "我知道了"
        }, function(a) {
            if (a) {
                window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser";
            }
        });
    }
    var teamId;
    const myurl = "http://share.51xiaoli.cn/inviteReg.html";
    var QR = {
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
        makeQrImg: function(qrTag) {
            var cas_qr = $("#canvasQR")[0], ctx_qr = cas_qr.getContext("2d");
            ctx_qr.fillStyle = "#fff";
            ctx_qr.fillRect(0, 0, 530, 530);
            ctx_qr.fill();
            ctx_qr.drawImage(qrTag, 30, 30, 470, 470);
            $("#userQr").html('<img src="' + cas_qr.toDataURL("image/png") + '"/>');
            ctx_qr.clearRect(0, 0, 530, 530);
        },
        make_qr: function(uid) {
            var self = this;
            if (/Android/.test(km.userAgent) && self.qr_base64 && self.qr_base64[0] == uid) {
                $("#userQrCode").append('<img src="' + self.qr_base64[1] + '"/>');
                var qrTag = $("#userQrCode img")[0];
                self.makeQrImg(qrTag);
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
                        var qr_code = $("#userQrCode img")[0];
                        var qr = [ uid, $("#userQrCode img").attr("src") ];
                        Storage.set("qr", qr);
                        self.makeQrImg(qr_code);
                    }
                }, 100);
            }
            var mylink0 = myurl + "?uid=" + uid;
            var share_kmb = 'kmb://share?param={"shareurl":"' + mylink0 + '","desc":"快马送了一个红包给你，快来看看里面有多精彩？戳开有好礼。"}';
            if (!km.less("1.5.5")) {
                share_kmb = 'kmb://share?param={"shareurl":"' + mylink0 + '","desc":"和我一起赚零花","title":"快马送了一个红包给你，快来看看里面有多精彩？ ","icon":"http://static.etouch.cn/imgs/upload/1512982615.3361.png"}';
            }
            $("#type2, #type3, #type4").on("click", function() {
                window.location = share_kmb;
            });
            $("#saoma").on("click", ".btn", function() {
                window.location = share_kmb;
            });
        }
    };
    if (km.less("1.3.2")) {
        var uid = Tools.uid();
        QR.make_qr(uid);
        $("#type5").on("click", function() {
            window.location = "qunfa.html?uid=" + uid;
        });
    }
    Ajax.custom({
        url: "api/v1/userinfo/base"
    }, function(d) {
        teamId = d.data.team_id;
        $("#inviteQr").text(d.data.invite_code);
        if (!km.less("1.3.2")) {
            QR.make_qr(d.data.uid);
        }
        $(".invite_qr").on("click", function() {
            window.location = "inviteCode.html?code=" + d.data.invite_code;
        });
    });
    $("#type1").on("click", function() {
        $("#saoma").show();
    });
    $("#type5").on("click", function() {
        if (km.less("1.3.2")) {
            updateApp();
        } else {
            window.location = "qunfa.html?auth_token=" + Tools.auth_token();
        }
    });
    $("#showIncome").on("click", function() {
        if (km.less("1.3.2")) {
            updateApp();
        } else {
            window.location = "showIncome.html?auth_token=" + Tools.auth_token();
        }
    });
    $("#callTudi").on("click", function() {
        $('#nav li[data-id="friends"]').click();
    });
    $("#saoma").on("click", ".close", function() {
        $("#saoma").hide();
    });
    Ajax.custom({
        url: "api/v1/ads",
        data: {
            location: "my_invite_icon"
        }
    }, function(data) {
        if (data.status == 1e3) {
            var d = data.data;
            if (d.length > 0) {
                var cur = parseInt(d.length * Math.random());
                $("#banner").append('<a href="' + d[cur].origin_url + '"><img src="' + d[cur].images[0] + '" /></a>');
            }
        }
    });
    function hideInfo(a) {
        var ss = "" + a;
        var len = ss.length;
        var start_i = len / 2 - 2, end_i = len / 2 + 2;
        var str1 = ss.substring(0, start_i);
        var str2 = ss.substr(end_i, len - end_i);
        return str1 + "****" + str2;
    }
    function loadData(orderBy, order) {
        pagelist.fun({
            url: "api/v1/inviteRelation/friends",
            data: {
                orderBy: orderBy,
                order: order,
                page: 1,
                page_size: 10
            }
        }, function(data) {
            if (data.status == 1020) {
                $("#navOrder").remove();
            } else {
                $.each(data.data.list, function() {
                    if (teamId != "" && teamId != "0") {
                        this.hasTeam = true;
                    }
                    this.uid = this.to_uid;
                    this.show_uid = hideInfo(this.to_uid);
                    this.register_time = Ajax.formatDate(this.register_time, "yyyy-MM-dd hh:mm");
                    var cur_time = new Date().getTime();
                    var delta_T = cur_time - this.recent_active_time;
                    if (delta_T > 0) {
                        var days = parseInt(delta_T / 1e3 / 60 / 60 / 24);
                        if (days > 3) {
                            this.recent_active_time = Ajax.formatDate(this.recent_active_time, "yyyy-MM-dd");
                        } else if (days == 0) {
                            var hours = parseInt(delta_T / 1e3 / 60 / 60);
                            if (hours == 0) {
                                this.recent_active_time = "当前";
                            } else {
                                this.recent_active_time = hours + "小时前";
                            }
                        } else {
                            this.recent_active_time = days + "天前";
                        }
                    } else {
                        this.recent_active_time = Ajax.formatDate(this.recent_active_time, "yyyy-MM-dd");
                    }
                });
            }
        });
    }
    var default_orderBy = "recent_active_time", default_order = "desc";
    loadData(default_orderBy, default_order);
    $("#conList").on("click", ".urge", function() {
        var $el = $(this);
        if ($el.hasClass("disabled")) {
            Tools.alertDialog({
                text: "每个徒弟每天只能被提醒一次<br>晚22点-早8点不能打扰徒弟哦"
            });
        } else {
            Ajax.custom({
                url: "api/v1/inviteRelation/remind",
                data: {
                    son_uid: $el.data("uid")
                }
            }, function(data) {
                var txt;
                switch (data.status) {
                  case 1e3:
                    txt = "您的徒弟已收到您的提醒！";
                    $el.addClass("disabled");
                    break;

                  case 9012:
                    txt = "每个徒弟,每天只能被提醒一次哦";
                    $el.addClass("disabled");
                    break;

                  case 9013:
                    txt = "晚22点-早8点不能提醒徒弟哦";
                    $el.addClass("disabled");
                    break;

                  case 2002:
                    txt = "您的徒弟不存在！";
                    $el.addClass("disabled");
                    break;
                }
                Tools.alertDialog({
                    text: txt,
                    time: "0"
                });
            });
        }
    });
    $("#conList").on("click", ".join_myteam", function() {
        var $el = $(this);
        if ($el.hasClass("disabled")) {
            Tools.alertDialog({
                text: "每个徒弟每天只能被邀请一次<br>晚22点-早8点不能打扰徒弟哦",
                time: "0"
            });
        } else {
            new confirmTip({
                title: '<p style="width:10.1em;margin:0 auto;text-align:left;">您是否想邀请这位徒弟加入您的团队</p>'
            }, function(a) {
                if (a) {
                    Ajax.custom({
                        url: "api/v1/teams/" + teamId + "/invite/" + $el.data("uid")
                    }, function(data) {
                        $el.addClass("disabled");
                        if (data.status == 1e3) {
                            Tools.alertDialog({
                                title: "邀请已发出",
                                text: "对方接受后将自动成为您的团员！",
                                time: "0"
                            });
                        } else {
                            Tools.alertDialog({
                                text: data.desc,
                                time: "0"
                            });
                        }
                    });
                }
            });
        }
    });
    $("#conList").on("click", ".more_coin", function() {
        var self = $(this);
        if (self.find(".con").length > 0) {
            if (self.hasClass("open")) {
                self.removeClass("open");
            } else {
                if (self.hasClass("isloaded")) {
                    self.addClass("open");
                } else {
                    Ajax.custom({
                        url: "api/v1/inviteRelation/friends/active",
                        data: {
                            son_uid: self.data("id")
                        }
                    }, function(d) {
                        self.addClass("isloaded");
                        if (d.status == 1e3) {
                            var act_d = parseInt(d.data.had_active_day);
                            self.find(".txt span").text("（剩余：" + d.data.left_active_day + "天）");
                            if (act_d > 0) {
                                if (act_d > 7) {
                                    self.find(".coin li").addClass("active");
                                } else {
                                    for (var i = 0; i < act_d; i++) {
                                        self.find(".coin li").eq(i).addClass("active");
                                    }
                                }
                            }
                            self.addClass("open");
                        }
                    });
                }
            }
        }
    });
});define("mod/pagelist2", [ "./base", "../plugs/laypage" ], function(require, exports, module) {
    var Ajax = require("./base");
    var laypage = require("../plugs/laypage");
    window.Ajax = Ajax;
    exports.defaultListTmpl = "#conList-tmpl";
    exports.defaultListEle = "#conList";
    exports.pagingDom = "#listPage";
    exports.fun = function(options, beforeCallback, afterCallback) {
        var isFirst = options.data.page == 1, opt = {
            renderFor: this.defaultListTmpl,
            renderEle: this.defaultListEle,
            pagingDom: this.pagingDom,
            showLoading: true,
            hasNext: true,
            logtype: "paging"
        };
        for (var i in opt) {
            options[i] = options[i] || opt[i];
        }
        laypage({
            cont: $(options.pagingDom),
            pages: 100,
            groups: 0,
            curr: 1,
            prev: false,
            next: "点击查看更多",
            skin: "flow",
            jump: function(obj) {
                var that = this;
                options.data.page = obj.curr;
                Ajax.baseAjax(options, function(data) {
                    if (data.status == 1020) {
                        data.data = null;
                        Ajax.render(options.renderEle, options.renderFor, data, undefined, true);
                        $(options.pagingDom).remove();
                    } else {
                        that.pages = data.data.total_page;
                        if (obj.curr == data.data.total_page) {
                            options.hasNext = false;
                            $(options.pagingDom).find(".laypage_main").html("<span>没有更多数据</span>");
                        }
                        $.each(data.data.list, function() {
                            this.added_time = Ajax.formatDate(this.added_time);
                        });
                        if (beforeCallback) {
                            $.isFunction(beforeCallback) && beforeCallback(data);
                        }
                        if (data.data.page != 1) {
                            Ajax.render(options.renderEle, options.renderFor, data.data, undefined, false);
                        } else {
                            Ajax.render(options.renderEle, options.renderFor, data.data, undefined, true);
                        }
                        if (afterCallback) {
                            $.isFunction(afterCallback) && afterCallback();
                        }
                        $(options.pagingDom).removeClass("hide");
                    }
                }, function(jqXHR, textStatus, errorThrown) {
                    if (typeof callbackError == "function") {
                        callbackError(jqXHR, textStatus, errorThrown);
                    }
                });
            }
        });
        window.onscroll = function() {
            if (options.hasNext) {
                var scrollTop = document.body.scrollTop;
                var scrollHeight = document.body.scrollHeight;
                var windowHeight = window.screen.height * window.devicePixelRatio;
                if (scrollTop + windowHeight + 100 > scrollHeight) {
                    $("#laypage_0 a").click();
                }
            }
        };
    };
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
});!function() {
    "use strict";
    function a(d) {
        var e = "laypagecss";
        a.dir = "dir" in a ? a.dir : f.getpath + "../css/skin/laypage.css", new f(d), a.dir && !b[c](e) && f.use(a.dir, e);
    }
    a.v = "1.3";
    var b = document, c = "getElementById", d = "getElementsByTagName", e = 0, f = function(a) {
        var b = this, c = b.config = a || {};
        c.item = e++, b.render(!0);
    };
    f.on = function(a, b, c) {
        return a.attachEvent ? a.attachEvent("on" + b, function() {
            c.call(a, window.even);
        }) : a.addEventListener(b, c, !1), f;
    }, f.getpath = function() {
        var a = document.scripts, b = a[a.length - 1].src;
        return b.substring(0, b.lastIndexOf("/") + 1);
    }(), f.use = function(c, e) {}, f.prototype.type = function() {
        var a = this.config;
        return "object" == typeof a.cont ? void 0 === a.cont.length ? 2 : 3 : void 0;
    }, f.prototype.view = function() {
        var b = this, c = b.config, d = [], e = {};
        if (c.pages = 0 | c.pages, c.curr = 0 | c.curr || 1, c.groups = "groups" in c ? 0 | c.groups : 5, 
        c.first = "first" in c ? c.first : "&#x9996;&#x9875;", c.last = "last" in c ? c.last : "&#x5C3E;&#x9875;", 
        c.prev = "prev" in c ? c.prev : "&#x4E0A;&#x4E00;&#x9875;", c.next = "next" in c ? c.next : "&#x4E0B;&#x4E00;&#x9875;", 
        c.pages <= 1) return "";
        for (c.groups > c.pages && (c.groups = c.pages), e.index = Math.ceil((c.curr + (c.groups > 1 && c.groups !== c.pages ? 1 : 0)) / (0 === c.groups ? 1 : c.groups)), 
        c.curr > 1 && c.prev && d.push('<a href="javascript:;" class="laypage_prev" data-page="' + (c.curr - 1) + '">' + c.prev + "</a>"), 
        e.index > 1 && c.first && 0 !== c.groups && d.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">' + c.first + "</a><span>&#x2026;</span>"), 
        e.poor = Math.floor((c.groups - 1) / 2), e.start = e.index > 1 ? c.curr - e.poor : 1, 
        e.end = e.index > 1 ? function() {
            var a = c.curr + (c.groups - e.poor - 1);
            return a > c.pages ? c.pages : a;
        }() : c.groups, e.end - e.start < c.groups - 1 && (e.start = e.end - c.groups + 1); e.start <= e.end; e.start++) e.start === c.curr ? d.push('<span class="laypage_curr" ' + (/^#/.test(c.skin) ? 'style="background-color:' + c.skin + '"' : "") + ">" + e.start + "</span>") : d.push('<a href="javascript:;" data-page="' + e.start + '">' + e.start + "</a>");
        return c.pages > c.groups && e.end < c.pages && c.last && 0 !== c.groups && d.push('<span>&#x2026;</span><a href="javascript:;" class="laypage_last" title="&#x5C3E;&#x9875;"  data-page="' + c.pages + '">' + c.last + "</a>"), 
        e.flow = !c.prev && 0 === c.groups, (c.curr !== c.pages && c.next || e.flow) && d.push(function() {
            return e.flow && c.curr === c.pages ? '<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">' + c.next + "</span>" : '<a href="javascript:;" class="laypage_next" data-page="' + (c.curr + 1) + '">' + c.next + "</a>";
        }()), '<div name="laypage' + a.v + '" class="laypage_main laypageskin_' + (c.skin ? function(a) {
            return /^#/.test(a) ? "molv" : a;
        }(c.skin) : "default") + '" id="laypage_' + b.config.item + '">' + d.join("") + function() {
            return c.skip ? '<span class="laypage_total"><label>&#x5230;&#x7B2C;</label><input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="laypage_skip"><label>&#x9875;</label><button type="button" class="laypage_btn">&#x786e;&#x5b9a;</button></span>' : "";
        }() + "</div>";
    }, f.prototype.jump = function(a) {
        if (a) {
            for (var b = this, c = b.config, e = a.children, g = a[d]("button")[0], h = a[d]("input")[0], i = 0, j = e.length; j > i; i++) "a" === e[i].nodeName.toLowerCase() && f.on(e[i], "click", function() {
                var a = 0 | this.getAttribute("data-page");
                c.curr = a, b.render();
            });
            g && f.on(g, "click", function() {
                var a = 0 | h.value.replace(/\s|\D/g, "");
                a && a <= c.pages && (c.curr = a, b.render());
            });
        }
    }, f.prototype.render = function(a) {
        var d = this, e = d.config, f = d.type(), g = d.view();
        2 === f ? e.cont.innerHTML = g : 3 === f ? e.cont.html(g) : b[c](e.cont).innerHTML = g, 
        e.jump && e.jump(e, a), d.jump(b[c]("laypage_" + e.item)), e.hash && !a && (location.hash = "!" + e.hash + "=" + e.curr);
    }, "function" == typeof define ? define("plugs/laypage", [], function() {
        return a;
    }) : "undefined" != typeof exports ? module.exports = a : window.laypage = a;
}();define("plugs/confirmTip", [], function(require, exports, module) {
    var confirmTip = function(option, callback) {
        var opt = {
            title: "",
            text: "",
            sureTxt: "确定",
            cancelTxt: "取消"
        };
        this.option = {};
        for (var i in opt) {
            this.option[i] = option[i] || opt[i];
        }
        this.id = "pop_" + new Date().getTime();
        this.init(callback);
    };
    confirmTip.prototype.init = function(callback) {
        var that = this, opt = that.option;
        var arr = [], divId = that.id;
        arr.push('<div class="pop-mask km-dialog"></div>');
        arr.push('<div class="pop-screen km-dialog" id="' + divId + '">');
        arr.push('<div class="box">');
        opt.title != "" && arr.push("<h2>" + opt.title + "</h2>");
        opt.text != "" && arr.push('<div class="text">' + opt.text + "</div>");
        arr.push('<div class="btnbox">' + '<a class="cancelBtn">' + opt.cancelTxt + "</a>" + '<a class="sureBtn">' + opt.sureTxt + "</a>" + "</div>");
        arr.push("</div></div>");
        $("body").append(arr.join(""));
        $("#" + divId).height($("#" + divId + " .box").height());
        $("#" + divId + " .sureBtn").click(function() {
            $("#" + divId).prev().remove();
            $("#" + divId).remove();
            $.isFunction(callback) && callback(true);
        });
        $("#" + divId + " .cancelBtn").click(function() {
            $("#" + divId).prev().remove();
            $("#" + divId).remove();
            $.isFunction(callback) && callback(false);
        });
    };
    module.exports = confirmTip;
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