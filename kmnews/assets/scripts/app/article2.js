define('app/article', function(require, exports, module) {
    var Ajax = require('../mod/base');
	var km = require('../plugs/version');
    require('../plugs/cookieStorage');
    if(km.less('1.2.2')){
        if(!Storage.get('HASWARNING_')){
            Storage.set('HASWARNING_',1);
            Tools.alertDialog({
                title: '升级通知',
                text: '请升级至新版本1.3.0，活动多多奖励多多，提现立即到账！现有版本近期将停止提现功能！<br><br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">马上更新</a>',
                time: '0'
            });
        }
    }
    var a_id = Tools.getQueryValue('id') || '';
    if(a_id=='' || !/^[0-9]+$/.test(a_id)){
        window.location = 'http://news.kuaima.cn/404.html';
        return;
    }
    /**********/
    if(km.gEq('1.1.0') && km.less('1.2.2'))
        if(Tools.getQueryValue('login')=='1'||Tools.getQueryValue('login')=='0')
            if(!Storage.get('HASREAD')){
                Storage.set('HASREAD',1);
                $('body').css({'overflow':'hidden','height': window.screen.height}).append('<div class="km-dialog leader-wrap" id="leaderPage">'+
                    '<div class="con" id="leaderCon">'+
                        '<img id="leaderBg" src="image/leader.png"/>'+
                        '<div class="txt">认真阅读至文章底部<br>才能获得金币奖励哦</div>'+
                        '<div class="btn">知道了</div>'+
                    '</div>'+
                '</div>');
                $('#leaderCon').css({
                    'margin-top': (window.screen.height - $('#leaderCon').height())/4,
                    'margin-left': (innerWidth - $('#leaderCon').width())/2
                })
                $('#leaderPage')[0].addEventListener('touchmove',function(e){e.preventDefault();return false;},false);
                $('#leaderCon').on('click',function(){
                    $('#leaderPage').remove();
                    $('body').removeAttr('style');
                });
            }
    var Fun = {
        isEmpty: function(str){
            return /^\s*$/.test(str)
        },
        removeData: function(el){
            $.each(el.data(), function(i){
                el.removeAttr('data-'+i);
            })
        }
    };
    /***********************/
   	function doCon() {
        var wrapW = $('#MainCon').width();
        //所有图片的处理
        $('#MainCon img').each(function(){
            var $img = $(this);
            var src = $img.data('gif-url') || $img.data('original') || $img.data('src');
            var w = $img.data('w')||$img.data('width');
            var h = $img.data('h')||$img.data('height');
            if(w){
                $img.css('width', w);
            }
            if(h){
                if(wrapW < w){
                    $img.css('height', h*wrapW/w);
                }else{
                    $img.css('height', h);
                }
            }
            if($img.data('gif-url')){
                $img.css({'width': 'auto', 'max-width':'100%'});
            }
            if($img.parent().attr('href')){
                $img.parent().attr('href','javascript:void(0)');
            }
            if(src){
                Fun.removeData($img);
                if(!Fun.isEmpty(src)){
                    $img.attr('src', src);
                }
            }else{
                return;
            }
        });
        if($('#conIframe').length==1){
        	$('#conIframe').height(innerHeight).width(innerWidth);
        }
        if(km.gEq('1.2.2')){
            var iframe = document.createElement('iframe');
            if(km.isNews){
                iframe.src = 'kmxb://article?refreshheight='+ $(document).height();
            }
            if(km.isBrowser){
                iframe.src = 'kmb://article?refreshheight='+ $(document).height();
            }
            iframe.style.display = 'none';
            $('body').append(iframe);
            $(iframe).remove();
        }
        if(km.less('1.3.1')){
            var mainH = $('#MainCon').height();
            if(mainH > innerHeight+80){
                $('#article').height(innerHeight+80+'px');
            }else{
                if (mainH > 250) 
                    $('#article').height(mainH-50+'px');
                else
                    $('#article').height(mainH+40+'px');
            }
            $('.unfold').show();

            $('#unfold').on('click', function(){
                $('#article').css('height',  mainH+10);
                $(this).parents('.unfold').remove();
                if(km.gEq('1.2.0')){
                    var iframe = document.createElement('iframe');
                    if(km.isNews){
                        iframe.src = 'kmxb://article?height='+$(document).height();
                    }
                    if(km.isBrowser){
                        iframe.src = 'kmb://article?height='+$(document).height();
                    }
                    iframe.style.display = 'none';
                    $('body').append(iframe);
                    $(iframe).remove();
                }
            });
        }
        // 微信腾讯视频处理
        $('#MainCon .video_iframe').each(function(){
            var src = $(this).data('src');
            $(this).width(wrapW).height(wrapW*2/3);
            if(src){ 
                if(!Fun.isEmpty(src)){
                    if(/v.qq.com\/iframe\/preview.html/.test(src)){
                        var n_v_arr = src.split('preview.html?vid=');
                        var n_v_id = n_v_arr[1].split('&')[0];
                        $(this).attr('src', n_v_arr[0]+'player.html?auto=0&vid='+ n_v_id);
                    }else{
                        $(this).attr('src', src);
                    }
                }
            }else{
                return;
            }
        });
        $('#MainCon .iframe_video').each(function(){
            var w = parseInt($(this).width());
            $(this).css('height',w*.6+'px');
        });
        //qq音乐处理
        if($('qqmusic').length > 0){
            $('qqmusic').remove()
            $('#qqmusic_play_').remove();
        }
        // 腾讯新闻的文章
        if($('#Cnt-Main-Article-QQ').length > 0){
            $('#Cnt-Main-Article-QQ script').remove();
            $('#Cnt-Main-Article-QQ iframe').remove();
            $('#Cnt-Main-Article-QQ .rv-js-root').remove();
        }
   	}
    /******************************/
    function v1_article() {
    	var validread = require('../plugs/validread');
    	Ajax.custom({
    		url:'api/v1/article/'+a_id
    	}, function(d) {
            var data = d.data, article = data.article;
    		document.title = article.title;
            try{
                Ajax.render('#MainCon','#MainCon-tmpl', article);
            }catch(e){
                console.log(e);
            }
            doCon();
            var contpl = { tags: '<span class="tag red-tag">热门</span>' };
            Ajax.render('#recommend', '#recommend-tmpl', data.recomArticles, contpl);
            $('.recommend-wrap').show();

            if(Tools.getQueryValue('login')=='1'){
                if(data.idx && data.seconds && Tools.auth_token()!='null')
                    validread(a_id, data.idx, data.seconds);
            }
            if(Tools.getQueryValue('login')=='0'){
                if(Tools.notPC == 'Android'){
                    Tools.alertDialog({text: '登录之后看文章有奖励哦~<br><br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="kmb://alertlogin">马上登录</a>'});
                }else{
                    window.location = 'kmb://alertlogin';
                }
            }
            $('#recommend').on('click', 'a', function() {
                var url = $(this).data('url'), id = $(this).data('id');
                window.location.href = 'kmb://recommend?url=' + url + '&id=' + id;
            });
    	});
    }
    /************/
    if(km.less('1.2.0')){
        v1_article();
    }else{
        /** KM V 1.2.0 **/
        $('.recommend-wrap').remove();
        Ajax.custom({
            url:'api/v2/article/details/'+a_id
        }, function(d){
            var article = d.data.article;
            document.title = article.title;
            if(article.origin_url!='') $('#originUrl').attr('href', article.origin_url);
            try{
                Ajax.render('#MainCon','#MainCon-tmpl', article);
            }catch(e){
                console.log(e);
            } 
            doCon();

        });
    }
});