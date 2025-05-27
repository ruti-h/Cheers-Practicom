using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.IServices
{
  public  interface IUploadService
    {
        Task<string> GetDownloadUrlAsync(string fileName);

    }
}
