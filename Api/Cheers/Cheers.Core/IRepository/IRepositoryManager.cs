using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.IRepository
{
   public interface IRepositoryManager
    {
        
        IRepositoryUser RepositoryUser { get; }
        Task saveAsync();
    }
}
