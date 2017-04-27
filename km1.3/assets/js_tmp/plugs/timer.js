define("plugs/timer", [], function(require, exports, module) {
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
                $(_self.el).html("开抢时间：每日10点").show();
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
        if (m == 0) {
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
});