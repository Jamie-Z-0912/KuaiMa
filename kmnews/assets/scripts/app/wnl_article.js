define('app/wnl_article', function(require, exports, module) {
    var Ajax = require('../mod/base');
	// var km = require('../plugs/version');
    require('../plugs/cookieStorage');
    var a_id = Tools.getQueryValue('id') || '';
    if(a_id=='' || !/^[0-9]+$/.test(a_id)){
        window.location = 'http://news.kuaima.cn/404.html';
        return;
    }
    /**********/
    var Fun = {
        user_agent: navigator.userAgent.toLocaleLowerCase(),
        isAndroid: function(){
            return /android/.test(this.user_agent);
        },
        isIos: function(){
            return /iphone|ipod|ipad/.test(this.user_agent);
        },
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
        //高度处理
        var mainH = $('#MainCon').height(), 
            per = Tools.getQueryValue('mh')/100,
            showH;
        if(!per){
            if(mainH > innerHeight+40){
                showH = innerHeight+40+'px';
            }else{
                if (mainH > 250) 
                    showH = mainH-50+'px';
                else
                    showH = mainH+40+'px';
            }
        }else{
            showH = (per * mainH ).toFixed(2)+'px';
        }
        $('#article').height(showH);
   	}
    /* 显示文章内容 */
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
        var tjLen = tuijianData.length, tjData = [], stack=[];
        for (var i = 0; i < tjLen; i++) { stack.push(i)};
        for (var i = 0; i < 4; i++) {
            var num = stack.splice(parseInt(Math.random() * stack.length), 1)[0];
            console.log(num)
            tjData.push(tuijianData[num])
        }
        Ajax.render('#recommend', '#recommend-tmpl', tjData);
        $('.recommend-wrap').show();
        seajs.use('https://static.mlinks.cc/scripts/dist/mlink.min.js', function(){
            $('.unfold').show();
            // if(Fun.isAndroid()){
            //     var options = new Object();
            //     options["mlink"] = 'https://ax9wdh.mlinks.cc/AaiE?mw_android_dc=http://ustatic.ufile.ucloud.com.cn/KM_zhwnl02.apk';
            //     options["button"] = document.querySelectorAll("a#unfold");
            //     options["params"] = {"detailid": article.id, 'detailurl': article.url};
            //     new Mlink(options);
            // }
            // if(Fun.isIos()){
                var options = new Object();
                options["mlink"] = 'https://ax9wdh.mlinks.cc/A0WY';
                options["button"] = document.querySelectorAll("a#unfold");
                options["params"] = {"detailid": article.id, 'detailurl': article.url};
                new Mlink(options);
            // }

            var linkLength = $('#recommend li').length;
            for (var i = 0; i < linkLength; i++) {
                var id = '#rec_' + i;
                var options = new Object();
                options["mlink"] = 'https://ax9wdh.mlinks.cc/AaiE';
                options["button"] = document.querySelectorAll('a'+id);
                options["params"] = {'detailid':$(id).data('id'), 'detailurl':$(id).data('url')};
                // console.log(options)
                new Mlink(options);
            }
        });
	});
    $('#num').text(Math.ceil(Math.random()*93)+7);
    $('#photos li').each(function(){
        var n = Math.ceil(Math.random()*1000);
        $(this).css('background-image','url(image/photos/'+n+'.png)');
    });
});