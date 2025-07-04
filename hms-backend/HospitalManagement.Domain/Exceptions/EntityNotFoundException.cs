using System;

namespace HospitalManagement.Domain.Exceptions
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException(string entityName, object id)
            : base($"{entityName} with ID {id} not found")
        {
            EntityName = entityName;
            Id = id;
        }

        public string EntityName { get; }
        public object Id { get; }
    }
}