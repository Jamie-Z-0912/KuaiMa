define(function(require, exports, module) {
	var Ajax = require('./render');
    var laypage = require('../plugs/laypage');
    window.Ajax = Ajax;
    exports.defaultListTmpl = '#conList-tmpl';
    exports.defaultListEle = '#conList';
    exports.pagingDom = '#listPage';
	exports.fun = function(options, beforeCallback, afterCallback){
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
                            this.added_time = Ajax.formatDate(this.added_time);
                        });
                        if (beforeCallback) {
                            $.isFunction(beforeCallback) && beforeCallback(data);
                        }
                        if(data.page != 1 ){
                            Ajax.render(options.renderEle, options.renderFor, data, undefined, false);
                        }else{
                            Ajax.render(options.renderEle, options.renderFor, data, undefined, true);
                        }
                        if (afterCallback) {
                            $.isFunction(afterCallback) && afterCallback();
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

        window.onscroll = function() {
            if(options.hasNext){
                var scrollTop = document.body.scrollTop;
                var scrollHeight = document.body.scrollHeight;
                var windowHeight = window.screen.height * window.devicePixelRatio;
                if (scrollTop + windowHeight + 100 > scrollHeight) {　　　
                    $('#laypage_0 a').click();
                }
            }
        }
	};
});