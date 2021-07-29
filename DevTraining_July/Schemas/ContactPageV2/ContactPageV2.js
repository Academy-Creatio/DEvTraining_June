define("ContactPageV2", ["ServiceHelper", "ProcessModuleUtilities"], function(ServiceHelper, ProcessModuleUtilities) {
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

			/** EventHandler for changes in columnName
			 * @param {*} a  always nul,
			 * @param {*} columnName modified column name
			 */
			 onJobTitleChange: function(a, columnName){
				 var newValue = this.get(columnName);
				 this.showInformationDialog("JobTitle has changed, its new value is: "+ newValue);
				 this.$isAddressVisible = true;
			 },

			 /** Sets up synchronous validation, not suitable for async methods such as database requests or webservice calls
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
					"Click": {"bindTo": "onActionOneClick"},
					ImageConfig: this.get("Resources.Images.CreatioSquare"),
				}));
				actionMenuItems.addItem(this.getButtonMenuItem({
					"Tag": "action2",
					"Caption": this.get("Resources.Strings.ActionTwoCaption"),
					//"Caption": "Action 2",
					"Click": {"bindTo": "onActionTwoClick"},
					"Items": this.addSubItems()
				}));
				return actionMenuItems;
			},

			addSubItems: function(){
				var collection = this.Ext.create("Terrasoft.BaseViewModelCollection");
				collection.addItem(this.getButtonMenuItem({
					"Caption": this.get("Resources.Strings.SubActionOneCaption"),
					"Click": {"bindTo": "onSubActionOneClick"},
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
			},

			/**
			 * Call Custom Configuration WebService
			 * @tutorial https://academy.creatio.com/docs/developer/back-end_development/configuration_web_service/configuration_web_service#case-1241
			 */
			onActionOneClick: function(){
				
				//Payload
				var serviceData = {
					"person":{
						"email": "andrew@domain.com",
						"name": "",
						"age": 0
					}	
				};

				// Calling the web service and processing the results.
				// Can only execute/send POST requests
				//https://baseUrl/0/rest/CustomExample/PostMethodName
				ServiceHelper.callService(
					"CustomExample", //CS - ClassName
					"PostMethodName", //CS Method
					function(response) 
					{
						var result = response.PostMethodNameResult;
						if(result.length >0){
							var name = result[0].name;
						}
						this.showInformationDialog(name);
					}, 
					serviceData, 
					this
				);
			},

			/**
			 * Creation of query instance with "Contact" root schema. 
			 * @tutorial https://academy.creatio.com/docs/developer/front-end_development/crud_operations_in_configuration_schema/filters_handling
			 */
			onActionTwoClick: function(){
				var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "Contact"
				});
				esq.addColumn("Name");
				esq.addColumn("Country.Name", "CountryName");

				// Select all contacts where country is not specified.
				var esqFirstFilter = esq.createColumnIsNullFilter("Country");
				esq.filters.add("esqFirstFilter", esqFirstFilter);

				// Select all contacts, date of birth of which fall at the period from 1.01.1970 to 1.01.1980.
				var dateFrom = new Date(1970, 0, 1, 0, 0, 0, 0);
				var dateTo = new Date(1980, 0, 1, 0, 0, 0, 0);
				var esqSecondFilter = esq.createColumnBetweenFilterWithParameters("BirthDate", dateFrom, dateTo);

				// Add created filters to query collection. 
				esq.filters.add("esqSecondFilter", esqSecondFilter);

				// This collection will include objects, i.e. query results, filtered by two filters.
				esq.getEntityCollection(function (result) {
					if (result.success) {
						result.collection.each(function (item) {
							// Processing of collection items.
							var message = item.$Name+" "+item.$CountryName;
							this.showInformationDialog(message);
						});
					}
				}, this);
			},

			onSubActionOneClick: function (){
				var id = this.$Id;
				var scope = this;
				var args = {
					sysProcessName: "Process_d168652",
					parameters:{
						contactId: id
					},
					callback: scope.onProcessCompleted(),
					scope: scope
				}
				ProcessModuleUtilities.executeProcess(args);
			},

			onProcessCompleted: function(){
				this.hideBodyMask();
			},

			/** Validates model values. Sends validate results to callback function.
			 * Using Terrasoft.chain allows us to execute multiple methods.
			 * For example first we validate checkEmailIsUnique and when the result comes back
			 * chain moves to checkEmailIsUnique.
			 * Terrasoft.chain will execute async methods synchronously
			 * @inheritdoc Terrasoft.BaseEntityV2#asyncValidate 
			 * @overridden
			 * @param {Function} callback Callback-function.
			 * @param {Object} scope Execution context.
			 */
			 asyncValidate: function(callback, scope) {
				this.callParent([function(response) {
					if (!this.validateResponse(response)) {
						return;
					}
					this.Terrasoft.chain(
						function(next) {
							this.checkEmailIsUnique(function(response) {
								if (this.validateResponse(response)) {
									next();
								}
							}, this);
						},
						function(next) {
							this.checkEmailIsUniqueServer(function(response) {
								if (this.validateResponse(response)) {
									next();
								}
							}, this);
						},
						function(next) {
							callback.call(scope, response);
							next();
						}, this);
				}, this]);
			},
			
			 
			
			/* If you only need to perform one async method, use this
			asyncValidate: function(callback, scope) 
			{
				this.callParent([
					function(response){
						if (response.success){
							this.checkEmailIsUnique(callback, scope || this);
						}
						else {
							callback.call(scope || this, response);
						}
					}, 
					this
				]);
			},
			*/

			/** Validates that the email of the currently modified contact is unique */
			checkEmailIsUnique: function (callback, scope) 
			{
				var esq = Ext.create("Terrasoft.EntitySchemaQuery", { rootSchemaName: "Contact" });
				esq.addColumn("Email", "Email");
				
				var esqFirstFilter = esq.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "Email", this.$Email
				);
				
				var esqSecondFilter = esq.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.NOT_EQUAL, "Id", this.$Id
				);

				esq.filters.logicalOperation = Terrasoft.LogicalOperatorType.AND;
				esq.filters.add("esqFirstFilter", esqFirstFilter);
				esq.filters.add("esqSecondFilter", esqSecondFilter);

				esq.getEntityCollection(function (result) {
					if (result.success && result.collection.getCount()>0) {
						if (callback) {
							callback.call(scope, {
									success: false,
									message: "Email has to be unique, checked with UI"
								}
							);
						}
					}
					else {
						if (callback) {
							callback.call(scope, 
								{success: true}
							);
						}
					}
				}, 
				this);
			},

			checkEmailIsUniqueServer: function (callback, scope) {
				
				//Payload
				var serviceData = {
					"person":{
						"email": this.$Email,
						"name": "",
						"age": 0
					}	
				};

				ServiceHelper.callService(
					"CustomExample", //CS - ClassName
					"PostMethodName", //CS Method
					function(response) 
					{
						var result = response.PostMethodNameResult;
						if(result.length >1){
							if (callback) {
								callback.call(scope, {
										success: false,
										message: "Email has to be unique, checked with WebService"
									}
								);
							}
						}
						else{
							if (callback) {
								callback.call(scope, 
									{success: true}
								);
							}
						}
						
					}, 
					serviceData, 
					this
				);
			}

		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "MyRedButton",
				"values": {
					"itemType": 5,
					"style": "red",
					"classes": {
						"textClass": [
							"actions-button-margin-right"
						],
						"wrapperClass": [
							"actions-button-margin-right"
						]
					},
					"caption": "Page red button",
					"hint": "Red btn hint goes here !!!",
					"click": {
						"bindTo": "onMyMainButtonClick"
					},
					"tag": "LeftContainer_Red"
				},
				"parentName": "LeftContainer",
				"propertyName": "items",
				"index": 7
			},
			{
				"operation": "insert",
				"name": "MyGreenButton",
				"values": {
					"itemType": 5,
					"style": "green",
					"classes": {
						"textClass": [
							"actions-button-margin-right"
						],
						"wrapperClass": [
							"actions-button-margin-right"
						]
					},
					"caption": "Page Green button",
					"hint": "Page green button hint <a href=\"https://google.ca\" target=\"_blank\"> Link to help",
					"click": {
						"bindTo": "onMyMainButtonClick"
					},
					"tag": "LeftContainer_Green",
					"menu": {
						"items": [
							{
								"caption": "Sub Item 1",
								"click": {
									"bindTo": "onMySubButtonClick"
								},
								"visible": true,
								"hint": "Sub item 1 hint",
								"tag": "subItem1"
							},
							{
								"caption": "Sub Item 2",
								"click": {
									"bindTo": "onMySubButtonClick"
								},
								"visible": true,
								"hint": "Sub item 2 hint",
								"tag": "subItem2"
							}
						]
					}
				},
				"parentName": "LeftContainer",
				"propertyName": "items",
				"index": 8
			},
			{
				"operation": "merge",
				"name": "AccountEmail",
				"values": {
					"enabled": true
				}
			},
			{
				"operation": "remove",
				"name": "AccountEmail",
				"properties": [
					"contentType"
				]
			},
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
					"visible": {
						"bindTo": "isAddressVisible"
					},
					"enabled": true
				},
				"parentName": "ContactGeneralInfoBlock",
				"propertyName": "items",
				"index": 6
			},
			{
				"operation": "merge",
				"name": "ContactAddress",
				"values": {
					"visible": {
						"bindTo": "isAddressVisible"
					},
					"enabled": {
						"bindTo": "isAddressVisible"
					}
				}
			},
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
