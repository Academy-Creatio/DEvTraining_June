using System;
using System.Collections.Generic;
using System.Data;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using Terrasoft.Core;
using Terrasoft.Core.DB;
using Terrasoft.Web.Common;

namespace Terrasoft.Configuration.Dev.Pkg.DevTraining_July
{
	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class CustomExample : BaseService
	{
		private SystemUserConnection _systemUserConnection;
		private SystemUserConnection SystemUserConnection
		{
			get
			{
				return _systemUserConnection ?? (_systemUserConnection = (SystemUserConnection)AppConnection.SystemUserConnection);
			}
		}

		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, 
			BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
		public List<Person> PostMethodName(Person person)
		{
			//UserConnection userConnection = UserConnection ?? SystemUserConnection;
			return GetAllPeopleByEmaiil(person.Email);
		}

		[OperationContract]
		[WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
		public string GetMethodname()
		{
		//Example getting SystemSetting
			var settingValue =  (int)Terrasoft.Core.Configuration.SysSettings.GetValue(UserConnection, "OurNewSetting");
			UserConnection userConnection = UserConnection ?? SystemUserConnection;
			return "Ok";
		}


		private List<Person> GetAllPeopleByEmaiil(string email)
		{
			Select select = new Select(UserConnection)
				.Column("Name")
				.Column("Age")
				.Column("Email")
				.From("Contact")
				.Where("Email").IsEqual(Column.Parameter(email)) as Select;

			List<Person> people = new List<Person>();
			using (DBExecutor dbExecutor = UserConnection.EnsureDBConnection())
			{
				using (IDataReader reader = select.ExecuteReader(dbExecutor))
				{
					while (reader.Read())
					{
						var person = new Person() {
							Age = uint.Parse(reader["Age"].ToString()),
							Name = (string)reader["Name"],
							Email = (string)reader["Email"]
						};
						people.Add(person);
					}
				}
			}

			return people;
		}
	}

	[DataContract(Name = "person")]
	public class Person
	{
		[DataMember(Name = "name")]
		public string Name { get; set; }
		
		[DataMember(Name = "age")]
		public uint Age { get; set; }

		[DataMember(Name = "email")]
		public string Email { get; set; }
	}


}



