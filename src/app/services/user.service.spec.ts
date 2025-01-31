import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('UserService', () => {
  let service: UserService;
  let localStorageMock: { [key: string]: string | null };
  let mockPlatformId: Object = 'browser'; // Mock as if it's running in a browser

  beforeEach(() => {
    localStorageMock = {}; // Mock localStorage object

    spyOn(window.localStorage, 'getItem').and.callFake((key: string) =>
      localStorageMock[key] || null
    );
    spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageMock[key] = value;
    });

    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: mockPlatformId }],
    });

    service = TestBed.inject(UserService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize default users if none exist', () => {
    spyOn<any>(service, 'initializeDefaultUsers').and.callThrough();

    localStorageMock['users'] = null; // Simulate empty storage
    service = new UserService(mockPlatformId);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'users',
      jasmine.any(String)
    );
  });

  it('should load users from localStorage', () => {
    const mockUsers = [
      { userName: 'Test User', workoutTypes: ['Yoga'], totalWorkouts: 1, workoutMinutes: 30, workoutsData: [] },
    ];

    localStorageMock['users'] = JSON.stringify(mockUsers);

    const users = service.loadUsers();

    expect(users).toEqual(mockUsers);
  });

  it('should return an empty array if no users exist', () => {
    localStorageMock['users'] = null;

    const users = service.loadUsers();

    expect(users).toEqual([]);
  });

  it('should save users to localStorage', () => {
    const newUsers = [
      { userName: 'John Doe', workoutTypes: ['Running'], totalWorkouts: 2, workoutMinutes: 60, workoutsData: [] },
    ];

    service.saveUsers(newUsers);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'users',
      JSON.stringify(newUsers)
    );
  });
});
