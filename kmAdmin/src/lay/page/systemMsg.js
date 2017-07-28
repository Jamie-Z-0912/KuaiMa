layui.define(['global', 'form', 'laydate', 'upload'], function(exports){
	var $ = layui.jquery, 
		layer = layui.layer ,
		form = layui.form(), 
		laydate = layui.laydate;
    $('#side').load('../include/side.html', function(a,b){
    	$('#1_6').addClass('layui-this');
    	layui.use('element', function(){
	  		var element = layui.element();
		});
    });
    $('#siteTop').load('../include/top.html', function(a,b){
        $('#cur').text('系统通知');
    });
    /* 增加和操作处的点击 s */
    var operation = {
    	add: function() {
    		$('#updateBtn').remove();
			layer.open({
				title:'新增系统通知',
				type: 1,
				skin: 'layui-layer-rim', 
				area: ['480px', '600px'], 
				content: $('#formPane'),
				cancel: function(){ 
					$('#reset').click()
				}
			});
    	},
    	edit: function() {
    		$('#addBtn').remove();
			layer.open({
				title:'修改系统通知',
				type: 1,
				skin: 'layui-layer-rim', 
				area: ['480px', '600px'], 
				content: $('#formPane'),
				cancel: function(){ 
					$('#reset').click()
				}
			});
    	},
    	del: function() {
    		console.log('删除')
    	},
    	send: function() {
    		console.log('发送')
    	}
    }
	$('.js-operation').on('click', function(){
	    var type = $(this).data('type');
	    operation[type].call(this);
	});
	/* 增加和操作处的点击 e */


	//监听提交
	form.on('submit(check)', function(data){
	    console.log(data)
	    return false;
	});
	form.on('submit(add)', function(data){
	    console.log(data)
	    return false;
	});
	form.on('submit(update)', function(data){
	    console.log(data)
	    return false;
	});
		
	exports('systemMsg', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    