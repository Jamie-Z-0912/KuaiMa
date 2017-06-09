define('app/mygather', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
	var km = require('../plugs/version');
	
	$('#nav').on('click', 'li', function(){
		var id = $(this).data('id');
		$(this).addClass('active').siblings().removeClass('active');
		$('#'+id).show().siblings('.main-list').hide();
	});
	//金币汇总
	Ajax.custom({
		url: 'api/v1/post/day_coin'
	}, function(data){
		if(data.status==1000){
			var d = data.data;
			$('#yesEarnings').text(d.yesterdayCoin)
			$('#todEarnings').text(d.todayCoin)
		}
		if(data.status == 9702){
            Tools.alertDialog({
                text: "抱歉您没有采集权限"
            });
		}
	});

	//已上线
	pagelist.fun({
		url: 'api/v1/post/personally',
		renderFor: '#onlineList-tmpl',
        renderEle: '#onlineList',
		pagingDom: '#onlinePage',
		data:{ 
			status: 2, page: 1, page_size: 20
		}
	},function(d){
		var data = d.data;
        var w_ = parseInt($('#onlineList').width() * .3).toFixed(2);
		for (var i = 0; i < data.length; i++) {
			if(data[i].layout==3){
				d.data[i].imgWidth = w_+'px';
				d.data[i].imgBoxHeight = (w_*74/113).toFixed(2)+'px';
			}
		};
		$('#onlineNum').text(d.total_num).parent().show();
    });
	//已下架
	pagelist.fun({
		url: 'api/v1/post/personally',
		renderFor: '#shelvedList-tmpl',
        renderEle: '#shelvedList',
		pagingDom: '#shelvedPage',
		data:{ 
			status: 3, page: 1, page_size: 20
		}
	},function(d){
		var data = d.data;
        var w_ = parseInt($('#onlineList').width() * .3).toFixed(2);
		for (var i = 0; i < data.length; i++) {
			if(data[i].layout==3){
				d.data[i].imgWidth = w_+'px';
				d.data[i].imgBoxHeight = (w_*74/113).toFixed(2)+'px';
			}
			d.data[i].pub_time = Ajax.formatDate(data[i].pub_time);
		};
		$('#shelvedNum').text(d.total_num).parent().show();
    });
	//发布中
	pagelist.fun({
		url: 'api/v1/post/personally',
		renderFor: '#annList-tmpl',
        renderEle: '#annList',
		pagingDom: '#annPage',
		data:{ 
			status: 1, page: 1, page_size: 20
		}
	},function(d){
		$('#annNum').text(d.total_num).parent().show();
	});

	$('#onlineList').on('click', 'li', function(){
		var id = $(this).data('id');
		window.location = 'kmb://worthreading?id='+id;
	})
});