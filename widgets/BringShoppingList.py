import sqlite3

from core.base.model.Widget import Widget
from core.base.model.widgetSizes import WidgetSizes

from BringApi.BringApi import BringApi
import json

class BringShoppingList(Widget):

	SIZE = WidgetSizes.w_tall
	OPTIONS: dict = dict()

	def __init__(self, data: sqlite3.Row):
		super().__init__(data)


	def getList(self) -> list:
		_uuid = self.skillInstance.getConfig('uuid')
		_uuidlist = self.skillInstance.getConfig('listUuid')

		items = BringApi(_uuid, _uuidlist).get_items(self.LanguageManager.activeLanguageAndCountryCode)['purchase']
		itemlist = [item['name'] for item in items]

		return json.dumps(itemlist)
