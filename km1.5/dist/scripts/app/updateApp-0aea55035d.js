define("app/updateApp",["../plugs/version.js","../mod/tools"],function(require,exports,module){require("../plugs/version.js");require("../mod/tools"),document.getElementById("con").innerHTML='<p class="cur_v">加入团队<br>多拿一份团队分红<br>这样的好事儿<br>当然要参与进来啦<br>要挣就挣双份儿吧！</p>';var i=Tools.getQueryValue("k");""!=i&&(window.location="kmb://"+i)}),define("plugs/version",[],function(require,exports,module){var i,t={},e=navigator.userAgent;if(t.isKM=/KuaiMa/.test(e),t.isKM){var n=e.split("ssy=")[1];i=/iOS|Android/.test(n.split(";")[0])?n.split(";")[2]:n.split(";")[1],t.version=i.replace("V","")}t.userAgent=e,t.equal=function(i){return!!t.isKM&&i==this.version},t.greater=function(i){if(t.isKM){for(var e=this.version.split("."),n=i.split("."),s=!1,l=0;l<e.length&&!(e[l]<n[l]);l++)e[l]>n[l]&&(s=!0);return s}return!1},t.less=function(i){if(t.isKM){for(var e=this.version.split("."),n=i.split("."),s=!1,l=0;l<e.length&&!(e[l]>n[l]);l++)e[l]<n[l]&&(s=!0);return s}return!1},t.gEq=function(i){return!(!this.equal(i)&&!this.greater(i))},t.lEq=function(i){return!(!this.equal(i)&&!this.less(i))},module.exports=t}),define("mod/tools",[],function(require){var i={getQueryValue:function(i){var t=location.search,e=new Array;if(t.length>1){var n=t.indexOf("?");t=t.substring(n+1,t.length)}else t=null;if(t)for(var s=0;s<t.split("&").length;s++)e[s]=t.split("&")[s];for(var l=0;l<e.length;l++)if(e[l].split("=")[0]==i)return decodeURI(e[l].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(i,t){var e={title:null,text:null,img:null,time:3e3};for(var n in e)i[n]=i[n]||e[n];var s="tips"+(new Date).getTime(),l='<div id="'+s+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';i.time<1&&(l+='<i class="iconfont icon-close" id="close"></i>'),l+='<div class="content">',null!=i.title&&""!=i.title&&(l+="<h1>"+i.title+"</h1>"),null!=i.text&&""!=i.text&&(l+="<p>"+i.text+"</p>"),null!=i.img&&""!=i.img&&(l+='<div class="pic"><img src="'+i.img+'"/></div>'),l+="</div> </div> </div>";var o=$(l).appendTo("body"),r=$("#"+s+" .km-popup").height(),u=$(window).height(),a=(u-r)/2;if($("#"+s+" .km-popup").css("top",a),o.addClass("show-dialog"),$("#close").click(function(){$("#"+s).remove(),$.isFunction(t)&&t()}),i.time>0){var p=i.time;setTimeout(function(){$("#"+s).remove(),$.isFunction(t)&&t()},p)}}};window.Tools=i});