define("app/static_weixin",["zepto","../plugs/version.js","../plugs/secondPage.js"],function(require,exports,module){var $=require("zepto"),e=require("../plugs/version.js"),t=require("../plugs/secondPage.js"),s=new t("#openWX");$("#business").on("click",function(){return/Android/.test(navigator.userAgent)&&e.less("1.2.3")?$("#openWX h2").html('长按 <a style="color:#fa0">快马小报</a> 复制'):window.location="kmb://QQ="+encodeURIComponent("快马小报"),s.openSidebar(),!1}),$("#sidebar-bg").on("touchstart",function(){return s.closeSidebar(),!1})}),define("plugs/version",[],function(require,exports,module){var e,t={},s=navigator.userAgent;if(t.isKM=/KuaiMa/.test(s),t.isKM){var i=s.split("ssy=")[1];e=/iOS|Android/.test(i.split(";")[0])?i.split(";")[2]:i.split(";")[1],t.version=e.replace("V","")}t.userAgent=s,t.equal=function(e){return!!t.isKM&&e==this.version},t.greater=function(e){if(t.isKM){for(var s=this.version.split("."),i=e.split("."),n=!1,o=0;o<s.length&&!(s[o]<i[o]);o++)s[o]>i[o]&&(n=!0);return n}return!1},t.less=function(e){if(t.isKM){for(var s=this.version.split("."),i=e.split("."),n=!1,o=0;o<s.length&&!(s[o]>i[o]);o++)s[o]<i[o]&&(n=!0);return n}return!1},t.gEq=function(e){return!(!this.equal(e)&&!this.greater(e))},t.lEq=function(e){return!(!this.equal(e)&&!this.less(e))},module.exports=t}),define("plugs/secondPage",[],function(require,exports,module){var e=0,t=function(e){var t=this;t.targetPage=$(e),$(e+" .ui-icon-return").click(function(e){e.preventDefault(),t.closeSidebar()})};t.prototype={targetPage:void 0,openPage:function(t){var s=$(window),i=s.width(),n=s.height();this.targetPage.addClass("open").css({width:i,height:n}).show(),e++,$("body").hasClass("move")||$("body").addClass("move"),$("#sidebar-bg").show(),t&&t()},openSidebar:function(t){var s=$(window),i=s.width(),n=s.height(),o=this;this.targetPage.show().css({width:i,height:n}),setTimeout(function(){o.targetPage.addClass("open")},100),$("#sidebar-bg").show(),e++,$("body").hasClass("move")||$("body").addClass("move"),t&&t()},closeSidebar:function(t){var s=this;s.targetPage.removeClass("open"),e--,setTimeout(function(){s.targetPage.hide(),hasOpend=!1,e<=0&&$("body").removeClass("move"),t&&t()},220),$("#sidebar-bg").hide(),window.location.hash=""}},module.exports=t});