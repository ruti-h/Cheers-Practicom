import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface ReportData {
  monthlyRegistrations: Array<{ month: string; male: number; female: number }>
  successRates: Array<{ period: string; rate: number }>
  ageDistribution: Array<{ age: string; count: number; color: string }>
  cityDistribution: Array<{ city: string; count: number; percentage: number }>
  matchingEfficiency: Array<{ week: string; matches: number; meetings: number; success: number }>
}

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  selectedPeriod = "month"
  isLoading = false
  activeTab = "registrations"

  reportData: ReportData = {
    monthlyRegistrations: [
      { month: "ינואר", male: 45, female: 52 },
      { month: "פברואר", male: 38, female: 41 },
      { month: "מרץ", male: 62, female: 58 },
      { month: "אפריל", male: 71, female: 69 },
      { month: "מאי", male: 55, female: 63 },
      { month: "יוני", male: 48, female: 51 },
    ],
    successRates: [
      { period: "שבוע 1", rate: 85 },
      { period: "שבוע 2", rate: 92 },
      { period: "שבוע 3", rate: 88 },
      { period: "שבוע 4", rate: 94 },
      { period: "שבוע 5", rate: 91 },
      { period: "שבוע 6", rate: 96 },
    ],
    ageDistribution: [
      { age: "20-25", count: 156, color: "#fbbf24" },
      { age: "26-30", count: 234, color: "#f59e0b" },
      { age: "31-35", count: 189, color: "#d97706" },
      { age: "36-40", count: 98, color: "#b45309" },
      { age: "40+", count: 67, color: "#92400e" },
    ],
    cityDistribution: [
      { city: "ירושלים", count: 312, percentage: 28.5 },
      { city: "תל אביב", count: 245, percentage: 22.3 },
      { city: "בני ברק", count: 189, percentage: 17.2 },
      { city: "פתח תקווה", count: 134, percentage: 12.2 },
      { city: "חיפה", count: 98, percentage: 8.9 },
      { city: "אחרות", count: 122, percentage: 10.9 },
    ],
    matchingEfficiency: [
      { week: "שבוע 1", matches: 45, meetings: 38, success: 12 },
      { week: "שבוע 2", matches: 52, meetings: 44, success: 15 },
      { week: "שבוע 3", matches: 48, meetings: 41, success: 13 },
      { week: "שבוע 4", matches: 61, meetings: 52, success: 18 },
      { week: "שבוע 5", matches: 55, meetings: 47, success: 16 },
      { week: "שבוע 6", matches: 58, meetings: 49, success: 19 },
    ],
  }

  ngOnInit() {
    // Initialize component
  }

  refreshData() {
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 1500)
  }

  exportReport() {
    console.log("Exporting report...")
  }

  setActiveTab(tab: string) {
    this.activeTab = tab
  }

  getKeyMetrics() {
    return {
      totalMatches: 1247,
      successRate: 94.2,
      averageTime: 12.3,
      satisfaction: 4.9,
    }
  }
}
