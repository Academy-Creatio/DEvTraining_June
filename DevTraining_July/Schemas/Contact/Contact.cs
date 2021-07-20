namespace Terrasoft.Configuration
{

	using DataContract = Terrasoft.Nui.ServiceModel.DataContract;
	using global::Common.Logging;
	using Newtonsoft.Json;
	using Newtonsoft.Json.Linq;
	using System;
	using System.Collections.Generic;
	using System.Collections.ObjectModel;
	using System.Data;
	using System.Drawing;
	using System.Globalization;
	using System.IO;
	using System.Linq;
	using System.Runtime.Remoting;
	using SystemSettings = Terrasoft.Core.Configuration.SysSettings;
	using Terrasoft.Common;
	using Terrasoft.Common.Json;
	using Terrasoft.Configuration;
	using Terrasoft.Configuration.EntitySynchronization;
	using Terrasoft.Core;
	using Terrasoft.Core.Configuration;
	using Terrasoft.Core.DB;
	using Terrasoft.Core.DcmProcess;
	using Terrasoft.Core.Entities;
	using Terrasoft.Core.Factories;
	using Terrasoft.Core.Process;
	using Terrasoft.Core.Process.Configuration;
	using Terrasoft.GlobalSearch.Indexing;
	using Terrasoft.Messaging.Common;
	using Terrasoft.UI.WebControls.Controls;
	using Terrasoft.UI.WebControls.Utilities.Json.Converters;

	#region Class: Contact_DevTraining_JulyEventsProcess

	public partial class Contact_DevTraining_JulyEventsProcess<TEntity>
	{

		#region Methods: Public
		ILog _logger = LogManager.GetLogger("DevTrainingJuly");
		public void ValidateContactName()
		{
			if (Entity.Name.Contains("Kirill"))
			{
				var evm = new EntityValidationMessage()
				{
					MassageType = MessageType.Error,
					Text = "Kirill must not be changed",
					Column = Entity.Schema.Columns.FindByName("Name")
				};
				Entity.ValidationMessages.Add(evm);
				_logger.InfoFormat("Contact validation failed {evm}", evm);
			}
		}
		public void ValidateAccountNotEmpty()
		{
			if (Entity.AccountId == Guid.Empty)
			{
				var evm = new EntityValidationMessage()
				{
					MassageType = MessageType.Error,
					Text = "Account MUST not be empty",
					Column = Entity.Schema.Columns.FindByName("Account")
				};
				Entity.ValidationMessages.Add(evm);
				_logger.InfoFormat("Contact validation failed {evm}", evm);
			}
		}
		#endregion

	}

	#endregion

}

