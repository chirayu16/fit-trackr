import { WorkoutEntry } from './workout-entry.model';
export interface User {
    userName: string;
    workoutMinutes: number;
    totalWorkouts : number;
    workoutTypes : ('Swimming' | 'Yoga' | 'Running' | 'All types')[];
    workoutsData : WorkoutEntry[];
}