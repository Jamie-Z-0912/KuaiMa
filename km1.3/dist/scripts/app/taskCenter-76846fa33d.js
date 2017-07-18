define("app/taskCenter",["../mod/pagelist","../plugs/cookieStorage.js","../plugs/version","../plugs/timer.js","../plugs/tipsAd.js","../plugs/secondPage.js"],function(require,exports,module){var e=require("../mod/pagelist");require("../plugs/cookieStorage.js");var t=require("../plugs/version"),a=require("../plugs/timer.js"),n=require("../plugs/tipsAd.js"),i=require("../plugs/secondPage.js");if("null"==Tools.auth_token()){var o={title:"提醒",text:"请在快马小报中登录再访问！",time:5e3};return void Tools.alertDialog(o,function(){window.location="kmb://alertlogin"})}if(t.less("1.1.0"))return Tools.alertDialog({title:"重大更新",text:'快马小报全新改版<br>签到每次得0.5元<br></br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">马上更新</a>',time:"0"}),void $("#close").remove();var s={over:function(){$("#checkin").hide(),$("#signinNormal").text("已签到"),$("#norCheckin").show()},normal:function(){$("#checkin").hide(),$("#signinNormal").addClass("checkin"),$("#norCheckin").show()}},r={updateApp:function(){$("body").append('<div class="pop-mask km-dialog"></div><div class="pop-screen km-dialog update_pop"><div class="box"><h2>升级新版本</h2><div class="text"><img src="image/tc-update.png" style="width:100%"><p>开启新任务，快来赚更多！</p></div><div class="btnbox"><a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">去升级</a></div></div></div>')},getCoin:function(e,t){Ajax.custom({url:"api/v1/task/receiveReward",data:{eventType:e}},function(e){1e3!=e.status?Tools.alertDialog({text:e.desc}):$.isFunction(t)&&t()})}},l=700;Ajax.custom({url:"api/v1/checkin/setting"},function(e){var t=e.data;l=t.commission||700,t.is_checkin?(Storage.set("hasCheckin","1",!0),s.over()):t.left_num>0?($("#leftNum").text("今日剩余 "+t.left_num+"/"+t.total_num),$("#timer").prev().text("距离开始还有"),new a("#timer",t.left_seconds,t.is_start,function(){$("#signin").addClass("checkin"),Storage.get("hasCheckin",!0)&&1==Storage.get("hasCheckin",!0)&&s.over()}),$("#timer").show()):("common_checkin"==t.checkin_type&&s.normal(),$("#signin").text("已抢光").addClass("over"))}),console.log(t),t.less("1.3.2")?$("#hotSearch").hide():($("#hotSearch").show(),$("#hotSearch").on("click",function(){t.less("1.3.2")?r.updateApp():window.location="kmb://hotsearch"})),t.less("1.2.0")&&$("#replyC, #likeC").remove(),Ajax.custom({url:"api/v1/task/junior"},function(e){var a=e.data;if(a.show_junior_task){/iPhone|iPad|iPod/.test(t.userAgent)&&t.less("1.4.2")?$("#newbie_school").hide():$("#newbie_school").on("click",function(){var e=$(this);t.less("1.4.2")?r.updateApp():$("#newbie_school .over").length>0?window.location="kmb://newbie":r.getCoin("read_tutorial",function(){Tools.alertDialog({text:"获得"+e.data("num")+"金币"}),setTimeout(function(){$("#newbie_school .right").text("已完成").addClass("over"),window.location="kmb://newbie"},1e3)})}),/iPhone|iPad|iPod/.test(t.userAgent)&&t.less("1.3.2")?$("#newbie_search").hide():($("#newbie_search").show(),$("#newbie_search").on("click",function(){t.less("1.3.2")?r.updateApp():window.location="kmb://hotsearch"})),$("#newbie_read").on("click",function(){window.location="kmb://main"}),$("#newbieTask").show();var i=($("#newbieDays li").length,a.can_receive_junior_reward_day_num),o=a.receive_junior_reward_day_num;0!=i&&$("#newbieDays li").eq(i-1).addClass("can_get");for(var s=0;s<o;s++)$("#newbieDays li").eq(s).addClass("has_get");a.has_read_tutorial&&$("#newbie_school .right").text("已完成").addClass("over"),a.has_first_read_article&&$("#newbie_read .right").text("已完成").addClass("over"),a.has_first_search&&$("#newbie_search .right").text("已完成").addClass("over");var l=["junior_first_day_reward","junior_second_day_reward","junior_third_day_reward","junior_fourth_day_reward","junior_fifth_day_reward","junior_sixth_day_reward","junior_seventh_day_reward"];$("#newbieDays").on("click","li",function(){var e=$(this),t=e.index(),a=e.data("num"),i="成功领取"+a+"金币";e.hasClass("card")&&(i="获得一张"+a+"天加速卡"),e.hasClass("can_get")?r.getCoin(l[t],function(){new n({type:"ok",subtit:i,text:"得到第"+(t+1)+"天奖励",hasAd:"0"}),e.removeClass("can_get").addClass("has_get")}):e.hasClass("has_get")?Tools.alertDialog({text:"你已领过第"+(t+1)+"天的奖励"}):Tools.alertDialog({text:"第"+(t+1)+"天领取时间未到！"})})}else $("#newbieTask").remove()}),Ajax.custom({url:"api/v1/task/daily"},function(e){var a=e.data;a.show_daily_fuli&&($("#welfare").show(),a.has_join_fuli_act&&$("#welfare h6").text("已完成").addClass("over"),$("#welfare").on("click",function(){var e=$(this);$("#welfare .over").length>0?window.location=a.daily_fuli_task.origin_url:r.getCoin("join_fuli_act",function(){Tools.alertDialog({text:"获得"+e.data("num")+"金币"}),setTimeout(function(){$("#welfare h6").text("已完成").addClass("over"),window.location=a.daily_fuli_task.origin_url},1e3)})})),/iPhone|iPad|iPod/.test(t.userAgent)&&t.less("1.4.2")?$("#readMesA, #gatherA").remove():($("#hotSearch h6").text(a.search_task_status),$("#readMesA, #gatherA").show(),"open"!=Tools.getQueryValue("notice")?$("#readMesA").on("click",function(){t.less("1.4.2")?r.updateApp():window.location="kmb://sysnotificationsetting"}):($("#readMesA h6").text(a.read_push_status),$("#readMesA").addClass("tips"),$("#readMesA").on("click",function(){Tools.alertDialog({text:"阅读每日推送文章<br>可获得额外金币奖励"})})),$("#gatherA").on("click",function(){a.has_caiji_permission?t.less("1.4.0")?r.updateApp():window.location="kmb://worthreadingtab":t.less("1.4.2")?r.updateApp():window.location="kmb://applyworthreading"}))});var c=[];Ajax.custom({url:"api/v1/ads",data:{location:"checkin_alert"}},function(e){for(var t=0;t<e.data.length;t++){var a={img:"",link:""};a.img=e.data[t].images[0],a.link=e.data[t].origin_url,c.push(a)}}),$("#rule").on("click",function(){new n({type:"rule",subtit:"每天上午10点准时开抢",text:"开启提醒，快人一步！<br>数量有限，先到先得！",hasAd:"0",isClose:"no",btnType:"1"})}),$("#signin").on("click",function(){var e=$(this);if(e.hasClass("checkin")){e.removeClass("checkin");var t=Math.floor(Math.random()*c.length),a=new n({type:"waiting",subtit:"拼命疯抢中…",isClose:"no",adImg:c[t].img,adLink:c[t].link});setTimeout(function(){Ajax.custom({url:"api/v1/checkin"},function(e){if(a.close(),1e3==e.status){s.over(),Storage.set("hasCheckin",1,!0);var t=Math.floor(Math.random()*c.length);new n({type:"ok",title:"签到成功",text:"恭喜你获得"+e.data.commission+"金币",adImg:c[t].img,adLink:c[t].link});var i=document.createElement("iframe");i.src="kmb://refreshgold",i.style.display="none",$("body").append(i),$(i).remove()}9001==e.status&&(Storage.set("hasCheckin",1,!0),s.over(),Tools.alertDialog({text:"今天已签到，明天再来吧"})),3001!=e.status&&3004!=e.status||(s.normal(),new n({type:"over",title:"签到失败",text:"还有普通签到等着你参加",adImg:c[t].img,adLink:c[t].link}))})},1e3)}else{if($(this).hasClass("over")){var t=Math.floor(Math.random()*c.length);return void new n({type:"over",title:"手慢了",text:"今日已抢光，明天10点再来吧",adImg:c[t].img,adLink:c[t].link})}Tools.alertDialog({text:"签到未开始，稍后再试",time:"0"})}}),$("#signinNormal").on("click",function(){var e=$(this);e.hasClass("checkin")&&(e.removeClass("checkin"),setTimeout(function(){Ajax.custom({url:"api/v1/checkin/common"},function(e){if(1e3==e.status){s.over(),Storage.set("hasCheckin",1,!0);var t=Math.floor(Math.random()*c.length);new n({type:"ok",isClose:"no",title:"获得"+e.data.commission+"金币",text:"提示：每日前5000名可获得700金币",adImg:c[t].img,adLink:c[t].link});var a=document.createElement("iframe");a.src="kmb://refreshgold",a.style.display="none",$("body").append(a),$(a).remove()}9001==e.status&&(Storage.set("hasCheckin",1,!0),s.over(),Tools.alertDialog({text:"今天已签到，明天再来吧"})),3001==e.status&&(s.normal(),new n({type:"over",title:"签到未开始",text:"前5000名可获得700金币",adImg:c[t].img,adLink:c[t].link}))})},1e3))}),$("#readA").on("click",function(){window.location="kmb://main"}),$("#inviteF").on("click",function(){window.location="kmb://invite"}),$("#shareA").on("click",function(){window.location="kmb://back"});var u=new i("#signList"),d=$("#signList .btn");$("#viewList").on("click",function(){var t=$(this);if(t.hasClass("shaodeng"))return void Tools.alertDialog({text:"5s内限查看一次，请稍后再试~"});t.addClass("shaodeng"),setTimeout(function(){t.removeClass("shaodeng")},5e3),e.fun({url:"api/v1/checkin/logs",data:{page:1,page_size:20}}),$("#listPage").hide(),u.openSidebar(),$("#conList").height(innerHeight-d.height())}),d.on("click",function(){u.closeSidebar()})}),define("mod/pagelist",["./base","../plugs/laypage"],function(require,exports,module){var e=require("./base"),t=require("../plugs/laypage");window.Ajax=e,exports.defaultListTmpl="#conList-tmpl",exports.defaultListEle="#conList",exports.pagingDom="#listPage",exports.fun=function(a,n,i){var o=(a.data.page,{renderFor:this.defaultListTmpl,renderEle:this.defaultListEle,pagingDom:this.pagingDom,showLoading:!0,hasNext:!0,logtype:"paging"});for(var s in o)a[s]=a[s]||o[s];t({cont:$(a.pagingDom),pages:100,groups:0,curr:1,prev:!1,next:"点击查看更多",skin:"flow",jump:function(t){var o=this;a.data.page=t.curr,e.baseAjax(a,function(s){1020==s.status?(s.data=null,e.render(a.renderEle,a.renderFor,s,void 0,!0),$(a.pagingDom).remove()):(o.pages=s.total,t.curr==s.total&&(a.hasNext=!1,$(a.pagingDom).find(".laypage_main").html("<span>没有更多数据</span>")),$.each(s.data,function(){this.added_time=e.formatDate(this.added_time)}),n&&$.isFunction(n)&&n(s),1!=s.page?e.render(a.renderEle,a.renderFor,s,void 0,!1):e.render(a.renderEle,a.renderFor,s,void 0,!0),i&&$.isFunction(i)&&i(),$(a.pagingDom).removeClass("hide"))},function(e,t,a){"function"==typeof callbackError&&callbackError(e,t,a)})}}),window.onscroll=function(){if(a.hasNext){var e=document.body.scrollTop,t=document.body.scrollHeight;e+window.screen.height*window.devicePixelRatio+100>t&&$("#laypage_0 a").click()}}}}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var a=e,n={"M+":a.getMonth()+1,"d+":a.getDate(),"h+":a.getHours(),"m+":a.getMinutes(),"s+":a.getSeconds(),"q+":Math.floor((a.getMonth()+3)/3),S:a.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(a.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in n)new RegExp("("+i+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?n[i]:("00"+n[i]).substr((""+n[i]).length)));return t}function t(e){var t,a=function(){};if(!e.status)return void Tools.alertDialog({title:"提醒",text:"系统错误，请稍后重试！"});switch(e.status){case 1101:t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"};break;case 1004:t={title:"提醒",text:"请在快马小报中登录再访问！"};break;case 1002:t={title:"提醒",text:"请在快马小报中访问！"};break;case 1006:var n=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+n+"</span>s后自动刷新"};var i=setInterval(function(){n--,n<1&&(clearInterval(i),window.location.reload()),$("#closeTimer").text(n)},1e3);break;default:return t=null,!0}return null!=t?(Tools.alertDialog(t,a),!1):void 0}var $=require("zepto");var a=require("../plugs/doT.min"),n={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,a){var n=a||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var i=dd.getFullYear(),o=dd.getMonth()+1,s=dd.getDate();o<10&&(o="0"+o);var r=i+"-"+o+"-"+s,l=r.match(/(\d+)/g),c=new Date(l[0],l[1]-1,l[2]);return e(c,n)}var c=new Date(parseInt(t));return e(c,n)},baseAjax:function(e,a){var i={name:"app_key",value:n.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(i):e.data.app_key=n.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:n.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(n){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(n)&&a(n)},error:function(t,a,n){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,n,i,o){if($(t).length>0&&n){var s=i||void 0,r=$(t).text(),l=a.template(r,void 0,s);o?$(e).html(l(n)):$(e).append(l(n))}},custom:function(e,t){var a=this;e=e||{},e.logtype="custom",a.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,a,n){return("string"==typeof a?a:a.toString()).replace(t.define||s,function(e,a,i,o){return 0===a.indexOf("def.")&&(a=a.substring(4)),a in n||(":"===i?(t.defineParams&&o.replace(t.defineParams,function(e,t,i){n[a]={arg:t,text:i}}),a in n||(n[a]=o)):new Function("def","def['"+a+"']="+o)(n)),""}).replace(t.use||s,function(a,i){t.useParams&&(i=i.replace(t.useParams,function(e,t,a,i){if(n[a]&&n[a].arg&&i)return e=(a+":"+i).replace(/'|\\/g,"_"),n.__exp=n.__exp||{},n.__exp[e]=n[a].text.replace(new RegExp("(^|[^\\w$])"+n[a].arg+"([^\\w$])","g"),"$1"+i+"$2"),t+"def.__exp['"+e+"']"}));var o=new Function("def","return "+i)(n);return o?e(t,o,n):o})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var a,n={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};n.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},a=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(a,function(e){return t[e]||e}):""}},a=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=n:"function"==typeof define&&define.amd?define(function(){return n}):a.doT=n;var i={start:"'+(",end:")+'",startencode:"'+encodeHTML("},o={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},s=/$^/;n.template=function(r,l,c){l=l||n.templateSettings;var u,d,p=l.append?i:o,g=0;r=l.use||l.define?e(l,r,c||{}):r,r=("var out='"+(l.strip?r.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):r).replace(/'|\\/g,"\\$&").replace(l.interpolate||s,function(e,a){return p.start+t(a)+p.end}).replace(l.encode||s,function(e,a){return u=!0,p.startencode+t(a)+p.end}).replace(l.conditional||s,function(e,a,n){return a?n?"';}else if("+t(n)+"){out+='":"';}else{out+='":n?"';if("+t(n)+"){out+='":"';}out+='"}).replace(l.iterate||s,function(e,a,n,i){return a?(g+=1,d=i||"i"+g,a=t(a),"';var arr"+g+"="+a+";if(arr"+g+"){var "+n+","+d+"=-1,l"+g+"=arr"+g+".length-1;while("+d+"<l"+g+"){"+n+"=arr"+g+"["+d+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||s,function(e,a){return"';"+t(a)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),u&&(l.selfcontained||!a||a._encodeHTML||(a._encodeHTML=n.encodeHTMLSource(l.doNotSkipEncoded)),r="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+n.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+r);try{return new Function(l.varname,r)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+r),e}},n.compile=function(e,t){return n.template(e,null,t)},module.exports=n}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,a=new Array;if(t.length>1){var n=t.indexOf("?");t=t.substring(n+1,t.length)}else t=null;if(t)for(var i=0;i<t.split("&").length;i++)a[i]=t.split("&")[i];for(var o=0;o<a.length;o++)if(a[o].split("=")[0]==e)return decodeURI(a[o].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var a={title:null,text:null,img:null,time:3e3};for(var n in a)e[n]=e[n]||a[n];var i="tips"+(new Date).getTime(),o='<div id="'+i+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(o+='<i class="iconfont icon-close" id="close"></i>'),o+='<div class="content">',null!=e.title&&""!=e.title&&(o+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(o+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(o+='<div class="pic"><img src="'+e.img+'"/></div>'),o+="</div> </div> </div>";var s=$(o).appendTo("body"),r=$("#"+i+" .km-popup").height(),l=$(window).height(),c=(l-r)/2;if($("#"+i+" .km-popup").css("top",c),s.addClass("show-dialog"),$("#close").click(function(){$("#"+i).remove(),$.isFunction(t)&&t()}),e.time>0){var u=e.time;setTimeout(function(){$("#"+i).remove(),$.isFunction(t)&&t()},u)}}};window.Tools=e}),function(){"use strict";function e(n){var i="laypagecss";e.dir="dir"in e?e.dir:o.getpath+"../css/skin/laypage.css",new o(n),e.dir&&!t[a](i)&&o.use(e.dir,i)}e.v="1.3";var t=document,a="getElementById",n="getElementsByTagName",i=0,o=function(e){var t=this;(t.config=e||{}).item=i++,t.render(!0)};o.on=function(e,t,a){return e.attachEvent?e.attachEvent("on"+t,function(){a.call(e,window.even)}):e.addEventListener(t,a,!1),o},o.getpath=function(){var e=document.scripts,t=e[e.length-1].src;return t.substring(0,t.lastIndexOf("/")+1)}(),o.use=function(e,t){},o.prototype.type=function(){var e=this.config;return"object"==typeof e.cont?void 0===e.cont.length?2:3:void 0},o.prototype.view=function(){var t=this,a=t.config,n=[],i={};if(a.pages=0|a.pages,a.curr=0|a.curr||1,a.groups="groups"in a?0|a.groups:5,a.first="first"in a?a.first:"&#x9996;&#x9875;",a.last="last"in a?a.last:"&#x5C3E;&#x9875;",a.prev="prev"in a?a.prev:"&#x4E0A;&#x4E00;&#x9875;",a.next="next"in a?a.next:"&#x4E0B;&#x4E00;&#x9875;",a.pages<=1)return"";for(a.groups>a.pages&&(a.groups=a.pages),i.index=Math.ceil((a.curr+(a.groups>1&&a.groups!==a.pages?1:0))/(0===a.groups?1:a.groups)),a.curr>1&&a.prev&&n.push('<a href="javascript:;" class="laypage_prev" data-page="'+(a.curr-1)+'">'+a.prev+"</a>"),i.index>1&&a.first&&0!==a.groups&&n.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">'+a.first+"</a><span>&#x2026;</span>"),i.poor=Math.floor((a.groups-1)/2),i.start=i.index>1?a.curr-i.poor:1,i.end=i.index>1?function(){var e=a.curr+(a.groups-i.poor-1);return e>a.pages?a.pages:e}():a.groups,i.end-i.start<a.groups-1&&(i.start=i.end-a.groups+1);i.start<=i.end;i.start++)i.start===a.curr?n.push('<span class="laypage_curr" '+(/^#/.test(a.skin)?'style="background-color:'+a.skin+'"':"")+">"+i.start+"</span>"):n.push('<a href="javascript:;" data-page="'+i.start+'">'+i.start+"</a>");return a.pages>a.groups&&i.end<a.pages&&a.last&&0!==a.groups&&n.push('<span>&#x2026;</span><a href="javascript:;" class="laypage_last" title="&#x5C3E;&#x9875;"  data-page="'+a.pages+'">'+a.last+"</a>"),i.flow=!a.prev&&0===a.groups,(a.curr!==a.pages&&a.next||i.flow)&&n.push(function(){return i.flow&&a.curr===a.pages?'<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+a.next+"</span>":'<a href="javascript:;" class="laypage_next" data-page="'+(a.curr+1)+'">'+a.next+"</a>"}()),'<div name="laypage'+e.v+'" class="laypage_main laypageskin_'+(a.skin?function(e){return/^#/.test(e)?"molv":e}(a.skin):"default")+'" id="laypage_'+t.config.item+'">'+n.join("")+function(){return a.skip?'<span class="laypage_total"><label>&#x5230;&#x7B2C;</label><input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="laypage_skip"><label>&#x9875;</label><button type="button" class="laypage_btn">&#x786e;&#x5b9a;</button></span>':""}()+"</div>"},o.prototype.jump=function(e){if(e){for(var t=this,a=t.config,i=e.children,s=e[n]("button")[0],r=e[n]("input")[0],l=0,c=i.length;c>l;l++)"a"===i[l].nodeName.toLowerCase()&&o.on(i[l],"click",function(){var e=0|this.getAttribute("data-page");a.curr=e,t.render()});s&&o.on(s,"click",function(){var e=0|r.value.replace(/\s|\D/g,"");e&&e<=a.pages&&(a.curr=e,t.render())})}},o.prototype.render=function(e){var n=this,i=n.config,o=n.type(),s=n.view();2===o?i.cont.innerHTML=s:3===o?i.cont.html(s):t[a](i.cont).innerHTML=s,i.jump&&i.jump(i,e),n.jump(t[a]("laypage_"+i.item)),i.hash&&!e&&(location.hash="!"+i.hash+"="+i.curr)},"function"==typeof define?define("plugs/laypage",[],function(){return e}):"undefined"!=typeof exports?module.exports=e:window.laypage=e}(),define("plugs/cookieStorage",[],function(){var e={get:function(e){var t="(?:;)?"+e+"=([^;]*);?";if(!new RegExp(t).test(document.cookie))return null;try{return unescape(RegExp.$1)}catch(e){return null}},set:function(e,t,a){a=a||this.getExpDate(7,0,0),"number"==typeof a&&(a=this.getExpDate(a,0,0)),document.cookie=e+"="+escape(t)+(null==a?"":";expires="+a)+"; path=/"},remove:function(e){this.set(e,"",-1)},getExpDate:function(e,t,a){var n=new Date;if("number"==typeof e&&"number"==typeof t&&"number"==typeof t)return n.setDate(n.getDate()+parseInt(e)),n.setHours(n.getHours()+parseInt(t)),n.setMinutes(n.getMinutes()+parseInt(a)),n.toGMTString()}};window.Cookie=e;var t={AUTH:"KMAUTH",LNAME:"MY-LNAME",ACCOUNT:"MY-NAME",HEADIMG:"MY-HEADIMG",get:function(e,t){if(this.isLocalStorage()){var a=this.getStorage(t).getItem(e);return a?JSON.parse(a):void 0}},set:function(e,t,a){this.isLocalStorage()&&(t=JSON.stringify(t),this.getStorage(a).setItem(e,t))},remove:function(e,t){this.isLocalStorage()&&this.getStorage(t).removeItem(e)},getStorage:function(e){return e?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(e){return console.log("本地存储已关闭"),!1}}};window.Storage=t}),define("plugs/version",[],function(require,exports,module){var e,t={},a=navigator.userAgent;if(t.isKM=/KuaiMa/.test(a),t.isKM){var n=a.split("ssy=")[1];e=/iOS|Android/.test(n.split(";")[0])?n.split(";")[2]:n.split(";")[1],t.version=e.replace("V","")}t.userAgent=a,t.equal=function(e){return!!t.isKM&&e==this.version},t.greater=function(e){if(t.isKM){for(var a=this.version.split("."),n=e.split("."),i=!1,o=0;o<a.length&&!(a[o]<n[o]);o++)a[o]>n[o]&&(i=!0);return i}return!1},t.less=function(e){if(t.isKM){for(var a=this.version.split("."),n=e.split("."),i=!1,o=0;o<a.length&&!(a[o]>n[o]);o++)a[o]<n[o]&&(i=!0);return i}return!1},t.gEq=function(e){return!(!this.equal(e)&&!this.greater(e))},t.lEq=function(e){return!(!this.equal(e)&&!this.less(e))},module.exports=t}),define("plugs/timer",[],function(require,exports,module){var e=function(e,t,a,n){this.el=e,this.remaining=t,this.isFirst=!0,this.isStart=a||!1,this.zeroize=function(e){return e<10?"0"+e:""+e},this.callback=n,this.init()};e.prototype.init=function(){var e,t,a,n=this;if(n.isStart){if(0==n.remaining)return $(n.el).html('<em class="h">00</em>:<em class="m">00</em>:<em class="s">00</em>').show().prev().show(),void($.isFunction(n.callback)&&n.callback());$(n.el).html("开抢时间：每日10点").show(),$("#signin").addClass("over")}else n.remaining>7200?$(n.el).html("今日10点开抢").show():(e=parseInt(n.remaining/3600),t=parseInt(n.remaining%3600/60),a=parseInt(n.remaining%3600%60),$(n.el).html('<em class="h">'+n.zeroize(e)+'</em>:<em class="m">'+n.zeroize(t)+'</em>:<em class="s">'+n.zeroize(a)+"</em>").show().prev().show(),n.count())},e.prototype.count=function(){var e,t,a,n,i,o,s=this;if(a=parseInt($(s.el+" .s").text()),t=parseInt($(s.el+" .m").text()),e=parseInt($(s.el+" .h").text()),n=a>0?a-1:0==t&&0==e?0:59,$(s.el+" .s").text(s.zeroize(n)),0==a&&(i=t>0?t-1:0==e?0:59,$(s.el+" .m").text(s.zeroize(i))),0==a&&0==t&&(o=e>0?e-1:0,$(s.el+" .h").text(s.zeroize(o))),0==n&&0==t&&0==e)return void($.isFunction(s.callback)&&s.callback());setTimeout(function(){s.count()},1e3)},module.exports=e}),define("plugs/tipsAd",[],function(require,exports,module){var e=function(e){var t={isClose:"yes",type:"",title:"",subtit:"",text:"",btnType:"0",hasAd:"1",adImg:"image/ad.png",adLink:"school_invite_0.html"};this.option={};for(var a in t)this.option[a]=e[a]||t[a];this.id="pop_"+(new Date).getTime(),this.init()};e.prototype.init=function(e){var t=this,a=t.option,n=[];n.push('<div class="pop-mask km-dialog"></div>'),n.push('<div class="pop-screen km-dialog" id="'+t.id+'">'),n.push('<div class="box">'),"yes"==a.isClose&&n.push('<i class="iconfont icon-close"></i>'),n.push('<div class="hd-img '+a.type+'"></div>'),""!=a.title&&n.push("<h1>"+a.title+"</h1>"),""!=a.subtit&&n.push("<h3>"+a.subtit+"</h3>"),""!=a.text&&n.push('<div class="text">'+a.text+"</div>"),"1"==a.hasAd&&n.push('<div class="ad"><a href="'+a.adLink+'"><img src="'+a.adImg+'" /></a></div>'),"1"==a.btnType&&n.push('<div class="btnbox"><a class="close">我知道了</a></div>'),n.push("</div></div>"),$("body").append(n.join("")),$("#"+t.id).height($("#"+t.id+" .box").height()),$("#"+t.id+" .icon-close, #"+t.id+" .close").on("click",function(){t.close()})},e.prototype.close=function(){var e=$("#"+this.id);e.prev().remove(),e.remove()},module.exports=e}),define("plugs/secondPage",[],function(require,exports,module){var e=0,t=function(e){var t=this;t.targetPage=$(e),$(e+" .ui-icon-return").click(function(e){e.preventDefault(),t.closeSidebar()})};t.prototype={targetPage:void 0,openPage:function(t){var a=$(window),n=a.width(),i=a.height();this.targetPage.addClass("open").css({width:n,height:i}).show(),e++,$("body").hasClass("move")||$("body").addClass("move"),$("#sidebar-bg").show(),t&&t()},openSidebar:function(t){var a=$(window),n=a.width(),i=a.height(),o=this;this.targetPage.show().css({width:n,height:i}),setTimeout(function(){o.targetPage.addClass("open")},100),$("#sidebar-bg").show(),e++,$("body").hasClass("move")||$("body").addClass("move"),t&&t()},closeSidebar:function(t){var a=this;a.targetPage.removeClass("open"),e--,setTimeout(function(){a.targetPage.hide(),hasOpend=!1,e<=0&&$("body").removeClass("move"),t&&t()},220),$("#sidebar-bg").hide(),window.location.hash=""}},module.exports=t});