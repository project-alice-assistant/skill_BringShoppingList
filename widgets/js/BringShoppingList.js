class BringShoppingList_BringShoppingList {

	constructor(uid, widgetId) {
		this.uid = uid;
		this.widgetId = widgetId;
		this.refresh();
		self = this
		setInterval(function() { self.refresh() }, 1000* 10);
	}

	static getIconName(val) {
		let fileName = val.toLowerCase();
		let repl = {
			"\\s" : "_",
			" "   : "_",
			"-"   : "_",
			"!"   : "",
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

	refresh() {
		self = this
		fetch(`http://${window.location.hostname}:5001/api/v1.0.1/widgets/${this.widgetId}/function/getList/`, {
			method: 'POST',
			body: '{}',
			headers: {
				'auth': localStorage.getItem('apiToken'),
				'content-type': 'application/json'
			}
		}).then(function(answer){
			let $list = $('#BringShoppingList_list');
			if (!answer.ok) {
				$list.html("<div class='BringWidgetError'>Bring! Shopping List - ERROR: " + answer.statusText + "</div>");
			} else if ('success' in answer && !answer['success']) {
				$list.html("<div class='BringWidgetError'>Bring! Shopping List - ERROR: " + answer['message'] + "</div>");
				return;
			}
			return answer.json()
		}).then(function (answer) {
			let $list = $('#BringShoppingList_list');
			answer = answer.data['items']

			// Build a list of items that are on the list
			let items = {};
			$.each(answer, function (i, item) {
				items[item['text']] = item;
			});

			// First remove what's gone from the list
			$list.find('img').each(function () {
				if (!($(this).attr('id') in items)) {
					$(this).parent().remove();
				}
			});

			// Then add what's new
			for (const [itemName, item] of Object.entries(items)) {
				if(item['image'] === undefined) return;
				if ($(`#${BringShoppingList_BringShoppingList.getIconName(item['image'])}`).length === 0) {
					$list.append(
						$(`
							<div class="tile">
								<div class="BringShoppingTile_imgCont"></div>
								<img alt="${itemName}" class="BringShoppingItemIcon" id="${BringShoppingList_BringShoppingList.getIconName(item['image'])}" src="https://web.getbring.com/assets/images/items/${BringShoppingList_BringShoppingList.getIconName(item['image'])}" 
								onerror="this.onerror=null; this.src='https://web.getbring.com/assets/images/items/${item['image'][0].toLowerCase()}.png';"/>
								<br/>${itemName}</div>
						`)
					);
				}
			}
		})
	}
}
