define('app/static_adList', function(require, exports, module) {
    var Ajax = require('../mod/base');
    function loadData(date){
        var filename = 'adlist.json', year = new Date().getFullYear();
        if(date) {
            filename = 'data/adlist_'+date+'.json';
        }
        $.ajax({
            url: filename+'?t='+ new Date().getTime(),
            type: 'GET',
            success: function(data){
                var d = typeof data == 'object' ? data : JSON.parse(data);
                var isFirst = false;
                if(date){
                    for (var i = 0; i < d.data.length; i++) {
                        d.data[i].added_time = year + '-' + date;
                    }
                }else{
                    isFirst = true;
                    if(d.showday.length>0){
                        for (var i = 0; i < d.showday.length; i++) {
                            if(d.showday[i]!=''){
                                loadData(d.showday[i]);
                            }
                        };
                    }
                    for (var i = 0; i < d.data.length; i++) {
                        d.data[i].added_time = new Date().toLocaleDateString().replace(/\//g,'-'); 
                    };
                }
                Ajax.render('#conList', '#conList-tmpl',d, undefined, isFirst);
                var w_ = $('.view_3 .imgbox').width() * .3;
                $('.view_3 .imgbox').height(w_*74/113);
            }
        })
    }
    loadData();
    $('#conList').on('click', 'li', function(){
        var txt = $(this).data('keyword'),
            url = 'http://browser.kuaima.cn/tongji/9newsList.html?url=https://wap.sogou.com/web/sl?bid=sogou-mobb-b4892f808f9efbd5&keyword=';
        window.location.href = url+encodeURI(txt);
    })
})