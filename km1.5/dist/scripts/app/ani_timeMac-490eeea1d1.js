define("app/ani_timeMac",["../mod/base2","../plugs/storageCache.js"],function(require,exports,module){function t(t){for(var e=document.getElementById("bingtu"),a=e.getContext("2d"),o=2*Math.PI,i=0;i<t.length;i++)a.fillStyle=t[i].color,a.strokeStyle=t[i].color,a.beginPath(),a.moveTo(88,80),a.arc(88,90,86,o,o-2*Math.PI*(t[i].pre/100),!0),a.fill(),a.stroke(),o-=2*Math.PI*(t[i].pre/100),a.fillRect(190,30*i+20,16,16),a.font="20px serif",a.fillStyle="#fff",a.fillText(t[i].txt,216,30*i+35);return'<img src="'+e.toDataURL("image/png")+'"/>'}function e(){s?($("#myDate").append('<div class="intro"><p>活动日期：2018.01.01~2018.01.07</p><p>活动期内，每日分享即可获得一个宝箱。记得天天来噢！</p></div>'),$("#download").on("click",function(){o.custom({url:"api/v1/sgj/share"},function(){var t="http://share.51xiaoli.cn/animation/timeMac/index.html?uid="+n;/t.kuaima/.test(location.href)&&(t="http://t.kuaima.cn/browser/animation/timeMac/index.html?uid="+n);var e='kmb://share?param={"shareurl":"'+t+'","desc":"2017我在快马赚得满满一桶金，快来点击获取你的赚钱秘籍~"}';km.less("1.5.5")||(e='kmb://share?param={"shareurl":"'+t+'","desc":"最会赚钱的人！","title":"2017我在快马赚得满满一桶金，快来点击获取你的赚钱秘籍~","icon":"http://static.etouch.cn/imgs/upload/1512982615.3361.png"}'),window.location=e})})):seajs.use("https://static.mlinks.cc/scripts/dist/mlink.min.js",function(){var t=new Object;t.mlink="https://ax9wdh.mlinks.cc/AdxL",t.button=document.querySelectorAll("a#download"),t.params={},new Mlink(t)})}function a(t,a,o,i){$("#loading").remove();bodymovin.loadAnimation(r);if(t&&""!=t)$("#content1").html('<div class="txt">'+t+"</div>").addClass("animate1"),setTimeout(function(){$("#content2").html('<div class="txt">'+a+"</div>").addClass("animate2"),$("#content3").html('<div class="txt">'+o+'</div><div id="imgbox">'+i+'</div><div class="txt txt_">悄悄支个招哦：<span class="big">'+(/收徒/.test(o)?"搜索任务":"邀请收徒")+"</span>是最赚钱的！</div>").addClass("animate3"),setTimeout(function(){$("#myDate").append('<a class="reload" href="javascript:location.reload();"></a><a class="download" id="download" href="javascript:void(0)">'+(s?"立即分享，赚宝箱":"生成我的时光机")+"</a>"),e()},16e3)},5e3);else{$("#myDate").css({"background-image":"url(images/nodate/bg.png)","background-color":"#241f1f"}).addClass("opa_in"),$("#nodate1").addClass("nodate");var n=[];n.push('<div class="logo"><img src="images/timelogo.png" /></div>'),n.push('<div class="text"><img src="images/nodate/text.png" /></div>'),n.push('<div class="zhutu" id="zhutu">'),n.push('<div class="box box_2"><img src="images/nodate/no2_t.png" class="tit" /><img src="images/nodate/no2_txt.png" class="txt" /></div>'),n.push('<div class="box box_1"><img src="images/nodate/no1_t.png" class="tit" /><img src="images/nodate/no1_txt.png" class="txt" /></div>'),n.push('<div class="box box_3"><img src="images/nodate/no3_t.png" class="tit" /><img src="images/nodate/no3_txt.png" class="txt" /></div>'),n.push("</div>"),$("#nodate1").html(n.join("")),setTimeout(function(){$("#zhutu .box").eq(1).height("206px").find(".tit,.txt").addClass("opa_in_1"),$("#zhutu .box").eq(0).height("146px").find(".tit,.txt").addClass("opa_in_2"),$("#zhutu .box").eq(2).height("112px").find(".tit,.txt").addClass("opa_in_3"),$("#nodate1").addClass("opa_out"),$("#nodate2").css("background","#ffbb10").html('<img src="images/nodate/nodate2_1.png" /><img src="images/nodate/nodate2_2.png" style="margin-top:20px;" />').show().addClass("opa_in2"),setTimeout(function(){$("#nodate1").remove(),$("#myDate").css("background","#ffbb10"),$("#myDate").append('<a class="reload" href="javascript:location.reload();"></a><a class="download_no" id="download" href="javascript:void(0)">'+(s?"立即分享，赚宝箱":"生成我的时光机")+"</a>"),e()},5200)},4600)}}var o=require("../mod/base2");require("../plugs/storageCache.js"),$("#loading").height(innerHeight),$("#loading .load_img").css("margin-top",innerHeight/2-200);var i=navigator.userAgent.toLocaleLowerCase(),n="null"==Tools.uid()?0:Tools.uid(),s=/kuaima/.test(i),r={wrapper:document.getElementById("bodymovin"),animType:"canvas",loop:!1,prerender:!0,autoplay:!0,path:"data.json"};!function(e){function i(){o.custom({url:"api/v1/sgj/data",data:{uid:n}},function(r){if(1020==r.status)return void setTimeout(function(){i()},2e3);if(1e3!=r.status)return void a();for(var l,c,d,u=r.data,g={pre:"",obj:""},p=o.formatDate(u.register_time,"yyyy-MM-dd"),m=0;m<e.length;m++)if(u.total_income<e[m].max){var h=e[m].obj.split("、"),v=parseInt(h.length*Math.random());g.pre=e[m].pre,g.obj=h[v];break}(l=p+(""==u.father_nick?"":"，在"+u.father_nick+"好友的邀请下")+'，我加入了快马小报。现累计赚取了<span class="rmb">'+u.total_income+"</span>元，相当于"+g.obj+"的价值哦！",0==u.first_withdraw_time)?c="原来在家就能躺着赚钱啦！看着收益涨涨涨，我真的很开心~~":c=o.formatDate(u.first_withdraw_time,"yyyy-MM-dd")+'，我在快马小报赚的第一笔钱<span class="rmb">'+u.first_withdraw_amount+"</span>元快速到账啦！原来在家就能躺着赚钱啦！";var f=u.invite_coin,x=u.share_task_coin,b=u.search_task_coin,_=u.read_article_coin;check_coin=u.checkin_coin;var k=f+x+b+_+check_coin,w=[];w.push(parseInt(f/k*100)),w.push(parseInt(x/k*100)),w.push(parseInt(b/k*100)),w.push(parseInt(_/k*100)),w.push(parseInt(check_coin/k*100));var y=100-w[0]-w[1]-w[2]-w[3]-w[4];y>0&&(w[2]+=y);for(var S=[{pre:w[0],color:"#83be4f",txt:"邀请收徒"},{pre:w[1],color:"#6e44e5",txt:"转发任务"},{pre:w[2],color:"#ffa628",txt:"搜索任务"},{pre:w[3],color:"#ffdd3c",txt:"阅读文章"},{pre:w[4],color:"#06b8ec",txt:"每日签到"}],j=w[0],T="邀请收徒",m=1;m<w.length;m++)w[m]>j&&(j=this[m],T=S[m].txt);d='<span class="rmb">'+T+"</span>是我收入中赚取最多的，当前击败了"+g.pre+"的快马用户",s?Storage.setCache(Storage.AUTH,Tools.auth_token(),600):Storage.setCache(Storage.AUTH,n,600),Storage.setCache("timeDate",l+"|"+c+"|"+d+"|"+t(S),600),a(l,c,d,t(S))})}if(!s&&0==n)return void a();if(console.log(Storage.getCache(Storage.AUTH)),console.log(Storage.getCache("timeDate")),Storage.getCache(Storage.AUTH)&&Storage.getCache("timeDate")){var r=Storage.getCache(Storage.AUTH),l=n,c=Storage.getCache("timeDate");if(console.log(r),console.log(l),s&&(l=Tools.auth_token()),l!=r)Storage.remove(Storage.AUTH),Storage.remove("timeDate"),i();else{var e=c.split("|");console.log(e),a(e[0],e[1],e[2],e[3])}}else i()}([{max:3,pre:"15%",obj:"5根棒棒糖、1瓶矿泉水、1根玉米、1根萝卜、1个南瓜、1捆青菜、1斤地瓜、1斤土豆、1份小葱、1根黄瓜、1包食盐、1包味精、1包榨菜、2个馒头、1瓶啤酒、1只咸鸭蛋、1个西红柿、1根香蕉、1个苹果、1个橙子"},{max:5,pre:"20%",obj:"1颗西蓝花、1罐旺旺、1桶泡面、1瓶绿茶、1包薯片、1袋话梅、1袋瓜子、1块肥皂、5个鸡蛋、1菜盆、1双手套、1袋饼干、1包卫龙辣条、1瓶脉动、1罐椰汁、1瓶可乐、1个火龙果、1袋手帕纸、1个运动毽子、1张贺卡"},{max:10,pre:"30%",obj:"1包面条、1瓶老干妈、1瓶酱油、1瓶香醋、1打抽纸、1瓶洗洁精、1打衣架、1罐红牛、1根甘蔗、1个柚子、1个手抓饼、1个煎饼果子、1碗馄饨、1个灯泡、1个插座、1把钥匙、1把螺丝刀、1个挂钩、1个漱口杯、1个花瓶"},{max:20,pre:"30%",obj:"1条鲫鱼、1条鲈鱼、1瓶大宝、1双棉拖、1条毛巾、1个汉堡、1支毛笔、1个羽毛球、1个秒表、1对快板、1本学生课本、1个手电筒、1罐蜂蜜、1双凉拖、1套饭盒、1套水彩笔、1个发箍、1顶太阳帽、1把雨伞、1件雨衣"},{max:50,pre:"30%",obj:"1份仔排、1斤牛肉、1斤羊肉、1只母鸡、1只土鸭、1斤鸡腿、1箱牛奶、1箱哇哈哈、1袋大米、1桶香喷喷油、1个暖手袋、1瓶洗发露、1瓶洗衣液、2张电影票、1对枕头、1根跳绳、1个U盘、1个水龙头、1包茶叶、1斤龙虾"},{max:100,pre:"30%",obj:"1个电水壶、1个电子秤、1包纸尿裤、1个运动手环、1对乒乓球拍、1对滑雪手套、1副象棋、1张瑜伽垫、1块运动滑板、1个无线路由器、1个台灯、1套门锁、1把扳手、1盒坚果大礼包"},{max:500,pre:"30%",obj:"1个电饭煲、1个电磁炉、1个吹风机、1个电火锅、1个豆浆机、1床品四件套、1个电热毯、1罐奶粉、1根手链、1瓶葡萄酒、1顿牛排大餐、1个微波炉、1台取暖器、1个电烤箱、1旅行箱、1个篮球、1根钓鱼竿、1双溜冰鞋、1个儿童电话手表、1个电视盒子"},{max:1e3,pre:"30%",obj:"1瓶梦之蓝、1电烤箱、1台麻将桌、1台智能打印机、1个大衣柜、1套餐桌、1个吸顶灯、1台消毒柜、1套洗碗机"},{max:5e3,pre:"30%",obj:"1台空调、1台冰箱、1台洗衣机、1台超清智能电视、1个热水器、1个洗碗机、1台空气净化器、1个按摩椅、1数码相机、1扫地机器人、1套家庭影院、1台跑步机、1套沙发、1台华为手机、1台小米手机、1台oppo手机、1台摄像机、1辆摩托车、1辆电瓶车"},{max:1e4,pre:"80%",obj:"1台iPhone X、1台苹果电脑、1趟东南亚游、1台无人摄像机"},{max:9999999,pre:"85%",obj:"1个钻戒、1条爱马仕皮带、1LV手包、1浪琴手表、1台钢琴、1趟美洲游、1趟欧洲游、1趟澳洲游"}])}),define("mod/base2",["zepto","./tools"],function(require,exports,module){function t(t,e){var a=t,o={"M+":a.getMonth()+1,"d+":a.getDate(),"h+":a.getHours(),"m+":a.getMinutes(),"s+":a.getSeconds(),"q+":Math.floor((a.getMonth()+3)/3),S:a.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(a.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in o)new RegExp("("+i+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?o[i]:("00"+o[i]).substr((""+o[i]).length)));return e}function e(t){var e,a=function(){};if(!t.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1009|1101|1015/.test(t.status))e={title:"提醒",text:t.desc};else{if(!/1006/.test(t.status))return e=null,!0;var o=5;e={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+o+"</span>s后自动刷新"};var i=setInterval(function(){o--,o<1&&(clearInterval(i),window.location.reload()),$("#closeTimer").text(o)},1e3)}return null!=e?(Tools.alertDialog(e,a),!1):void 0}var $=require("zepto");var a={key:"26817749",magic_key:"24817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(e,a){var o=a||"yyyy-MM-dd hh:mm";if(isNaN(e)||null==e)return e;if("object"==typeof e){var i=dd.getFullYear(),n=dd.getMonth()+1,s=dd.getDate();n<10&&(n="0"+n);var r=i+"-"+n+"-"+s,l=r.match(/(\d+)/g),c=new Date(l[0],l[1]-1,l[2]);return t(c,o)}var c=new Date(parseInt(e));return t(c,o)},baseAjax:function(t,o){var i=(navigator.userAgent,a.key),n=Tools.auth_token(),s={name:"app_key",value:i};t.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show")),t.data||(t.data={}),$.isFunction(t.data.push)?t.data.push(s):t.data.app_key=i,$.isFunction(t.data.push)?t.data.push({name:"auth_token",value:n}):t.data.auth_token=n,$.ajax({url:a.km_api+t.url,data:t.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(a){t.showLoading&&$(".ui-loading-block").removeClass("show"),e(a)&&o(a)},error:function(e,a,o){console.log(e),t.showLoading&&$(".ui-loading-block").removeClass("show")}})},custom:function(t,e){var a=this;t=t||{},a.baseAjax(t,e)}}}),define("mod/tools",[],function(require){var t={getQueryValue:function(t){var e=location.search,a=new Array;if(e.length>1){var o=e.indexOf("?");e=e.substring(o+1,e.length)}else e=null;if(e)for(var i=0;i<e.split("&").length;i++)a[i]=e.split("&")[i];for(var n=0;n<a.length;n++)if(a[n].split("=")[0]==t)return decodeURI(a[n].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(t,e){var a={title:null,text:null,img:null,time:3e3};for(var o in a)t[o]=t[o]||a[o];var i="tips"+(new Date).getTime(),n='<div id="'+i+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';t.time<1&&(n+='<i class="iconfont icon-close" id="close"></i>'),n+='<div class="content">',null!=t.title&&""!=t.title&&(n+="<h1>"+t.title+"</h1>"),null!=t.text&&""!=t.text&&(n+="<p>"+t.text+"</p>"),null!=t.img&&""!=t.img&&(n+='<div class="pic"><img src="'+t.img+'"/></div>'),n+="</div> </div> </div>";var s=$(n).appendTo("body"),r=$("#"+i+" .km-popup").height(),l=$(window).height(),c=(l-r)/2;if($("#"+i+" .km-popup").css("top",c),s.addClass("show-dialog"),$("#close").click(function(){$("#"+i).remove(),$.isFunction(e)&&e()}),t.time>0){var d=t.time;setTimeout(function(){$("#"+i).remove(),$.isFunction(e)&&e()},d)}}};window.Tools=t}),define("plugs/storageCache",[],function(){function t(t,e){var a=(new Date).getTime();this.c=a,e=e||i,this.e=a+1e3*e,this.v=t}function e(t){return"object"==typeof t&&!!(t&&"c"in t&&"e"in t&&"v"in t)}function a(t){return(new Date).getTime()<t.e}var o=new Date("Fri, 31 Dec 9999 23:59:59 UTC"),i=o.getTime(),n={serialize:function(t){return JSON.stringify(t)},deserialize:function(t){return t&&JSON.parse(t)}},s={AUTH:"KMAUTH",NAME:"MY-NAME",get:function(t,e){if(this.isLocalStorage()){var a=this.getStorage(e).getItem(t);return a?JSON.parse(a):void 0}},set:function(t,e,a){this.isLocalStorage()&&(e=JSON.stringify(e),this.getStorage(a).setItem(t,e))},remove:function(t,e){this.isLocalStorage()&&this.getStorage(e).removeItem(t)},setCache:function(e,a,o,i){if(this.isLocalStorage()){var s=new t(a,o);this.getStorage(i).setItem(e,n.serialize(s))}},getCache:function(t,o){var i=null;try{var s=this.getStorage(o).getItem(t);i=n.deserialize(s)}catch(t){return null}if(e(i)){if(a(i)){var s=i.v;return s}return this.remove(t),null}return null},getStorage:function(t){return t?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(t){return console.log("本地存储已关闭"),!1}}};window.Storage=s});