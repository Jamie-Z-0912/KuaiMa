define('app/static_zhuanFa', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
    var km =  require('../plugs/version.js');
    var v = km.version || '1.5.5';
    $('.zhuafa').css('min-height',innerHeight);
    pagelist.fun({ 
        url: 'api/v1/tasks/socialShare',
        data:{
            ver_name: v,
            page: 1, page_size: 20
        }
    }, function(d){
        var data = d.data;
        for (var i = 0; i < data.length; i++) {
            var pre = (data[i].left_count/data[i].total_count).toFixed(4);
            data[i].left_sch = (pre*100).toFixed(2)+'%';
            data[i].sch = ((1-pre)*100).toFixed(2)+'%';
        };
    });
    $('#conList').on('click', 'li', function(){
        var id = $(this).data('id');
        window.location = 'kmb://taskdetail?param={"taskid":'+id+'}';
    });
    $('#moreTask').on('click', function(){
        window.location = 'kmb://mine';
        setTimeout(function(){
            window.location = 'kmb://makemoney';
        },300)
    })
})