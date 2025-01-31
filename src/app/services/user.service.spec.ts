import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('UserService', () => {
  describe('Browser Platform', () => {
    let service: UserService;
    let localStorageMock: { [key: string]: string | null };
    let mockPlatformId: Object = 'browser';

    beforeEach(() => {
      localStorageMock = {};

      spyOn(window.localStorage, 'getItem').and.callFake(
        (key: string) => localStorageMock[key] || null
      );
      spyOn(window.localStorage, 'setItem').and.callFake(
        (key: string, value: string) => {
          localStorageMock[key] = value;
        }
      );

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

      localStorageMock['users'] = null;
      service = new UserService(mockPlatformId);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'users',
        jasmine.any(String)
      );
    });

    it('should load users from localStorage', () => {
      const mockUsers = [
        {
          userName: 'Test User',
          workoutTypes: ['Yoga'],
          totalWorkouts: 1,
          workoutMinutes: 30,
          workoutsData: [],
        },
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
        {
          userName: 'John Doe',
          workoutTypes: ['Running'],
          totalWorkouts: 2,
          workoutMinutes: 60,
          workoutsData: [],
        },
      ];

      service.saveUsers(newUsers);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'users',
        JSON.stringify(newUsers)
      );
    });
  });

  describe('Server Platform', () => {
    let service: UserService;
    let localStorageMock: { [key: string]: string | null };

    beforeEach(() => {
      localStorageMock = {};

      spyOn(window.localStorage, 'getItem').and.callFake(
        (key: string) => localStorageMock[key] || null
      );
      spyOn(window.localStorage, 'setItem').and.callFake(
        (key: string, value: string) => {
          localStorageMock[key] = value;
        }
      );

      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });

      service = TestBed.inject(UserService);
    });

    it('should return empty array when loading users on server', () => {
      const users = service.loadUsers();
      expect(users).toEqual([]);
      expect(localStorage.getItem).not.toHaveBeenCalled();
    });

    it('should not save users when on server', () => {
      const newUsers = [
        {
          userName: 'Test User',
          workoutTypes: ['Yoga'],
          totalWorkouts: 1,
          workoutMinutes: 30,
          workoutsData: [],
        },
      ];

      service.saveUsers(newUsers);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should not initialize default users when on server', () => {
      service = new UserService('server');
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
