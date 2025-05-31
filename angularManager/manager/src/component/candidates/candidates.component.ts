import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface Candidate {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  city: string
  gender: "male" | "female"
  status: "active" | "pending" | "matched" | "inactive"
  registrationDate: string
  lastActive: string
  profileCompletion: number
  verified: boolean
  matchScore?: number
}

@Component({
  selector: "app-candidates",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./candidates.component.html",
  styleUrls: ["./candidates.component.scss"],
})
export class CandidatesComponent implements OnInit {
  candidates: Candidate[] = [
    {
      id: 1,
      firstName: "שרה",
      lastName: "כהן",
      email: "sarah.cohen@email.com",
      phone: "050-1234567",
      age: 26,
      city: "ירושלים",
      gender: "female",
      status: "active",
      registrationDate: "2024-01-15",
      lastActive: "2024-01-28",
      profileCompletion: 95,
      verified: true,
      matchScore: 92,
    },
    {
      id: 2,
      firstName: "דוד",
      lastName: "לוי",
      email: "david.levi@email.com",
      phone: "052-9876543",
      age: 29,
      city: "תל אביב",
      gender: "male",
      status: "matched",
      registrationDate: "2024-01-10",
      lastActive: "2024-01-27",
      profileCompletion: 88,
      verified: true,
      matchScore: 89,
    },
    {
      id: 3,
      firstName: "רחל",
      lastName: "אברהם",
      email: "rachel.abraham@email.com",
      phone: "053-5555555",
      age: 24,
      city: "בני ברק",
      gender: "female",
      status: "pending",
      registrationDate: "2024-01-25",
      lastActive: "2024-01-28",
      profileCompletion: 65,
      verified: false,
    },
    {
      id: 4,
      firstName: "יוסף",
      lastName: "מזרחי",
      email: "yosef.mizrahi@email.com",
      phone: "054-7777777",
      age: 31,
      city: "חיפה",
      gender: "male",
      status: "active",
      registrationDate: "2024-01-20",
      lastActive: "2024-01-28",
      profileCompletion: 92,
      verified: true,
      matchScore: 85,
    },
  ]

  searchTerm = ""
  filterStatus = "all"
  filterGender = "all"
  selectedCandidate: Candidate | null = null
  showModal = false

  ngOnInit() {
    // Initialize component
  }

  get filteredCandidates(): Candidate[] {
    return this.candidates.filter((candidate) => {
      const matchesSearch =
        candidate.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        candidate.city.toLowerCase().includes(this.searchTerm.toLowerCase())

      const matchesStatus = this.filterStatus === "all" || candidate.status === this.filterStatus
      const matchesGender = this.filterGender === "all" || candidate.gender === this.filterGender

      return matchesSearch && matchesStatus && matchesGender
    })
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      active: "status-active",
      pending: "status-pending",
      matched: "status-matched",
      inactive: "status-inactive",
    }
    return classes[status as keyof typeof classes] || "status-default"
  }

  getStatusText(status: string): string {
    const texts = {
      active: "פעיל",
      pending: "ממתין",
      matched: "מותאם",
      inactive: "לא פעיל",
    }
    return texts[status as keyof typeof texts] || status
  }

  getGenderIcon(gender: string): string {
    return gender === "male" ? "👨" : "👩"
  }

  viewCandidate(candidate: Candidate) {
    this.selectedCandidate = candidate
    this.showModal = true
  }

  closeModal() {
    this.showModal = false
    this.selectedCandidate = null
  }

  editCandidate(candidate: Candidate) {
    console.log("Edit candidate:", candidate)
  }

  deleteCandidate(candidate: Candidate) {
    console.log("Delete candidate:", candidate)
  }

  sendEmail(candidate: Candidate) {
    console.log("Send email to:", candidate)
  }

  createMatch(candidate: Candidate) {
    console.log("Create match for:", candidate)
  }

  addCandidate() {
    console.log("Add new candidate")
  }

  exportCandidates() {
    console.log("Export candidates")
  }

  importCandidates() {
    console.log("Import candidates")
  }

  getCandidatesByStatus(status: string): number {
    return this.candidates.filter((c) => c.status === status).length
  }
}
