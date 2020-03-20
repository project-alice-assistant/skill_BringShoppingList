(function () {
	function getIconName(val){
		let fileName = val.toLowerCase();
		repl = {
                    "\\s": "_",
                    " ": "_",
                    "-": "_",
                    "!": "",
                    "\xe4": "ae",
                    "ä": "ae",
                    "\xf6": "oe",
                    "ö": "oe",
                    "\xfc": "ue",
					"ü": "ue",
                    "\xe9": "e"
                };
		n = new RegExp(Object.keys(repl).join("|"),"gi");
		fileName = fileName.replace(n, function(t) {
                    return repl[t.toLowerCase()]
                })
		console.log(fileName);
		return fileName+'.png'
	}
	function refresh() {
		$.ajax({
		url: '/home/widget/',
		data: JSON.stringify({
			skill: 'BringShoppingList',
			widget: 'BringShoppingList',
			func: 'getList',
			param: ''
		}),
		contentType: 'application/json',
		dataType: 'json',
		type: 'POST'
		}).done(function(answer) {
			listItems = "";
			$.each(answer, function (i, val) {
				listItems += '<div class="BringShoppingList_list_item">' +
								'<div class="BringShoppingList_imgCont"></div><img class="bringItemIcon" src="https://web.getbring.com/assets/images/items/'+getIconName(val)+
								'" onError="this.onerror=null;this.src=\'https://web.getbring.com/assets/images/items/'+val[0].toLowerCase()+'.png\';" /><br/>' +
								val + '</div>';
			});
			$('#BringShoppingList_list').html( listItems );
		});
	}
	refresh();
	setInterval(function() {refresh()}, 1000*60);

})();
/*
 e.getImagePath = function(t) {
                return "/assets/images/items/" + e.normalizeStringPath(t) + ".png"
            }
            ,
            e.normalizeStringPath = function(t) {
                var e = {
                    "\\s": "_",
                    " ": "_",
                    "-": "_",
                    "!": "",
                    "\xe4": "ae",
                    "\xf6": "oe",
                    "\xfc": "ue",
                    "\xe9": "e"
                }
                  , n = new RegExp(Object.keys(e).join("|"),"gi");
                return t.toLowerCase().replace(n, function(t) {
                    return e[t.toLowerCase()]
                })
            }*/
