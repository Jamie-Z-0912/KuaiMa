define('app/mytask', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
	var curD = new Date().getDate();
	Ajax.custom({
		url: 'api/v1/orders/socialShare/today'
	}, function(data){
		var todayArray = data.data.today_tasks;
		console.log(todayArray)
		$.each(todayArray, function(){
			this.added_time = '今天 ' + Ajax.formatDate(this.added_time, 'hh:mm');
		})
		var d = {data: todayArray};
		Ajax.render('#todayTaskList', '#conList-tmpl', d);
		if(todayArray.length == 0){
			$('#todayTaskList').html('<li class="empty"><p>您今日还未做任务，做任务越多得金币越多</p> <div class="ui-btn">去赚钱</div> </li>')
		}
		var share_num = data.data.today_total_share_num || 20;
		$('#residue').text('剩余'+ data.data.today_left_share_num +'个');
		$('#total').text(share_num);
	});
	
    pagelist.fun({
		url: 'api/v1/orders/socialShare/previous',
		data:{
			page: 1,
			page_size: 10
		}
	});

	$('.mytask-list').on('click', 'li', function(){
		if($(this).hasClass('empty')){
			window.location = 'kmb://makemoney';
		}else if($(this).hasClass('over-task')){
			Tools.alertDialog({
				text: '该任务已结束<br>去看看其他任务吧~'
			})
		}else{
			var t_id = $(this).attr('data-id');
			window.location = 'kmb://taskdetail?param={"taskid":'+ t_id +'}';
		}
	});
});