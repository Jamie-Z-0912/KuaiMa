define('app/ani_timeMac', function(require, exports, module) {
    var Ajax = require('../mod/base2');
    $('#loading').height(innerHeight);
    $('#loading .load_img').css('margin-top',innerHeight/2-200);
    var us = navigator.userAgent.toLocaleLowerCase();
    var animData = {
        wrapper: document.getElementById('bodymovin'),
        animType: 'canvas',
        loop: false,
        prerender: true,
        autoplay: true,
        path: 'data.json'
    };
    function drawCircle(data,color){
        var canvas = document.getElementById("bingtu");
        var ctx = canvas.getContext("2d");
        var startPoint= 1.5 * Math.PI;
        for(var i=0;i<data.length;i++){
                ctx.fillStyle = color[i];
                ctx.strokeStyle = color[i];
                ctx.beginPath();
                ctx.moveTo(90,80);
                ctx.arc(90,80,80,startPoint,startPoint-Math.PI*2*(data[i]/100),true);
                ctx.fill();
                ctx.stroke();
                startPoint -= Math.PI*2*(data[i]/100);
        }
        return '<img src="'+canvas.toDataURL("image/png")+'"/>';
    }
    function animate(txt1,txt2,txt3,bingtu){
        $('#loading').remove();
        var anim = bodymovin.loadAnimation(animData);
        // console.log(anim);
        setTimeout(function(){
            if(txt1&&txt1!=''){
                $('#content1').html('<div class="txt">'+txt1+'</div>').addClass('animate1');
                setTimeout(function(){
                    $('#content1').addClass('animate1_out');
                    $('#content2').html('<div class="txt">'+txt2+'</div>').addClass('animate2');
                },4600);
                setTimeout(function(){
                    $('#content2').addClass('animate2_out');
                    $('#content3').html('<div class="txt">'+txt3+'</div><div id="imgbox">'+bingtu+'</div><div class="txt txt_">悄悄支个招哦：<span class="big">转发任务</span>是最赚钱的！</div>').addClass('animate3');
                },9000);
                setTimeout(function(){
                    $('#content3').addClass('animate3_out');
                    $('#myDate').append('<a class="reload" href="javascript:location.reload();"></a><a class="download" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser"></a>');
                },11000);
            }else{

            }
        },5000);
    }

    (function(arr){
        loadDate();
        function loadDate(){
            var uid = Tools.getQueryValue('uid');
            if(uid ==''){ animate(); return; }
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

                    txt1 = redDate+'，在'+d.father_nick+'好友的邀请下，我加入了快马小报。现累计赚取了<span class="rmb">'+d.total_income+'</span>元，相当于'+userInfo.obj+'的价值哦！';

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
                    var mostCoin = inv_coin, mostTxt = '邀请收徒';
                    if(mostCoin < share_coin){
                        mostCoin = share_coin; mostTxt = '转发任务';
                    } 
                    if(mostCoin < search_coin){
                        mostCoin = search_coin; mostTxt = '搜索任务';
                    }
                    if(mostCoin < read_coin){
                        mostCoin = read_coin; mostTxt = '阅读文章';
                    } 
                    if(mostCoin < check_coin){
                        mostCoin = check_coin; mostTxt = '每日签到';
                    }
                    txt3 = '<span class="rmb">'+mostTxt+'</span>是我赚取最多收入的，当前击败了'+userInfo.pre+'的快马用户';

                    var total = inv_coin+share_coin+search_coin+read_coin+check_coin, _d = [];
                    _d.push(parseInt(inv_coin/total*100));
                    _d.push(parseInt(share_coin/total*100));
                    _d.push(parseInt(search_coin/total*100));
                    _d.push(parseInt(read_coin/total*100));
                    _d.push(parseInt(check_coin/total*100));
                    console.log(_d)
                    var may_d = 100-_d[0]-_d[1]-_d[2]-_d[3]-_d[4];
                    if(may_d>0) _d[1] += may_d; 
                    var color = ["#83be4f","#6e44e5","#ffa628","#ffdd3c","#3e193b"];
                    animate(txt1,txt2,txt3,drawCircle(_d, color))
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
