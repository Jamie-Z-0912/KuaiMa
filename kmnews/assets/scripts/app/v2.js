define('app/video', function(require, exports, module) {
    var Ajax = require('../mod/base');
	var km = require('../plugs/version');
    require('../plugs/cookieStorage');
    if(km.less('1.2.2')){
        if(!Storage.get('HASWARNING_')){
            Storage.set('HASWARNING_',1);
            alertDialog({
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
    /*********/    
    var Fun = {
        isEmpty: function(str){
            return /^\s*$/.test(str)
        }
    };
    function doCon(){
        $('#videoplayer')[0].addEventListener("play", function(){
            _hmt.push(['_trackEvent', 'video', 'play']);
            var iframe = document.createElement('iframe');
            if(km.isNews){
                iframe.src = 'kmxb://article?height=' + innerHeight;
            }
            if(km.isBrowser){
                iframe.src = 'kmb://article?height=' + innerHeight;
            }
            iframe.style.display = 'none';
            $('body').append(iframe);
            $(iframe).remove();
        });
        if(km.gEq('1.2.2')){
            var iframe = document.createElement('iframe');
            if(km.isNews){
                iframe.src = 'kmxb://article?refreshheight='+ $('#MainCon').parent().height();
            }
            if(km.isBrowser){
                iframe.src = 'kmb://article?refreshheight='+ $('#MainCon').parent().height();
            }
            iframe.style.display = 'none';
            $('body').append(iframe);
            $(iframe).remove();
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
            if(!article.origin_url && article.source=='风行网'){
                var str = article.content.split('<iframe')[1];
                    str = str.split('</iframe>')[0];
                article.fx_origin = '<iframe' + str + '</iframe>';
                console.log(article.fx_origin)
            }else{
                if(article.origin_url!='') $('#originUrl').attr('href', article.origin_url);
            }
            try{
                Ajax.render('#MainCon','#MainCon-tmpl', article);
            }catch(e){
                console.log(e);
            }
            if($('#videoplayer').length>0){ doCon();}
            if(!article.origin_url && article.source=='风行网'){
                $('#originUrl').attr('href', $('iframe[name="ext_urlIframe"]').attr('src'));
            }

            var contpl = { tags: '<span class="tag red-tag">热门</span>' };
            Ajax.render('#recommend', '#recommend-tmpl', data.recomArticles, contpl);
            $('.recommend-wrap').show();

            if(Tools.getQueryValue('login')=='1'){
                if(data.idx && data.seconds && Tools.auth_token()!='null')
                    validread(a_id, data.idx, data.seconds);
            }
            if(Tools.getQueryValue('login')=='0'){
                if(Tools.notPC == 'Android'){
                    alertDialog({text: '登录之后看文章有奖励哦~<br><br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="kmb://alertlogin">马上登录</a>'});
                }else{
                    window.location = 'kmb://alertlogin';
                }
            }
            $('#recommend').on('click', 'a', function() {
                var url = $(this).data('url'),
                    id = $(this).data('id');
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
            if(!article.origin_url && article.source=='风行网'){
                var str = article.content.split('<iframe')[1];
                    str = str.split('</iframe>')[0];
                article.fx_origin = '<iframe' + str + '</iframe>';
                console.log(article.fx_origin)
            }else{
                if(article.origin_url!='') $('#originUrl').attr('href', article.origin_url);
            }
            try{
                Ajax.render('#MainCon','#MainCon-tmpl', article);
            }catch(e){
                console.log(e);
            }
            if($('#videoplayer').length>0){doCon();}
            if(!article.origin_url && article.source=='风行网'){
                $('#originUrl').attr('href', $('iframe[name="ext_urlIframe"]').attr('src'));
            }
        });
    }
});