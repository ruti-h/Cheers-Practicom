using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.DTOs
{
    public class UploadFileRequest
    {
        public IFormFile File { get; set; }

    }
}
