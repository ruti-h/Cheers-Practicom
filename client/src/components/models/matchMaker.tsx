
import { Candidate } from './candidate';

export interface MatchMaker extends Candidate {
    matchmakerName?: string;
    idNumber?: string;
    birthDate?: Date | string;
    gender?: string;
    mobilePhone?: string;
    landlinePhone?: string;
    phoneType?: string;
    personalClub?: string;
    community?: string;
    occupation?: string;
    previousWorkplaces?: string;
    isSeminarGraduate?: boolean;
    hasChildrenInShidduchim?: boolean;
    experienceInShidduchim?: string;
    lifeSkills?: string;
    yearsInShidduchim?: number;
    isInternalMatchmaker?: boolean;
    printingNotes?: string;
  
 }
