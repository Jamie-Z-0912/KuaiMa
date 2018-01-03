define("app/taskCenter", [ "../mod/pagelist", "../plugs/storageCache.js", "../plugs/version", "../plugs/timer.js", "../plugs/tipsAd.js", "../plugs/secondPage.js" ], function(require, exports, module) {
    var pagelist = require("../mod/pagelist");
    require("../plugs/storageCache.js");
    var km = require("../plugs/version");
    var Timer = require("../plugs/timer.js");
    var tipsAd = require("../plugs/tipsAd.js");
    var SecondPage = require("../plugs/secondPage.js");
    var km_v = km.version || "1.5.5";
    if (Tools.auth_token() == "null") {
        var opt = {
            title: "提醒",
            text: "请在#ProjectName#中登录再访问！",
            time: 5e3
        };
        Tools.alertDialog(opt, function() {
            window.location = "kmb://alertlogin";
        });
        return;
    }
    if (km.less("1.1.0")) {
        Tools.alertDialog({
            title: "重大更新",
            text: '#ProjectName#全新改版<br>签到每次得0.5元<br></br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">马上更新</a>',
            time: "0"
        });
        $("#close").remove();
        return;
    }
    var checkinStatus = {
        expire: function() {
            var mydate = new Date(), today = mydate.toLocaleDateString(), now = Math.ceil(mydate.getTime() / 1e3);
            var expTime = new Date(today + " 23:50:00").getTime() / 1e3;
            return expTime - now > 0 ? expTime - now : null;
        },
        over: function() {
            if (this.expire()) {
                Storage.setCache("checkin", "over", this.expire());
            }
            $("#checkin").hide();
            $("#signinNormal").text("已签到");
            $("#norCheckin").show();
        },
        normal: function() {
            if (this.expire()) {
                Storage.setCache("checkin", "normal", this.expire());
            }
            $("#checkin").hide();
            $("#signinNormal").addClass("checkin");
            $("#norCheckin").show();
        }
    };
    var fun = {
        downLink: function() {
            var w_link = "http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser";
            var ios_link = "https://itunes.apple.com/gb/app/id1217748676?mt=8";
            return /iPhone|iPad|iPod/.test(km.userAgent) ? ios_link : w_link;
        },
        updateApp: function() {
            var str = '<div class="pop-mask km-dialog"></div>' + '<div class="pop-screen km-dialog update_pop">' + '<div class="box">' + "<h2>升级新版本</h2>" + '<div class="text">' + '<img src="image/tc-update.png" style="width:100%">' + "<p>开启新任务，快来赚更多！</p>" + "</div>" + '<div class="btnbox">' + '<a href="' + this.downLink() + '">去升级</a>' + "</div>" + "</div>" + "</div>";
            $("body").append(str);
        },
        getCoin: function(type, callback) {
            Ajax.custom({
                url: "api/v1/task/receiveReward",
                data: {
                    eventType: type
                }
            }, function(data) {
                if (data.status != 1e3) {
                    Tools.alertDialog({
                        text: data.desc
                    });
                } else {
                    $.isFunction(callback) && callback();
                }
            });
        }
    };
    var checkin_jinbi = 700, showNormal = false;
    if (Storage.getCache(Storage.AUTH) == Tools.auth_token() && Storage.getCache("checkin")) {
        var status = Storage.getCache("checkin");
        checkinStatus[status]();
    } else {
        Storage.remove("checkin");
        Ajax.custom({
            url: "api/v1/checkin/setting"
        }, function(data) {
            var d = data.data;
            if (d.checkin_type == "common_checkin") {
                showNormal = true;
            }
            checkin_jinbi = d.commission || 700;
            if (d.is_checkin) {
                Storage.set("hasCheckin", "1", true);
                checkinStatus.over();
            } else {
                if (d.left_num > 0) {
                    $("#leftNum").text("今日剩余 " + d.left_num + "/" + d.total_num);
                    $("#timer").prev().text("距离开始还有");
                    new Timer("#timer", d.left_seconds, d.is_start, function() {
                        $("#signin").addClass("checkin");
                        if (Storage.get("hasCheckin", true) && Storage.get("hasCheckin", true) == 1) {
                            checkinStatus.over();
                        }
                    });
                } else {
                    if (showNormal) {
                        checkinStatus.normal();
                    }
                    $("#signin").text("已抢光").addClass("over");
                }
            }
        });
    }
    $("#hotSearch").show();
    $("#hotSearch").on("click", function() {
        if (km.less("1.3.2")) {
            fun.updateApp();
        } else {
            window.location = "kmb://hotsearch";
        }
    });
    if (km.less("1.2.0")) {
        $("#replyC, #likeC").on("click", function() {
            fun.updateApp();
        });
    }
    function getJunior() {
        Ajax.custom({
            url: "api/v1/task/junior"
        }, function(d) {
            var data = d.data;
            if (data.show_junior_task) {
                $("#newbie_school").on("click", function() {
                    var _self = $(this);
                    if (km.less("1.4.2")) {
                        fun.updateApp();
                    } else {
                        if ($("#newbie_school .over").length > 0) {
                            window.location = "kmb://newbie";
                        } else {
                            fun.getCoin("read_tutorial", function() {
                                Tools.alertDialog({
                                    text: "获得" + _self.data("num") + "金币"
                                });
                                setTimeout(function() {
                                    $("#newbie_school .right").text("已完成").addClass("over");
                                    window.location = "kmb://newbie";
                                }, 900);
                            });
                        }
                    }
                });
                $("#newbie_search").on("click", function() {
                    if (km.less("1.3.2")) {
                        fun.updateApp();
                    } else {
                        window.location = "kmb://hotsearch";
                    }
                });
                $("#newbie_read").on("click", function() {
                    window.location = "kmb://main";
                });
                $("#newbieTask").show();
                var n_day_len = $("#newbieDays li").length;
                var n_can_day = data.can_receive_junior_reward_day_num;
                var n_has_day = data.receive_junior_reward_day_num;
                if (n_can_day != 0) {
                    $("#newbieDays li").eq(n_can_day - 1).addClass("can_get");
                }
                for (var i = 0; i < n_has_day; i++) {
                    $("#newbieDays li").eq(i).addClass("has_get");
                }
                if (data.has_read_tutorial) {
                    $("#newbie_school .right").text("已完成").addClass("over");
                }
                if (data.has_first_read_article) {
                    $("#newbie_read .right").text("已完成").addClass("over");
                }
                if (data.has_first_search) {
                    $("#newbie_search .right").text("已完成").addClass("over");
                }
                var days_wel = [ "junior_first_day_reward", "junior_second_day_reward", "junior_third_day_reward", "junior_fourth_day_reward", "junior_fifth_day_reward", "junior_sixth_day_reward", "junior_seventh_day_reward" ];
                $("#newbieDays").on("click", "li", function() {
                    var _self = $(this), i = _self.index();
                    var coin = _self.data("num");
                    var tt = "成功领取" + coin + "金币";
                    if (_self.hasClass("card")) {
                        tt = "获得一张" + coin + "天加速卡";
                    }
                    if (_self.hasClass("can_get")) {
                        fun.getCoin(days_wel[i], function() {
                            new tipsAd({
                                type: "ok",
                                subtit: tt,
                                text: "得到第" + (i + 1) + "天奖励",
                                hasAd: "0"
                            });
                            _self.removeClass("can_get").addClass("has_get");
                        });
                    } else if (_self.hasClass("has_get")) {
                        Tools.alertDialog({
                            text: "你已领过第" + (i + 1) + "天的奖励"
                        });
                    } else {
                        Tools.alertDialog({
                            text: "第" + (i + 1) + "天领取时间未到！"
                        });
                    }
                });
            } else {
                Storage.setCache(Storage.AUTH, Tools.auth_token());
                $("#newbieTask").remove();
            }
        });
    }
    if (Storage.getCache(Storage.AUTH)) {
        var old_auth = Storage.getCache(Storage.AUTH);
        if (Tools.auth_token() != old_auth) {
            getJunior();
            Storage.remove(Storage.AUTH);
        }
    } else {
        getJunior();
    }
    Ajax.custom({
        url: "api/v1/task/daily",
        data: {
            ver_name: km_v
        }
    }, function(d) {
        var data = d.data;
        if (data.show_share_km) {
            $("#shareKM").show();
            if (data.has_shared_km) {
                $("#welfare h6").text("已完成").addClass("over");
            }
            $("#shareKM").on("click", function() {
                var _self = $(this);
                if ($("#welfare .over").length > 0) {
                    window.location = "kmb://sharetask?coin=0&shareurl=http://share.51xiaoli.cn/inviteReg.html";
                } else {
                    window.location = "kmb://sharetask?coin=" + _self.data("num") + "&shareurl=http://share.51xiaoli.cn/inviteReg.html";
                }
            });
        }
        if (data.show_daily_fuli) {
            $("#welfare").show();
            if (data.has_join_fuli_act) {
                $("#welfare h6").text("已完成").addClass("over");
            }
            $("#welfare").on("click", function() {
                var _self = $(this);
                if ($("#welfare .over").length > 0) {
                    window.location = data.daily_fuli_task.origin_url;
                } else {
                    fun.getCoin("join_fuli_act", function() {
                        Tools.alertDialog({
                            text: "获得" + _self.data("num") + "金币"
                        });
                        setTimeout(function() {
                            $("#welfare h6").text("已完成").addClass("over");
                            window.location = data.daily_fuli_task.origin_url;
                        }, 1e3);
                    });
                }
            });
        }
        if (!data.has_bind_invite_code) {
            $("#bindCode").show();
            $("#bindCode").on("click", function() {
                window.location = "bindCode.html?auth_token=" + Tools.auth_token();
            });
        }
        $("#readMesA, #gatherA").show();
        if (Tools.getQueryValue("notice") != "open") {
            $("#readMesA").on("click", function() {
                if (km.less("1.4.2")) {
                    fun.updateApp();
                } else {
                    window.location = "kmb://sysnotificationsetting";
                }
            });
        } else {
            $("#readMesA h6").html('待推送<i class="iconfont ui-arrowlink"></i>');
            $("#readMesA").addClass("tips");
            $("#readMesA").on("click", function() {
                Tools.alertDialog({
                    text: "阅读每日推送文章<br>可获得额外金币奖励"
                });
            });
        }
        $("#gatherA").on("click", function() {
            if (data.has_caiji_permission) {
                if (km.less("1.4.0")) {
                    fun.updateApp();
                } else {
                    window.location = "kmb://worthreadingtab";
                }
            } else {
                if (km.less("1.4.2")) {
                    fun.updateApp();
                } else {
                    window.location = "kmb://applyworthreading";
                }
            }
        });
    });
    var runAD = Storage.getCache("adImgs");
    if (runAD) {} else {
        runAD = [];
        Ajax.custom({
            url: "api/v1/ads",
            data: {
                location: "checkin_alert"
            }
        }, function(d) {
            for (var i = 0; i < d.data.length; i++) {
                var ad = {
                    img: "",
                    link: ""
                };
                ad.img = d.data[i].images[0];
                ad.link = d.data[i].origin_url;
                runAD.push(ad);
            }
            Storage.setCache("adImgs", runAD, 600);
        });
    }
    $("#rule").on("click", function() {
        new tipsAd({
            type: "rule",
            subtit: "每天上午10点准时开抢",
            text: "开启提醒，快人一步！<br>数量有限，先到先得！",
            hasAd: "0",
            isClose: "no",
            btnType: "1"
        });
    });
    $("#signin").on("click", function() {
        var btn = $(this);
        if (btn.hasClass("checkin")) {
            btn.removeClass("checkin");
            var showad = Math.floor(Math.random() * runAD.length);
            var waiting = new tipsAd({
                type: "waiting",
                subtit: "拼命疯抢中…",
                isClose: "no",
                adImg: runAD[showad].img,
                adLink: runAD[showad].link
            });
            setTimeout(function() {
                Ajax.custom({
                    url: "api/v1/checkin"
                }, function(data) {
                    waiting.close();
                    if (data.status == 1e3) {
                        checkinStatus.over();
                        Storage.set("hasCheckin", 1, true);
                        var showad = Math.floor(Math.random() * runAD.length);
                        new tipsAd({
                            type: "ok",
                            title: "签到成功",
                            text: "恭喜你获得" + data.data.commission + "金币",
                            adImg: runAD[showad].img,
                            adLink: runAD[showad].link
                        });
                        var iframe = document.createElement("iframe");
                        iframe.src = "kmb://refreshgold";
                        iframe.style.display = "none";
                        $("body").append(iframe);
                        $(iframe).remove();
                    }
                    if (data.status == 9001) {
                        Storage.set("hasCheckin", 1, true);
                        checkinStatus.over();
                        Tools.alertDialog({
                            text: "今天已签到，明天再来吧"
                        });
                    }
                    if (data.status == 3001 || data.status == 3004) {
                        var showad = Math.floor(Math.random() * runAD.length);
                        checkinStatus.normal();
                        new tipsAd({
                            type: "over",
                            title: "太遗憾没抢到",
                            text: "还有 普通签到 等你参加",
                            adImg: runAD[showad].img,
                            adLink: runAD[showad].link
                        });
                    }
                });
            }, 1e3);
        } else {
            if ($(this).hasClass("over")) {
                var showad = Math.floor(Math.random() * runAD.length);
                new tipsAd({
                    type: "over",
                    title: "手慢了",
                    text: "今日已抢光，明天10点再来吧",
                    adImg: runAD[showad].img,
                    adLink: runAD[showad].link
                });
                return;
            }
            Tools.alertDialog({
                text: "签到未开始，稍后再试",
                time: "0"
            });
        }
    });
    $("#signinNormal").on("click", function() {
        var btn = $(this);
        if (btn.hasClass("checkin")) {
            btn.removeClass("checkin");
            Ajax.custom({
                url: "api/v1/checkin/common"
            }, function(data) {
                if (data.status == 1e3) {
                    checkinStatus.over();
                    Storage.set("hasCheckin", 1, true);
                    var showad = Math.floor(Math.random() * runAD.length);
                    var nor_sign_ad = new tipsAd({
                        type: "ok",
                        isClose: "no",
                        title: "获得" + data.data.commission + "金币",
                        text: "提示：每日前5000名可获得700金币",
                        adImg: runAD[showad].img,
                        adLink: runAD[showad].link
                    });
                    $("#" + nor_sign_ad.id + " .ad a").on("click", function() {
                        $("#" + nor_sign_ad.id).remove();
                        $(".pop-mask").remove();
                    });
                }
                if (data.status == 9001) {
                    Storage.set("hasCheckin", 1, true);
                    checkinStatus.over();
                    Tools.alertDialog({
                        text: "今天已签到，明天再来吧"
                    });
                }
            });
        }
    });
    $("#readA").on("click", function() {
        window.location = "kmb://main";
    });
    $("#inviteF,#inviteFri").on("click", function() {
        window.location = "kmb://invite";
    });
    $("#shareA").on("click", function() {
        window.location = "kmb://back";
    });
    var signListPage = new SecondPage("#signList");
    var $btn = $("#signList .btn");
    $("#viewList").on("click", function() {
        var that = $(this);
        if (that.hasClass("shaodeng")) {
            Tools.alertDialog({
                text: "5s内限查看一次，请稍后再试~"
            });
            return;
        }
        that.addClass("shaodeng");
        setTimeout(function() {
            that.removeClass("shaodeng");
        }, 5e3);
        pagelist.fun({
            url: "api/v1/checkin/logs",
            data: {
                page: 1,
                page_size: 20
            }
        });
        $("#listPage").hide();
        signListPage.openSidebar();
        $("#conList").height(innerHeight - $btn.height());
    });
    $btn.on("click", function() {
        signListPage.closeSidebar();
    });
});define("mod/pagelist", [ "./base", "../plugs/laypage" ], function(require, exports, module) {
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
                        that.pages = data.total;
                        if (obj.curr == data.total) {
                            options.hasNext = false;
                            $(options.pagingDom).find(".laypage_main").html("<span>没有更多数据</span>");
                        }
                        $.each(data.data, function() {
                            this.added_time = Ajax.formatDate(this.added_time);
                        });
                        if (beforeCallback) {
                            $.isFunction(beforeCallback) && beforeCallback(data);
                        }
                        if (data.page != 1) {
                            Ajax.render(options.renderEle, options.renderFor, data, undefined, false);
                        } else {
                            Ajax.render(options.renderEle, options.renderFor, data, undefined, true);
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
}();define("plugs/storageCache", [], function() {
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
        NAME: "MY-NAME",
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
});define("plugs/timer", [], function(require, exports, module) {
    var Timer = function(el, t, isStart, callback) {
        this.el = el;
        this.remaining = t;
        this.isFirst = true;
        this.isStart = isStart || false;
        this.zeroize = function(n) {
            return n < 10 ? "0" + n : "" + n;
        };
        this.callback = callback;
        this.init();
    };
    Timer.prototype.init = function() {
        var _self = this, h, m, s;
        if (_self.isStart) {
            if (_self.remaining == 0) {
                $(_self.el).html('<em class="h">00</em>:<em class="m">00</em>:<em class="s">00</em>').show().prev().show();
                $.isFunction(_self.callback) && _self.callback();
                return;
            } else {
                $(_self.el).prev().html("开抢时间：每日10点");
                $("#signin").addClass("over");
            }
        } else {
            if (_self.remaining > 2 * 60 * 60) {
                $(_self.el).html("今日10点开抢").show();
            } else {
                h = parseInt(_self.remaining / (60 * 60));
                m = parseInt(_self.remaining % (60 * 60) / 60);
                s = parseInt(_self.remaining % (60 * 60) % 60);
                $(_self.el).html('<em class="h">' + _self.zeroize(h) + '</em>:<em class="m">' + _self.zeroize(m) + '</em>:<em class="s">' + _self.zeroize(s) + "</em>").show().prev().show();
                _self.count();
            }
        }
    };
    Timer.prototype.count = function() {
        var _self = this, h, m, s;
        var ss, mm, hh;
        s = parseInt($(_self.el + " .s").text());
        m = parseInt($(_self.el + " .m").text());
        h = parseInt($(_self.el + " .h").text());
        ss = s > 0 ? s - 1 : m == 0 && h == 0 ? 0 : 59;
        $(_self.el + " .s").text(_self.zeroize(ss));
        if (s == 0) {
            mm = m > 0 ? m - 1 : h == 0 ? 0 : 59;
            $(_self.el + " .m").text(_self.zeroize(mm));
        }
        if (s == 0 && m == 0) {
            hh = h > 0 ? h - 1 : 0;
            $(_self.el + " .h").text(_self.zeroize(hh));
        }
        if (ss == 0 && m == 0 && h == 0) {
            $.isFunction(_self.callback) && _self.callback();
            return;
        }
        setTimeout(function() {
            _self.count();
        }, 1e3);
    };
    module.exports = Timer;
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