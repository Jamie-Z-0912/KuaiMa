layui.define(['global', 'form', 'laypage', 'laydate'], function(exports){
	var $ = layui.jquery, 
		layer = layui.layer, 
        form = layui.form();

	
    //事件监听
    form.on('select', function(data){
        console.log(data);
    });
    form.on('select(province)', function(data){
        console.log(data.elem); //得到select原始DOM对象
        console.log(data.value); //得到被选中的值
        console.log(data.othis); //得到美化后的DOM对象
    });
	
    //监听提交
    form.on('submit(fetchOne)', function(data){
        console.log('fetchOne:'+data)
        return false;
    });
    form.on('submit(fetchList)', function(data){
        console.log('fetchList:'+data)
        return false;
    });
    
	exports('articleFetch', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    