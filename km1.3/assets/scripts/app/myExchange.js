define('app/myExchange', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
    var km = require('../plugs/version');
    var lower = km.less('1.4.0');
    pagelist.fun({ 
        url: 'api/v1/post/myExchange',
        data:{page: 1, page_size: 20}
    },function(d){
        var data = d.data;
        for (var i = 0; i < data.length; i++) {
            if(typeof data[i].post_images !="object" || data[i].post_images.length==0){
                d.data[i].post_layout=5;
            }
        };
    });

    // kmb://worthreadingreport?id={{=value.post_id}}

    //kmb://worthreading?id=

    // $('#conList').on('click', 'li', function(){
    //     var url = $(this).data('url'),
    //         id = $(this).data('id'),
    //         type = $(this).data('type');
    //     if(type=='2'){
    //         window.location.href = 'kmb://recommend?url=' + url + '&id=' + id;
    //     }
    // })
})