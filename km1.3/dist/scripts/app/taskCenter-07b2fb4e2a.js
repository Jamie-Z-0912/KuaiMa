define("app/taskCenter",["../mod/pagelist","../plugs/cookieStorage.js","../plugs/version","../plugs/timer.js","../plugs/tipsAd.js","../plugs/secondPage.js"],function(require,exports,module){var e=require("../mod/pagelist");require("../plugs/cookieStorage.js");var t=require("../plugs/version"),n=require("../plugs/timer.js"),a=require("../plugs/tipsAd.js"),i=require("../plugs/secondPage.js");if("null"==Tools.auth_token()){var o={title:"提醒",text:"请在快马小报中登录再访问！",time:5e3};return void Tools.alertDialog(o,function(){window.location="kmb://alertlogin"})}if(t.less("1.1.0"))return Tools.alertDialog({title:"重大更新",text:'快马小报全新改版<br>签到每次得0.5元<br></br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">马上更新</a>',time:"0"}),void $("#close").remove();var s={over:function(){$("#checkin").hide(),$("#signinNormal").text("已签到"),$("#norCheckin").show()},normal:function(){$("#checkin").hide(),$("#signinNormal").addClass("checkin"),$("#norCheckin").show()}},r={updateApp:function(){$("body").append('<div class="pop-mask km-dialog"></div><div class="pop-screen km-dialog update_pop"><div class="box"><h2>升级新版本</h2><div class="text"><img src="image/tc-update.png" style="width:100%"><p>开启新任务，快来赚更多！</p></div><div class="btnbox"><a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">去升级</a></div></div></div>')},getCoin:function(e,t){Ajax.custom({url:"api/v1/task/receiveReward",data:{eventType:e}},function(e){1e3!=e.status?Tools.alertDialog({text:e.desc}):$.isFunction(t)&&t()})}},l=700;Ajax.custom({url:"api/v1/checkin/setting"},function(e){var t=e.data;l=t.commission||700,t.is_checkin?(Storage.set("hasCheckin","1",!0),s.over()):t.left_num>0?($("#leftNum").text("今日剩余 "+t.left_num+"/"+t.total_num),$("#timer").prev().text("距离开始还有"),new n("#timer",t.left_seconds,t.is_start,function(){$("#signin").addClass("checkin"),Storage.get("hasCheckin",!0)&&1==Storage.get("hasCheckin",!0)&&s.over()}),$("#timer").show()):("common_checkin"==t.checkin_type&&s.normal(),$("#signin").text("已抢光").addClass("over"))}),console.log(t),t.less("1.3.2")?$("#hotSearch").hide():($("#hotSearch").show(),$("#hotSearch").on("click",function(){t.less("1.3.2")?r.updateApp():window.location="kmb://hotsearch"})),t.less("1.2.0")&&$("#replyC, #likeC").remove(),Ajax.custom({url:"api/v1/task/junior"},function(e){var n=e.data;if(n.show_junior_task){/iPhone|iPad|iPod/.test(t.userAgent)&&t.less("1.4.2")?$("#newbie_school").hide():$("#newbie_school").on("click",function(){var e=$(this);t.less("1.4.2")?r.updateApp():$("#newbie_school .over").length>0?window.location="kmb://newbie":r.getCoin("read_tutorial",function(){Tools.alertDialog({text:"获得"+e.data("num")+"金币"}),setTimeout(function(){$("#newbie_school .right").text("已完成").addClass("over"),window.location="kmb://newbie"},1e3)})}),/iPhone|iPad|iPod/.test(t.userAgent)&&t.less("1.3.2")?$("#newbie_search").hide():($("#newbie_search").show(),$("#newbie_search").on("click",function(){t.less("1.3.2")?r.updateApp():window.location="kmb://hotsearch"})),$("#newbie_read").on("click",function(){window.location="kmb://main"}),$("#newbieTask").show();var i=($("#newbieDays li").length,n.can_receive_junior_reward_day_num),o=n.receive_junior_reward_day_num;0!=i&&$("#newbieDays li").eq(i-1).addClass("can_get");for(var s=0;s<o;s++)$("#newbieDays li").eq(s).addClass("has_get");n.has_read_tutorial&&$("#newbie_school .right").text("已完成").addClass("over"),n.has_first_read_article&&$("#newbie_read .right").text("已完成").addClass("over"),n.has_first_search&&$("#newbie_search .right").text("已完成").addClass("over");var l=["junior_first_day_reward","junior_second_day_reward","junior_third_day_reward","junior_fourth_day_reward","junior_fifth_day_reward","junior_sixth_day_reward","junior_seventh_day_reward"];$("#newbieDays").on("click","li",function(){var e=$(this),t=e.index(),n=e.data("num"),i="成功领取"+n+"金币";e.hasClass("card")&&(i="获得一张"+n+"天加速卡"),e.hasClass("can_get")?r.getCoin(l[t],function(){new a({type:"ok",subtit:i,text:"得到第"+(t+1)+"天奖励",hasAd:"0"}),e.removeClass("can_get").addClass("has_get")}):e.hasClass("has_get")?Tools.alertDialog({text:"你已领过第"+(t+1)+"天的奖励"}):Tools.alertDialog({text:"第"+(t+1)+"天领取时间未到！"})})}else $("#newbieTask").remove()}),Ajax.custom({url:"api/v1/task/daily"},function(e){var n=e.data;n.show_daily_fuli&&($("#welfare").show(),n.has_join_fuli_act&&$("#welfare h6").text("已完成"),$("#welfare").on("click",function(){var e=$(this);$("#welfare .over").length>0?window.location=n.daily_fuli_task.origin_url:r.getCoin("join_fuli_act",function(){Tools.alertDialog({text:"获得"+e.data("num")+"金币"}),setTimeout(function(){$("#welfare h6").text("已完成"),window.location=n.daily_fuli_task.origin_url},1e3)})})),/iPhone|iPad|iPod/.test(t.userAgent)&&t.less("1.4.2")?$("#readMesA, #gatherA").remove():($("#hotSearch h6").text(n.search_task_status),$("#readMesA, #gatherA").show(),"open"!=Tools.getQueryValue("notice")?$("#readMesA").on("click",function(){t.less("1.4.2")?r.updateApp():window.location="kmb://sysnotificationsetting"}):($("#readMesA h6").text(n.read_push_status),$("#readMesA").addClass("over")),$("#gatherA").on("click",function(){n.has_caiji_permission?t.less("1.4.0")?r.updateApp():window.location="kmb://worthreadingtab":t.less("1.4.2")?r.updateApp():window.location="kmb://applyworthreading"}))});var c=[];Ajax.custom({url:"api/v1/ads",data:{location:"checkin_alert"}},function(e){for(var t=0;t<e.data.length;t++){var n={img:"",link:""};n.img=e.data[t].images[0],n.link=e.data[t].origin_url,c.push(n)}}),$("#rule").on("click",function(){new a({type:"rule",subtit:"每天上午10点准时开抢",text:"开启提醒，快人一步！<br>数量有限，先到先得！",hasAd:"0",isClose:"no",btnType:"1"})}),$("#signin").on("click",function(){var e=$(this);if(e.hasClass("checkin")){e.removeClass("checkin");var t=Math.floor(Math.random()*c.length),n=new a({type:"waiting",subtit:"拼命疯抢中…",isClose:"no",adImg:c[t].img,adLink:c[t].link});setTimeout(function(){Ajax.custom({url:"api/v1/checkin"},function(e){if(n.close(),1e3==e.status){s.over(),Storage.set("hasCheckin",1,!0);var t=Math.floor(Math.random()*c.length);new a({type:"ok",title:"签到成功",text:"恭喜你获得"+e.data.commission+"金币",adImg:c[t].img,adLink:c[t].link});var i=document.createElement("iframe");i.src="kmb://refreshgold",i.style.display="none",$("body").append(i),$(i).remove()}9001==e.status&&(Storage.set("hasCheckin",1,!0),s.over(),Tools.alertDialog({text:"今天已签到，明天再来吧"})),3001!=e.status&&3004!=e.status||(s.normal(),new a({type:"over",title:"签到失败",text:"还有普通签到等着你参加",adImg:c[t].img,adLink:c[t].link}))})},1e3)}else{if($(this).hasClass("over")){var t=Math.floor(Math.random()*c.length);return void new a({type:"over",title:"手慢了",text:"今日已抢光，明天10点再来吧",adImg:c[t].img,adLink:c[t].link})}Tools.alertDialog({text:"签到未开始，稍后再试",time:"0"})}}),$("#signinNormal").on("click",function(){var e=$(this);e.hasClass("checkin")&&(e.removeClass("checkin"),setTimeout(function(){Ajax.custom({url:"api/v1/checkin/common"},function(e){if(1e3==e.status){s.over(),Storage.set("hasCheckin",1,!0);var t=Math.floor(Math.random()*c.length);new a({type:"ok",isClose:"no",title:"获得"+e.data.commission+"金币",text:"提示：每日前5000名可获得700金币",adImg:c[t].img,adLink:c[t].link});var n=document.createElement("iframe");n.src="kmb://refreshgold",n.style.display="none",$("body").append(n),$(n).remove()}9001==e.status&&(Storage.set("hasCheckin",1,!0),s.over(),Tools.alertDialog({text:"今天已签到，明天再来吧"})),3001==e.status&&(s.normal(),new a({type:"over",title:"签到未开始",text:"前5000名可获得700金币",adImg:c[t].img,adLink:c[t].link}))})},1e3))}),$("#readA").on("click",function(){window.location="kmb://main"}),$("#inviteF").on("click",function(){window.location="kmb://invite"}),$("#shareA").on("click",function(){window.location="kmb://back"});var u=new i("#signList"),d=$("#signList .btn");$("#viewList").on("click",function(){var t=$(this);if(t.hasClass("shaodeng"))return void Tools.alertDialog({text:"5s内限查看一次，请稍后再试~"});t.addClass("shaodeng"),setTimeout(function(){t.removeClass("shaodeng")},5e3),e.fun({url:"api/v1/checkin/logs",data:{page:1,page_size:20}}),$("#listPage").hide(),u.openSidebar(),$("#conList").height(innerHeight-d.height())}),d.on("click",function(){u.closeSidebar()})}),define("mod/pagelist",["./base","../plugs/laypage"],function(require,exports,module){var e=require("./base"),t=require("../plugs/laypage");window.Ajax=e,exports.defaultListTmpl="#conList-tmpl",exports.defaultListEle="#conList",exports.pagingDom="#listPage",exports.fun=function(n,a,i){var o=(n.data.page,{renderFor:this.defaultListTmpl,renderEle:this.defaultListEle,pagingDom:this.pagingDom,showLoading:!0,hasNext:!0,logtype:"paging"});for(var s in o)n[s]=n[s]||o[s];t({cont:$(n.pagingDom),pages:100,groups:0,curr:1,prev:!1,next:"点击查看更多",skin:"flow",jump:function(t){var o=this;n.data.page=t.curr,e.baseAjax(n,function(s){1020==s.status?(s.data=null,e.render(n.renderEle,n.renderFor,s,void 0,!0),$(n.pagingDom).remove()):(o.pages=s.total,t.curr==s.total&&(n.hasNext=!1,$(n.pagingDom).find(".laypage_main").html("<span>没有更多数据</span>")),$.each(s.data,function(){this.added_time=e.formatDate(this.added_time)}),a&&$.isFunction(a)&&a(s),1!=s.page?e.render(n.renderEle,n.renderFor,s,void 0,!1):e.render(n.renderEle,n.renderFor,s,void 0,!0),i&&$.isFunction(i)&&i(),$(n.pagingDom).removeClass("hide"))},function(e,t,n){"function"==typeof callbackError&&callbackError(e,t,n)})}}),window.onscroll=function(){if(n.hasNext){var e=document.body.scrollTop,t=document.body.scrollHeight;e+window.screen.height*window.devicePixelRatio+100>t&&$("#laypage_0 a").click()}}}}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,a={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in a)new RegExp("("+i+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[i]:("00"+a[i]).substr((""+a[i]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"提醒",text:"系统错误，请稍后重试！"});switch(e.status){case 1101:t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"};break;case 1004:t={title:"提醒",text:"请在快马小报中登录再访问！"};break;case 1002:t={title:"提醒",text:"请在快马小报中访问！"};break;case 1006:var a=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+a+"</span>s后自动刷新"};var i=setInterval(function(){a--,a<1&&(clearInterval(i),window.location.reload()),$("#closeTimer").text(a)},1e3);break;default:return t=null,!0}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),a={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var a=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var i=dd.getFullYear(),o=dd.getMonth()+1,s=dd.getDate();o<10&&(o="0"+o);var r=i+"-"+o+"-"+s,l=r.match(/(\d+)/g),c=new Date(l[0],l[1]-1,l[2]);return e(c,a)}var c=new Date(parseInt(t));return e(c,a)},baseAjax:function(e,n){var i={name:"app_key",value:a.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(i):e.data.app_key=a.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:a.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(a){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(a)&&n(a)},error:function(t,n,a){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,a,i,o){if($(t).length>0&&a){var s=i||void 0,r=$(t).text(),l=n.template(r,void 0,s);o?$(e).html(l(a)):$(e).append(l(a))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,a){return("string"==typeof n?n:n.toString()).replace(t.define||s,function(e,n,i,o){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in a||(":"===i?(t.defineParams&&o.replace(t.defineParams,function(e,t,i){a[n]={arg:t,text:i}}),n in a||(a[n]=o)):new Function("def","def['"+n+"']="+o)(a)),""}).replace(t.use||s,function(n,i){t.useParams&&(i=i.replace(t.useParams,function(e,t,n,i){if(a[n]&&a[n].arg&&i)return e=(n+":"+i).replace(/'|\\/g,"_"),a.__exp=a.__exp||{},a.__exp[e]=a[n].text.replace(new RegExp("(^|[^\\w$])"+a[n].arg+"([^\\w$])","g"),"$1"+i+"$2"),t+"def.__exp['"+e+"']"}));var o=new Function("def","return "+i)(a);return o?e(t,o,a):o})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,a={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};a.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=a:"function"==typeof define&&define.amd?define(function(){return a}):n.doT=a;var i={start:"'+(",end:")+'",startencode:"'+encodeHTML("},o={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},s=/$^/;a.template=function(r,l,c){l=l||a.templateSettings;var u,d,p=l.append?i:o,g=0;r=l.use||l.define?e(l,r,c||{}):r,r=("var out='"+(l.strip?r.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):r).replace(/'|\\/g,"\\$&").replace(l.interpolate||s,function(e,n){return p.start+t(n)+p.end}).replace(l.encode||s,function(e,n){return u=!0,p.startencode+t(n)+p.end}).replace(l.conditional||s,function(e,n,a){return n?a?"';}else if("+t(a)+"){out+='":"';}else{out+='":a?"';if("+t(a)+"){out+='":"';}out+='"}).replace(l.iterate||s,function(e,n,a,i){return n?(g+=1,d=i||"i"+g,n=t(n),"';var arr"+g+"="+n+";if(arr"+g+"){var "+a+","+d+"=-1,l"+g+"=arr"+g+".length-1;while("+d+"<l"+g+"){"+a+"=arr"+g+"["+d+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||s,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),u&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=a.encodeHTMLSource(l.doNotSkipEncoded)),r="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+a.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+r);try{return new Function(l.varname,r)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+r),e}},a.compile=function(e,t){return a.template(e,null,t)},module.exports=a}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var a=t.indexOf("?");t=t.substring(a+1,t.length)}else t=null;if(t)for(var i=0;i<t.split("&").length;i++)n[i]=t.split("&")[i];for(var o=0;o<n.length;o++)if(n[o].split("=")[0]==e)return decodeURI(n[o].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var a in n)e[a]=e[a]||n[a];var i="tips"+(new Date).getTime(),o='<div id="'+i+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(o+='<i class="iconfont icon-close" id="close"></i>'),o+='<div class="content">',null!=e.title&&""!=e.title&&(o+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(o+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(o+='<div class="pic"><img src="'+e.img+'"/></div>'),o+="</div> </div> </div>";var s=$(o).appendTo("body"),r=$("#"+i+" .km-popup").height(),l=$(window).height(),c=(l-r)/2;if($("#"+i+" .km-popup").css("top",c),s.addClass("show-dialog"),$("#close").click(function(){$("#"+i).remove(),$.isFunction(t)&&t()}),e.time>0){var u=e.time;setTimeout(function(){$("#"+i).remove(),$.isFunction(t)&&t()},u)}}};window.Tools=e}),function(){"use strict";function e(a){var i="laypagecss";e.dir="dir"in e?e.dir:o.getpath+"../css/skin/laypage.css",new o(a),e.dir&&!t[n](i)&&o.use(e.dir,i)}e.v="1.3";var t=document,n="getElementById",a="getElementsByTagName",i=0,o=function(e){var t=this;(t.config=e||{}).item=i++,t.render(!0)};o.on=function(e,t,n){return e.attachEvent?e.attachEvent("on"+t,function(){n.call(e,window.even)}):e.addEventListener(t,n,!1),o},o.getpath=function(){var e=document.scripts,t=e[e.length-1].src;return t.substring(0,t.lastIndexOf("/")+1)}(),o.use=function(e,t){},o.prototype.type=function(){var e=this.config;return"object"==typeof e.cont?void 0===e.cont.length?2:3:void 0},o.prototype.view=function(){var t=this,n=t.config,a=[],i={};if(n.pages=0|n.pages,n.curr=0|n.curr||1,n.groups="groups"in n?0|n.groups:5,n.first="first"in n?n.first:"&#x9996;&#x9875;",n.last="last"in n?n.last:"&#x5C3E;&#x9875;",n.prev="prev"in n?n.prev:"&#x4E0A;&#x4E00;&#x9875;",n.next="next"in n?n.next:"&#x4E0B;&#x4E00;&#x9875;",n.pages<=1)return"";for(n.groups>n.pages&&(n.groups=n.pages),i.index=Math.ceil((n.curr+(n.groups>1&&n.groups!==n.pages?1:0))/(0===n.groups?1:n.groups)),n.curr>1&&n.prev&&a.push('<a href="javascript:;" class="laypage_prev" data-page="'+(n.curr-1)+'">'+n.prev+"</a>"),i.index>1&&n.first&&0!==n.groups&&a.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">'+n.first+"</a><span>&#x2026;</span>"),i.poor=Math.floor((n.groups-1)/2),i.start=i.index>1?n.curr-i.poor:1,i.end=i.index>1?function(){var e=n.curr+(n.groups-i.poor-1);return e>n.pages?n.pages:e}():n.groups,i.end-i.start<n.groups-1&&(i.start=i.end-n.groups+1);i.start<=i.end;i.start++)i.start===n.curr?a.push('<span class="laypage_curr" '+(/^#/.test(n.skin)?'style="background-color:'+n.skin+'"':"")+">"+i.start+"</span>"):a.push('<a href="javascript:;" data-page="'+i.start+'">'+i.start+"</a>");return n.pages>n.groups&&i.end<n.pages&&n.last&&0!==n.groups&&a.push('<span>&#x2026;</span><a href="javascript:;" class="laypage_last" title="&#x5C3E;&#x9875;"  data-page="'+n.pages+'">'+n.last+"</a>"),i.flow=!n.prev&&0===n.groups,(n.curr!==n.pages&&n.next||i.flow)&&a.push(function(){return i.flow&&n.curr===n.pages?'<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+n.next+"</span>":'<a href="javascript:;" class="laypage_next" data-page="'+(n.curr+1)+'">'+n.next+"</a>"}()),'<div name="laypage'+e.v+'" class="laypage_main laypageskin_'+(n.skin?function(e){return/^#/.test(e)?"molv":e}(n.skin):"default")+'" id="laypage_'+t.config.item+'">'+a.join("")+function(){return n.skip?'<span class="laypage_total"><label>&#x5230;&#x7B2C;</label><input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="laypage_skip"><label>&#x9875;</label><button type="button" class="laypage_btn">&#x786e;&#x5b9a;</button></span>':""}()+"</div>"},o.prototype.jump=function(e){if(e){for(var t=this,n=t.config,i=e.children,s=e[a]("button")[0],r=e[a]("input")[0],l=0,c=i.length;c>l;l++)"a"===i[l].nodeName.toLowerCase()&&o.on(i[l],"click",function(){var e=0|this.getAttribute("data-page");n.curr=e,t.render()});s&&o.on(s,"click",function(){var e=0|r.value.replace(/\s|\D/g,"");e&&e<=n.pages&&(n.curr=e,t.render())})}},o.prototype.render=function(e){var a=this,i=a.config,o=a.type(),s=a.view();2===o?i.cont.innerHTML=s:3===o?i.cont.html(s):t[n](i.cont).innerHTML=s,i.jump&&i.jump(i,e),a.jump(t[n]("laypage_"+i.item)),i.hash&&!e&&(location.hash="!"+i.hash+"="+i.curr)},"function"==typeof define?define("plugs/laypage",[],function(){return e}):"undefined"!=typeof exports?module.exports=e:window.laypage=e}(),define("plugs/cookieStorage",[],function(){var e={get:function(e){var t="(?:;)?"+e+"=([^;]*);?";if(!new RegExp(t).test(document.cookie))return null;try{return unescape(RegExp.$1)}catch(e){return null}},set:function(e,t,n){n=n||this.getExpDate(7,0,0),"number"==typeof n&&(n=this.getExpDate(n,0,0)),document.cookie=e+"="+escape(t)+(null==n?"":";expires="+n)+"; path=/"},remove:function(e){this.set(e,"",-1)},getExpDate:function(e,t,n){var a=new Date;if("number"==typeof e&&"number"==typeof t&&"number"==typeof t)return a.setDate(a.getDate()+parseInt(e)),a.setHours(a.getHours()+parseInt(t)),a.setMinutes(a.getMinutes()+parseInt(n)),a.toGMTString()}};window.Cookie=e;var t={AUTH:"KMAUTH",LNAME:"MY-LNAME",ACCOUNT:"MY-NAME",HEADIMG:"MY-HEADIMG",get:function(e,t){if(this.isLocalStorage()){var n=this.getStorage(t).getItem(e);return n?JSON.parse(n):void 0}},set:function(e,t,n){this.isLocalStorage()&&(t=JSON.stringify(t),this.getStorage(n).setItem(e,t))},remove:function(e,t){this.isLocalStorage()&&this.getStorage(t).removeItem(e)},getStorage:function(e){return e?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(e){return console.log("本地存储已关闭"),!1}}};window.Storage=t}),define("plugs/version",[],function(require,exports,module){var e,t={},n=navigator.userAgent;if(t.isKM=/KuaiMa/.test(n),t.isKM){var a=n.split("ssy=")[1];e=/iOS|Android/.test(a.split(";")[0])?a.split(";")[2]:a.split(";")[1],t.version=e.replace("V","")}t.userAgent=n,t.equal=function(e){return!!t.isKM&&e==this.version},t.greater=function(e){if(t.isKM){for(var n=this.version.split("."),a=e.split("."),i=!1,o=0;o<n.length&&!(n[o]<a[o]);o++)n[o]>a[o]&&(i=!0);return i}return!1},t.less=function(e){if(t.isKM){for(var n=this.version.split("."),a=e.split("."),i=!1,o=0;o<n.length&&!(n[o]>a[o]);o++)n[o]<a[o]&&(i=!0);return i}return!1},t.gEq=function(e){return!(!this.equal(e)&&!this.greater(e))},t.lEq=function(e){return!(!this.equal(e)&&!this.less(e))},module.exports=t}),define("plugs/timer",[],function(require,exports,module){var e=function(e,t,n,a){this.el=e,this.remaining=t,this.isFirst=!0,this.isStart=n||!1,this.zeroize=function(e){return e<10?"0"+e:""+e},this.callback=a,this.init()};e.prototype.init=function(){var e,t,n,a=this;if(a.isStart){if(0==a.remaining)return $(a.el).html('<em class="h">00</em>:<em class="m">00</em>:<em class="s">00</em>').show().prev().show(),void($.isFunction(a.callback)&&a.callback());$(a.el).html("开抢时间：每日10点").show(),$("#signin").addClass("over")}else a.remaining>7200?$(a.el).html("今日10点开抢").show():(e=parseInt(a.remaining/3600),t=parseInt(a.remaining%3600/60),n=parseInt(a.remaining%3600%60),$(a.el).html('<em class="h">'+a.zeroize(e)+'</em>:<em class="m">'+a.zeroize(t)+'</em>:<em class="s">'+a.zeroize(n)+"</em>").show().prev().show(),a.count())},e.prototype.count=function(){var e,t,n,a,i,o,s=this;if(n=parseInt($(s.el+" .s").text()),t=parseInt($(s.el+" .m").text()),e=parseInt($(s.el+" .h").text()),a=n>0?n-1:0==t&&0==e?0:59,$(s.el+" .s").text(s.zeroize(a)),0==n&&(i=t>0?t-1:0==e?0:59,$(s.el+" .m").text(s.zeroize(i))),0==n&&0==t&&(o=e>0?e-1:0,$(s.el+" .h").text(s.zeroize(o))),0==a&&0==t&&0==e)return void($.isFunction(s.callback)&&s.callback());setTimeout(function(){s.count()},1e3)},module.exports=e}),define("plugs/tipsAd",[],function(require,exports,module){var e=function(e){var t={isClose:"yes",type:"",title:"",subtit:"",text:"",btnType:"0",hasAd:"1",adImg:"image/ad.png",adLink:"school_invite_0.html"};this.option={};for(var n in t)this.option[n]=e[n]||t[n];this.id="pop_"+(new Date).getTime(),this.init()};e.prototype.init=function(e){var t=this,n=t.option,a=[];a.push('<div class="pop-mask km-dialog"></div>'),a.push('<div class="pop-screen km-dialog" id="'+t.id+'">'),a.push('<div class="box">'),"yes"==n.isClose&&a.push('<i class="iconfont icon-close"></i>'),a.push('<div class="hd-img '+n.type+'"></div>'),""!=n.title&&a.push("<h1>"+n.title+"</h1>"),""!=n.subtit&&a.push("<h3>"+n.subtit+"</h3>"),""!=n.text&&a.push('<div class="text">'+n.text+"</div>"),"1"==n.hasAd&&a.push('<div class="ad"><a href="'+n.adLink+'"><img src="'+n.adImg+'" /></a></div>'),"1"==n.btnType&&a.push('<div class="btnbox"><a class="close">我知道了</a></div>'),a.push("</div></div>"),$("body").append(a.join("")),$("#"+t.id).height($("#"+t.id+" .box").height()),$("#"+t.id+" .icon-close, #"+t.id+" .close").on("click",function(){t.close()})},e.prototype.close=function(){var e=$("#"+this.id);e.prev().remove(),e.remove()},module.exports=e}),define("plugs/secondPage",[],function(require,exports,module){var e=0,t=function(e){var t=this;t.targetPage=$(e),$(e+" .ui-icon-return").click(function(e){e.preventDefault(),t.closeSidebar()})};t.prototype={targetPage:void 0,openPage:function(t){var n=$(window),a=n.width(),i=n.height();this.targetPage.addClass("open").css({width:a,height:i}).show(),e++,$("body").hasClass("move")||$("body").addClass("move"),$("#sidebar-bg").show(),t&&t()},openSidebar:function(t){var n=$(window),a=n.width(),i=n.height(),o=this;this.targetPage.show().css({width:a,height:i}),setTimeout(function(){o.targetPage.addClass("open")},100),$("#sidebar-bg").show(),e++,$("body").hasClass("move")||$("body").addClass("move"),t&&t()},closeSidebar:function(t){var n=this;n.targetPage.removeClass("open"),e--,setTimeout(function(){n.targetPage.hide(),hasOpend=!1,e<=0&&$("body").removeClass("move"),t&&t()},220),$("#sidebar-bg").hide(),window.location.hash=""}},module.exports=t});