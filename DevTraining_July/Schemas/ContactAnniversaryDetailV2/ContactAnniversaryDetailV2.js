define("ContactAnniversaryDetailV2", ["ConfigurationGrid", "ConfigurationGridGenerator",
	"ConfigurationGridUtilitiesV2"], function() {
	return {
		entitySchemaName: "ContactAnniversary",
		attributes: {
			"IsEditable": {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: true
			}
		},
		mixins: {
			ConfigurationGridUtilitiesV2: "Terrasoft.ConfigurationGridUtilitiesV2"
		},
		// Message name.Subsiber AccountPageV2
		"UpdateContactbday": {
			mode: this.Terrasoft.MessageMode.PTP,
			direction: this.Terrasoft.MessageDirectionType.PUBLISH
		},
		methods: {
			onActiveRowAction: function(buttonTag, primaryColumnValue) {
				this.mixins.ConfigurationGridUtilitiesV2.onActiveRowAction.call(this, buttonTag, primaryColumnValue);
			},
			Update: function(){
				//Subscriber on AccountPageV2
				var birthday = this.getGridData().get(this.$ActiveRow).$Date;
				this.sandbox.publish("UpdateContactbday", this, ["myTag"]);
				this.reloadGridData();
			}
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "MyButton",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"style": Terrasoft.controls.ButtonEnums.style.GREEN,
					"tag": "Button1",
					"caption": "DEMO BUTTON",
					"click": {
						"bindTo": "Update"
					},
					"enabled": true
				},
				"parentName": "Detail",
				"propertyName": "tools",
				"index": 2
			},
			
			{
				"operation": "merge",
				"name": "DataGrid",
				"values": {
					"className": "Terrasoft.ConfigurationGrid",
					"generator": "ConfigurationGridGenerator.generatePartial",
					"generateControlsConfig": {"bindTo": "generateActiveRowControlsConfig"},
					"changeRow": {"bindTo": "changeRow"},
					"unSelectRow": {"bindTo": "unSelectRow"},
					"onGridClick": {"bindTo": "onGridClick"},
					"activeRowActions": [
						{
							"className": "Terrasoft.Button",
							"style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "save",
							"markerValue": "save",
							"imageConfig": {"bindTo": "Resources.Images.SaveIcon"}
						},
						{
							"className": "Terrasoft.Button",
							"style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "cancel",
							"markerValue": "cancel",
							"imageConfig": {"bindTo": "Resources.Images.CancelIcon"}
						},
						{
							"className": "Terrasoft.Button",
							"style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "card",
							"markerValue": "card",
							"imageConfig": {"bindTo": "Resources.Images.CardIcon"}
						},
						{
							"className": "Terrasoft.Button",
							"style": Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "copy",
							"markerValue": "copy",
							"imageConfig": {"bindTo": "Resources.Images.CopyIcon"}
						},
						{
							"className": "Terrasoft.Button",
							"style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
							"tag": "remove",
							"markerValue": "remove",
							"imageConfig": {"bindTo": "Resources.Images.RemoveIcon"}
						}
					],
					"initActiveRowKeyMap": {"bindTo": "initActiveRowKeyMap"},
					"activeRowAction": {"bindTo": "onActiveRowAction"},
					"multiSelect": {"bindTo": "MultiSelect"}
				}
			}
		]/**SCHEMA_DIFF*/
	};
});