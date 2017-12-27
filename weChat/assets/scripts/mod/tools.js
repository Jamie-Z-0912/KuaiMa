define(function(require) {
    // require('./alertDialog.css');
    var Tools = {
        //获取URL参数
        getQueryValue: function(key) {
            var q = location.search, keyValuePairs = new Array();
            if (q.length > 1) {
                var idx = q.indexOf('?');
                q = q.substring(idx + 1, q.length);
            } else {
                q = null;
            }
            if (q) {
                for (var i = 0; i < q.split("&").length; i++) {
                    keyValuePairs[i] = q.split("&")[i];
                }
            }
            for (var j = 0; j < keyValuePairs.length; j++) {
                if (keyValuePairs[j].split("=")[0] == key) {
                    // 这里需要解码，url传递中文时location.href获取的是编码后的值
                    // 但FireFox下的url编码有问题
                    return decodeURI(keyValuePairs[j].split("=")[1]);
                }
            }
            return '';
        },
        auth_token: function(){
            return Tools.getQueryValue('auth_token');
        },
        alertDialog: function(options,callback){
            var opt = { title: null, text: null, img: null, time: 3000 };   
            for (var i in opt) {
                options[i] = options[i] || opt[i];
            }
            var dialogId = "tips" + new Date().getTime();
            var html ='<div id="'+ dialogId +'" class="ui-popup-screen km-dialog">'
                        +'<div class="ui-overlay-shadow km-popup">';
            if(options.time<1){
                html += '<i class="iconfont icon-close" id="close"></i>';
            }
            html +='<div class="content">';
            if(options.title != null && options.title != ""){
                html +='<h1>'+options.title+'</h1>';
            }
            if(options.text!=null && options.text != ""){
                html += '<p>'+options.text+'</p>';
            }
            if(options.img!=null && options.img != ""){
                html +='<div class="pic"><img src="'+options.img+'"/></div>';
            }
            html+= '</div> </div> </div>';
            
            var popupDialogObj = $(html).appendTo('body');

            var c_h = $('#'+dialogId+' .km-popup').height();
            var s_h = $(window).height();
            var top = (s_h - c_h)/2;
            $('#'+dialogId+' .km-popup').css('top',top);
            
            popupDialogObj.addClass('show-dialog');
            
            $('#close').click(function(){
                $('#'+dialogId).remove();
                $.isFunction(callback)&&callback();
            });
            if(options.time>0){
                var t = options.time;
                setTimeout(function(){
                    $('#'+dialogId).remove();
                    $.isFunction(callback)&&callback();
                }, t);
            }  
        }
    };
    window.Tools = Tools;
})