import { WorkoutCategory } from './../../models/workout-category.model';
import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AddUserComponent } from '../add-user/add-user.component';
import { TabViewModule } from 'primeng/tabview';
import { UserTableComponent } from "../user-table/user-table.component";
import { User } from '../../models/user.model';
import { WorkoutEntry } from '../../models/workout-entry.model';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, AddUserComponent, TabViewModule, UserTableComponent, DropdownModule, CommonModule, FormsModule, InputTextModule,ChartComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers:[UserService] 
})
export class HomeComponent {
  users: User[] =[];  //to store new user
  filteredUsers: User[] = []; //to store final operated user
  userNameList: string[] = [];
  selectedUser: string ='';
  workoutTypes: WorkoutCategory[] = [
    {name : 'All types', code : 'All types'},
    {name : 'Yoga', code : 'Yoga'},
    {name : 'Running', code : 'Running'},
    {name : 'Swimming', code: 'Swimming'}
  ];
  selectedWorkout : 'Yoga' | 'Running' | 'Swimming' | 'All types' = 'All types';
  searchText: string = '';

  constructor( private userService: UserService) { }

  loadUsers(): void {

    const savedUsers = this.userService.loadUsers();
    if( savedUsers && savedUsers.length > 0) {
      this.users = savedUsers;
      this.filteredUsers = [...this.users];
      this.userNameList = this.users?.map((user) => user.userName);
      this.selectedUser = this.userNameList[0];
    }
  }

  saveUsers(): void {
    this.userService.saveUsers(this.users);
  }

  addUserToTable(user: any) {
    const newWorkout : WorkoutEntry = {
      workoutType: user.workoutType,
      workoutMinutes: user.workoutMinutes
    };

    const existingUser = this.users.find((existingUser)=> existingUser.userName.toLowerCase() === user.userName.toLowerCase());

    if(existingUser) {  //userExits, check for same workout
      const existingUserWorkout = existingUser.workoutsData.find(
        (workout) => workout.workoutType === newWorkout.workoutType 
      );

      if(existingUserWorkout) {  //workouttype exits
        existingUserWorkout.workoutMinutes += newWorkout.workoutMinutes;
      }
      else {
        existingUser.workoutsData.push(newWorkout);
      }
      existingUser.totalWorkouts++;
      existingUser.workoutMinutes += newWorkout.workoutMinutes;

      if(!existingUser.workoutTypes.includes(newWorkout.workoutType))
      {
        existingUser.workoutTypes.push(newWorkout.workoutType)
      }
      
      this.users = [...this.users];
      this.selectedUser = existingUser.userName;
    }
    else {
      const newUser = {
        userName: user.userName,
        workoutTypes: [user.workoutType],
        totalWorkouts: 1,
        workoutMinutes: user.workoutMinutes,
        workoutsData: [newWorkout], 
      };
      this.users = [newUser, ...this.users];

      this.userNameList.unshift(newUser.userName);
      this.selectedUser = newUser.userName;
    }
    
    this.filterUsers();
    this.saveUsers();

  }

  filterUsers() {
    this.filteredUsers = this.users;

    if(this.searchText?.length> 0) {
      this.filteredUsers = this.users.filter(
        (user) => user.userName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    if(this.selectedWorkout && this.selectedWorkout !== 'All types') {
      this.filteredUsers = this.filteredUsers.filter((user) => {
         return user.workoutTypes.includes(this.selectedWorkout)
    });
  }
  }

  ngOnInit(): void {
    this.loadUsers();
  }
}
