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
		messages:{
			/**
			 * Published on: ContactSectionV2
			 * @tutorial https://academy.creatio.com/docs/developer/front-end_development/sandbox_component/module_message_exchange
			 */
			 "SectionActionClicked":{
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
			}
		},
		methods: {
			/**
			 * @inheritdoc Terrasoft.BasePageV2#init
			 * @override
			 */
			init: function() {
				this.callParent(arguments);
				this.subscribeToMessages();
			},
			subscribeToMessages: function(){
				this.sandbox.subscribe(
					"SectionActionClicked",
					function(){this.onSectionMessageReceived();},
					this,
					[this.sandbox.id]
				)
			},

			onSectionMessageReceived: function(){
				this.showInformationDialog("Message received");
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
			},

			/**
			 * @inheritdoc Terrasoft.BasePageV2#getActions
			 * @overridden
			 */
			getActions: function() {
				var actionMenuItems = this.callParent(arguments);
				actionMenuItems.addItem(this.getButtonMenuSeparator());
				actionMenuItems.addItem(this.getButtonMenuItem({
					"Tag": "action1",
					"Caption": this.get("Resources.Strings.ActionOneCaption"),
					//"Caption": "Action 1",
					"Click": {"bindTo": "onActionClick"},
					ImageConfig: this.get("Resources.Images.CreatioSquare"),
				}));
				actionMenuItems.addItem(this.getButtonMenuItem({
					"Tag": "action2",
					"Caption": this.get("Resources.Strings.ActionTwoCaption"),
					//"Caption": "Action 2",
					"Click": {"bindTo": "onActionClick"},
					"Items": this.addSubItems()
				}));
				return actionMenuItems;
			},

			addSubItems: function(){
				var collection = this.Ext.create("Terrasoft.BaseViewModelCollection");
				collection.addItem(this.getButtonMenuItem({
					"Caption": this.get("Resources.Strings.SubActionOneCaption"),
					"Click": {"bindTo": "onActionClick"},
					"Tag": "sub1"
				}));
				collection.addItem(this.getButtonMenuItem({
					"Caption": this.get("Resources.Strings.SubActionTwoCaption"),
					"Click": {"bindTo": "onActionClick"},
					"Tag": "sub2"
				}));
				return collection;
			},
			onActionClick: function(tag){
				this.showInformationDialog("Action clicked with tag: "+tag);
			}

//http://k_krylov:7010/0/Nui/ViewModule.aspx#SectionModuleV2/ContactSectionV2/ContactPageV2/edit/4a8b394d-6213-4604-b363-b7fc5b952657
//http://k_krylov:7010/0/Nui/ViewModule.aspx#CardModuleV2                    /ContactPageV2/edit/4a8b394d-6213-4604-b363-b7fc5b952657



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

			/* BUTTONS */
			{
				"operation": "insert",
				"name": "MyRedButton",
				"parentName": "LeftContainer",
				"propertyName": "items",
				"values":{
					itemType: this.Terrasoft.ViewItemType.BUTTON,
					style: Terrasoft.controls.ButtonEnums.style.RED,
					classes: {
						"textClass": ["actions-button-margin-right"],
						"wrapperClass": ["actions-button-margin-right"]
					},
					caption: "Page red button",
					hint: "Red btn hint goes here !!!",
					click: {"bindTo": "onMyMainButtonClick"},
					tag: "LeftContainer_Red"
				}
			},
			{
				"operation": "insert",
				"name": "MyGreenButton",
				"parentName": "LeftContainer",
				"propertyName": "items",
				"values":{
					"itemType": this.Terrasoft.ViewItemType.BUTTON,
					"style": Terrasoft.controls.ButtonEnums.style.GREEN,
					classes: {
						"textClass": ["actions-button-margin-right"],
						"wrapperClass": ["actions-button-margin-right"]
					},
					"caption": "Page Green button",
					"hint": "Page green button hint <a href=\"https://google.ca\" target=\"_blank\"> Link to help",
					"click": {"bindTo": "onMyMainButtonClick"},
					tag: "LeftContainer_Green",
					"menu":{
						"items": [
							{
								caption: "Sub Item 1",
								click: {bindTo: "onMySubButtonClick"},
								visible: true,
								hint: "Sub item 1 hint",
								tag: "subItem1"
							},
							{
								caption: "Sub Item 2",
								click: {bindTo: "onMySubButtonClick"},
								visible: true,
								hint: "Sub item 2 hint",
								tag: "subItem2"
							}
						]
					}
				}
			},
			
			/* END BUTTONS */



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
