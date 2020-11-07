(function () {

	function getIconName(val) {
		let fileName = val.toLowerCase();
		let repl = {
			"\\s": "_",
			" ": "_",
			"-": "_",
			"!": "",
			"\xe4": "ae",
			"\xf6": "oe",
			"\xfc": "ue",
			"\xe9": "e"
		};
		let n = new RegExp(Object.keys(repl).join("|"), "gi");
		fileName = fileName.replace(n, function (t) {
			return repl[t.toLowerCase()]
		});
		return fileName + '.png'
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
		}).done(function (answer) {
			let $list = $('#BringShoppingList_list');
			if ('success' in answer){
				$list.html("<div class='BringWidgetError'>Bring! Shopping List - ERROR: " + answer['error'] + "</div>");
				return;
			}

			// Build a list of items that are on the list
			let items = {};
			$.each(answer, function (i, item) {
				items[item['text']] = item;
			});

			// First remove what's gone from the list
			$list.find('img').each(function() {
				if (!($(this).attr('id') in items)) {
					$(this).parent().remove();
				}
			});

			// Then add what's new
			for (const [itemName, item] of Object.entries(items)) {
				if ($(`#${itemName}`).length === 0) {
					$list.append(
						$(`
							<div class="tile">
								<div class="BringShoppingTile_imgCont"></div>
								<img alt="${itemName}" class="BringShoppingItemIcon" id="${itemName}" src="https://web.getbring.com/assets/images/items/${getIconName(item['image'])}" 
								onerror="this.onerror=null; this.src='https://web.getbring.com/assets/images/items/${item['image'][0].toLowerCase()}.png';"/>
								<br/>${itemName}</div>
						`)
					);
				}
			}
		});
	}

	refresh();
	setInterval(function () {
		refresh()
	}, 1000 * 10);

})();
