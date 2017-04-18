define('app/invite', function(require, exports, module) {
    var Ajax = require('../mod/base');
    window.jQuery = window.Zepto;
    var tipsAd = require('../plugs/tipsAd.js');
    var km =  require('../plugs/version.js');
    require('../plugs/swiper-2.7.min.js');

    var channel='', userAgent = navigator.userAgent;
    if(userAgent.split('ssy=').length==2){
        var _ssy = userAgent.split('ssy=')[1];
        if(/iOS|Android/.test(_ssy.split(';')[0])){
            channel = _ssy.split(';')[3]
        }else{
            channel = _ssy.split(';')[2]
        }
    }
    var mylink = 'http://browser.kuaima.cn/inviteReg.html?uid=' + Tools.uid() + '&channel=' + channel;
    var mylink0 = 'http://browser.kuaima.cn/inviteReg.html?uid=' + Tools.uid();

    seajs.use('./scripts/lib/jquery.qrcode.min', function(){
        $('#userQrCode').qrcode({
            logo:"data:image/png;base64,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",
            width: 190,
            height: 190,
            correctLevel: 2,
            text: mylink
        });
    });
    Ajax.custom({
        url:'api/v1/userinfo/base'
    }, function(d){
        $('#photo').append('<img src="'+ d.data.avatar +'" />');
        $('#Tel').text(d.data.phone);
        $('#incomeNum').text(d.data.all_income);
    })

    var cas_dz = $("#canvasDZ")[0], ctx_dz = cas_dz.getContext("2d");
    var cas_gx = $("#canvasGX")[0], ctx_gx = cas_gx.getContext("2d");
    var makeQR = setInterval(function(){
        if($("#userQrCode img").length > 0){
            clearInterval(makeQR);
            var qr_code = $("#userQrCode img")[0];
            /*** 定制 ***/
            var bg_dz = $('#dzQr')[0];
            ctx_dz.drawImage(bg_dz,0,0,400,162);
            ctx_dz.drawImage(qr_code,19,0,162,162);
            $("#dzQr").attr('src',cas_dz.toDataURL("image/png"));
            ctx_dz.clearRect(0,0,400,162);
            /*** 个性 ***/
            var bg1 = $(".qr_code1")[0], bg2 = $(".qr_code2")[0];
            ctx_gx.fillStyle = '#fff';
            ctx_gx.drawImage(bg1,0,0,528,736);
            ctx_gx.beginPath();
            ctx_gx.fillRect(24, 24, 178, 178);
            ctx_gx.fill();
            ctx_gx.drawImage(qr_code,33,33,160,160);
             /* font */
            ctx_gx.font="20px PingFangSC-Semibold";
            ctx_gx.lineWidth = 12;
            ctx_gx.strokeStyle = '#fff'; 
            ctx_gx.strokeText("长按识别二维码",42,216);
            ctx_gx.fillStyle = '#000';
            ctx_gx.fillText("长按识别二维码",42,216);
            $(".qr_code1").attr('src',cas_gx.toDataURL("image/png"));
            ctx_gx.clearRect(0,0,528,736);

            /***** 图 2 ****/
            ctx_gx.fillStyle = '#fff';
            ctx_gx.drawImage(bg2,0,0,528,736);
            ctx_gx.beginPath();
            ctx_gx.fillRect(32, 508, 178, 178);
            ctx_gx.fill();
            ctx_gx.drawImage(qr_code,41,517,160,160);
             /* font */
            ctx_gx.font="20px PingFangSC-Semibold";
            ctx_gx.lineWidth = 12;
            ctx_gx.strokeStyle = '#fff'; 
            ctx_gx.strokeText("长按识别二维码",49,706);
            ctx_gx.fillStyle = '#000';
            ctx_gx.fillText("长按识别二维码",49,706);
            $(".qr_code2").attr('src',cas_gx.toDataURL("image/png"));
            ctx_gx.clearRect(0,0,528,736);
        }
    },100);

    $('#nav').on('click', 'li', function(){
        var id = $(this).data('id');
        $(this).addClass('active').siblings().removeClass('active');
        $('#'+id).show().siblings('.content').hide();
        if(id == 'gexing' && $('#qrImgsWrap div').length==2){
            var in_w = $('#qrImgs').width();
            $('#qrImgs, #qrImgsWrap').height(in_w*736/528);

            var myBanner = new Swiper('#qrImgs',{
                pagination: '.pagination',
                loop:true,
                autoplay:5000,
                paginationClickable: true,
                onSlideChangeStart: function(){
                    //回调函数
                }
            });
                
        }
    });

    $('#guiZe').on('click', function(){
        new tipsAd({
            type: '',
            subtit: '邀请奖励规则',
            text: '<p style="text-align:left;padding:.1rem .3rem;">每邀请一个徒弟，当徒弟完成一个任务时，您将获得1500金币奖励。另外，徒弟每次有效阅读，您都会额外获得20金币奖励哦！</p>',
            hasAd: '0',
            isClose: 'no',
            btnType: '1'
        });
    })

    if(km.less('1.3.0')){
        $('#shareBtn1').remove();
    }else{
        $('#shareBtn1').show();
        $('#shareBtn1').on('click', function(){
            window.location = 'kmb://shareinviteimg';
        });
    }
    $('#shareBtn3').on('click', function(){
        window.location = 'kmb://share?param={"shareurl":"'+mylink0+'","desc":"看文章有奖励，既长见识又赚钱，每月轻松多赚500元。你也快来试试吧！"}';
    });
});