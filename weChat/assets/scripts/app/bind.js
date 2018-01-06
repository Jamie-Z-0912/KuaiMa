define('app/bind', function(require, exports, module) {	
    var submit = require('../mod/submit'),
        popups = require('../plugs/popups.js');
    require('../plugs/cookie.js');

    var auth1 = Storage.getCache(Storage.AUTH),
        auth2 = Tools.getQueryValue('auth_token');

    if(Tools.getQueryValue('code')==''){
        if(auth1||auth2!=''){
            new popups({
                topTxt:'您已经绑定过账号了！一个微信号只能绑定一次哦！',
                img:'../image/no.png'
            })
        }
    }else{
        if(auth1) Storage.remove(Storage.AUTH);
    	$('input[name="code"]').val(Tools.getQueryValue('code'));
    }

    // var gvCode = (Math.random().toFixed(4)).substring(2);
    // $('#gvCodeInput, #gvCode').text(gvCode);
    // $('#gvCodeInput').bind('input propertychange', function(e) {
    //     var that = $(this), gv = that.val();
    //     if(gv.length > 3){
    //         if(gv==gvCode){
    //             that.attr('disabled','disabled');
    //             $('#subForm').removeClass('disabled');
    //             that.parent().next().show();
    //             $('#yuyin').css('display','block');
    //             return;
    //         }else{
    //             that.val('');
    //             return
    //         }
    //     }
    // });
    /*** 发送短信验证码 ***/ 
    seajs.use('../scripts/lib/jquery.base64', function(){
        $('#repeatSend,#yuyin').on('click', function(){
            var phone = $('input[name="phone"]').val();
            var type = $(this).data('type');
            if(phone.isEmpty()){
                Tools.alertDialog({ text: "手机号不能为空" });
                return;
            }
            if(!phone.isMobile()){
                Tools.alertDialog({ text: "手机号格式不正确" });
                return;
            }
            if(!$(this).hasClass('disabled')){
                $('#yuyin').addClass('disabled');
                setTimeout(function(){
                    $('#yuyin').removeClass('disabled');
                }, 60000);

                Cookie.set('_KKMMMMMCMMM',Ajax.formatDate(new Date().getTime(),'yyyyMMdd'));
                submit.sendSms($('#repeatSend'),{
                    phone: base64.encode(phone),
                    useto: 'bindAccount',
                    type: type
                });

            }
        })
    });

    $('#subForm').on('click', function(){
        if(!$(this).hasClass('disabled')){
            $('#bindUser').submit();
        }
    });
    $('#bindUser').submit(function(e){
    	e.preventDefault();
    	var curEl = $(this);
    	var phone = $('input[name="phone"]').val();
    	var code = $('input[name="verify_code"]').val();
    	if(phone.isEmpty()){
            Tools.alertDialog({
                text: "手机号不能为空"
            })
            return;
        }
        if(!phone.isMobile()){
            Tools.alertDialog({
                text: "手机号格式不正确"
            })
            return;
        }
        if(code.isEmpty()){
            Tools.alertDialog({
                text: "验证码不能为空"
            })
            return;
        }
        if(!code.isVerifyCode()){
            Tools.alertDialog({
                text: "请正确输入收到的验证码"
            })
            return;
        };
    	submit.fun({
    		url: 'api/v1/register/bind_wx',
    		data: $(this)
    	}, function(data){
            if(data.status == 1000){
                Storage.setCache(Storage.AUTH,data.data.auth_token,60*60*24*3);
                new popups({
                    title:'<img src="../image/bind_suc.png"/>',
                    img:'../image/ok.png',
                    botTxt:'3秒后为您自动跳转……'
                });
                setTimeout(function(){
                    window.location = 'bindAward.html'
                },3000)
            }else{
                Tools.alertDialog({
                    text: data.desc
                })
            }
    	})
    });
});