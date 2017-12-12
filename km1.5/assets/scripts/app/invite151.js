define('app/invite151', function(require, exports, module) {
    var pagelist = require('../mod/pagelist2');
    window.jQuery = window.Zepto;
    var confirmTip = require('../plugs/confirmTip.js');
    var km =  require('../plugs/version.js');
    require('../plugs/cookieStorage.js');
    var km_error = location.href;
    $('#kmError').on('click', function(){
        Tools.alertDialog({
            text:'<span style="display:block;width:99%;word-wrap: break-word;">'+location.href+'</span>',
            time: '0'
        })
    })
    // if(!km.isKM){
    //     Tools.alertDialog({
    //         text:'请在快马小报中打开！<br>'+km.userAgent,
    //         time: 9999999
    //     })
    //     return;
    // }
    /*************/
    $('#nav').on('click', 'li', function(){
        var _self = $(this), id = _self.data('id');
        if(!_self.hasClass('active')){
            _self.addClass('active').siblings().removeClass('active');
            $('#'+id).removeClass('hide').siblings('div').addClass('hide');
        }
    });
    if(Tools.getQueryValue('tab')=='friend'){
        $('#nav li[data-id="friends"]').click();
    }
    /***********/
    function updateApp(type){
        var txt = '升级到最新版本，更多任务要你收益涨涨涨！';
        new confirmTip({
            text: '<p style="color:#333;padding-left:.15rem;padding-right:.15rem;">'+txt+'</p>',
            sureTxt: '马上更新',
            cancelTxt: '我知道了'
        },function(a){
            if(a){
                window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser'
            }
        });
    }
    var teamId;
    const myurl = 'http://share.51xiaoli.cn/inviteReg.html';
    var QR = {
        qr_base64: Storage.get('qr'),
        channel: function(){
            var channel='', userAgent = km.userAgent;
            if(userAgent.split('ssy=').length==2){
                var _ssy = userAgent.split('ssy=')[1];
                if(/iOS|Android/.test(_ssy.split(';')[0])){
                    channel = _ssy.split(';')[3]
                }else{
                    channel = _ssy.split(';')[2]
                }
            }
            return channel;
        },
        makeQrImg: function(qrTag){
            var cas_qr = $("#canvasQR")[0], ctx_qr = cas_qr.getContext("2d");
            /*** 二维码 ***/
            ctx_qr.fillStyle = '#fff';
            ctx_qr.fillRect(0, 0, 530, 530);
            ctx_qr.fill();
            ctx_qr.drawImage(qrTag,30,30,470,470);
            $("#userQr").html('<img src="'+ cas_qr.toDataURL("image/png")+'"/>');
            ctx_qr.clearRect(0,0,530,530);
        },
        make_qr: function(uid){
            var self = this;
            if(/Android/.test(km.userAgent) && self.qr_base64 && self.qr_base64[0] == uid){
                $("#userQrCode").append('<img src="'+  self.qr_base64[1] +'"/>');
                var qrTag = $("#userQrCode img")[0];
                self.makeQrImg(qrTag);
            }else{
                var mylink = myurl + '?uid=' + uid + '&channel=' + this.channel();
                seajs.use('./scripts/lib/jquery.qrcode.min', function(){
                    var qr = $('#userQrCode').qrcode({
                        logo:"data:image/png;base64,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",
                        width: 190,
                        height: 190,
                        correctLevel: 2,
                        text: mylink
                    });
                });
                var makeQrTime = setInterval(function(){
                    if($("#userQrCode img").length > 0){
                        clearInterval(makeQrTime);
                        var qr_code = $("#userQrCode img")[0];
                        var qr=[uid,$("#userQrCode img").attr('src')];
                        Storage.set('qr',qr);
                        self.makeQrImg(qr_code);
                    }
                },100);
            }
            var mylink0 = myurl + '?uid=' + uid;
            var share_kmb = 'kmb://share?param={"shareurl":"'+mylink0+'","desc":"快马送了一个红包给你，快来看看里面有多精彩？戳开有好礼。"}';
            if (!km.less('1.5.5')) {
                share_kmb = 'kmb://share?param={"shareurl":"'+mylink0+'","desc":"和我一起赚零花","title":"快马送了一个红包给你，快来看看里面有多精彩？ ","icon":"http://static.etouch.cn/imgs/upload/1512982615.3361.png"}';
            };
            $('#type2, #type3, #type4').on('click', function(){ window.location = share_kmb; });
            $('#saoma').on('click', '.btn', function(){ window.location = share_kmb; });
        }
    }
    if(km.less('1.3.2')){
        var uid = Tools.uid();
        QR.make_qr(uid);
        $('#type5').on('click', function(){
            window.location = 'qunfa.html?uid='+uid;
        });
    }
    Ajax.custom({
        url:'api/v1/userinfo/base'
    }, function(d){
        teamId = d.data.team_id;
        $('#inviteQr').text(d.data.invite_code);
        if(!km.less('1.3.2')){
            QR.make_qr(d.data.uid);
        }
        $('.invite_qr').on('click', function(){
            window.location = 'inviteCode.html?code='+d.data.invite_code;
        })
    });
    $('#type1').on('click', function(){ $('#saoma').show(); });
    $('#type5').on('click', function(){
        if(km.less('1.3.2')){
            updateApp();
        }else{
            window.location = 'qunfa.html?auth_token='+Tools.auth_token();
        }
    });

    $('#showIncome').on('click', function(){
        if(km.less('1.3.2')){
            updateApp();
        }else{
            window.location = 'showIncome.html?auth_token='+Tools.auth_token();
        }
    });
    $('#callTudi').on('click', function(){
        $('#nav li[data-id="friends"]').click();
    })
    $('#saoma').on('click', '.close', function(){ $('#saoma').hide(); });
    Ajax.custom({
        url: 'api/v1/ads',
        data:{ location: 'my_invite_icon' }
    }, function(data){
        if(data.status==1000){
            var d = data.data;
            if(d.length>0){
                var cur = parseInt(d.length*Math.random());
                $('#banner').append('<a href="'+d[cur].origin_url+'"><img src="'+d[cur].images[0]+'" /></a>')
            }
        }
    })
    /*************************/
    function hideInfo(a){
        var ss = '' + a;
        var len = ss.length;
        var start_i = len/2-2, end_i = len/2+2;
        var str1 = ss.substring(0,start_i);
        var str2 = ss.substr(end_i, len - end_i);
        return str1+'****'+str2;
    }
    function loadData(orderBy, order){
        pagelist.fun({
            url: 'api/v1/inviteRelation/friends',
            data:{ 
                orderBy: orderBy,  
                order: order, 
                page: 1,
                page_size: 10
            }
        },function(data){
            if(data.status == 1020){
                $('#navOrder').remove();
            }else{
                $.each(data.data.list, function(){
                    if(teamId!=''&&teamId!='0'){
                        this.hasTeam = true;
                    }
                    this.uid = this.to_uid;
                    this.show_uid = hideInfo(this.to_uid);
                    this.register_time = Ajax.formatDate(this.register_time, 'yyyy-MM-dd hh:mm');
                    // console.log(this.added_time)
                    var cur_time = new Date().getTime();
                    var delta_T = cur_time - this.recent_active_time;
                    if( delta_T > 0){
                        var days = parseInt(delta_T/1000/60/60/24);
                        if(days > 3){
                            this.recent_active_time = Ajax.formatDate(this.recent_active_time, 'yyyy-MM-dd');
                        }else if(days == 0){
                            var hours = parseInt(delta_T/1000/60/60);
                            if(hours == 0){
                                this.recent_active_time = '当前';
                            }else{
                                this.recent_active_time = hours + '小时前';
                            }
                        }else{
                            this.recent_active_time = days + '天前';
                        }
                    }else{
                        this.recent_active_time = Ajax.formatDate(this.recent_active_time, 'yyyy-MM-dd');
                    }
                });
            }
        });
    }
    //added_time 注册时间;recent_active_time 最近活跃时间; bring_profit_to_from 给师傅带来的收益;desc降序 asc升序
    var default_orderBy = 'recent_active_time', default_order = 'desc';
    loadData(default_orderBy, default_order);

    $('#conList').on('click', '.urge', function(){
        var $el = $(this);
        if($el.hasClass('disabled')){
            Tools.alertDialog({
                text: "每个徒弟每天只能被提醒一次<br>晚22点-早8点不能打扰徒弟哦"
            });
        }else{
            Ajax.custom({
                url: 'api/v1/inviteRelation/remind',
                data:{
                    son_uid: $el.data('uid')
                }
            },function(data){
                var txt;
                switch(data.status){
                    case 1000:
                        txt = '您的徒弟已收到您的提醒！';
                        $el.addClass('disabled');
                        break;
                    case 9012:
                        txt = '每个徒弟,每天只能被提醒一次哦';
                        $el.addClass('disabled');
                        break;
                    case 9013:
                        txt = '晚22点-早8点不能提醒徒弟哦';
                        $el.addClass('disabled');
                        break;
                    case 2002:
                        txt = '您的徒弟不存在！';
                        $el.addClass('disabled');
                        break;
                }
                Tools.alertDialog({ text: txt, time: '0' });
            });
        }
    });

    $('#conList').on('click', '.join_myteam', function(){
        var $el = $(this);
        if($el.hasClass('disabled')){
            Tools.alertDialog({
                text: "每个徒弟每天只能被邀请一次<br>晚22点-早8点不能打扰徒弟哦",
                time:'0'
            });
        }else{
            new confirmTip({
                title: '<p style="width:10.1em;margin:0 auto;text-align:left;">您是否想邀请这位徒弟加入您的团队</p>'
            },function(a){
                if(a){
                    Ajax.custom({
                        url: 'api/v1/teams/'+teamId+'/invite/'+$el.data('uid')
                    },function(data){
                        $el.addClass('disabled');
                        if(data.status == 1000){
                            Tools.alertDialog({title:'邀请已发出', text: '对方接受后将自动成为您的团员！',time:'0' });
                        }else{
                            Tools.alertDialog({ text: data.desc, time:'0' });
                        }
                    });
                }
            })
        }
    });

    $('#conList').on('click', '.more_coin', function(){
        var self = $(this);
        if(self.find('.con').length>0){
            if(self.hasClass('open')){
                self.removeClass('open');
            }else{
                if(self.hasClass('isloaded')){
                    self.addClass('open');
                }else{
                    Ajax.custom({
                        url: 'api/v1/inviteRelation/friends/active',
                        data: {
                            son_uid: self.data('id')
                        }
                    }, function(d){
                        self.addClass('isloaded');
                        if(d.status==1000){
                            var act_d = parseInt(d.data.had_active_day);
                            self.find('.txt span').text('（剩余：'+d.data.left_active_day+'天）')
                            if(act_d>0){
                                if(act_d>7){
                                    self.find('.coin li').addClass('active');
                                }else{
                                    for (var i = 0; i < act_d; i++){
                                        self.find('.coin li').eq(i).addClass('active');
                                    };
                                }
                            }
                            self.addClass('open');
                        }
                    });
                }

            }
        }
    })
});