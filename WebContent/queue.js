$(function() {
	initPlayerlist();

	initData();

	$('#passBtn').click(doPass);

	initEvent();
});

function initEvent() {
	$('.repeat-status').click(function(evt) {
		if ($(this).hasClass('checked')) {
			$(this).removeClass('checked');
			repeatStatus = false;
		} else {
			$(this).addClass('checked');
			repeatStatus = true;
		}
	});

	function getSelectionText(e) {
		var text = '';
		if (window.getSelection) {
			text = window.getSelection().toString();
		} else if (document.selection && document.selection.type != "Control") {
			text = document.selection.createRange().text;
		}
		text = text.trim();
		if (text != '') {
			translate(encodeURI(text), e.pageX - 180, e.pageY + 5 + $('#word-content').scrollTop());
		} else {
			$('#translate-panel').hide();
		}
	}

	function singleClick(e) {
		getSelectionText(e);
	}

	function doubleClick(e) {
		// do something, "this" will be the DOM element
		getSelectionText(e);
	}

	$('#word-content').click(function(e) {
		var that = this;
		setTimeout(function() {
			var dblclick = parseInt($(that).data('double'), 10);
			if (dblclick > 0) {
				$(that).data('double', dblclick - 1);
			} else {
				singleClick.call(that, e);
			}
		}, 300);
	}).dblclick(function(e) {
		$(this).data('double', 2);
		doubleClick.call(this, e);
	});
}

function doPass() {
	$.ajax({
		type : "GET",
		url : root + '/api?t=pass',
		data : {
			"wordid" : currentWordId
		},
		error : function() {
			console.error("query failed");
		},
		success : function(data) {
			console.log(data);
		}
	});
}

function translate(word, x, y) {
	$.ajax({
		type : "GET",
		url : root + '/gwtw?t=translate',
		data : {
			"word" : word
		},
		error : function() {
			console.error("query failed");
		},
		success : function(data) {
			$('#translate-panel').empty().html(data).show();
		}
	});
}

var currentWordId = null;
function initData() {
	$.ajax({
		type : "GET",
		url : root + '/api?t=list3',
		async : false,
		error : function() {
			console.error("query failed");
		},
		success : function(data) {
			$('#word-title, #pron, #meaning, #audio-example').empty();

			$(data).each(
				function(i, item) {
					var _url = root + '/api?t=m&id=' + item.sentenceid + "&ts=" + new Date().getTime();
					$sentence = $('<div class="aexample"><div>' + item.booktype
						+ '</div><div class="book-name" bookid="' + item.bookid + '">' + item.bookname
						+ '</div><div style="color: blue;">' + item.coursename
						+ '</div><div class="audio-item" data-src="' + _url + '"><span>' + (i + 1)
						+ '</span>&nbsp;&nbsp;' + sentenceRender(item.word, item.sentence) + '<div>'
						+ item.chinese + '</div></div>');

					$('#audio-example').append($sentence);
				});
			function sentenceRender(word, sentence) {
				var startIndex = sentence.toLowerCase().indexOf(word);
				var endIndex = startIndex + word.length;
				var result = sentence.substr(0, startIndex) + '<span style="color: red; font-weight: bold;">'
					+ sentence.substr(startIndex, word.length) + '</span>' + sentence.substr(endIndex);
				return result;
			}

			$('.book-name').click(function(evt) {
				var bookid = $(this).attr('bookid');
				var url = root + '/book.jsp?id=' + bookid;
				window.open(url);
			});
			resetPlayer();
		}
	});
}
{
	var word = 'abrupt';
	var sentence = "Mrs Merkel's abrupt abandonment of nuclear power has also brought the two parties' environmental policies closer.";
	var startIndex = sentence.indexOf(word);
	var endIndex = startIndex + word.length;
	var result = sentence.substr(0, startIndex) + '<span>' + sentence.substr(startIndex, word.length) + '</span>'
		+ sentence.substr(endIndex);
	console.log(startIndex, result);
	console.log(sentence);
}

var audioInstance = null;
var repeatStatus = false;
function initPlayerlist() {
	// Setup the player to autoplay the next track
	audioInstance = audiojs.create(document.getElementById('audio-player'), {
		trackEnded : function() {
			var next = $('.audio-item.playing');
			if (!repeatStatus) {
				next = $('.audio-item.playing').parent().next().find('.audio-item');
			}
			if (!next.length)
				next = $('.audio-item').first();
			loadAudio($(next));
		}
	});

	// Load in the first track
	resetPlayer();

	// Keyboard shortcuts
	$(document).keydown(function(e) {
		var unicode = e.charCode ? e.charCode : e.keyCode;
		// right arrow
		if (unicode == 39) {
			var next = $('.audio-item.playing').parent().next().find('.audio-item');
			if (!next.length)
				next = $('.audio-item').first();
			next.click();
			// back arrow
		} else if (unicode == 37) {
			var prev = $('.audio-item.playing').parent().prev().find('.audio-item');
			if (!prev.length)
				prev = $('.audio-item').last();
			prev.click();
			// spacebar
		} else if (unicode == 32) {
			e.preventDefault();

			audioInstance.playPause();
		}
	});
}

function loadAudio($target) {
	audioInstance.load($target.attr('data-src'));
	$('#audio-text').html($target.html());
	$target.addClass('playing');
	$('.audio-item').not($target).removeClass('playing');
	audioInstance.play();
}

function resetPlayer() {
	var first = $('.audio-item').attr('data-src');
	console.log(first);
	if (first != undefined) {
		loadAudio($('.audio-item').eq(0));

		// Load in a track on click
		$('.audio-item').click(function(e) {
			e.preventDefault();

			// loadAudio($(this));

			var that = this;
			setTimeout(function() {
				var dblclick = parseInt($(that).data('double'), 10);
				if (dblclick > 0) {
					$(that).data('double', dblclick - 1);
				} else {
					loadAudio($(that));
				}
			}, 300);
		}).dblclick(function(evt) {
			$(this).data('double', 2);
			console.log('sd')
		});
	}
}