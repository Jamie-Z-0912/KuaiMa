define('app/hotSearch', function(require, exports, module) {
    var Ajax = require('../mod/base');
    var km = require('../plugs/version');
    Ajax.custom({
    	url:'api/v1/search/task'
    },function(d){
    	var data = d.data, cur_num = data.todaySearchKeywordNum;
        var arr = [];
    	$.each(data.isReceiveRewardFlags,function(k,v){
    		var d = {};
            d.key = k;
            d.isover = v;
            d.cur_num = cur_num;
            d.width = cur_num>k ? '100%': cur_num/k*100+'%';
            d.coin = 80 + (k-10)*2;
            d.isok = cur_num > k-1 && !v;
            arr.push(d);
    	})
        Ajax.render('#schedule', '#schedule-tmpl', arr, undefined, true);
        var keywords = [];
        for (var i = 0; i < data.searchHotKeywords.length; i++) {
            keywords.push('<div class="keyword">'+ data.searchHotKeywords[i] +'</div>');
        };
        $('#keywords').html(keywords.join(''));
    });

    if(km.less('1.3.2')){
        $('#upgradeTip').removeClass('hide');
        Tools.alertDialog({
            text:"本活动仅在1.3.2版本才有效<br/>快快更新升级吧~",
            time:'9999999'
        });
    }else{
        $('#upgradeTip').remove();
    }
    function tips(txt){
        var arr = [];
        arr.push('<div class="ui-popup-screen km-dialog">');
        arr.push('<a href="kmb://search?keyword='+encodeURIComponent(txt)+'" class="iconfont icon-close"></a>');
        arr.push('<div class="hot-tips">');
            arr.push('<div class="text">点选搜索结果，阅读一段时间<span>才算完成任务</span></div>');
            arr.push('<img src="image/hotSearch_tip.png" />');
            arr.push('<a href="kmb://search?keyword='+encodeURIComponent(txt)+'" class="btn">去点击</a>');
        arr.push('</div></div>');
        $('body').append(arr.join(''));
    }
    $('#keywords').on('click', '.keyword', function(){
        var txt = $(this).text();
        tips(txt);
    });
    $('#schedule').on('click', '.btn', function(){
        var that = $(this);
        if(that.hasClass('ok')){
            var goal = that.data('goal');
            Ajax.custom({
                url: 'api/v1/searchReward/receive',
                data: {
                    searchKeywordNum:goal
                }
            },function(d){
                switch(d.status){
                    case 1000:
                        Tools.alertDialog({
                            text: '奖励领取成功'
                        });
                        that.removeClass('ok').text('已经领取');
                        break;
                    case 9400:
                        Tools.alertDialog({
                            text: '搜索任务奖励已领取'
                        });
                        that.removeClass('ok').text('已经领取');
                        break;
                    case 9401:
                        Tools.alertDialog({
                            text: '您还未达到搜索次数'
                        });
                        break;
                    case 1007:
                        Tools.alertDialog({
                            text: '服务器异常，请退出稍后再试'
                        });
                        break;
                }
            })
        }
    })
})