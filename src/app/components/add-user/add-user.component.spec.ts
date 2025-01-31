import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserComponent } from './add-user.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    messageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        ToastModule,
        BrowserAnimationsModule,
        AddUserComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    const realMessageService =
      fixture.debugElement.injector.get(MessageService);
    realMessageService.add = messageService.add;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with an empty form', () => {
      expect(component.userForm.get('userName')?.value).toBe('');
      expect(component.userForm.get('workoutMinutes')?.value).toBeNull();
      expect(component.userForm.get('selectedWorkoutType')?.value).toBe('');
    });

    it('should be invalid when empty', () => {
      expect(component.userForm.valid).toBeFalsy();
    });

    it('should be valid when all fields are filled correctly', () => {
      component.userForm.patchValue({
        userName: 'John Doe',
        workoutMinutes: 30,
        selectedWorkoutType: { name: 'Running', code: 'Running' },
      });

      expect(component.userForm.valid).toBeTruthy();
    });

    it('should validate workout minutes to be greater than 0', () => {
      const workoutMinutesControl = component.userForm.get('workoutMinutes');
      workoutMinutesControl?.setValue(-1);

      expect(workoutMinutesControl?.errors?.['min']).toBeTruthy();

      workoutMinutesControl?.setValue(30);
      expect(workoutMinutesControl?.errors).toBeNull();
    });
  });

  describe('Dialog Operations', () => {
    it('should show dialog and reset form when showDialog is called', () => {
      component.userForm.patchValue({
        userName: 'Test User',
        workoutMinutes: 45,
        selectedWorkoutType: { name: 'Yoga', code: 'Yoga' },
      });

      component.showDialog();

      expect(component.visible).toBeTruthy();
      expect(component.userForm.get('userName')?.value).toBe('');
      expect(component.userForm.get('workoutMinutes')?.value).toBeNull();
      expect(component.userForm.get('selectedWorkoutType')?.value).toBe('');
      expect(component.userForm.pristine).toBeTrue();
      expect(component.userForm.untouched).toBeTrue();
    });

    it('should close dialog and reset form when closeDialog is called', () => {
      component.visible = true;
      component.userForm.patchValue({
        userName: 'Test User',
        workoutMinutes: 45,
        selectedWorkoutType: { name: 'Yoga', code: 'Yoga' },
      });

      component.closeDialog();

      expect(component.visible).toBeFalsy();
      expect(component.userForm.get('userName')?.value).toBe('');
      expect(component.userForm.get('workoutMinutes')?.value).toBeNull();
      expect(component.userForm.get('selectedWorkoutType')?.value).toBe('');
      expect(component.userForm.pristine).toBeTrue();
      expect(component.userForm.untouched).toBeTrue();
    });
  });

  describe('Add User Operation', () => {
    it('should emit user data and show success message when form is valid', () => {
      spyOn(component.userAdded, 'emit');

      component.userForm.patchValue({
        userName: 'John Doe',
        workoutMinutes: 30,
        selectedWorkoutType: { name: 'Running', code: 'Running' },
      });

      component.addUser();

      expect(component.userAdded.emit).toHaveBeenCalledWith({
        userName: 'John Doe',
        workoutMinutes: 30,
        workoutType: 'Running',
      });

      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        detail: "John Doe's workout added successfully!",
        key: 'tr',
      });

      expect(component.visible).toBeFalsy();
    });

    it('should show warning message and mark fields as touched when form is invalid', () => {
      component.userForm.patchValue({
        userName: '',
        workoutMinutes: null,
        selectedWorkoutType: '',
      });

      component.addUser();

      expect(component.errorMessage).toBeTrue();
      expect(component.userForm.touched).toBeTrue();
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'warn',
        detail: 'All fields are necessary',
        key: 'tr',
      });
    });

    it('should show warning message when showWarn is called directly', () => {
      component.showWarn();

      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'warn',
        detail: 'All fields are necessary',
        key: 'tr',
      });
    });
  });

  describe('Reset Operation', () => {
    it('should reset all form fields and state when resetForm is called', () => {
      component.userName = 'Test';
      component.workoutMinutes = 45;
      component.selectedWorkoutType = 'Running';
      component.submitted = true;

      component.resetForm();

      expect(component.userName).toBe('');
      expect(component.workoutMinutes).toBeNull();
      expect(component.selectedWorkoutType).toBe('');
      expect(component.submitted).toBeFalse();
    });
  });

  describe('Workout Types', () => {
    it('should initialize with correct workout types', () => {
      expect(component.workoutTypes).toEqual([
        { name: 'Swimming', code: 'Swimming' },
        { name: 'Yoga', code: 'Yoga' },
        { name: 'Running', code: 'Running' },
      ]);
    });
  });
});
