import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,  } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { User } from '../../models/user.model';
import { WorkoutCategory } from '../../models/workout-category.model';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    FloatLabelModule,
    ReactiveFormsModule,
    ToastModule,
    RippleModule
  
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  providers: [MessageService]
})
export class AddUserComponent {
  @Output() userAdded = new EventEmitter<Partial<User>>();
  
  userForm: FormGroup;
  userName: string | undefined;
  workoutMinutes: number | null = null;
  selectedWorkoutType: string = '';
  visible: boolean = false;
  submitted: boolean = false;
  errorMessage: boolean = false;
  workoutTypes: WorkoutCategory[] = [
    { name: 'Swimming', code: 'Swimming' },
    { name: 'Yoga', code: 'Yoga' },
    { name: 'Running', code: 'Running' },
  ];

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      workoutMinutes: [null, [Validators.required, Validators.min(1)]],
      selectedWorkoutType: ['', Validators.required]
    });
  }

  showDialog() {
    this.userForm.reset({
      userName: '',
      workoutMinutes: null,
      selectedWorkoutType: ''
    });
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.visible = true;
  }

  resetForm() {
    this.userName = '';
    this.workoutMinutes = null;
    this.selectedWorkoutType = '';
    this.submitted = false;
  }

  closeDialog() {
    this.userForm.reset({
      userName: '',
      workoutMinutes: null,
      selectedWorkoutType: ''
    });
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.visible = false;
  }
  

  addUser() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const user = {
          userName: formValue.userName,
          workoutMinutes: formValue.workoutMinutes,
          workoutType: formValue.selectedWorkoutType.name // Transform here
      };
      this.userAdded.emit(user);
      this.closeDialog();
    } else {
      this.errorMessage = true; 
      this.userForm.markAllAsTouched();
      
      if (this.errorMessage) {
        this.showWarn();
      }
    }
  }
  

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Message Content' });
  }
}
