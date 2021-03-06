'use strict';

var HuiCalendar= function(element, options){
    this.options = $.extend({}, HuiCalendar.defaults, options );
	this.element = element;
	this.currentDate = this.options.defaultDate;
	this.render();
};

HuiCalendar.prototype = {
	initialRender: function(){
		this.element.addClass('hui-calendar ' + this.options.haha);
	},
	render: function(event){
		var self = this,
			events = this.options.events;

		self.initialRender();
		self.setSize();
		self._getRange(this.currentDate, function(){
			self._renderTool();
			self._renderWidget();
		});
		events && self.renderEvents(events);
		
		self.options.selected && self.initEvent();
	},
	_renderTool: function(){
		var self = this,
			ele = self.element,
			groupEl = $('<div class="hui-toolbar">'),
			groupChildren = $(),
			prevButton = null,
			nextButton = null,
			title = null,
			eleList = {};

		self.options.switcher && (eleList.prevButton = $(
			'<a href="javascript:;" class="hui-prev-btn">'
		    + '<i class="icon-prev"></i>'
			+ '</a>'
		)
		.click(function(){
			self.changeView('prev');
		}));

		eleList.title = $('<h2 class="hui-time-range"></h2>');

		self.options.switcher && (eleList.nextButton = $(
			'<a href="javascript:;" class="hui-next-btn">'
		    + '<i class="icon-next"></i>'
			+ '</a>'
		)
		.click(function(){
			self.changeView('next');
		}));

		for (var eleItem in eleList) {
			groupChildren = groupChildren.add(eleList[eleItem]);
		};

		groupEl.append(groupChildren);
		groupEl.appendTo(ele);
		self._renderTitle();
	},
	_renderHeader: function(){
		var $container = $(".hui-view-header"),
			headerChildren = $(),
			gridHeader = null,
			headerTr = $('<tr class="hui-widget-header">');

		headerTr.append($('<th class="hui-axis">'));
		for (var i = 0; i < 7; i++) {
			    var week = moment(this.options.todayDate).format('YYYY-MM-DD') == this.dateInfo.yearList[i] ?
						    '<span class="today">' + this.options.todayText + '</span>' : this.dateInfo.week[i];

			gridHeader = $('<th class="hui-day-header">'+this.options.weekdays[i]+'<br>'+week+'</th>');
			gridHeader.attr("data-date", this.dateInfo.yearList[i]);
			headerTr = headerTr.append(gridHeader);
		};
		headerTr.append($('<th class="hui-scroll">'));

		headerChildren = headerChildren.add($('<table>')).append(headerTr);
		headerChildren.appendTo($container);
	},	
	_renderTimeGrid: function(){
		var $container = $(".hui-view-body"),
			bodyChildren = $('<table class="hui-time-grid">'),
			gridBody = null,
			bodyTr = null;

			$(this).html(start +' - '+ end);
		for (var i = 0; i < 48; i++) {
		    var time = '',
		        gridClass = i % 2 !== 0 ? '' : 'oddTD';

		    if (i % 2 !== 0) {
		        time = (i - 1) / 2 < 10 ? '0' + (i - 1) / 2 + ':30' : (i - 1) / 2 + ':30';
		    } else {
		        time = i / 2 < 10 ? '0' + i / 2 + ':00' : i / 2 + ':00';
		    }


			bodyTr = $('<tr class="hui-time-grid '+gridClass+'">').append('<td class="hui-axis">'+time+'</td>');
			bodyTr.attr("data-time", time);

			for (var j = 0; j < 7; j++) {
				var year = this.dateInfo.yearList[j],
					date = moment(year + ' ' + time).format('YYYY-MM-DDTHH:mm'),
					start = moment(date).format("HH:mm"),
					end = moment(date).add(30,"m").format("HH:mm"),
					timeRange = start +' - '+ end;

				gridBody = $('<td class="hui-time ' + year + '" id="' + year + i + '" data-date="'+ date +'">' + timeRange +'</div>');

				bodyTr = bodyTr.append(gridBody);
			};
			bodyChildren = bodyChildren.append(bodyTr);
		};

		$(".hui-view-body .hui-time-grid").remove();
		bodyChildren.appendTo($container);
	},
	_renderWidget: function(){
		var ele = this.element,
			groupEl = $('<div class="hui-view-container"><div class="hui-view-header"></div><div class="hui-view-body"></div></div>');

		groupEl.appendTo(ele);
		this._renderHeader();
		this._renderTimeGrid();
		$(".hui-view-body").scrollTop(400);
		$(".hui-view-body").css({'height':this.options.contentHeight - $(".hui-toolbar").outerHeight() - $(".hui-view-header").height()});
		this._trigger('afterRender');
	},
	_getRange: function(date, callback){
		var dayStart = moment(date).weekday(1),
			ym = dayStart.format('YYYY/MM/'),
            //ym = dayStart.format('YYYY年MM月'),
			dayEnd = moment(date).weekday(7),
			weekList = [],
			yearList = [];

		for (var i = 0; i < 7; i++) {
			weekList.push(moment(date).weekday(i+1).format("MM-DD"));
			yearList.push(moment(date).weekday(i+1).format("YYYY-MM-DD"));
		};

		dayEnd = dayEnd.format('MM/DD');//MM月DD
		dayStart = dayStart.format('DD');

		this.dateInfo = {
			ym: ym,
			yearList: yearList,
			week: weekList,
			start: dayStart,
			startFormat: moment(date).weekday(1).format('YYYY-MM-DD'),
			end: dayEnd,
			endFormat: moment(date).weekday(7).format('YYYY-MM-DD')
		};

		callback && callback();
	},
	_renderTitle: function(){
		var $rangeDom = $(".hui-time-range");

		$rangeDom.html(this.dateInfo.ym + this.dateInfo.start + ' - ' + this.dateInfo.end +' ');//日
	},
	_changeGrid: function() {
	    var self = this,
	        date = self.dateInfo;
	       
		$(".hui-widget-header .hui-day-header").each(function (i, gridItem) {
		    var week = moment(self.options.todayDate).format('YYYY-MM-DD') == date.yearList[i] ?
                        '<span class="today">' + self.options.todayText + '</span>' : date.week[i];

			$(gridItem).attr("data-date", date.yearList[i]);
			$(gridItem).html(self.options.weekdays[i] + '<br/>' + date.week[i]);
		});
	},
	infoBoxHtml: function(content){
		return '<div class="fc-unthemed fc-popover-box"><i class="fc-popover-arrow"></i>' 
	        + '   <div class="fc-popover">'
	        + '        <span class="fc-close fc-icon fc-icon-x"></span>'
	        + '        <div class="fc-body fc-widget-content">'
	        + '            <div class="fc-event-container clearfix">'+ content+ '</div>'
	        + '        </div>'
	        + '   </div>'
	        + '</div>';
	},
	openInfoBox: function(obj, content) {
        var self = this,
        	left = 0,
            top = 0,
            isLeft = true,
            objLeft = obj.offset().left - self.element.offset().left;

	        $('.fc-popover-box').remove();
	        self.element.append(self.infoBoxHtml(content));

	        var $fcPopover = $('.fc-popover-box');
	        top = obj.offset().top - self.element.offset().top - ($fcPopover.outerHeight() - obj.outerHeight()) / 2;
	        isLeft = objLeft < self.element.width() / 2;
	        left = isLeft ? objLeft + obj.outerWidth() : objLeft - $fcPopover.outerWidth();
	        !isLeft && $fcPopover.addClass("ly-right");
	        $fcPopover.css({
	            "top": top,
	            "left": left
	        }).show();
    },
    closeInfoBox: function(obj){
    	var obj = typeof obj === 'undefined'  ? $('.fc-popover-box') : obj.parents(".fc-popover-box");

        obj.remove();
    },
	renderEvents: function(events){
		var self = this;

		events && $.each(events, function(i, eventItem){
			var eventItem = self._roundTime(eventItem),
				startDate = moment(eventItem.start).format('YYYY-MM-DD'),
				endDate = moment(eventItem.end).format('YYYY-MM-DD'),
				length = moment(endDate).diff(moment(startDate), 'days');

			for (var i = 0; i < length + 1; i++) {
				var day = moment(startDate).add(i, 'days'),
					timeList = $("." + moment(day).format('YYYY-MM-DD'));

				for (var j = 0; j < timeList.length; j++) {
					var date = $(timeList[j]).attr("data-date");

					if(date === moment(eventItem.start).format('YYYY-MM-DDTHH:mm') 
					|| (moment(date).isAfter(eventItem.start) && moment(date).isBefore(eventItem.end))){
						self._trigger('eventsRender', eventItem, $(timeList[j]));
					}
				};
			};
		});	
	},
	_roundTime: function(eventItem){
		var startM = parseInt(moment(eventItem.start).format('mm'));

		startM >= 0 && startM < 30 && (startM = '00');
		startM > 30 && (startM = '30');
		eventItem.start = moment(eventItem.start).format('YYYY-MM-DDTHH:' + startM);

		return eventItem;
	},
	getResult: function(){
		var result = [];

		$(".hui-time.selected").each(function(){
			var $this = $(this),
				time = $this.parent(".hui-time-grid").attr("data-time"),
				date = $(".hui-widget-header .hui-day-header:eq("+ ($this.index() -1) +")").attr("data-date");

			result.push(date + ' ' + time);
		});
		return result;
	},
	refresh: function(date){
		var self = this;

		self.currentDate = date;
		self._getRange(self.currentDate, function(){
			self._renderTitle();
			self._changeGrid();
		});
		$(".hui-view-body").scrollTop(400);
		self.removeEvents();
		self.option.events && self.renderEvents();
	},
    getCalendarTime: function() {
        return {
            start: this.dateInfo.startFormat,
            end: this.dateInfo.endFormat
        }
    },
	changeView: function(str){
		var self = this,
			range = null,
			num = str === 'prev' ? -7 : 7;

		self.currentDate = moment(self.currentDate).add(num, 'day');
		self._getRange(self.currentDate, function(){
			self._renderTitle();
			self._changeGrid();
			self._renderTimeGrid();
		});
		$(".hui-view-body").scrollTop(400);
	    self.closeInfoBox();
		self._trigger('afterChange', self.currentDate);
	},
	initEvent: function(){
		var self = this;

		$(document).delegate('.hui-time', 'click', function(){
			self._trigger('eventClick', $(this));
		});

		$(document).delegate('.hui-time-grid', 'mousedown', function(e){
			if($(e.target).hasClass("hui-axis")){
				return;
			}

			self.options.eventMousemove && $(document).delegate('.hui-time-grid', 'mousemove', self.options.eventMousemove);
		});

		$(document).delegate('.hui-time-grid', 'mouseup', function(e){
			self.options.eventMousemove && $(document).undelegate('.hui-time-grid', 'mousemove', self.options.eventMousemove);
		});

		$(document).delegate(".fc-popover-box .fc-close", "click", function () {
            self.closeInfoBox($(this));
        });
	},
	removeEvents: function(){
		$('.hui-time').removeClass("selected").removeClass("leaved");
	},
	setSize: function(){
		var options = this.options,
			ele = this.element;

		ele.css({'height': options.contentHeight});
		ele.css({'width': options.contentWidth});
	},
	_trigger: function(name) {
		if (this.options[name]) {
			this.options[name].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	},
	destroy: function(argument) {
		$(this.element).find(".hui-toolbar").remove();
		$(this.element).find(".hui-view-container").remove();
		$(document).undelegate('.hui-time', 'click');
		$(document).undelegate('.hui-time-grid', 'mousedown');
		$(document).undelegate('.hui-time-grid', 'mousemove');
		$(document).undelegate('.hui-time-grid', 'mouseup');
	}
};

HuiCalendar.defaults = {
	defaultDate: '2015-05-10',
	    todayDate: '2015-08-06',
	contentHeight: 520,
	contentWidth: 800,
	switcher: true, //左右切换按钮开关
	selected: false, //选时间区块开关
	events: [], // 设置需要显示区块数据列表
	weekdays: '周一_周二_周三_周四_周五_周六_周日'.split('_'),
    todayText: '今天',
	afterRender: null,
	afterChange: null,
	eventClick: null,
	eventMousemove: null
};

$.fn.huiCalendar = function(options){
	var args = Array.prototype.slice.call(arguments, 1); 
	var res = this; 

	this.each(function(i, _element) { 
		var element = $(_element);
		var calendar = element.data('huiCalendar');
		var singleRes; 

		if (typeof options === 'string') {
			if (calendar && $.isFunction(calendar[options])) {
				singleRes = calendar[options].apply(calendar, args);
				if (!i) {
					res = singleRes; 
				}
				if (options === 'destroy') { 
					element.removeData('huiCalendar');
				}
			}
		}

		else if (!calendar) {
			calendar = new HuiCalendar(element, options);
			element.data('huiCalendar', calendar);
		}
	});
	
	return res;
};