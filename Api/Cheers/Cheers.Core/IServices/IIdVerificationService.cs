using Cheers.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.IServices
{
    public interface IIdVerificationService
    {
        Task<VerificationResult> VerifyIdCard(VerificationResult request);
        //Task<VerificationResult> VerifyIdCard(VerificationRequest request);
        public IdCardInfo ParseIdCardText(string extractedText);
    }
}
