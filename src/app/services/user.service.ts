import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly DEFAULT_USERS: User[] = [
    {
      userName: 'Chirayu ',
      workoutTypes: ['Swimming', 'Yoga'],
      totalWorkouts: 2,
      workoutMinutes: 90,
      workoutsData: [
        { workoutType: 'Swimming', workoutMinutes: 45 },
        { workoutType: 'Yoga', workoutMinutes: 45 },
      ],
    },
    {
      userName: 'Ayush',
      workoutTypes: ['Yoga', 'Running'],
      totalWorkouts: 2,
      workoutMinutes: 120,
      workoutsData: [
        { workoutType: 'Yoga', workoutMinutes: 60 },
        { workoutType: 'Running', workoutMinutes: 60 },
      ],
    },
    {
      userName: 'Elon',
      workoutTypes: ['Running', 'Swimming'],
      totalWorkouts: 2,
      workoutMinutes: 75,
      workoutsData: [
        { workoutType: 'Running', workoutMinutes: 30 },
        { workoutType: 'Swimming', workoutMinutes: 45 },
      ],
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers(): void {
    // Check if users exist in localStorage
    if (isPlatformBrowser(this.platformId)) {
      const existingUsers = localStorage.getItem('users');
      if (!existingUsers) {
        // If no users exist, save the default users
        localStorage.setItem('users', JSON.stringify(this.DEFAULT_USERS));
      }
    }
  }

  loadUsers(): any[] {
    if (isPlatformBrowser(this.platformId)) {
      const savedUsers = localStorage.getItem('users');
      return savedUsers ? JSON.parse(savedUsers) : [];
    }
    return [];
  }

  saveUsers(users: any[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
}
