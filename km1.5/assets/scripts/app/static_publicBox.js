define('app/publicBox', function(require, exports, module) {
	var Ajax = require('../mod/base');
    var tipsAd = require('../plugs/tipsAd');
    var rule = $('#ruleCon').html();
    $('#rule').on('click', function(){
        new tipsAd({
            title: '活动规则',
            text: rule,
            hasAd:'0'
        })
    });
    $('#go').on('click', function(){
        window.location = 'openBox.html?auth_token='+Tools.auth_token();
    });

    Ajax.custom({
        url:'api/v1/box/user'
    }, function(d){
        console.log(d)
        if(d.status==1000){
            var leftNum = d.data.leftBoxNum;
            $('#boxNum').text(leftNum);
            if(leftNum==0){
                $('#getCoin').addClass('nobox');
            }else{
                $('#getCoin').addClass('bounce');
            }
        }else{
            Tools.alertDialog({
                text: d.desc,
                time: '999999999'
            })
        }
    })
    $('#getCoin').on('click', function(){
        var _self = $(this);
        if(_self.hasClass('nobox')){
            Tools.alertDialog({
                title:'<p style="font-size:.16rem;font-weight: normal;line-height:1.8;">当前还没有宝箱可开启哦<br>速速参与活动<br>邀请好友点击赢取宝箱吧</p>',
                text: '<a href="openBox.html?auth_token='+Tools.auth_token()+'" class="ui-btn minbtn">马上行动</a>',
                time: '0'
            })
        }else{
            if(_self.hasClass('disabled')){
                Tools.alertDialog({
                    text: '开启太频繁，3秒后再开吧~',
                    time: '0'
                })
                setTimeout(function(){
                    _self.removeClass('disabled');
                },3000);
            }else{
                _self.addClass('disabled');
                Ajax.custom({
                    url:'api/v1/box/open'
                }, function(d){
                    if(d.status==1000){
                        var leftNum = parseInt($('#boxNum').text());
                        var openBox = setInterval(function(){
                            if(_self.find('.o1').length>0){
                                $('#getCoin .top').addClass('o2');
                                leftNum>0 && $('#boxNum').text(leftNum-1);
                                $('#getCoin .coin').text('+'+d.data.coin).show().addClass('opa');
                                Tools.alertDialog({
                                    text: '恭喜您获得'+d.data.coin+'金币',
                                    time: '1200'
                                },function(){
                                    _self.removeClass('disabled');
                                    $('#getCoin .coin').text('').hide().removeClass('opa');
                                    $('#getCoin .top').removeClass('o2').removeClass('o1')
                                })
                                clearInterval(openBox);
                            }else{
                                $('#getCoin .top').addClass('o1');
                            }
                        },80);
                    }else if(d.status==9940){
                        Tools.alertDialog({
                            title:'<p style="font-size:.16rem;font-weight: normal;line-height:1.8;">宝箱开完啦<br>继续参与活动 邀请好友点击<br>赢取更多宝箱吧</p>',
                            text: '<a href="openBox.html?auth_token='+Tools.auth_token()+'" class="ui-btn minbtn">马上行动</a>',
                            time: '0'
                        })
                    }else{
                        Tools.alertDialog({
                            title: '开启失败',
                            text: d.desc,
                            time: '9999999999'
                        })
                        return;
                    }
                });
            }
        }
    })

});