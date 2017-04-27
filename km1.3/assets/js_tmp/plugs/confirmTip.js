define("plugs/confirmTip", [], function(require, exports, module) {
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
});