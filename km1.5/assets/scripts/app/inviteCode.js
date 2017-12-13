define('app/inviteCode', function(require, exports, module) {
    var Ajax = require('../mod/base');
    var km =  require('../plugs/version.js');
    var confirmTip = require('../plugs/confirmTip.js');
    var code = Tools.getQueryValue('code');
    $('#code').text(code);

    function copy(){
    	window.location = 'kmb://QQ='+encodeURIComponent('我的邀请码：'+code);
        setTimeout(function(){
            window.location = 'kmb://invitecode?code='+code;
        },100);
        // var txt = '复制成功，快去告诉朋友们吧~';
        // new confirmTip({
        //     text: '<p style="color:#333;padding-left:.15rem;padding-right:.15rem;">'+txt+'</p>',
        //     sureTxt: '打开微信',
        //     cancelTxt: '我知道了'
        // },function(a){
        //     if(a){
        //         window.location = 'weixin://'
        //     }
        // });
    }
    $('.copy').on('click', function(){
    	copy();
    });
    $('#share').on('click', function(){
    	if(km.less('1.5.5')){
    		copy();
    	}else{
    		window.location = 'kmb://invitecode?code='+code;
    	}
    })

});