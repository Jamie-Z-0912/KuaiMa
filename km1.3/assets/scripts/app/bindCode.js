define('app/bindCode', function(require, exports, module) {
    var Ajax = require('../mod/base');
    var km = require('../plugs/version');
	if(Tools.auth_token() == 'null'){
    	var opt = { title: "提醒", text: "请在#ProjectName#中登录再访问！", time: 5000};
    	Tools.alertDialog(opt, function(){
    		window.location = 'kmb://alertlogin';
    	});
    	return;
    }
    $('#code').bind('input propertychange', function(e) {
        var self = $(this), val = self.val(), len = val.length, s_len = $('#skin i').length;
        // if(len>s_len){
        //     self.val(val.substr(0,6));
        // }else{
        //     if(len==s_len) $('#bind').removeClass('disabled');
        //     if(len==s_len-1) $('#bind').addClass('disabled');
        //     if(len==0){
        //         $('#skin i').text('').removeClass('light');
        //     }else{
        //         var cur_num = $('#code').val().substr(len-1,1);
        //         var cur = $('#skin i').eq(len-1);
        //         if(cur.hasClass('light')){
        //             $('#skin i').eq(len).text('').removeClass('light');
        //         }else{
        //             cur.text(cur_num).addClass('light');
        //         }
        //     }
        // }
        if(len>5) $('#bind').removeClass('disabled');
    });

    $('#bind').on('click', function(){
        if(!$(this).hasClass('disabled')){
            var code = $('#code').val().substr(0,6), txt = $('#coin').text();
            console.log(code)
            Ajax.custom({
                url:'api/v1/inviteRelation/bind/'+code
            },function(data){
                if(data.status == 1000){
                    Tools.alertDialog({
                        title:'绑定成功',
                        text:'恭喜您获得<b style="color:#ffa31a">'+txt+'</b style="color:#ffa31a">奖励<br><div>（奖励将自动存入账户）</div>'
                    },function(){
                        window.location = 'kmb//back';
                    })
                }else{
                    Tools.alertDialog({
                        title:'绑定出错',
                        text: data.desc
                    })
                }
            })
        }
    })
});