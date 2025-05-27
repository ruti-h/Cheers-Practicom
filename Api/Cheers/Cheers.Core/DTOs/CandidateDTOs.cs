using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.DTOs
{
    public class CandidateDTOs
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public int NumberHouse { get; set; }
        public string Tz { get; set; }

        public string? BackGround { get; set; }
        public string? Openness { get; set; }
        public DateTime BurnDate { get; set; }
        public bool HealthCondition { get; set; }
        public string Status { get; set; }

        public double Height { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        public string? Appearance { get; set; }

        public string? FatherPhone { get; set; }
        public string? MotherPhone { get; set; }
        public string? Class { get; set; }
        // שדות חדשים
        public string? ExpectationsFromPartner { get; set; }
        public string? Club { get; set; }
        public int? AgeFrom { get; set; }
        public int? AgeTo { get; set; }
        public string? ImportantTraitsInMe { get; set; }
        public string? ImportantTraitsIAmLookingFor { get; set; }
        public string Gender { get; set; }


        //male
        public bool? Smoker { get; set; } // מעשן

        public string? Beard { get; set; } // זקן

        public string? Hat { get; set; } // כובע

        public string? Suit { get; set; } // חליפה



        public bool? DriversLicense { get; set; } // רשיון נהיגה

        public string? IsLearning { get; set; }
        public string? Yeshiva { get; set; }


        public string? PreferredSeminarStyle { get; set; }
        public string? PreferredProfessional { get; set; }
        public string? PreferredHeadCovering { get; set; }
        public string? PreferredAnOutsider { get; set; }
        //woman
        public string?   Seminar { get; set; }
        public bool? AnOutsider { get; set; }
        public string? PrefferedIsLearning { get; set; }
        public string? PrefferedYeshivaStyle { get; set; }
        public string? Professional { get; set; }
        public string? HeadCovering { get; set; }

    }
}
