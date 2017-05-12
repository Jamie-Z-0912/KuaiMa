define("app/newsWelfare", [ "zepto", "../plugs/version", "../plugs/secondPage.js" ], function(require, exports, module) {
    var $ = require("zepto");
    var km = require("../plugs/version");
    var SecondPage = require("../plugs/secondPage.js");
    var openWXPage = new SecondPage("#openWX");
    $("#business").on("click", function() {
        var qq = $(this).text();
        if (/Android/.test(navigator.userAgent) && km.less("1.2.3")) {
            $("#openWX h2").html('长按 <a style="color:#fa0">快马小报</a> 复制');
        } else {
            window.location = "kmb://QQ=" + encodeURIComponent(qq);
        }
        openWXPage.openSidebar();
        return false;
    });
    $("#sidebar-bg").on("touchstart", function() {
        openWXPage.closeSidebar();
        return false;
    });
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