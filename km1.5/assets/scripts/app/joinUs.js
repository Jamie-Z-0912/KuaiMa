define('app/joinUs', function(require, exports, module) {
    var submit = require('../mod/submit');
    const teamId = Tools.getQueryValue('teamId'), fatherId = Tools.uid();
    /***********/
    seajs.use('./scripts/lib/jquery.base64', function(){
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
                submit.sendSms($('#repeatSend'),{
                    phone: base64.encode(phone),
                    useto: 'register',
                    type: type
                });
            }
        })
    });
    /****************/
    var gvCode = (Math.random().toFixed(4)).substring(2);
    $('#gvCodeInput, #gvCode').text(gvCode);
    $('#gvCodeInput').bind('input propertychange', function(e) {
        var that = $(this), gv = that.val();
        if(gv.length > 3){
            if(gv==gvCode){
                that.attr('disabled','disabled');
                that.parent().next().show();
                $('#yuyin').css('display','block');
                return;
            }else{
                that.val('');
                return
            }
        }
    });
    /***********/
    $('#joinUsForm').submit(function(e){
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
            url: 'api/v1/teams/'+teamId+'/webJoin/'+fatherId,
            data: $(this)
        }, function(data){
            if(data.status == 2001){
                Tools.alertDialog({
                    text: '验证码错误，请新获取'
                })
            }else{
                if(data.status==1000){
                    alert('成功')
                }
                // Tools.alertDialog({
                //     title: (data.status == 1000 ? '注册成功': ''),
                //     text: '注册完成，快去赚钱吧<br><br><a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser" id="openAppBtn" style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;">下载#ProjectName#</a>',
                //     time: '0'
                // },function(){
                //     window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser';
                // });
            }
        })
    });
});