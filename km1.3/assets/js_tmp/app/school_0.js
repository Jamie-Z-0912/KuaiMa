define("app/school0", [ "zepto", "../plugs/version.js" ], function(require, exports, module) {
    var $ = require("zepto");
    var km = require("../plugs/version.js");
    if (km.less("1.4.2")) {
        if (/iPhone|iPad|iPod/.test(km.userAgent)) {
            $(".v142 h2").append('<a class="download_link" href="https://itunes.apple.com/gb/app/id1217748676?mt=8">下载新版本 &gt;</a>');
        } else {
            $(".v142 h2").append('<a class="download_link" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">下载新版本 &gt;</a>');
        }
        $(".v142").show();
    } else {
        $(".v142").show();
    }
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
});