define('app/shoutu1001', function(require, exports, module) {
	var Ajax = require('../mod/base');
    var km =  require('../plugs/version.js');
    var confirmTip = require('../plugs/confirmTip.js');

    function updateApp(){
        new confirmTip({
            text: '<p style="color:#333;">升级1.5.0版本加入团队，更多任务更多收益</p>',
            sureTxt: '马上更新',
            cancelTxt: '我知道了'
        },function(a){
            if(a){
                window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser'
            }
        });
    }
    $('#team .zudui').on('click', function(){
        if(km.less('1.5.0')){
            updateApp();
        }else{
            window.location = 'kmb://team_myself';
        }
    })
    function building(){
        $('#team').hide();
        $('#building').show();
        $('#tips').text('提示：等待组队的时间，您可以先去阅读值得看、做做搜索任务，做完后加入团队即可生效哦！')
        var tuan = setInterval(function(){
            Ajax.custom({
                url:'api/v1/teams/make/status'
            }, function(data){
                if(data.data.has_team){
                    clearInterval(tuan);
                    $('#tips').text('提示：加入团队后，记得不要偷懒哦，否则会被队友嫌弃的。');
                    $('#team .zudui').text('去团队赚收益')
                    $('#team').show();
                    $('#building').hide();
                    if(km.less('1.5.2')){
                        $('#team .zudui').off().on('click', function(){
                            if(km.less('1.5.0')){
                                updateApp();
                            }else{
                                if(/Android/.test(km.userAgent)){
                                    window.location = 'kmb://mine';
                                }else{
                                    window.location = 'kmb://back';
                                }
                            }
                        });
                    }else{
                        $('#team .zudui').off().on('click', function(){
                            window.location = 'kmb://team_myself?teamid='+data.data.team_id;
                        });
                        window.location = 'kmb://team_myself?teamid='+data.data.team_id;
                    }

                }
            })
        }, 2000);
    }
    Ajax.custom({
        url:'api/v1/teams/make/status'
    }, function(data){
        console.log(data)
        var d = data.data;
        if(!d.has_team){
            if(d.is_matching){
                building();
            }else{
                $('#team .zudui').text('快速组队')
                    .off().on('click', function(){
                        Ajax.custom({
                            url:'api/v1/teams/make'
                        }, function(data){
                            if(data.status==1000){
                                building();
                            }
                        })
                    });
                $('#tips').text('快速组队工具可以帮您匹配到志同道合的快小马组成团队。加入团队后，记得不要偷懒哦，否则会被队友嫌弃的。')
            }
        }
    })
    $('#zutuan').on('click', function(){
        if(km.gEq('1.5.0')){
            window.location = 'kmb://team_myself';
        }else{
            updateApp();
        }
    });

});