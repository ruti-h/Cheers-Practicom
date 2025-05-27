
  export interface Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    country?: string;
    city?: string;
    street?: string;
    numberHouse?: number;
    tz: string;
    backGround?: string;
    openness?: string;
    burnDate?: Date | string;
    healthCondition?: boolean;
    status?: string;
    height?: number;
    phone?: string;
    email?: string;
    appearance?: string;
    fatherPhone?: string;
    motherPhone?: string;
    class?: string;
    expectationsFromPartner?: string;
    club?: string;
    ageFrom?: number;
    ageTo?: number;
    importantTraitsInMe?: string;
    importantTraitsIAmLookingFor?: string;
    role: "Male" | "Woman" | "MatchMaker";
   
  }