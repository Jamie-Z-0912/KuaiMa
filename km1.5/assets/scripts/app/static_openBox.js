define('app/openBox', function(require, exports, module) {
	var Ajax = require('../mod/base');
    var tipsAd = require('../plugs/tipsAd');
    var km =  require('../plugs/version.js');

    Ajax.custom({
        url:'v1/inviteAct/shareUrl'
    },function(data){
        if(data.status==1000){  
            var d = data.data;
            var param = {"shareurl": d.share_url,"desc": d.share_description }
            if(!km.less('1.5.5')){
                param = {
                    "shareurl": d.share_url ,
                    "title": d.share_description,
                    "desc":"戳开有惊喜",
                    "icon":"http://static.etouch.cn/imgs/upload/1512982615.3361.png"
                };
            }
            var share_kmb = 'kmb://share?param='+JSON.stringify(param);
            $('#share').on('click', 'li', function(){
                window.location = share_kmb;
            })
        }else{
            Tools.alertDialog({
                text: data.desc,
                time: '999999999'
            })
        }
    });
    $('#share li')[0].addEventListener("click", function(){
        _hmt.push(['_trackEvent', 'actShareGetBox', 'click', 'weixin']);
    })
    $('#share li')[1].addEventListener("click", function(){
        _hmt.push(['_trackEvent', 'actShareGetBox', 'click', 'weibo']);
    })
    $('#share li')[2].addEventListener("click", function(){
        _hmt.push(['_trackEvent', 'actShareGetBox', 'click', 'QQzone']);
    })
    var rule = $('#ruleCon').html();
    $('#rule').on('click', function(){
        new tipsAd({
            title: '活动规则',
            text: rule,
            hasAd:'0'
        })
    });
    $('#go').on('click', function(){
        window.location = 'publicBox.html?auth_token='+Tools.auth_token();
    });

});