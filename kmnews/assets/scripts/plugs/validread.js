define(function(require,exports,module){
    var Ajax = require('../mod/base');
    var oo = function(a_id, idx, seconds){
        var _this = this;
        this.open = false;
        this.listH = false;
        this.isTime = false;
        this.hasRecord = false;
        this.idx = idx;
        this.rid = $('#rec_'+idx).data('id');
        this._ajax = function(){
            if(_this.open && _this.listH && _this.isTime && !_this.hasRecord){
                _this.hasRecord = true;
                Ajax.custom({
                    url: 'api/v1/article/view',
                    data: {
                        articleId: a_id,
                        rid: _this.rid
                    }
                }, function(data){
                    if(data.status == 1000){
                        if(data.data.coin_num!=0){
                            Tools.alertDialog({
                                text: '获得'+ data.data.coin_num +'金币',
                                img:'image/coin.png',
                                time: 1800
                            });
                        }
                        _this.hasRecord = true;
                        var iframe = document.createElement('iframe');
                        iframe.src = 'kmb://refreshgold';
                        iframe.style.display = 'none';
                        $('body').append(iframe);
                        $(iframe).remove();
                    }else _this.hasRecord = false;
                });
            }
        };
        /****计时****/
        setTimeout(function(){
            _this.isTime = true;_this._ajax();
        }, seconds*1000);
        /****距离****/
        $(window).scroll(function(){
            var elTop = $('#rec_'+_this.idx).offset().top - innerHeight;
            var scrollt = document.documentElement.scrollTop || document.body.scrollTop;
            if(elTop < scrollt){
                _this.listH = true;_this._ajax();
            }
        });
        /****开始****/
        if($('#videoplayer').length > 0){
            $('#videoplayer')[0].addEventListener("play", function(){
                _this.open = true;_this._ajax();
            });
        }else{
            $('#unfold').on('click', function(){
                _this.open = true;_this._ajax();
            });
        }
    };
    module.exports = oo;
});