define('app/recruit', function(require, exports, module) {
    var Ajax = require('../mod/base');
    window.jQuery = window.Zepto;
    var km =  require('../plugs/version.js');
    require('../plugs/cookieStorage.js');
    $('body,#bg').height(innerHeight);
    // if(!km.isKM){
    //     Tools.alertDialog({
    //         text:'请在快马小报中打开！<br>'+km.userAgent,
    //         time: 9999999
    //     })
    //     return;
    // }

    const uid = Tools.uid(), teamId = Tools.getQueryValue('teamId');
    // var myurl = 'http://share.51xiaoli.cn/joinUs.html?uid=' + uid + '&teamId=' + teamId;
    var myurl = 'http://t.kuiama.cn/browser/joinUs.html?uid=' + uid + '&teamId=' + teamId;
    function get_channel(){
        var channel='', userAgent = km.userAgent;
        if(userAgent.split('ssy=').length==2){
            var _ssy = userAgent.split('ssy=')[1];
            if(/iOS|Android/.test(_ssy.split(';')[0])){
                channel = _ssy.split(';')[3]
            }else{
                channel = _ssy.split(';')[2]
            }
        }
        return channel;
    }
    var QR = {
        channel: get_channel(),
        qr_base64: Storage.get('qr'),
        makeQrImg: function(qrTag){
            var cas_qr = $("#canvasQR")[0], ctx_qr = cas_qr.getContext("2d");
            /*** 二维码 ***/
            ctx_qr.fillStyle = '#fff';
            ctx_qr.fillRect(0, 0, 530, 530);
            ctx_qr.fill();
            ctx_qr.drawImage(qrTag,30,30,470,470);
            $("#userQrTab").html('<img src="'+ cas_qr.toDataURL("image/png")+'"/>');
            ctx_qr.clearRect(0,0,530,530);
        },
        make_qr: function(){
            var self = this;
            if(/Android/.test(km.userAgent) && self.qr_base64 && self.qr_base64[0] == uid){
                $("#userQrCode").append('<img src="'+  self.qr_base64[1] +'"/>');
                var qrTag = $("#userQrCode img")[0];
                self.makeQrImg(qrTag);
            }else{
                var mylink = myurl + '&channel=' + this.channel;
                seajs.use('./scripts/lib/jquery.qrcode.min', function(){
                    var qr = $('#userQrCode').qrcode({
                        // logo:"data:image/png;base64,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",
                        logo:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjwAsAAB4AAdpxxYoAAAAASUVORK5CYII=",
                        width: 190,
                        height: 190,
                        correctLevel: 2,
                        text: mylink
                    });
                });
                var makeQrTime = setInterval(function(){
                    if($("#userQrCode img").length > 0){
                        clearInterval(makeQrTime);
                        var qr_code = $("#userQrCode img")[0];
                        var qr=[uid,$("#userQrCode img").attr('src')];
                        Storage.set('qr',qr);
                        self.makeQrImg(qr_code);
                    }
                },100);
            }
            $('#shareBtn3').on('click', function(){
                window.location = 'kmb://share?param={"shareurl":"'+myurl+'","desc":"读新闻涨见识还可以赚零花，加入团队奖励翻！"}';
            });
        }
    }
    QR.make_qr();

    Ajax.custom({
        url:'api/v1/teams/'+teamId
    }, function(data){
        if(data.status==1000){
            var d = data.data;
            $('#teamCode').text(d.invite_code);
        }else{
            Tools.alertDialog({
                title: "提醒",
                text: data.desc,
                time: '0'
            })
        }
    })

    $('#nav').on('click', 'li', function(){
        var id = $(this).data('id');
        $(this).addClass('active').siblings().removeClass('active');
        $('#'+id).show().siblings('.content').hide();

        if (id == "gexing" && $("#qrImgsWrap div").length == 2) {
            var in_w = $("#qrImgs").width();
            $("#qrImgs, #qrImgsWrap").height(in_w * 736 / 528);
            var myBanner = new Swiper("#qrImgs", {
                pagination: ".pagination",
                loop: true,
                autoplay: 5000,
                paginationClickable: true,
                onSlideChangeStart: function() {}
            });
        }
    });

    $('#copyCode').on('click', function(){
        window.location = 'kmb://QQ='+$('#teamCode').text();
    })

});