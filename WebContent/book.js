$(function() {
	initPlayerlist();

	initData();

	initEvent();

	translate('understand');
});

function initEvent() {
	$('#btn-pass').click(doPass);
	$('#btn-pause').click(function(evt) {
		audioInstance.playPause();
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
			$('#translate-panel').css({
				"right" : -900
			});
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
		e.preventDefault();
	});
}

function doPass(evt) {
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
		url : root + '/api?t=translate',
		data : {
			"word" : word.toLowerCase()
		},
		error : function() {
			console.error("query failed");
		},
		success : function(data) {
			console.log(data);
			if (data.simple_means != undefined) {
				var $template = $(getTemplate());

				var symbols = data.simple_means.symbols[0];
				meansRender($template, symbols);

				$('#translate-panel').empty().append($template).css({
					// "left" : x,
					// "top" : y
					"right" : 0,
					"top" : 0
				});
			}
		}
	});
}

function meansRender($template, symbols) {
	var $pronArr = $template.find('.phonetic-transcription b');
	$pronArr.eq(0).html('[' + symbols.ph_en + ']');
	$pronArr.eq(1).html('[' + symbols.ph_am + ']');

	var $parts = $template.find('.dictionary-comment');
	$parts.empty();
	$(symbols.parts).each(function(i, item) {
		$parts.append(partRender(item));
	});

	function partRender(item) {
		var $p = $('                 <p>                                                                                                     '
				+ '                     <b>'
				+ item.part
				+ '</b>                                                                                          '
				+ '                     <strong class="dict-comment-mean">                                                                  '
				+ '                     </strong>                                                                                           '
				+ '                 </p> ');
		var means = item.means;
		if (means.length > 1) {
			for ( var i = 0; i < means.length - 1; i++) {
				$('strong', $p).append('<span>' + means[i] + '</span>&nbsp;<span class="dict-margin">;</span>&nbsp;');
			}
			$('strong', $p).append('<span>' + means[means.length - 1] + '</span>');
		} else {
			$('strong', $p).append('<span>' + means[0] + '</span>');
		}
		return $p;
	}

}

function getTemplate() {
	return ' <div class="simple-dict">                                                                                               '
			+ '     <div dir="ltr" class="output-bd">                                                                                   '
			+ '         <div class="dictionary-output">                                                                                 '
			+ '             <div class="dictionary-title clearfix">                                                                     '
			+ '                 <h3 class="strong">recover</h3>                                                                         '
			+ '                 <div class="dictionary-spell">                                                                          '
			+ '                     <span class="phonetic-transcription">                                                               '
			+ '                         <span>英</span>                                                                                  '
			+ '                         <b>[rɪˈkʌvə(r)]</b>                                                                             '
			+ '                     </span>                                                                                             '
			+ '                     <span class="phonetic-transcription">                                                               '
			+ '                         <span>美</span>                                                                                  '
			+ '                         <b>[rɪ\'kʌvər]</b>                                                                              '
			+ '                     </span>                                                                                             '
			+ '                 </div>                                                                                                  '
			+ '             </div>                                                                                                      '
			+ '             <div class="dictionary-comment">                                                                            '
			+ '                 <p>                                                                                                     '
			+ '                     <b>vt.</b>                                                                                          '
			+ '                     <strong class="dict-comment-mean">                                                                  '
			+ '                         <span>恢复</span>                                                                                 '
			+ '                         <span class="dict-margin">;</span>                                                              '
			+ '                         <span>找回</span>                                                                                 '
			+ '                         <span class="dict-margin">;</span>                                                              '
			+ '                         <span>重新获得</span>                                                                               '
			+ '                         <span class="dict-margin">;</span>                                                              '
			+ '                         <span>&lt;正&gt;恢复（适当的状态或位置）</span>                                                              '
			+ '                     </strong>                                                                                           '
			+ '                 </p>                                                                                                    '
			+ '                 <p>                                                                                                     '
			+ '                     <b>vi.</b>                                                                                          '
			+ '                     <strong class="dict-comment-mean">                                                                  '
			+ '                         <span>恢复健康（体力、能力等）</span>                                                                       '
			+ '                     </strong>                                                                                           '
			+ '                 </p>                                                                                                    '
			+ '                 <p>                                                                                                     '
			+ '                     <b>n.</b>                                                                                           '
			+ '                     <strong class="dict-comment-mean">                                                                  '
			+ '                         <span>恢复开始时姿势</span>                                                                            '
			+ '                     </strong>                                                                                           '
			+ '                 </p>                                                                                                    '
			+ '             </div>                                                                                                      '
			+ '         </div>                                                                                                          '
			+ '         <div class="dictionary-exchange">                                                                               '
			+ '             <p>                                                                                                         '
			+ '                 <span>第三人称单数：                                                                                           '
			+ '                 <a onclick="_hmt.push([\'_trackPageview\', \'simplemeans\',\'web翻译点击第三人称单数\']);" target="_blank" href="/#en/zh/recovers">recovers</a></span> '
			+ '             </p>                                                                                                        '
			+ '             <p>                                                                                                         '
			+ '                 <span>现在分词：                                                                                             '
			+ '                 <a onclick="_hmt.push([\'_trackPageview\', \'simplemeans\',\'web翻译点击现在进行时\']);" target="_blank" href="/#en/zh/recovering">recovering</a></span> '
			+ '             </p>                                                                                                        '
			+ '             <p>                                                                                                         '
			+ '                 <span>过去式：                                                                                              '
			+ '                 <a onclick="_hmt.push([\'_trackPageview\', \'simplemeans\',\'web翻译点击过去时\']);" target="_blank" href="/#en/zh/recovered">recovered</a></span> '
			+ '             </p>                                                                                                        '
			+ '             <p>                                                                                                         '
			+ '                 <span>过去分词：                                                                                             '
			+ '                 <a onclick="_hmt.push([\'_trackPageview\', \'simplemeans\',\'web翻译点击过去分词\']);" target="_blank" href="/#en/zh/recovered">recovered</a></span> '
			+ '             </p>                                                                                                        '
			+ '         </div>                                                                                                          '
			+ '     </div>                                                                                                              '
			+ ' </div>                                                                                                                  ';
}

