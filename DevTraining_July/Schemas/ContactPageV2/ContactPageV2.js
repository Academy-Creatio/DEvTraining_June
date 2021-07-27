define("ContactPageV2", [], function() {
	return {
		entitySchemaName: "Contact",
		attributes: {
			MyAttribute: {
				dependencies: [
					{
						columns: ["JobTitle"],
						methodName: "onJobTitleChange"
					}
				]
			},
			Account: {
				lookupListConfig: {
					columns: ["Web"]
				}
			},
			isAddressVisible: {
				"dataValueType": this.Terrasoft.DataValueType.BOOLEAN,
				"value": false
			}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			/**
			 * @inheritdoc Terrasoft.BasePageV2#init
			 * @override
			 */
			init: function() {
				this.callParent(arguments);
			},

			/**
			 * @inheritdoc Terrasoft.BasePageV2#onEntityInitialized
			 * @override
			 */
			onEntityInitialized: function() {
				this.callParent(arguments);
			},


			/**
			 * 
			 */
			 onJobTitleChange: function(a, columnName){
				 var newValue = this.get(columnName);
				 this.showInformationDialog("JobTitle has changed, its new value is: "+ newValue);
				 this.$isAddressVisible = true;
			 },

			 /**
			 * @inheritdoc BaseSchemaViewModel#setValidationConfig
			 * @override
			 */
			 setValidationConfig: function() {
				this.callParent(arguments);
				this.addColumnValidator("Email", this.emailValidator);
			},

			emailValidator: function() {
				var invalidMessage= "";
				var newValue = this.$Email;
				var corpDomain = this.$Account.Web;
				
				if (newValue.split("@")[1] !== corpDomain) {
					invalidMessage = "Primary email has to match to corporate domain.";
				}
				else {
					invalidMessage = "";
				}
				return {
					invalidMessage: invalidMessage
				};
			},

			isContactAddressVisible: function(){
				return false;
			},

			isContactAddressEnabled: function(){
				return false;
			}

		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			
			/**
			 * Addded field
			 */
			{
				"operation": "insert",
				"name": "Name",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ContactGeneralInfoBlock"
					},
					"bindTo": "Name",
					"visible": {bindTo: "isAddressVisible"}
				},
				"parentName": "ContactGeneralInfoBlock",
				"propertyName": "items",
				"index": 6,
			},
			
			
			{
				"operation": "insert",
				"name": "Name2",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 3,
						"layoutName": "ContactGeneralInfoBlock"
					},
					"bindTo": "Name"
				},
				"parentName": "ContactGeneralInfoBlock",
				"propertyName": "items",
				"index": 7
			},
			
			{
				"operation": "merge",
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"name": "ContactAddress",
				"values": {
					"itemType": Terrasoft.ViewItemType.DETAIL,
					"visible": {bindTo: "isAddressVisible"},
					"enabled": {bindTo: "isAddressVisible"}
				},
			},

			/**
			 * Designer generated content
			 */

			{
				"operation": "merge",
				"name": "JobTabContainer",
				"values": {
					"order": 2
				}
			},
			{
				"operation": "merge",
				"name": "HistoryTab",
				"values": {
					"order": 5
				}
			},
			{
				"operation": "merge",
				"name": "NotesAndFilesTab",
				"values": {
					"order": 6
				}
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 7
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
