define('app/myBrowsingHistory', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
    var km = require('../plugs/version');
    var lower = km.less('1.4.0');
    pagelist.fun({ 
        url: 'api/v1/readArticles',
        data:{page: 1, page_size: 20}
    },null,function(){
        var w_ = $('.view_3 .imgbox').width() * .3;
        $('.view_3 .imgbox').height(w_*74/113);
        $('.view_3 .imgbox').each(function(){
            var that = $(this);
            if(that.find('img').length<1){
                that.height(0)
            }
        });
    });
    $('#conList').on('click', 'li', function(){
        var url = $(this).data('url'),
            id = $(this).data('id'),
            type = $(this).data('type');
        if(type=='2'){
            window.location.href = 'kmb://recommend?url=' + url + '&id=' + id;
        }
        if(type=='3'){
            if(lower){
                Tools.alertDialog({title:'请更新至最新版本',text:'1.4.0版本以上才能查看采集文章'})
            }else{
                window.location = 'kmb://worthreading?id='+id;
            }
        }
    })
})