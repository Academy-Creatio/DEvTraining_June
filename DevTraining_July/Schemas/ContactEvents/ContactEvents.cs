using Terrasoft.Core;
using Terrasoft.Core.Entities;
using Terrasoft.Core.Entities.Events;

namespace Terrasoft.Configuration.Dev.Pkg.DevTraining_July.Schemas.ContactEvents
{
	/// <summary>
	/// Listener for 'EntityName' entity events. <b><see href="https://academy.creatio.com/docs/developer/back-end_development/entity_event_layer/entity_event_layer">Academy Article</see></b>
	/// </summary>
	/// <seealso cref="BaseEntityEventListener" />
	[EntityEventListener(SchemaName = "Contact")]
	class ContactEventListener : BaseEntityEventListener
	{
		/// <summary>
		/// <inheritdoc cref="BaseEntityEventListener.OnSaving(object, EntityBeforeEventArgs)"/>
		/// </summary>
		/// <param name="sender">Contact</param>
		/// <param name="e"></param>
		/// <remarks>
		/// Validation logic is defined in <see cref="Contact_DevTraining_JulyEventsProcess{TEntity}.ScriptTask_ValidateContactExecute(Core.Process.ProcessExecutingContext)"/>
		/// Check if validation is ennabled <c>e.IsCanceled = true;</c>, when true errors should be raised there, 
		/// otherwise call <c>e.IsCanceled=true</c>
		/// 
		/// </remarks>
		public override void OnSaving(object sender, EntityBeforeEventArgs e)
		{
			base.OnSaving(sender, e);
			Entity entity = (Entity)sender;
			UserConnection userConnection = entity.UserConnection;

			if (!e.IsValidationEnabled)
			{
				string value = entity.GetTypedColumnValue<string>("Name");
				if (value.Contains("Kirill"))
				{
					var isValid = entity.Validate();
				}
				e.IsCanceled = true;
			}
		}
	}
}