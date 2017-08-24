layui.define('layer' , function(exports){
    "use strict";
  
    var $ = layui.jquery;
    var layer = layui.layer;
    var device = layui.device();
    // layer.load(2);

    var msgConf = { icon: 2 ,shift: 6 }; 
    
    var formatDate = function(content, type){
        var pattern = type || "yyyy-MM-dd hh:mm";
        if (isNaN(content) || content == null) {
            return content;
        } else if (typeof(content) == 'object') {
            var y = dd.getFullYear(),
                m = dd.getMonth() + 1,
                d = dd.getDate();
            if (m < 10) {
                m = '0' + m;
            }
            var yearMonthDay = y + "-" + m + "-" + d;
            var parts = yearMonthDay.match(/(\d+)/g);
            var date = new Date(parts[0], parts[1] - 1, parts[2]);
            return format(date, pattern);
        } else {
            var date = new Date(parseInt(content));
            return format(date, pattern);
        }
    };
    /**
     * 接口基类
     */
    function Api(options) {
        this.options = options || {};
        //extends(options,this.options);
        this.timeout = 60000; //请求超时时间
        this.cache = true; //是否缓存
        this.defaultListTmpl = '#conList-tmpl';
        this.defaultListEle = '#conList';
        this.pagingDom = '#listPage';
        this.isLoading = false; //是否正在请求
        this.hasNext = true; //是否有下一页
        this.queue = {}; //请求队列
        this.tempPage = {}; //分页dom
        this.onEnd = function() {}; //当请求都完成
    }

    Api.prototype._init = function() {
        var spinnings = this.spinnings;
        return this;
    }

    /** 分页 **/
    Api.prototype.paging = function(options, callback, afterRender){
        var isFirst = options.data.page==1,
            opt = { //默认配置
                renderFor: this.defaultListTmpl,
                renderEle: this.defaultListEle,
                pagingDom: this.pagingDom,
                showLoading: true,
                hasNext: true,
                logtype: 'paging'
            };

        for (var i in opt) {
            options[i] = options[i] || opt[i];
        }
        laypage({
            cont: $(options.pagingDom), //容器。值支持id名、原生dom对象，jquery对象,
            pages: 100,
            groups: 0, //连续分数数0
            curr: 1,
            prev: false, //不显示上一页
            next: '点击查看更多',
            skin: 'flow', //设置信息流模式的样式
            jump: function(obj){
                var that = this;
                options.data.page = obj.curr;
                Ajax.baseAjax(options, function(data){
                    if(data.status == 1020){
                        data.data = null;
                        Ajax.render(options.renderEle, options.renderFor, data, undefined, true);
                        $(options.pagingDom).remove();
                    }else{
                        that.pages = data.total;
                        if(obj.curr == data.total){
                            options.hasNext = false;
                            $(options.pagingDom).find('.laypage_main').html('<span>没有更多数据</span>');
                        }
                        $.each(data.data, function(){
                            this.added_time = formatDate(this.added_time);
                        });
                        if (!afterRender) {
                            $.isFunction(callback) && callback(data);
                        }
                        if(data.page != 1 ){
                            Ajax.render(options.renderEle, options.renderFor, data, undefined, false);
                        }else{
                            Ajax.render(options.renderEle, options.renderFor, data, undefined, true);
                        }
                        if (afterRender) {
                            $.isFunction(callback) && callback();
                        }
                        $(options.pagingDom).removeClass('hide');
                    }
                },function(jqXHR, textStatus, errorThrown) {
                    if (typeof callbackError == 'function') {
                        callbackError(jqXHR, textStatus, errorThrown);
                    }
                });
            }
        });

        // window.onscroll = function() {
        //     if(options.hasNext){
        //         var scrollTop = document.body.scrollTop;
        //         var scrollHeight = document.body.scrollHeight;
        //         var windowHeight = window.screen.height * window.devicePixelRatio;
        //         if (scrollTop + windowHeight + 100 > scrollHeight) {　　　
        //             $('#laypage_0 a').click();
        //         }
        //     }
        // }
    };
    Api.prototype.baseAjax = function(options, callback){
        var appkey = {name: 'app_key', value: config.key};
        if (options.showLoading) {
            if($('.ui-loading-block').length == 0)
                $('body').append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>');
            else
                $('.ui-loading-block').addClass('show');
            if(options.logtype != 'paging' || options.data.skip == 0){
                $(options.renderEle).hide();
            }
        }

        if(!options.data) options.data={};
        if($.isFunction(options.data.push)){
            options.data.push(appkey);
        }else{
            options.data.app_key = config.key;
        }
        if($.isFunction(options.data.push)){
            options.data.push({name: 'auth_token', value: Tools.auth_token()});
        }else{
            options.data.auth_token = Tools.auth_token();
        }
        $.ajax({
            url: config.km_api + options.url,
            data: options.data,
            type: 'GET',
            dataType: "jsonp",
            xhrFields: {
                withCredentials: true
            },
            jsonpCallback:"jsonp"+Math.ceil(Math.random()*1000),
            success: function(data){
                if (options.showLoading) {
                    $('.ui-loading-block').removeClass('show');
                    if(options.logtype != 'paging' || options.data.skip == 0){
                        $(options.renderEle).show();
                    }
                 }
                if(preCheck(data)){
                    callback(data)
                }
            },
            error: function(xhr,errorType , error) {
                console.log(xhr);
                if(options.showLoading){
                    $('.ui-loading-block').removeClass('show');
                }
                if(options.logtype != 'paging'){
                    $(options.renderEle).show();
                }
            }
        });
    };
    Api.prototype.render = function(renderEle, renderFor, data, secTpl, isFirst){
        if ($(renderFor).length > 0 && data) {
            var st = secTpl || undefined;
            var gettpl = $(renderFor).text();
            var result = doT.template(gettpl, undefined, st);
            if(isFirst){
                $(renderEle).html( result(data) );
            }else{
                $(renderEle).append( result(data) );
            }
        }
    };
    Api.prototype.custom = function(options, callback){
        var that = this;
        options = options || {};
        options.logtype = 'custom';
        that.baseAjax(options, callback);
    }


    //暴露接口
    exports('upload', function(options){
        var upload = new Upload(options = options || {});
        upload.init();
    });
});

