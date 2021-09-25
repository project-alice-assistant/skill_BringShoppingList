(function () {

	function getIconName(val){
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
		fetch(`http://${this.aliceSettings['aliceIp']}:${this.aliceSettings['apiPort']}/api/v1.0.1/widgets/${this.widgetId}/function/getList/`, {
			method: 'POST',
			body: '{}',
			headers: {
				'auth': localStorage.getItem('apiToken'),
				'content-type': 'application/json'
			}
		}).then(function(answer){
			let $list = self.myDiv.querySelector('#BringShoppingList_list');
			if (!answer.ok) {
				$list.html("<div class='BringWidgetError'>Bring! Shopping List - ERROR: " + answer.statusText + "</div>");
			} else if ('success' in answer && !answer['success']) {
				$list.html("<div class='BringWidgetError'>Bring! Shopping List - ERROR: " + answer['message'] + "</div>");
				return;
			}
			return answer.json()
		}).then(function (answer) {
			let $list = self.myDiv.querySelector('#BringShoppingList_list');
			answer = answer.data['items']

			// Build a list of items that are on the list
			let items = [];
			for(const item of answer){
				items[item['text']] = item;
			};

			// First remove what's gone from the list

			Array.from($list.childNodes).forEach(function (node) {
				if (!(node.id in items)) {
					node.remove();
				}
			});

			// Then add what's new
			for (const [itemName, item] of Object.entries(items)) {
				if(item['image'] === undefined) return;
				if ($list.querySelector(`#${BringShoppingList_BringShoppingList.getIconName(item['image'])}`) === null) {
				 	let temp = document.createElement("div")
				 	temp.className = "tile"
					temp.id = BringShoppingList_BringShoppingList.getIconName(item['image'])
					temp.innerHTML = '<div class="BringShoppingTile_imgCont"></div>' +
						'<img alt="'+ itemName + '" class="BringShoppingItemIcon" ' +
						'id="'+BringShoppingList_BringShoppingList.getIconName(item['image'])+'" src="https://web.getbring.com/assets/images/items/'+BringShoppingList_BringShoppingList.getIconName(item['image'])+'"\n' +
						'onerror="this.onerror=null; this.src=\'https://web.getbring.com/assets/images/items/'+item['image'][0].toLowerCase()+'.png\';"/>\n' +
						'<br/>'+itemName;
					$list.appendChild(temp);
				}
			}
		})
	}
}
