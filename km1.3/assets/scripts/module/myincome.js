define(function(require, exports, module) {
	var pagelist = require('../libs/pagelist');
	var km = require('../plugs/version');

	if(Tools.auth_token() == 'null'){
    	var opt = { title: "提醒", text: "请在快马浏览器中登录再访问！", time: 5000};
    	Tools.alertDialog(opt, function(){
    		window.location = 'kmb://alertlogin';
    	});
    	return;
    }

	$('#nav').on('click', 'li', function(){
		var id = $(this).data('id');
		$(this).addClass('active').siblings().removeClass('active');
		$('#'+id).show().siblings('.main-list').hide();
	});
	var p = Tools.getQueryValue('type');
	if(p == 'cash'){
		$('#nav li[data-id="rmbListWrap"]').click();
	}
	$('#wave .w1').addClass('slideOutLeft');
	$('#wave .w2').addClass('slideOutLeft1');
	//金币汇总
	Ajax.custom({
		url: 'api/v1/coin/info'
	}, function(data){
		var d = data.data;
		$('#ERD').text(d.exchange_rate_desc);
		$('#YCI').text(d.yesterday_coin_income)
		$('#YCTR').text(d.yesterday_coin_to_rmb)
	})
	//金币明细
	pagelist.fun({
		url: 'api/v1/coin/list',
		renderFor: '#goldList-tmpl',
        renderEle: '#goldList',
		pagingDom: '#goldPage',
		data:{ 
			page: 1, page_size: 20
		}
	}, function(d){
		if(d.page == 5){
			$('#goldPage').html('<div class="laypage_main"><span>仅可查看最近100条数据</span></div>')
		}
	});
	//零钱收益明细
	pagelist.fun({
		url: 'api/v1/income/list',
		renderFor: '#rmbList-tmpl',
        renderEle: '#rmbList',
		pagingDom: '#rmbPage',
		data:{ 
			page: 1, page_size: 20
		}
	}, function(d){
		for (var i = 0; i < d.data.length; i++) {
			d.data[i].amount = d.data[i].amount < 0 ? ''+d.data[i].amount : '+'+d.data[i].amount;
		};
		if(d.page == 5){
			$('#rmbPage').html('<div class="laypage_main"><span>仅可查看最近100条数据</span></div>')
		}
	});
});