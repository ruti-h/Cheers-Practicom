using Amazon.S3;
using Amazon.S3.Model;
using Cheers.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Service.Services
{
  public  class UploadService: IUploadService
    {


        private readonly IAmazonS3 _s3Client;

        public UploadService(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = "cheers-aplication",
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(500),
            };
            return _s3Client.GetPreSignedURL(request);
        }
    }
}
