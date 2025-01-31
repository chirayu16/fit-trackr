import { Component, Input, OnInit, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { User } from '../../models/user.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [ChartModule, TableModule, CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit {
  @Input() users: User[] = [];
  selectedUser: User | null = null;
  chartData: any;
  chartOptions: any;
  usernames: string[] = [];
  previousSelection: User | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (this.users.length > 0) {
      this.selectedUser = this.users[0];
      this.previousSelection = this.selectedUser;
      this.updateChart();
    }
    if (isPlatformBrowser(this.platformId)) {
      this.setupChartOptions();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users']) {
      const currentUsers: User[] = changes['users'].currentValue || [];
      const previousUsers: User[] = changes['users'].previousValue || [];

      if (!previousUsers || previousUsers.length === 0) {
        this.selectedUser = currentUsers[0];
        this.updateChart();
        return;
      }

      if (this.selectedUser) {
        const updatedUser = currentUsers.find(
          (user: User) => user.userName === this.selectedUser?.userName
        );

        if (updatedUser) {
          this.selectedUser = updatedUser;
        } else if (currentUsers.length > previousUsers.length) {
          this.selectedUser = currentUsers[0];
        }
      } else if (currentUsers.length > 0) {
        this.selectedUser = currentUsers[0];
      }

      if (this.selectedUser) {
        this.updateChart();
      }
    }
  }

  onUserSelect(event: User | null): void {
    if (!event) {
      if (this.previousSelection) {
        this.selectedUser = this.previousSelection;
      }
    } else {
      this.selectedUser = event;
      this.previousSelection = event;
    }
    this.updateChart();
  }

  private updateChart(): void {
    if (!this.selectedUser) return;
    const workoutData = new Map<string, number>();
    this.selectedUser.workoutsData.forEach((workout) => {
      const current = workoutData.get(workout.workoutType) || 0;
      workoutData.set(workout.workoutType, current + workout.workoutMinutes);
    });
    this.chartData = {
      labels: Array.from(workoutData.keys()),
      datasets: [
        {
          label: 'Workout Minutes',
          data: Array.from(workoutData.values()),
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgb(54, 162, 235)'],
          borderWidth: 1,
        },
      ],
    };
  }

  private setupChartOptions(): void {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      this.chartOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
            title: {
              display: true,
              text: 'Minutes',
              color: textColorSecondary,
            },
          },
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };
    }
  }
}