define("app/bind",["../mod/submit","../plugs/tipsAd.js"],function(require,exports,module){var t=require("../mod/submit"),e=require("../plugs/tipsAd.js");if("null"==Tools.auth_token()){var n={title:"提醒",text:"请在快马小报中登录再访问！",time:5e3};return void Tools.alertDialog(n,function(){window.location="kmb://alertlogin"})}var i=function(t){Tools.alertDialog(t,function(){$('input[type="submit"]').removeAttr("disabled")})};$("#bindFrom").submit(function(n){n.preventDefault(),$('input[type="submit"]').attr("disabled","disabled");var o=$('input[name="account_name"]').val(),a=$('input[name="bank_card"]').val();$('input[name="bank_branch_name"]').val();if(o.isEmpty()){var s={text:"真实姓名不能为空"};return void i(s)}if(!o.isChinese()){var s={text:"真实姓名必须为中文名"};return void i(s)}if(a.isEmpty()){var s={text:"支付宝号不能为空"};return void i(s)}t.fun({url:"api/v1/withdraw/account/bind",data:$(this)},function(t){if(1e3!=t.status){var n={title:"绑定失败",text:t.desc};i(n)}else new e({type:"rule",subtit:"绑定成功！",hasAd:"0",isClose:"no",btnType:"1"})})})}),define("mod/submit",["./base"],function(require,exports,module){var t=require("./base");window.Ajax=t,String.prototype.isEmail=function(){return new RegExp(/^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(this)},String.prototype.isMobile=function(){return new RegExp(/^1[3|4|5|7|8]\d{9}$/).test(this)},String.prototype.isChinese=function(){return/^[\u4E00-\uFA29]*$/.test(this)&&!/^[\uE7C7-\uE7F3]*$/.test(this)},String.prototype.isEmpty=function(){return/^\s*$/.test(this)},String.prototype.isVerifyCode=function(){return new RegExp(/^\d*$/).test(this)},String.prototype.isNum=function(){return/^[0-9]+$/.test(this)},exports.fun=function(e,n){var i,o,a="string"!=typeof e.data&&!!e.data.length;a?(i=e.data.serializeArray(),o=e.data.find('[type="submit"]'),o.attr("disabled",!0)):i=e.data,$.each(i,function(){this.value=this.value.replace(/\s/gi,"")}),e.data=i,e.type=e.type||"GET",e.logtype="submit",t.baseAjax(e,function(t,e,i){a&&o.removeAttr("disabled"),"function"==typeof n&&n(t)},function(t,e,n){console.log(t.statusText),a&&o.removeAttr("disabled"),"function"==typeof callbackError&&callbackError(t,e,n)})},exports.sendSms=function(e,n){var i={phone:"",uid:"",type:"SMS",useto:""};for(var o in i)i[o]=n[o]||i[o];var a,s=60;a&&clearInterval(a),e.addClass("disabled").text("发送中···"),t.custom({url:"api/v1/verify_code/web",data:i},function(t){return 1e3==t.status?void(a=setInterval(function(){if(0==--s)return clearInterval(a),void e.removeClass("disabled").text("重发验证码");e.text("还剩"+s+"秒")},1e3)):2003==t.status?void Tools.alertDialog({title:"获取失败",text:"获取验证码太频繁，请明日再试"},function(){e.text("明日再获取")}):1008==t.status?void Tools.alertDialog({text:"您已经注册过啦"}):2002==t.status?void Tools.alertDialog({text:"用户不存在"}):void 0})}}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function t(t,e){var n=t,i={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var o in i)new RegExp("("+o+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?i[o]:("00"+i[o]).substr((""+i[o]).length)));return e}function e(t){var e,n=function(){};if(!t.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1004|1008|1009|1015/.test(t.status))e={title:"提醒",text:t.desc};else if(/1006/.test(t.status)){var i=5;e={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+i+"</span>s后自动刷新"};var o=setInterval(function(){i--,i<1&&(clearInterval(o),window.location.reload()),$("#closeTimer").text(i)},1e3)}else{if(1101!=t.status)return e=null,!0;e={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"}}return null!=e?(Tools.alertDialog(e,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),i={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(e,n){var i=n||"yyyy-MM-dd hh:mm";if(isNaN(e)||null==e)return e;if("object"==typeof e){var o=dd.getFullYear(),a=dd.getMonth()+1,s=dd.getDate();a<10&&(a="0"+a);var r=o+"-"+a+"-"+s,l=r.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return t(u,i)}var u=new Date(parseInt(e));return t(u,i)},baseAjax:function(t,n){var o={name:"app_key",value:i.key};t.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==t.logtype&&0!=t.data.skip||$(t.renderEle).hide()),t.data||(t.data={}),$.isFunction(t.data.push)?t.data.push(o):t.data.app_key=i.key,$.isFunction(t.data.push)?t.data.push({name:"auth_token",value:Tools.auth_token()}):t.data.auth_token=Tools.auth_token(),$.ajax({url:i.km_api+t.url,data:t.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(i){t.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==t.logtype&&0!=t.data.skip||$(t.renderEle).show()),e(i)&&n(i)},error:function(e,n,i){console.log(e),t.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=t.logtype&&$(t.renderEle).show()}})},render:function(t,e,i,o,a){if($(e).length>0&&i){var s=o||void 0,r=$(e).text(),l=n.template(r,void 0,s);a?$(t).html(l(i)):$(t).append(l(i))}},custom:function(t,e){var n=this;t=t||{},t.logtype="custom",n.baseAjax(t,e)}}}),define("plugs/doT.min",[],function(require,exports,module){function t(e,n,i){return("string"==typeof n?n:n.toString()).replace(e.define||s,function(t,n,o,a){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in i||(":"===o?(e.defineParams&&a.replace(e.defineParams,function(t,e,o){i[n]={arg:e,text:o}}),n in i||(i[n]=a)):new Function("def","def['"+n+"']="+a)(i)),""}).replace(e.use||s,function(n,o){e.useParams&&(o=o.replace(e.useParams,function(t,e,n,o){if(i[n]&&i[n].arg&&o)return t=(n+":"+o).replace(/'|\\/g,"_"),i.__exp=i.__exp||{},i.__exp[t]=i[n].text.replace(new RegExp("(^|[^\\w$])"+i[n].arg+"([^\\w$])","g"),"$1"+o+"$2"),e+"def.__exp['"+t+"']"}));var a=new Function("def","return "+o)(i);return a?t(e,a,i):a})}function e(t){return t.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,i={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};i.encodeHTMLSource=function(t){var e={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=t?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(t){return t?t.toString().replace(n,function(t){return e[t]||t}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=i:"function"==typeof define&&define.amd?define(function(){return i}):n.doT=i;var o={start:"'+(",end:")+'",startencode:"'+encodeHTML("},a={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},s=/$^/;i.template=function(r,l,u){l=l||i.templateSettings;var d,c,p=l.append?o:a,f=0;r=l.use||l.define?t(l,r,u||{}):r,r=("var out='"+(l.strip?r.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):r).replace(/'|\\/g,"\\$&").replace(l.interpolate||s,function(t,n){return p.start+e(n)+p.end}).replace(l.encode||s,function(t,n){return d=!0,p.startencode+e(n)+p.end}).replace(l.conditional||s,function(t,n,i){return n?i?"';}else if("+e(i)+"){out+='":"';}else{out+='":i?"';if("+e(i)+"){out+='":"';}out+='"}).replace(l.iterate||s,function(t,n,i,o){return n?(f+=1,c=o||"i"+f,n=e(n),"';var arr"+f+"="+n+";if(arr"+f+"){var "+i+","+c+"=-1,l"+f+"=arr"+f+".length-1;while("+c+"<l"+f+"){"+i+"=arr"+f+"["+c+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||s,function(t,n){return"';"+e(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),d&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=i.encodeHTMLSource(l.doNotSkipEncoded)),r="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+i.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+r);try{return new Function(l.varname,r)}catch(t){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+r),t}},i.compile=function(t,e){return i.template(t,null,e)},module.exports=i}),define("mod/tools",[],function(require){var t={getQueryValue:function(t){var e=location.search,n=new Array;if(e.length>1){var i=e.indexOf("?");e=e.substring(i+1,e.length)}else e=null;if(e)for(var o=0;o<e.split("&").length;o++)n[o]=e.split("&")[o];for(var a=0;a<n.length;a++)if(n[a].split("=")[0]==t)return decodeURI(n[a].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(t,e){var n={title:null,text:null,img:null,time:3e3};for(var i in n)t[i]=t[i]||n[i];var o="tips"+(new Date).getTime(),a='<div id="'+o+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';t.time<1&&(a+='<i class="iconfont icon-close" id="close"></i>'),a+='<div class="content">',null!=t.title&&""!=t.title&&(a+="<h1>"+t.title+"</h1>"),null!=t.text&&""!=t.text&&(a+="<p>"+t.text+"</p>"),null!=t.img&&""!=t.img&&(a+='<div class="pic"><img src="'+t.img+'"/></div>'),a+="</div> </div> </div>";var s=$(a).appendTo("body"),r=$("#"+o+" .km-popup").height(),l=$(window).height(),u=(l-r)/2;if($("#"+o+" .km-popup").css("top",u),s.addClass("show-dialog"),$("#close").click(function(){$("#"+o).remove(),$.isFunction(e)&&e()}),t.time>0){var d=t.time;setTimeout(function(){$("#"+o).remove(),$.isFunction(e)&&e()},d)}}};window.Tools=t}),define("plugs/tipsAd",[],function(require,exports,module){var t=function(t){var e={isClose:"yes",type:"",title:"",subtit:"",text:"",btnType:"0",hasAd:"1",adImg:"image/ad.png",adLink:"school_invite_0.html"};this.option={};for(var n in e)this.option[n]=t[n]||e[n];this.id="pop_"+(new Date).getTime(),this.init()};t.prototype.init=function(t){var e=this,n=e.option,i=[];i.push('<div class="pop-mask km-dialog"></div>'),i.push('<div class="pop-screen km-dialog" id="'+e.id+'">'),i.push('<div class="box">'),"yes"==n.isClose&&i.push('<i class="iconfont icon-close"></i>'),i.push('<div class="hd-img '+n.type+'"></div>'),""!=n.title&&i.push("<h1>"+n.title+"</h1>"),""!=n.subtit&&i.push("<h3>"+n.subtit+"</h3>"),""!=n.text&&i.push('<div class="text">'+n.text+"</div>"),"1"==n.hasAd&&i.push('<div class="ad"><a href="'+n.adLink+'"><img src="'+n.adImg+'" /></a></div>'),"1"==n.btnType&&i.push('<div class="btnbox"><a class="close">我知道了</a></div>'),i.push("</div></div>"),$("body").append(i.join("")),$("#"+e.id).height($("#"+e.id+" .box").height()),$("#"+e.id+" .icon-close, #"+e.id+" .close").on("click",function(){e.close()})},t.prototype.close=function(){var t=$("#"+this.id);t.prev().remove(),t.remove()},module.exports=t});