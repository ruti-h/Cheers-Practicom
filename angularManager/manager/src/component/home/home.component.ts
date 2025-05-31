import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { Router } from "@angular/router"
import { interval, type Subscription } from "rxjs"

interface DashboardStats {
  totalCandidates: number
  activeCandidates: number
  totalMatches: number
  successfulMatches: number
  pendingMeetings: number
  todaysMeetings: number
  monthlyGrowth: number
  satisfactionRate: number
}

interface RecentActivity {
  id: string
  type: "match" | "meeting" | "registration" | "success"
  title: string
  description: string
  time: string
  participants?: string[]
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  currentTime = new Date()
  adminName = "מנהל המערכת"
  private timeSubscription?: Subscription

  stats: DashboardStats = {
    totalCandidates: 1247,
    activeCandidates: 892,
    totalMatches: 156,
    successfulMatches: 23,
    pendingMeetings: 45,
    todaysMeetings: 8,
    monthlyGrowth: 12.5,
    satisfactionRate: 94.2,
  }

  recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "success",
      title: "התאמה הצליחה!",
      description: "שרה כהן ודוד לוי החליטו להמשיך יחד",
      time: "לפני 2 שעות",
      participants: ["שרה כהן", "דוד לוי"],
    },
    {
      id: "2",
      type: "match",
      title: "התאמה חדשה נוצרה",
      description: "מערכת ה-AI מצאה התאמה בציון 96%",
      time: "לפני 4 שעות",
      participants: ["רחל אברהם", "יוסף מזרחי"],
    },
    {
      id: "3",
      type: "meeting",
      title: "פגישה נקבעה",
      description: "פגישה ראשונה בבית קפה מרכזי",
      time: "לפני 6 שעות",
      participants: ["מרים שמואל", "אברהם גולד"],
    },
    {
      id: "4",
      type: "registration",
      title: "מועמד חדש נרשם",
      description: "פרופיל חדש עבר אימות ת.ז בהצלחה",
      time: "לפני 8 שעות",
    },
  ]

  constructor(private router: Router) {}

  ngOnInit() {
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date()
    })
  }

  ngOnDestroy() {
    this.timeSubscription?.unsubscribe()
  }

  getGreeting(): string {
    const hour = this.currentTime.getHours()
    if (hour < 12) return "בוקר טוב"
    if (hour < 18) return "צהריים טובים"
    return "ערב טוב"
  }

  getActivityIcon(type: string): string {
    const icons = {
      success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      match:
        "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      meeting: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      registration:
        "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
    }
    return icons[type as keyof typeof icons] || icons.registration
  }

  navigateToProfiles() {
    this.router.navigate(["/candidates"])
  }

  navigateToMatches() {
    this.router.navigate(["/matches"])
  }

  navigateToMeetings() {
    this.router.navigate(["/meetings"])
  }

  navigateToReports() {
    this.router.navigate(["/reports"])
  }
}
