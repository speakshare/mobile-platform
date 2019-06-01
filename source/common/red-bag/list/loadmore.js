module.exports = function (options) { 
	var defaultSetting = { 
		loading: '.loading', 
		padding: 200, 
		url: '', 
		type:'get',
		loadFirstPage: false, 
		hasMore:true,
		data: { 
			page: 1, 
			count: 10 
		},
		success: function () { 
		}, 
		error: null 
	}, 
	opt = $.extend(true, defaultSetting, options), 
	windowHeight = $(window).height(), 
	loading = false, 
	uniqID = $.uniqID(), 
	curPage = opt.data.page; 
	function loadData() { 
		opt.data.page = curPage; 
		var data = { 
			url: opt.url, 
			type: opt.type, 
			contentBox: '', 
			data: opt.data, 
			success: function (d) { 
				var hasMore = true; 
				if (!d || (d.list && (d.list.length< opt.data.count))) {
					$(window).off('scroll.' + uniqID); 
					hasMore = false; 
					opt.hasMore = false;
				} 
				curPage += 1; 
				loading = false; 
				opt.success(d, hasMore); 
			}, 
			error: function (d) { 
				opt.error && opt.error(d); 
				$(window).off('scroll.' + uniqID); 
			}, 
			loading: opt.loading 
		}; 
		$.sync(data); 
	} 
	if (opt.loadFirstPage) { 
		loading = true; 
		loadData(); 
	} 
	$(window).on('scroll.' + uniqID, function () { 
		var offset = document.body.scrollTop; 
		if (offset + windowHeight + opt.padding > fresh.$content.height() && !loading) { 
			loading = true; 
			if(opt.hasMore){
				loadData(); 
			}
		} 
	}); 
	return { 
		destory: function () { 
			$(window).off('scroll.' + uniqID); 
		} 
	}; 
} 