import sqlite3

from core.base.model.Widget import Widget
from core.base.model.widgetSizes import WidgetSizes

from BringApi.BringApi import BringApi
import json

class BringShoppingList(Widget):

	SIZE = WidgetSizes.w_large_tall
	OPTIONS: dict = dict()

	def __init__(self, data: sqlite3.Row):
		super().__init__(data)


	def getList(self) -> list:
		_uuid = self.skillInstance.getConfig('uuid')
		_uuidlist = self.skillInstance.getConfig('listUuid')
		_BringList = BringApi(_uuid, _uuidlist)
		_transl = BringApi.loadTranslations(self.LanguageManager.activeLanguageAndCountryCode)

		items = _BringList.get_items()['purchase']
		details = _BringList.get_items_detail()
		itemlist = [{"text": self.translate(item['name'], _transl), "image": self.get_image(details, item['name'])} for item in items]

		return json.dumps(itemlist)


	# return list with icons
	def get_image(self, details, item: str):
		for det in details:
			if det["itemId"] == item and det['userIconItemId']:
				return det['userIconItemId']
		return item


	def translate(self, item, transl):
		return transl.get(item) or item
