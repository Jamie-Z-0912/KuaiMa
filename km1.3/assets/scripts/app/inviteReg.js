define('app/inviteReg', function(require, exports, module) { 
    var isPC = function(){
        var userAgentInfo = navigator.userAgent;  
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
        var flag = true;  
        for (var v = 0; v < Agents.length; v++) {  
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
        }  
        return flag; 
    }
    var submit = require('../mod/submit');
    require('../plugs/cookieStorage.js');
    var SecondPage =  require('../plugs/secondPage.js');

    if(isPC()){
        $('#hongbao').html('<h1 style="color:#fff;text-align:center;" id="pcView">请在手机端查看</h1>');
        $('#pcView').css('margin-top', innerHeight/2);
        return;
    }
    $('.hongbao').css({ 'margin-top':(innerHeight-$('#hbT').height())/2+'px', 'opacity':1 });
    (function () {
        $.extend($.fn, {
            fadeOut: function (speed, easing, complete) {
                if (typeof(speed) === 'undefined') speed = 400; 
                if (typeof(easing) === 'undefined' || typeof(easing) !== 'string') easing = 'swing';
                $(this).css({ opacity: 1 }).animate({ opacity: 0}, speed, easing, function () {
                    $(this).css('display', 'none');
                    if (typeof(easing) === 'function') {
                        easing();
                    } else if (typeof(complete) === 'function') {
                        complete();
                    }
                });
                return this;
            }
        });
    })();
    /********* test *********/
    $('#hbk').on('click',function(){
        $(this).addClass('rotate');
        setTimeout(function(){
            $('#hbk').parent().remove();
            $('#hbT').animate({'transform': 'translateY(-600px)'},800,'swing');
            $('#hbB').animate({'transform': 'translateY(600px)'},800,'swing');
            /*二层页面加载*/
            $('input[name="fu"]').val(Tools.uid());
            $('input[name="channel"]').val(Tools.getQueryValue('channel'));
            var code = Tools.getQueryValue('code');
            var code_ = location.href.split(code)[1];
            if(code_.length > 0){
                code_ = code_.split('&')[0];
                code += code_
            }
            $('input[name="code"]').val(code);
            Ajax.custom({
                url: 'api/v1/withdrawList/now'
            }, function(d){
                var len = d.data.length;
                Ajax.render('#marquee','#marquee-tmpl', d.data);
                var w = $('#marquee li').width();
                $('#marquee').width(w*len);
                var marFun = function(){
                    $('#marquee li:first-child').width(0);
                    setTimeout(function(){
                        $('#marquee li:first-child').remove();
                    },3000);
                }
                marFun();
                var timer = setInterval(function(){
                    var li = $('#marquee li:first-child').clone();
                    $('#marquee').append(li);
                    marFun();
                },3010);
            });
            /**/
            $('#hongbao').fadeOut(800,'',function(){
                $('#hongbao').remove();
            });
        },500)
    });
    var nowList = {
        text: function(type, num){
            if(type == 0) return '充值了'+ num +'元到手机';
            if(type == 1) return '提现了'+ num +'元到银行卡';
            if(type == 2) return '提现了'+ num +'元到支付宝';
        },
        append: function(d){
            if(d==null){
                $('#marquee li').first().before('<li></li>');
            }else{
                $('#marquee li').first().before('<li>'
                    +'用户 '+ d.uid + this.text(d.type, d.amount) +'<span>'+ d.time +'</span>'
                +'</li>');
            }
        }
    }
    /*********/
    var gvCode = (Math.random().toFixed(4)).substring(2);
    $('#gvCodeInput, #gvCode').text(gvCode);
    $('#gvCodeInput').bind('input propertychange', function(e) {
        var that = $(this), gv = that.val();
        if(gv.length > 3){
            if(gv==gvCode){
                that.attr('disabled','disabled');
                that.parent().next().show();
                return;
            }else{
                that.val('');
                return
            }
        }
    });
    /***********/
    seajs.use('./scripts/lib/jquery.base64', function(){
        $('#repeatSend').on('click', function(){
            var phone = $('input[name="phone"]').val();
            if(phone.isEmpty()){
                Tools.alertDialog({ text: "手机号不能为空" });
                return;
            }
            if(!phone.isMobile()){
                Tools.alertDialog({ text: "手机号格式不正确" });
                return;
            }
            if(!$(this).hasClass('disabled')){
                Ajax.custom({
                    url: 'api/v1/account/exists',
                    data: { phone: phone }
                }, function(data){
                    if(data.data.exists){
                        Tools.alertDialog({
                            text: '您已经注册过啦快去赚钱吧<br><br><a href="javascript:;" id="openAppBtn" style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;">下载#ProjectName#</a>',
                            time: '0'
                        });
                        $('#openAppBtn').on('click',function(){
                            window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser';
                        });
                    }else{
                        Cookie.set('_KKMMMMMCMMM',Ajax.formatDate(new Date().getTime(),'yyyyMMdd'));
                        submit.sendSms($('#repeatSend'),{
                            phone: base64.encode(phone),
                            useto: 'register'
                        });
                    }
                });
            }
        })
    });
    /****************/
    $('#inviteForm').submit(function(e){
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
                text: "验证码为4位数字"
            })
            return;
        };
    	submit.fun({
    		url: 'api/v1/register/invite',
    		data: $(this)
    	}, function(data){
            if(data.status == 2001){
                Tools.alertDialog({
                    text: '验证码错误，请新获取'
                })
            }else{
                Tools.alertDialog({
                    title: (data.status == 1000 ? '注册成功': ''),
                    text: '注册完成，快去赚钱吧<br><br><a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser" id="openAppBtn" style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;">下载#ProjectName#</a>',
                    time: '0'
                },function(){
                    window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser';
                });
            }
    	})
    });

    var pageProtocol = new SecondPage('#page_protocol');
    $('#protocolCon').on('click', function(){
            pageProtocol.openSidebar();
        $('#agreeBtn').off().on('click', function(){
            pageProtocol.closeSidebar();
        })
    });

});