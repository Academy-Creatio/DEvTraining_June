using System;
using Terrasoft.Core;
using Terrasoft.Core.DB;
using Terrasoft.Core.Entities;

namespace WorkshopWorkingWithData.Files.DataOperations
{
	internal sealed class InsertingData
	{
		readonly UserConnection UserConnection;
		public InsertingData(UserConnection userConnection)
		{
			UserConnection = userConnection;
		}

		internal string InsertSeveralContacts()
		{
			string[] names = new string[]{ "John", "Bob", "Sam" };
			int i = 0;
			foreach (string name in names)
			{
				i +=InsertContact(Guid.NewGuid(), name);
			}
			return $"Inserted {i} contacts";
		}
		internal string InsertSeveralContactsEsq()
		{
			string[] names = new string[] { "John", "Bob", "Sam" };
			int i = 0;
			foreach (string name in names)
			{
				i += InsertContactEsq(Guid.NewGuid(), name);
			}
			return $"Inserted {i} contacts";
		}

		internal int InsertContact(Guid ContactId, string Name)
		{
			const string tableName = "Contact";
			Insert insert = new Insert(UserConnection)
				.Set("Id",Column.Parameter(ContactId))
				.Set("Name", Column.Parameter(Name))
				.Set("Email", Column.Parameter($"{Name}@creatio.com"))
				.Into(tableName);

			return insert.Execute();
		}
		internal int InsertContactEsq(Guid ContactId, string Name)
		{
			const string tableName = "Contact";
			EntitySchema contactSchema = UserConnection.EntitySchemaManager.GetInstanceByName(tableName);
			Entity contact = contactSchema.CreateEntity(UserConnection);
			contact.SetDefColumnValues();

			contact.SetColumnValue("Id", ContactId);
			contact.SetColumnValue("Name", Name);
			contact.SetColumnValue("Email", $"{Name}@creatio.com");
			//contact.SetColumnValue("AccountId", "e308b781-3c5b-4ecb-89ef-5c1ed4da488e");

			if (contact.InsertToDB())
				return 1;
			return 0;
		}
	}
}
