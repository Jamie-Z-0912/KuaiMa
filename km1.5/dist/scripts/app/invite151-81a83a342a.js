define("app/invite151",["../mod/pagelist2","../plugs/confirmTip.js","../plugs/version.js","../plugs/cookieStorage.js"],function(require,exports,module){function e(e){new n({text:'<p style="color:#333;padding-left:.15rem;padding-right:.15rem;">升级到最新版本，更多任务要你收益涨涨涨！</p>',sureTxt:"马上更新",cancelTxt:"我知道了"},function(e){e&&(window.location="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser")})}function t(e){var t=""+e,a=t.length,n=a/2-2,i=a/2+2;return t.substring(0,n)+"****"+t.substr(i,a-i)}var a=require("../mod/pagelist2");window.jQuery=window.Zepto;var n=require("../plugs/confirmTip.js"),i=require("../plugs/version.js");require("../plugs/cookieStorage.js");location.href;$("#kmError").on("click",function(){Tools.alertDialog({text:'<span style="display:block;width:99%;word-wrap: break-word;">'+location.href+"</span>",time:"0"})}),$("#nav").on("click","li",function(){var e=$(this),t=e.data("id");e.hasClass("active")||(e.addClass("active").siblings().removeClass("active"),$("#"+t).removeClass("hide").siblings("div").addClass("hide"))}),"friend"==Tools.getQueryValue("tab")&&$('#nav li[data-id="friends"]').click();var o;const s="http://share.51xiaoli.cn/inviteReg.html";var r={qr_base64:Storage.get("qr"),channel:function(){var e="",t=i.userAgent;if(2==t.split("ssy=").length){var a=t.split("ssy=")[1];e=/iOS|Android/.test(a.split(";")[0])?a.split(";")[3]:a.split(";")[2]}return e},makeQrImg:function(e){var t=$("#canvasQR")[0],a=t.getContext("2d");a.fillStyle="#fff",a.fillRect(0,0,530,530),a.fill(),a.drawImage(e,30,30,470,470),$("#userQr").html('<img src="'+t.toDataURL("image/png")+'"/>'),a.clearRect(0,0,530,530)},make_qr:function(e){var t=this;if(/Android/.test(i.userAgent)&&t.qr_base64&&t.qr_base64[0]==e){$("#userQrCode").append('<img src="'+t.qr_base64[1]+'"/>');var a=$("#userQrCode img")[0];t.makeQrImg(a)}else{var n=s+"?uid="+e+"&channel="+this.channel();seajs.use("./scripts/lib/jquery.qrcode.min",function(){$("#userQrCode").qrcode({logo:"data:image/png;base64,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",width:190,height:190,correctLevel:2,text:n})});var o=setInterval(function(){if($("#userQrCode img").length>0){clearInterval(o);var a=$("#userQrCode img")[0],n=[e,$("#userQrCode img").attr("src")];Storage.set("qr",n),t.makeQrImg(a)}},100)}var r=s+"?uid="+e,l='kmb://share?param={"shareurl":"'+r+'","desc":"快马送了一个红包给你，快来看看里面有多精彩？戳开有好礼。"}';i.less("1.5.5")||(l='kmb://share?param={"shareurl":"'+r+'","desc":"和我一起赚零花","title":"快马送了一个红包给你，快来看看里面有多精彩？ ","icon":"http://static.etouch.cn/imgs/upload/1512982615.3361.png"}'),$("#type2, #type3, #type4").on("click",function(){window.location=l}),$("#saoma").on("click",".btn",function(){window.location=l})}};if(i.less("1.3.2")){var l=Tools.uid();r.make_qr(l),$("#type5").on("click",function(){window.location="qunfa.html?uid="+l})}Ajax.custom({url:"api/v1/userinfo/base"},function(e){o=e.data.team_id,$("#inviteQr").text(e.data.invite_code),i.less("1.3.2")||r.make_qr(e.data.uid)}),$("#type1").on("click",function(){$("#saoma").show()}),$("#type5").on("click",function(){i.less("1.3.2")?e():window.location="qunfa.html?auth_token="+Tools.auth_token()}),$("#showIncome").on("click",function(){i.less("1.3.2")?e():window.location="showIncome.html?auth_token="+Tools.auth_token()}),$("#callTudi").on("click",function(){$('#nav li[data-id="friends"]').click()}),$("#saoma").on("click",".close",function(){$("#saoma").hide()}),Ajax.custom({url:"api/v1/ads",data:{location:"my_invite_icon"}},function(e){if(1e3==e.status){var t=e.data;if(t.length>0){var a=parseInt(t.length*Math.random());$("#banner").append('<a href="'+t[a].origin_url+'"><img src="'+t[a].images[0]+'" /></a>')}}});!function(e,n){a.fun({url:"api/v1/inviteRelation/friends",data:{orderBy:e,order:n,page:1,page_size:10}},function(e){1020==e.status?$("#navOrder").remove():$.each(e.data.list,function(){""!=o&&"0"!=o&&(this.hasTeam=!0),this.uid=this.to_uid,this.show_uid=t(this.to_uid),this.register_time=Ajax.formatDate(this.register_time,"yyyy-MM-dd hh:mm");var e=(new Date).getTime(),a=e-this.recent_active_time;if(a>0){var n=parseInt(a/1e3/60/60/24);if(n>3)this.recent_active_time=Ajax.formatDate(this.recent_active_time,"yyyy-MM-dd");else if(0==n){var i=parseInt(a/1e3/60/60);this.recent_active_time=0==i?"当前":i+"小时前"}else this.recent_active_time=n+"天前"}else this.recent_active_time=Ajax.formatDate(this.recent_active_time,"yyyy-MM-dd")})})}("recent_active_time","desc"),$("#conList").on("click",".urge",function(){var e=$(this);e.hasClass("disabled")?Tools.alertDialog({text:"每个徒弟每天只能被提醒一次<br>晚22点-早8点不能打扰徒弟哦"}):Ajax.custom({url:"api/v1/inviteRelation/remind",data:{son_uid:e.data("uid")}},function(t){var a;switch(t.status){case 1e3:a="您的徒弟已收到您的提醒！",e.addClass("disabled");break;case 9012:a="每个徒弟,每天只能被提醒一次哦",e.addClass("disabled");break;case 9013:a="晚22点-早8点不能提醒徒弟哦",e.addClass("disabled");break;case 2002:a="您的徒弟不存在！",e.addClass("disabled")}Tools.alertDialog({text:a,time:"0"})})}),$("#conList").on("click",".join_myteam",function(){var e=$(this);e.hasClass("disabled")?Tools.alertDialog({text:"每个徒弟每天只能被邀请一次<br>晚22点-早8点不能打扰徒弟哦",time:"0"}):new n({title:'<p style="width:10.1em;margin:0 auto;text-align:left;">您是否想邀请这位徒弟加入您的团队</p>'},function(t){t&&Ajax.custom({url:"api/v1/teams/"+o+"/invite/"+e.data("uid")},function(t){e.addClass("disabled"),1e3==t.status?Tools.alertDialog({title:"邀请已发出",text:"对方接受后将自动成为您的团员！",time:"0"}):Tools.alertDialog({text:t.desc,time:"0"})})})}),$("#conList").on("click",".more_coin",function(){var e=$(this);e.find(".con").length>0&&(e.hasClass("open")?e.removeClass("open"):e.hasClass("isloaded")?e.addClass("open"):Ajax.custom({url:"api/v1/inviteRelation/friends/active",data:{son_uid:e.data("id")}},function(t){if(e.addClass("isloaded"),1e3==t.status){var a=parseInt(t.data.had_active_day);if(e.find(".txt span").text("（剩余："+t.data.left_active_day+"天）"),a>0)if(a>7)e.find(".coin li").addClass("active");else for(var n=0;n<a;n++)e.find(".coin li").eq(n).addClass("active");e.addClass("open")}}))})}),define("mod/pagelist2",["./base","../plugs/laypage"],function(require,exports,module){var e=require("./base"),t=require("../plugs/laypage");window.Ajax=e,exports.defaultListTmpl="#conList-tmpl",exports.defaultListEle="#conList",exports.pagingDom="#listPage",exports.fun=function(a,n,i){var o=(a.data.page,{renderFor:this.defaultListTmpl,renderEle:this.defaultListEle,pagingDom:this.pagingDom,showLoading:!0,hasNext:!0,logtype:"paging"});for(var s in o)a[s]=a[s]||o[s];t({cont:$(a.pagingDom),pages:100,groups:0,curr:1,prev:!1,next:"点击查看更多",skin:"flow",jump:function(t){var o=this;a.data.page=t.curr,e.baseAjax(a,function(s){1020==s.status?(s.data=null,e.render(a.renderEle,a.renderFor,s,void 0,!0),$(a.pagingDom).remove()):(o.pages=s.data.total_page,t.curr==s.data.total_page&&(a.hasNext=!1,$(a.pagingDom).find(".laypage_main").html("<span>没有更多数据</span>")),$.each(s.data.list,function(){this.added_time=e.formatDate(this.added_time)}),n&&$.isFunction(n)&&n(s),1!=s.data.page?e.render(a.renderEle,a.renderFor,s.data,void 0,!1):e.render(a.renderEle,a.renderFor,s.data,void 0,!0),i&&$.isFunction(i)&&i(),$(a.pagingDom).removeClass("hide"))},function(e,t,a){"function"==typeof callbackError&&callbackError(e,t,a)})}}),window.onscroll=function(){if(a.hasNext){var e=document.body.scrollTop,t=document.body.scrollHeight;e+window.screen.height*window.devicePixelRatio+100>t&&$("#laypage_0 a").click()}}}}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var a=e,n={"M+":a.getMonth()+1,"d+":a.getDate(),"h+":a.getHours(),"m+":a.getMinutes(),"s+":a.getSeconds(),"q+":Math.floor((a.getMonth()+3)/3),S:a.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(a.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in n)new RegExp("("+i+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?n[i]:("00"+n[i]).substr((""+n[i]).length)));return t}function t(e){var t,a=function(){};if(!e.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1004|1009|1015/.test(e.status))t={title:"提醒",text:e.desc};else if(/1006/.test(e.status)){var n=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+n+"</span>s后自动刷新"};var i=setInterval(function(){n--,n<1&&(clearInterval(i),window.location.reload()),$("#closeTimer").text(n)},1e3)}else{if(1101!=e.status)return t=null,!0;t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"}}return null!=t?(Tools.alertDialog(t,a),!1):void 0}var $=require("zepto");var a=require("../plugs/doT.min"),n={key:"26817749",magic_key:"24817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,a){var n=a||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var i=dd.getFullYear(),o=dd.getMonth()+1,s=dd.getDate();o<10&&(o="0"+o);var r=i+"-"+o+"-"+s,l=r.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return e(u,n)}var u=new Date(parseInt(t));return e(u,n)},baseAjax:function(e,a){var i=navigator.userAgent,o=n.key;/magic/.test(i)&&(o=n.magic_key);var s={name:"app_key",value:o};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(s):e.data.app_key=o,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:n.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(n){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(n)&&a(n)},error:function(t,a,n){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,n,i,o){if($(t).length>0&&n){var s=i||void 0,r=$(t).text(),l=a.template(r,void 0,s);o?$(e).html(l(n)):$(e).append(l(n))}},custom:function(e,t){var a=this;e=e||{},e.logtype="custom",a.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,a,n){return("string"==typeof a?a:a.toString()).replace(t.define||s,function(e,a,i,o){return 0===a.indexOf("def.")&&(a=a.substring(4)),a in n||(":"===i?(t.defineParams&&o.replace(t.defineParams,function(e,t,i){n[a]={arg:t,text:i}}),a in n||(n[a]=o)):new Function("def","def['"+a+"']="+o)(n)),""}).replace(t.use||s,function(a,i){t.useParams&&(i=i.replace(t.useParams,function(e,t,a,i){if(n[a]&&n[a].arg&&i)return e=(a+":"+i).replace(/'|\\/g,"_"),n.__exp=n.__exp||{},n.__exp[e]=n[a].text.replace(new RegExp("(^|[^\\w$])"+n[a].arg+"([^\\w$])","g"),"$1"+i+"$2"),t+"def.__exp['"+e+"']"}));var o=new Function("def","return "+i)(n);return o?e(t,o,n):o})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var a,n={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};n.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},a=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(a,function(e){return t[e]||e}):""}},a=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=n:"function"==typeof define&&define.amd?define(function(){return n}):a.doT=n;var i={start:"'+(",end:")+'",startencode:"'+encodeHTML("},o={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},s=/$^/;n.template=function(r,l,u){l=l||n.templateSettings;var c,d,p=l.append?i:o,g=0;r=l.use||l.define?e(l,r,u||{}):r,r=("var out='"+(l.strip?r.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):r).replace(/'|\\/g,"\\$&").replace(l.interpolate||s,function(e,a){return p.start+t(a)+p.end}).replace(l.encode||s,function(e,a){return c=!0,p.startencode+t(a)+p.end}).replace(l.conditional||s,function(e,a,n){return a?n?"';}else if("+t(n)+"){out+='":"';}else{out+='":n?"';if("+t(n)+"){out+='":"';}out+='"}).replace(l.iterate||s,function(e,a,n,i){return a?(g+=1,d=i||"i"+g,a=t(a),"';var arr"+g+"="+a+";if(arr"+g+"){var "+n+","+d+"=-1,l"+g+"=arr"+g+".length-1;while("+d+"<l"+g+"){"+n+"=arr"+g+"["+d+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||s,function(e,a){return"';"+t(a)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),c&&(l.selfcontained||!a||a._encodeHTML||(a._encodeHTML=n.encodeHTMLSource(l.doNotSkipEncoded)),r="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+n.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+r);try{return new Function(l.varname,r)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+r),e}},n.compile=function(e,t){return n.template(e,null,t)},module.exports=n}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,a=new Array;if(t.length>1){var n=t.indexOf("?");t=t.substring(n+1,t.length)}else t=null;if(t)for(var i=0;i<t.split("&").length;i++)a[i]=t.split("&")[i];for(var o=0;o<a.length;o++)if(a[o].split("=")[0]==e)return decodeURI(a[o].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var a={title:null,text:null,img:null,time:3e3};for(var n in a)e[n]=e[n]||a[n];var i="tips"+(new Date).getTime(),o='<div id="'+i+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(o+='<i class="iconfont icon-close" id="close"></i>'),o+='<div class="content">',null!=e.title&&""!=e.title&&(o+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(o+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(o+='<div class="pic"><img src="'+e.img+'"/></div>'),o+="</div> </div> </div>";var s=$(o).appendTo("body"),r=$("#"+i+" .km-popup").height(),l=$(window).height(),u=(l-r)/2;if($("#"+i+" .km-popup").css("top",u),s.addClass("show-dialog"),$("#close").click(function(){$("#"+i).remove(),$.isFunction(t)&&t()}),e.time>0){var c=e.time;setTimeout(function(){$("#"+i).remove(),$.isFunction(t)&&t()},c)}}};window.Tools=e}),function(){"use strict";function e(n){var i="laypagecss";e.dir="dir"in e?e.dir:o.getpath+"../css/skin/laypage.css",new o(n),e.dir&&!t[a](i)&&o.use(e.dir,i)}e.v="1.3";var t=document,a="getElementById",n="getElementsByTagName",i=0,o=function(e){var t=this;(t.config=e||{}).item=i++,t.render(!0)};o.on=function(e,t,a){return e.attachEvent?e.attachEvent("on"+t,function(){a.call(e,window.even)}):e.addEventListener(t,a,!1),o},o.getpath=function(){var e=document.scripts,t=e[e.length-1].src;return t.substring(0,t.lastIndexOf("/")+1)}(),o.use=function(e,t){},o.prototype.type=function(){var e=this.config;return"object"==typeof e.cont?void 0===e.cont.length?2:3:void 0},o.prototype.view=function(){var t=this,a=t.config,n=[],i={};if(a.pages=0|a.pages,a.curr=0|a.curr||1,a.groups="groups"in a?0|a.groups:5,a.first="first"in a?a.first:"&#x9996;&#x9875;",a.last="last"in a?a.last:"&#x5C3E;&#x9875;",a.prev="prev"in a?a.prev:"&#x4E0A;&#x4E00;&#x9875;",a.next="next"in a?a.next:"&#x4E0B;&#x4E00;&#x9875;",a.pages<=1)return"";for(a.groups>a.pages&&(a.groups=a.pages),i.index=Math.ceil((a.curr+(a.groups>1&&a.groups!==a.pages?1:0))/(0===a.groups?1:a.groups)),a.curr>1&&a.prev&&n.push('<a href="javascript:;" class="laypage_prev" data-page="'+(a.curr-1)+'">'+a.prev+"</a>"),i.index>1&&a.first&&0!==a.groups&&n.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">'+a.first+"</a><span>&#x2026;</span>"),i.poor=Math.floor((a.groups-1)/2),i.start=i.index>1?a.curr-i.poor:1,i.end=i.index>1?function(){var e=a.curr+(a.groups-i.poor-1);return e>a.pages?a.pages:e}():a.groups,i.end-i.start<a.groups-1&&(i.start=i.end-a.groups+1);i.start<=i.end;i.start++)i.start===a.curr?n.push('<span class="laypage_curr" '+(/^#/.test(a.skin)?'style="background-color:'+a.skin+'"':"")+">"+i.start+"</span>"):n.push('<a href="javascript:;" data-page="'+i.start+'">'+i.start+"</a>");return a.pages>a.groups&&i.end<a.pages&&a.last&&0!==a.groups&&n.push('<span>&#x2026;</span><a href="javascript:;" class="laypage_last" title="&#x5C3E;&#x9875;"  data-page="'+a.pages+'">'+a.last+"</a>"),i.flow=!a.prev&&0===a.groups,(a.curr!==a.pages&&a.next||i.flow)&&n.push(function(){return i.flow&&a.curr===a.pages?'<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+a.next+"</span>":'<a href="javascript:;" class="laypage_next" data-page="'+(a.curr+1)+'">'+a.next+"</a>"}()),'<div name="laypage'+e.v+'" class="laypage_main laypageskin_'+(a.skin?function(e){return/^#/.test(e)?"molv":e}(a.skin):"default")+'" id="laypage_'+t.config.item+'">'+n.join("")+function(){return a.skip?'<span class="laypage_total"><label>&#x5230;&#x7B2C;</label><input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="laypage_skip"><label>&#x9875;</label><button type="button" class="laypage_btn">&#x786e;&#x5b9a;</button></span>':""}()+"</div>"},o.prototype.jump=function(e){if(e){for(var t=this,a=t.config,i=e.children,s=e[n]("button")[0],r=e[n]("input")[0],l=0,u=i.length;u>l;l++)"a"===i[l].nodeName.toLowerCase()&&o.on(i[l],"click",function(){var e=0|this.getAttribute("data-page");a.curr=e,t.render()});s&&o.on(s,"click",function(){var e=0|r.value.replace(/\s|\D/g,"");e&&e<=a.pages&&(a.curr=e,t.render())})}},o.prototype.render=function(e){var n=this,i=n.config,o=n.type(),s=n.view();2===o?i.cont.innerHTML=s:3===o?i.cont.html(s):t[a](i.cont).innerHTML=s,i.jump&&i.jump(i,e),n.jump(t[a]("laypage_"+i.item)),i.hash&&!e&&(location.hash="!"+i.hash+"="+i.curr)},"function"==typeof define?define("plugs/laypage",[],function(){return e}):"undefined"!=typeof exports?module.exports=e:window.laypage=e}(),define("plugs/confirmTip",[],function(require,exports,module){var e=function(e,t){var a={title:"",text:"",sureTxt:"确定",cancelTxt:"取消"};this.option={};for(var n in a)this.option[n]=e[n]||a[n];this.id="pop_"+(new Date).getTime(),this.init(t)};e.prototype.init=function(e){var t=this,a=t.option,n=[],i=t.id;n.push('<div class="pop-mask km-dialog"></div>'),n.push('<div class="pop-screen km-dialog" id="'+i+'">'),n.push('<div class="box">'),""!=a.title&&n.push("<h2>"+a.title+"</h2>"),""!=a.text&&n.push('<div class="text">'+a.text+"</div>"),n.push('<div class="btnbox"><a class="cancelBtn">'+a.cancelTxt+'</a><a class="sureBtn">'+a.sureTxt+"</a></div>"),n.push("</div></div>"),$("body").append(n.join("")),$("#"+i).height($("#"+i+" .box").height()),$("#"+i+" .sureBtn").click(function(){$("#"+i).prev().remove(),$("#"+i).remove(),$.isFunction(e)&&e(!0)}),$("#"+i+" .cancelBtn").click(function(){$("#"+i).prev().remove(),$("#"+i).remove(),$.isFunction(e)&&e(!1)})},module.exports=e}),define("plugs/version",[],function(require,exports,module){var e,t={},a=navigator.userAgent;if(t.isKM=/KuaiMa/.test(a),t.isKM){var n=a.split("ssy=")[1];e=/iOS|Android/.test(n.split(";")[0])?n.split(";")[2]:n.split(";")[1],t.version=e.replace("V","")}t.userAgent=a,t.equal=function(e){return!!t.isKM&&e==this.version},t.greater=function(e){if(t.isKM){for(var a=this.version.split("."),n=e.split("."),i=!1,o=0;o<a.length&&!(a[o]<n[o]);o++)a[o]>n[o]&&(i=!0);return i}return!1},t.less=function(e){if(t.isKM){for(var a=this.version.split("."),n=e.split("."),i=!1,o=0;o<a.length&&!(a[o]>n[o]);o++)a[o]<n[o]&&(i=!0);return i}return!1},t.gEq=function(e){return!(!this.equal(e)&&!this.greater(e))},t.lEq=function(e){return!(!this.equal(e)&&!this.less(e))},module.exports=t}),define("plugs/cookieStorage",[],function(){var e={get:function(e){var t="(?:;)?"+e+"=([^;]*);?";if(!new RegExp(t).test(document.cookie))return null;try{return unescape(RegExp.$1)}catch(e){return null}},set:function(e,t,a){a=a||this.getExpDate(7,0,0),"number"==typeof a&&(a=this.getExpDate(a,0,0)),document.cookie=e+"="+escape(t)+(null==a?"":";expires="+a)+"; path=/"},remove:function(e){this.set(e,"",-1)},getExpDate:function(e,t,a){var n=new Date;if("number"==typeof e&&"number"==typeof t&&"number"==typeof t)return n.setDate(n.getDate()+parseInt(e)),n.setHours(n.getHours()+parseInt(t)),n.setMinutes(n.getMinutes()+parseInt(a)),n.toGMTString()}};window.Cookie=e;var t={AUTH:"KMAUTH",LNAME:"MY-LNAME",ACCOUNT:"MY-NAME",HEADIMG:"MY-HEADIMG",get:function(e,t){if(this.isLocalStorage()){var a=this.getStorage(t).getItem(e);return a?JSON.parse(a):void 0}},set:function(e,t,a){this.isLocalStorage()&&(t=JSON.stringify(t),this.getStorage(a).setItem(e,t))},remove:function(e,t){this.isLocalStorage()&&this.getStorage(t).removeItem(e)},getStorage:function(e){return e?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(e){return console.log("本地存储已关闭"),!1}}};window.Storage=t});