define('app/ani_timeMac', function(require, exports, module) {
    var Ajax = require('../mod/base2');
    var km =  require('../plugs/version.js');
    require('../plugs/storageCache.js');
    $('#loading').height(innerHeight);
    $('#loading .load_img').css('margin-top',innerHeight/2-200);

    var uid = Tools.uid()=='null'?0:Tools.uid(), isKM = km.isKM;
    var animData = {
        wrapper: document.getElementById('bodymovin'),
        animType: 'canvas',
        loop: false,
        prerender: true,
        autoplay: true,
        path: 'data.json'
    };
    function drawCircle(data){
        var canvas = document.getElementById("bingtu");
        var ctx = canvas.getContext("2d");
        var startPoint = 2 * Math.PI;
        for(var i=0;i<data.length;i++){
            console.log(data[i].pre)
            ctx.fillStyle = data[i].color;
            ctx.strokeStyle = data[i].color;
            ctx.beginPath();
            ctx.moveTo(88,80);
            ctx.arc(88,90,86,startPoint,startPoint-Math.PI*2*(data[i].pre/100),true);
            ctx.fill();
            ctx.stroke();
            startPoint -= Math.PI*2*(data[i].pre/100);
            ctx.fillRect(190, i*30+20, 16, 16);
            ctx.font = "20px serif"; 
            ctx.fillStyle = '#fff';
            ctx.fillText(data[i].txt, 216, i*30+35)
        }
        return '<img src="'+canvas.toDataURL("image/png")+'"/>';
    }
    function downloadFun(){
        if(isKM){
            $('#myDate').append('<div class="intro"><p>活动日期：2018.01.01~2018.01.07</p><p>活动期内，每日分享即可获得一个宝箱。记得天天来噢！</p></div>');
            $('#download').on('click', function(){
                Ajax.custom({
                    url:'api/v1/sgj/share'
                },function(){
                    var mylink = 'http://share.51xiaoli.cn/animation/timeMac/index.html?uid='+uid;
                    if(/t.kuaima/.test(location.href)){
                        mylink = 'http://t.kuaima.cn/browser/animation/timeMac/index.html?uid='+uid;
                    }
                    var share_kmb = 'kmb://share?param={"shareurl":"'+mylink+'","desc":"2017我在快马赚得满满一桶金，快来点击获取你的赚钱秘籍~"}';
                    if (!km.less('1.5.5')) {
                        share_kmb = 'kmb://share?param={"shareurl":"'+mylink+'","desc":"最会赚钱的人！","title":"2017我在快马赚得满满一桶金，快来点击获取你的赚钱秘籍~","icon":"http://static.etouch.cn/imgs/upload/1514538626.4173.jpg"}';
                    };
                    window.location = share_kmb;
                })
            });
        }else{
            seajs.use('https://static.mlinks.cc/scripts/dist/mlink.min.js', function(){
                var options = new Object();
                options["mlink"] = 'https://ax9wdh.mlinks.cc/AdxL';
                options["button"] = document.querySelectorAll("a#download");
                options["params"] = {};
                new Mlink(options);
            });
        }
    }
    function animate(txt1,txt2,txt3,bingtu){
        $('#loading').remove();
        var anim = bodymovin.loadAnimation(animData);
        if(txt1&&txt1!=''){
            $('#content1').html('<div class="txt">'+txt1+'</div>').addClass('animate1');
            setTimeout(function(){
                $('#content2').html('<div class="txt">'+txt2+'</div>').addClass('animate2');
                $('#content3').html('<div class="txt">'+txt3+'</div><div id="imgbox">'+bingtu+'</div><div class="txt txt_">悄悄支个招：<span class="big">'+(/收徒/.test(txt3)?'搜索任务':'邀请收徒')+'</span>赚很多呢！</div>').addClass('animate3');
                setTimeout(function(){
                    $('#myDate').append('<a class="reload" href="javascript:location.reload();"></a><a class="download" id="download" href="javascript:void(0)">'+(isKM?'立即分享，赚宝箱':'生成我的时光机')+'</a>');
                    downloadFun();
                },16000);
            },5000);
        }else{
            $('#myDate').css({
                'background-image':'url(images/nodate/bg.png)',
                'background-color' : '#241f1f'
            }).addClass('opa_in');
            $('#nodate1').addClass('nodate');
            var nodate1 = [];
            nodate1.push('<div class="logo"><img src="images/timelogo.png" /></div>');
            nodate1.push('<div class="text"><img src="images/nodate/text.png" /></div>');
            nodate1.push('<div class="zhutu" id="zhutu">');
            nodate1.push('<div class="box box_2"><img src="images/nodate/no2_t.png" class="tit" /><img src="images/nodate/no2_txt.png" class="txt" /></div>');
            nodate1.push('<div class="box box_1"><img src="images/nodate/no1_t.png" class="tit" /><img src="images/nodate/no1_txt.png" class="txt" /></div>');
            nodate1.push('<div class="box box_3"><img src="images/nodate/no3_t.png" class="tit" /><img src="images/nodate/no3_txt.png" class="txt" /></div>');
            nodate1.push('</div>');
            $('#nodate1').html(nodate1.join(''));
            setTimeout(function(){
                $('#zhutu .box').eq(1).height('206px').find('.tit,.txt').addClass('opa_in_1');
                $('#zhutu .box').eq(0).height('146px').find('.tit,.txt').addClass('opa_in_2');
                $('#zhutu .box').eq(2).height('112px').find('.tit,.txt').addClass('opa_in_3');
                $('#nodate1').addClass('opa_out');
                $('#nodate2').css('background','#ffbb10').html('<img src="images/nodate/nodate2_1.png" /><img src="images/nodate/nodate2_2.png" style="margin-top:20px;" />').show().addClass('opa_in2');
                setTimeout(function(){
                    $('#nodate1').remove();
                    $('#myDate').css('background','#ffbb10')
                    $('#myDate').append('<a class="reload" href="javascript:location.reload();"></a><a class="download_no" id="download" href="javascript:void(0)">'+(isKM?'立即分享，赚宝箱':'生成我的时光机')+'</a>');
                    downloadFun();
                },5200);
            },4600);
        }
    }

    (function(arr){
        if(!isKM&&uid == 0){ animate(); return; }
        if(Storage.getCache(Storage.AUTH)&&Storage.getCache('timeDate')){
            var cache = Storage.getCache(Storage.AUTH), myauth=uid,
                cacheDate = Storage.getCache('timeDate');
            if(isKM) myauth = Tools.auth_token();
            if(myauth!=cache){
                Storage.remove(Storage.AUTH);
                Storage.remove('timeDate');
                loadDate();
            }else{
                var arr = cacheDate.split('|');
                animate(arr[0],arr[1],arr[2],arr[3]);
            }
        }else{
            loadDate();
        }
        function loadDate(){
            Ajax.custom({
                url:"api/v1/sgj/data",
                data:{ uid: uid }
            }, function(data){
                if(data.status==1020){
                    setTimeout(function(){ loadDate(); },2000);
                    return;
                }
                if(data.status==1000){
                    var d = data.data;
                    var txt1, txt2, txt3, userInfo={"pre":'','obj':''};
                    var redDate = Ajax.formatDate(d.register_time,'yyyy-MM-dd');
                    for (var i = 0; i < arr.length; i++) {
                        if(d.total_income<arr[i].max){
                            var objs = arr[i].obj.split('、');
                            var obj_n = parseInt(objs.length*(Math.random()));
                            userInfo.pre = arr[i].pre;
                            userInfo.obj = objs[obj_n];
                            break
                        }
                    };
                    var fa_txt = d.father_nick==''?'':'，在好友<font size="2">('+d.father_nick+')</font>的邀请下';
                    if(d.total_income==0){
                        txt1 = redDate+fa_txt+'，我加入了快马小报。刚注册登入，就获得了新人福利包的大量金币！';
                    }else{
                        txt1 = redDate+fa_txt+'，我加入了快马小报。现累计赚取了<span class="rmb">'+d.total_income+'</span>元，相当于'+userInfo.obj+'的价值哦！';
                    }
                    if(d.first_withdraw_time==0){
                        txt2 = '原来在家就能躺着赚钱啦！看着收益涨涨涨，我真的很开心~~'
                    }else{
                        var fristTime = Ajax.formatDate(d.first_withdraw_time,'yyyy-MM-dd');
                        txt2 = fristTime+'，我在快马小报赚的第一笔钱<span class="rmb">'+d.first_withdraw_amount+'</span>元快速到账啦！原来在家就能躺着赚钱啦！';
                    }
                    var inv_coin = d.invite_coin,
                        share_coin = d.share_task_coin,
                        search_coin = d.search_task_coin,
                        read_coin = d.read_article_coin
                        check_coin = d.checkin_coin;
                    var total = inv_coin+share_coin+search_coin+read_coin+check_coin, _d = [];
                    if(total==0) {
                        total=100;
                        inv_coin=share_coin=search_coin=read_coin=check_coin=20;
                    }
                    _d.push(parseInt(inv_coin/total*100));
                    _d.push(parseInt(share_coin/total*100));
                    _d.push(parseInt(search_coin/total*100));
                    _d.push(parseInt(read_coin/total*100));
                    _d.push(parseInt(check_coin/total*100));

                    var may_d = 100-_d[0]-_d[1]-_d[2]-_d[3]-_d[4];
                    if(may_d>0) _d[2] += may_d; 
                    var bingtuDate = [
                        {"pre": _d[0],"color":"#83be4f","txt":"邀请收徒"},
                        {"pre": _d[1],"color":"#6e44e5","txt":"转发任务"},
                        {"pre": _d[2],"color":"#ffa628","txt":"搜索任务"},
                        {"pre": _d[3],"color":"#ffdd3c","txt":"阅读文章"},
                        {"pre": _d[4],"color":"#06b8ec","txt":"每日签到"}
                    ]
                    var max = _d[0], maxTxt = '邀请收徒';
                    for (var i = 1; i < _d.length; i++){ 
                        if (_d[i] > max) { 
                            max = this[i];
                            maxTxt = bingtuDate[i].txt;
                        }
                    }
                    txt3 = '<span class="rmb">'+maxTxt+'</span>是我收入中赚取最多的，当前击败了'+userInfo.pre+'的快马用户';
                    if(isKM){
                        Storage.setCache(Storage.AUTH, Tools.auth_token(), 10*60);
                    }else{
                        Storage.setCache(Storage.AUTH, uid, 10*60);
                    }

                    Storage.setCache('timeDate',txt1+'|'+txt2+'|'+txt3+'|'+drawCircle(bingtuDate),10*60);
                    animate(txt1,txt2,txt3,drawCircle(bingtuDate))
                }else{
                    animate(); return;
                }
            });
        }
    })([
        {
            "max":3,
            "pre":"15%",
            "obj":"5根棒棒糖、1瓶矿泉水、1根玉米、1根萝卜、1个南瓜、1捆青菜、1斤地瓜、1斤土豆、1份小葱、1根黄瓜、1包食盐、1包味精、1包榨菜、2个馒头、1瓶啤酒、1只咸鸭蛋、1个西红柿、1根香蕉、1个苹果、1个橙子"
        },
        {
            "max":5,
            "pre":"20%",
            "obj":"1颗西蓝花、1罐旺旺、1桶泡面、1瓶绿茶、1包薯片、1袋话梅、1袋瓜子、1块肥皂、5个鸡蛋、1菜盆、1双手套、1袋饼干、1包卫龙辣条、1瓶脉动、1罐椰汁、1瓶可乐、1个火龙果、1袋手帕纸、1个运动毽子、1张贺卡"
        },
        {
            "max":10,
            "pre":"30%",
            "obj":"1包面条、1瓶老干妈、1瓶酱油、1瓶香醋、1打抽纸、1瓶洗洁精、1打衣架、1罐红牛、1根甘蔗、1个柚子、1个手抓饼、1个煎饼果子、1碗馄饨、1个灯泡、1个插座、1把钥匙、1把螺丝刀、1个挂钩、1个漱口杯、1个花瓶"
        },
        {
            "max":20,
            "pre":"30%",
            "obj":"1条鲫鱼、1条鲈鱼、1瓶大宝、1双棉拖、1条毛巾、1个汉堡、1支毛笔、1个羽毛球、1个秒表、1对快板、1本学生课本、1个手电筒、1罐蜂蜜、1双凉拖、1套饭盒、1套水彩笔、1个发箍、1顶太阳帽、1把雨伞、1件雨衣"
        },
        {
            "max":50,
            "pre":"30%",
            "obj":"1份仔排、1斤牛肉、1斤羊肉、1只母鸡、1只土鸭、1斤鸡腿、1箱牛奶、1箱哇哈哈、1袋大米、1桶香喷喷油、1个暖手袋、1瓶洗发露、1瓶洗衣液、2张电影票、1对枕头、1根跳绳、1个U盘、1个水龙头、1包茶叶、1斤龙虾"
        },
        {
            "max":100,
            "pre":"30%",
            "obj":"1个电水壶、1个电子秤、1包纸尿裤、1个运动手环、1对乒乓球拍、1对滑雪手套、1副象棋、1张瑜伽垫、1块运动滑板、1个无线路由器、1个台灯、1套门锁、1把扳手、1盒坚果大礼包"
        },
        {
            "max":500,
            "pre":"30%",
            "obj":"1个电饭煲、1个电磁炉、1个吹风机、1个电火锅、1个豆浆机、1床品四件套、1个电热毯、1罐奶粉、1根手链、1瓶葡萄酒、1顿牛排大餐、1个微波炉、1台取暖器、1个电烤箱、1旅行箱、1个篮球、1根钓鱼竿、1双溜冰鞋、1个儿童电话手表、1个电视盒子"
        },
        {
            "max":1000,
            "pre":"30%",
            "obj":"1瓶梦之蓝、1电烤箱、1台麻将桌、1台智能打印机、1个大衣柜、1套餐桌、1个吸顶灯、1台消毒柜、1套洗碗机"
        },
        {
            "max":5000,
            "pre":"30%",
            "obj":"1台空调、1台冰箱、1台洗衣机、1台超清智能电视、1个热水器、1个洗碗机、1台空气净化器、1个按摩椅、1数码相机、1扫地机器人、1套家庭影院、1台跑步机、1套沙发、1台华为手机、1台小米手机、1台oppo手机、1台摄像机、1辆摩托车、1辆电瓶车"
        },
        {
            "max":10000,
            "pre":"80%",
            "obj":"1台iPhone X、1台苹果电脑、1趟东南亚游、1台无人摄像机"
        },
        {
            "max": 9999999,
            "pre":"85%",
            "obj":"1个钻戒、1条爱马仕皮带、1LV手包、1浪琴手表、1台钢琴、1趟美洲游、1趟欧洲游、1趟澳洲游"
        }
    ]);

});