function initData() {
	if (type == '') {
		type = 'book';
	}
	$.ajax({
		type : "GET",
		url : root + '/api?t=' + type,
		data : {
			'id' : g_bookid
		},
		async : false,
		error : function() {
			console.error("query failed");
		},
		success : function(data) {
			$('#booktype').html(data.booktype);
			$('#bookname').html(data.bookname);
			// console.log(data);
			$(data.bookLst).each(
					function(i, word) {
						$word = $('<div id="word' + word.wordid + '" class="word-item"><span>' + (i + 1)
								+ '/</span><span>' + word.wordid + '&nbsp;</span>' + word.word + '</div>');
						$word.click(function() {
							// var _url = root + '/word.jsp?id=' +
							// word.wordid;
							// window.open(_url, '_blank');
							showWord(word.wordid);
						});
						$('#word-list').append($word);
					});
			$('.word-item').eq(0).trigger('click');
		}
	});
}

var currentWordId = null;
function showWord(wordId) {
	currentWordId = wordId;
	$.ajax({
		type : "GET",
		url : root + '/api?t=word&id=' + wordId,
		async : false,
		error : function() {
			console.error("query failed");
		},
		success : function(data) {
			$('#word-title, #pron, #meaning, #audio-example').empty();

			console.log(data);
			$('title').html(data.word + "-" + $('#bookname').html());
			$('#word-title').html(data.word);
			$('#pron').html(data.pron);
			var pronUrl = root + '/api?t=p&id=' + data.wordid;
			$('#pron').append('<audio controls src="' + pronUrl + '">sdfd</audio>');
			$('#btn-listen').click(function() {
				window.open(data.oggpath);
			});

			$(data.meaning).each(
					function(i, item) {
						$('#meaning').append(
								'<div class="meaning-type">' + item.type + '</div><div class="meaning-content">'
										+ item.meaning + '</div>');
						$(item.example).each(function(i, item) {
							$('#meaning').append('<div class="example">' + item.sentence + '</div>');
						});
					});

			$(data.aexample).each(
					function(i, item) {
						var _url = root + '/api?t=m&id=' + item.sentenceid + "&ts=" + new Date().getTime();
						$sentence = $('<div class="aexample"><div>' + item.booktype
								+ '</div><div class="book-name" bookid="' + item.bookid + '"><span>' + item.bookname
								+ '</span></div><div style="color: blue;">' + item.coursename + '</div><div><span>'
								+ (i + 1) + '</span>&nbsp;&nbsp;' + sentenceRender(item.sentence)
								+ '</div><div class="audio-item" data-src="' + _url + '"><span>' + item.chinese
								+ '</span></div>');

						// $sentence.append('<audio controls
						// src="' + _url +
						// '">sdfd</audio>');
						// $sentence.click(function() {
						// window.open(_url);
						// });
						$('#audio-example').append($sentence);
					});
			function sentenceRender(sentence) {
				var word = data.word;
				var startIndex = sentence.toLowerCase().indexOf(word);
				var endIndex = startIndex + word.length;
				var result = sentence.substr(0, startIndex) + '<span style="color: red; font-weight: bold;">'
						+ sentence.substr(startIndex, word.length) + '</span>' + sentence.substr(endIndex);
				return result;
			}

			$('.book-name span').click(function(evt) {
				var bookid = $(this).parent().attr('bookid');
				var url = root + '/book.jsp?id=' + bookid;
				window.open(url);
			});
			resetPlayer();
		}
	});
}
{
	var word = 'abstemious';
	var sentence = "Abstemious bars have also opened in Liverpool and Nottingham, and are planned for"
			+ " Brighton and Newcastle—two famously high-living towns.";
	var startIndex = sentence.toLowerCase().indexOf(word);
	var endIndex = startIndex + word.length;
	var result = sentence.substr(0, startIndex) + '<span>' + sentence.substr(startIndex, word.length) + '</span>'
			+ sentence.substr(endIndex);
	// console.log(startIndex, result);
	// console.log(sentence);
}

var audioInstance = null;
function initPlayerlist() {
	// Setup the player to autoplay the next track
	audioInstance = audiojs.create(document.getElementById('audio-player'), {
		trackEnded : function() {
			var next = $('.audio-item.playing').parent().next().find('.audio-item');
			if (next.length == 0) {
				next = $('.audio-item').first();
			}
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
			var next = $('.audio-item.playing').next();
			if (!next.length)
				next = $('.audio-item').first();
			next.click();
			// back arrow
		} else if (unicode == 37) {
			var prev = $('.audio-item.playing').prev();
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
	$('.audio-item.playing').removeClass('playing');
	$target.addClass('playing');
	audioInstance.play();
}

function resetPlayer() {
	var first = $('.audio-item').attr('data-src');
	console.log(first);
	if (first != undefined) {
		// loadAudio($('.audio-item').eq(0));

		// Load in a track on click
		$('.audio-item span').click(function(e) {
			e.preventDefault();

			loadAudio($(this).parent());
		});
	}
}