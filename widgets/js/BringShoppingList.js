(function () {

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
				listItems += '<li class="BringShoppingList_list_item"><span class="fa-li"><i class="fas fa-caret-right"></i></span>' + val + '</li>';
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
