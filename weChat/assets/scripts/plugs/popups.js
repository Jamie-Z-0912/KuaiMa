define(function(require,exports,module){
	var popups = function(option,callback){
		var opt = {
			isClose: '',
			className:'',
			title:'',
			topTxt:'',
			img:'',
			botTxt:'',
			sureTxt: '',
			cancelTxt: ''
		};
		this.option = {};
		for(var i in opt){
			this.option[i] = option[i] || opt[i];
		}
		this.id = 'pop_'+new Date().getTime();
		this.init(callback);
	};
	popups.prototype.init = function(callback){
		var that = this, opt = that.option;
		var arr = [];
		arr.push('<div class="pop-screen km-dialog" id="'+ that.id +'">');
		arr.push('<div class="pop-content '+opt.className+'">');
		if(opt.isClose=='yes'){
			arr.push('<div class="pop-close">x</div>');
		}
		opt.title!='' && arr.push('<div class="title">'+ opt.title +'</div>');
		opt.topTxt!='' && arr.push('<div class="top_txt">'+ opt.topTxt +'</div>');
		opt.img!='' && arr.push('<div class="pop-imgbox"><img src="'+ opt.img +'" /></div>');
		opt.botTxt!='' && arr.push('<div class="bot_txt">'+ opt.botTxt +'</div>');
		arr.push('<div class="pop-btn">');
		opt.sureTxt!='' && arr.push('<a class="yes">'+ opt.sureTxt +'</a>');
		opt.cancelTxt!='' && arr.push('<a class="no">'+ opt.cancelTxt +'</a>');
		arr.push('</div></div></div>');
		$('body').append(arr.join(''));


		var divId = '#'+that.id;
		var $con = $(divId+' .pop-content');
		$con.css('margin-top',parseInt((innerHeight-$con.height())/3))
		$(divId+' .pop-close').on('click', function(){
			that.close();
		});
	    $(divId+' .yes').click(function(){
	        $(divId).remove();
	        $.isFunction(callback) && callback(true);
	    });
	    $(divId+' .no').click(function(){
	        $(divId).remove();
	        $.isFunction(callback) && callback(false);
	    });
	};
	popups.prototype.close = function(){
		var $el = $('#'+this.id);
		$el.remove();
	}
    module.exports = popups;
});