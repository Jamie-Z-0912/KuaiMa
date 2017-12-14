define('app/inviteCode', function(require, exports, module) {
    var Ajax = require('../mod/base');
    var km =  require('../plugs/version.js');
    var confirmTip = require('../plugs/confirmTip.js');
    var code = Tools.getQueryValue('code');
    $('#code').text(code);

    var txt = '只要阅读就有钱来~还有更多有趣玩法教你赚足零花钱！点击下载：http://s.ssy.im/UdQBpp，我的邀请码：'+code;
    function copy(){
    	window.location = 'kmb://QQ='+encodeURIComponent(txt);
        new confirmTip({
            text: '<p style="color:#333;">赶快去呼朋唤友吧！</p>',
            sureTxt: 'QQ拉人',
            cancelTxt: '微信拉人'
        },function(a){
            if(a){
                window.location = 'mqqwpa://im/chat?chat_type=wpa&version=1';
            }else{
                window.location = 'weixin://';
            }
        });
    }
    $('.copy').on('click', function(){
    	copy();
    });
    $('#share').on('click', function(){
    	if(km.less('1.5.5')){
    		copy();
    	}else{
            window.location = 'kmb://QQ='+encodeURIComponent(txt);
            setTimeout(function(){
                window.location = 'kmb://invitecode?code='+code;
            },110)
    	}
    })

});