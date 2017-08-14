define("app/myCollection", function(require, exports, module) {
    var pagelist = require('../mod/pagelist');
	var confirmTip = require('../plugs/confirmTip.js');
    var km = require('../plugs/version');
    var lower = km.less('1.4.0');
    pagelist.fun({ 
        url: 'api/v1/collectArticles',
        data:{page: 1, page_size: 20}
    },function(d){
        var data = d.data;
        var w_ = parseInt($('#conList').width() * .3).toFixed(2);
        for (var i = 0; i < data.length; i++) {
            if(data[i].layout==3){
                d.data[i].imgWidth = w_+'px';
                d.data[i].imgBoxHeight = (w_*74/113).toFixed(2)+'px';
            }
            if(data[i].obj_type==2){
                d.data[i].jsLink = 'kmb://recommend?url='+ data[i].url + '&id=' +  data[i].article_id;
            }
            function tipUpdata(){
                Tools.alertDialog({
                    title:'请更新到最新版本',
                    text:'只有1.4.0版本以上才能查看采集的文章'
                })
            }
            if(data[i].obj_type==3){
                if(lower){
                    d.data[i].jsLink = "javascript:Tools.alertDialog({title:'请更新至最新版本',text:'1.4.0版本以上才能查看采集文章'})";
                }else{
                    if(data[i].type!=1&&km.less('1.4.4')){
                        d.data[i].jsLink = "javascript:Tools.alertDialog({title:'版本更新提示',text:'1.4.4版本及以上才能查看采集的图片和资源'})";
                    }else{
                        switch(data[i].type){
                            case 1:
                                d.data[i].jsLink = 'kmb://worthreading?id=' + data[i].article_id;
                                break;
                            case 2:
                                d.data[i].jsLink = 'kmb://worthreadingimg?id=' + data[i].article_id;
                                break;
                            case 3:
                                d.data[i].jsLink = 'kmb://worthreadingresource?id=' + data[i].article_id;
                                break;
                        }
                    }
                }
            }
            if(data[i].obj_type ==3 && data[i].type==2 && /.gif/.test(data[i].images[0]) ){
                var gif = data[i].images[0];
                d.data[i].images[0] = gif.replace(/.gif/g , '.png');
                d.data[i].isGif = true;
            }
        };
    },function(){
        $('.gif').die().on('click', function(){
            var img = $(this).next();
            var src = img.attr('src');
            img.attr('src', src.replace(/.png/g, '.gif'));
            $(this).remove();
            return false;
        })
    });
    $('#conList').on('click', '.del', function(e){
        e.preventDefault();
        e.stopPropagation();
        var that = $(this), id = that.data('id'), obj_type = that.attr('data-objType');
        new confirmTip({
            title: '<p style="padding: .2rem 0;">确定不再收藏这篇文章</p>'
        },function(a){
            if(a){
                Ajax.custom({
                    url:'api/v1/collectArticles/delete/'+ id,
                    data:{
                        objType: obj_type
                    }
                },function(d){
                    if(d.status == 1000){
                        Tools.alertDialog({
                            text: "已取消收藏"
                        });
                        that.parent().remove();
                    }
                    if(d.status == 8006){
                        Tools.alertDialog({
                            text: "文章尚未被收藏"
                        })
                    }
                });
            }
        });
    })
})