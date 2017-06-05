define("plugs/tipsAd", [], function(require, exports, module) {
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