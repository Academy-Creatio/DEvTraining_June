define("AccountContactsDetailV2", [], function() {
	return {
		entitySchemaName: "Contact",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "MyButton",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"style": Terrasoft.controls.ButtonEnums.style.RED,
					"tag": "Button1",
					"caption": "DEMO BUTTON",
					"click": {
						"bindTo": "doStuff"
					},
					"enabled": true
				},
				"parentName": "Detail",
				"propertyName": "tools",
				"index": 2
			},
		]/**SCHEMA_DIFF*/,
		methods: {

			doStuff: function(){
				if(!this.$ActiveRow){
					return;
				}
				var contactid = this.getGridData().get(this.$ActiveRow).$Id;
				debugger;
			}
		}
	};
});
