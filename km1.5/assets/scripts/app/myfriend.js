define('app/myfriend', function(require, exports, module) {
    var pagelist = require('../mod/pagelist2');
    var confirmTip = require('../plugs/confirmTip.js');
    const teamId = Tools.getQueryValue('teamId');
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
                    this.to_uid = hideInfo(this.to_uid);
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
    
    $('#navOrder').on('click', 'li', function(){
        var _el = $(this);
        var type = $(this).data('type');
        if(_el.hasClass('active')){
            if(_el.hasClass('up')){
                _el.removeClass('up').addClass('down');
                loadData(type, 'desc');
            }else{
                _el.removeClass('down').addClass('up');
                loadData(type, 'asc');
            }
        }else{
            _el.addClass('active down').siblings().removeAttr('class');
            loadData(type, 'desc');
        }
    });

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
                        if(data.status == 1000){
                            Tools.alertDialog({title:'邀请已发出', text: '对方接受后将自动成为您的团员！',time:'0' });
                        }else{
                            Tools.alertDialog({ text: data.desc, time:'0' });
                        }
                    });
                }
            })
        }
    })
});