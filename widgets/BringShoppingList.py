import json
import sqlite3
from BringApi.BringApi import BringApi

from core.webui.model.Widget import Widget
from core.webui.model.WidgetSizes import WidgetSizes


class BringShoppingList(Widget):
	DEFAULT_SIZE = WidgetSizes.w_large_tall
	DEFAULT_OPTIONS: dict = dict()


	def __init__(self, data: sqlite3.Row):
		super().__init__(data)


	def getList(self) -> dict:
		try:
			bringList = self.skillInstance.bring()
			translation = BringApi.loadTranslations(self.LanguageManager.activeLanguageAndCountryCode)

			items = bringList.get_items()['purchase']
			details = bringList.get_items_detail()
			itemList = [{"text": self.translate(item['name'], translation), "image": self.get_image(details, item['name'])} for item in items]

			return {'success': True, 'items': itemList}
		except Exception as e:
			return {'success':False,'message':str(e)}


	@staticmethod
	def get_image(details, item: str) -> str:
		for det in details:
			if det["itemId"] == item and det['userIconItemId']:
				return det['userIconItemId']
		return item


	@staticmethod
	def translate(item, transl):
		return transl.get(item) or item
