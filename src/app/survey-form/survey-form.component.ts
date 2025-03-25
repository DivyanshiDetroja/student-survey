import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-survey-form',
  imports: [
    CommonModule,
    ReactiveFormsModule, // <-- Add ReactiveFormsModule here
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.css'
})
export class SurveyFormComponent {
  surveyForm: FormGroup;
  campusLikesOptions = ['Students', 'Location', 'Campus', 'Atmosphere', 'Dorm Rooms', 'Sports'];
  interestSources = ['Friends', 'Television', 'Internet', 'Other'];
  likelihoodOptions = ['Very Likely', 'Likely', 'Unlikely'];
  selectedCampusLikes: string[] = [];
  zipCodeData: any[] = []; // To store the loaded zip code data
  zipSubscription: Subscription | undefined; // To manage the subscription

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.surveyForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)] ],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      streetAddress: [''],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      city: ['' ],
      state: ['' ],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      date: ['', Validators.required],
      interestSource: ['' , Validators.required],
      likelihood: ['' , Validators.required],
      comments: [''],
    });
  }

  
  ngOnInit() {
    this.http.get<any>('zipcodes.json').subscribe({
      next: (data) => {
        this.zipCodeData = data.zip_codes;
        console.log('Received data:', this.zipCodeData);
      },
      error: (error) => {
        
        console.error('Error loading zip code data:', error);
      },
    });

    this.zipSubscription = this.surveyForm.get('zip')?.valueChanges.subscribe((zip) => {
      if (zip && zip.length === 5) {
        this.lookupZipCode(zip); // You will need to change lookupZipCode function to access zip_code property.
      } else {
        this.surveyForm.patchValue({ city: '', state: '' });
      }
    });
  }

  ngOnDestroy() {
    if (this.zipSubscription) {
      this.zipSubscription.unsubscribe();
    }
  }

  lookupZipCode(zip: string) {
    const zipInfo = this.zipCodeData.find((item) => item.zip_code === Number(zip)); // Corrected property name and type conversion
  
    if (zipInfo) {
      this.surveyForm.patchValue({
        city: zipInfo.city,
        state: zipInfo.state,
      });
    } else {
      this.surveyForm.patchValue({ city: '', state: '' });
    }
  }
  get formattedCampusLikes() {
    return this.selectedCampusLikes.join(',');
  }

  onCampusLikeChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedCampusLikes.push(value);
    } else {
      this.selectedCampusLikes = this.selectedCampusLikes.filter((item) => item !== value);
    }
  }

  onSubmit() {
    if (this.surveyForm.valid && this.selectedCampusLikes.length >= 2) {
      const surveyData = {
        ...this.surveyForm.getRawValue(),
        campusLikes: this.formattedCampusLikes,
      };
      this.http.post('http://localhost:8080/surveys', surveyData).subscribe({
        next: (response) => {
          console.log('Survey submitted successfully!', response);
          alert('Survey submitted successfully!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error submitting survey:', error);
          alert('There was an error submitting the survey.');
          console.log(surveyData);
        },
      });
    } else {
      const errorMessages: string[] = [];
      if (this.selectedCampusLikes.length < 2) {
        errorMessages.push('Please select at least 2 campus likes.');
      }
      Object.keys(this.surveyForm.controls).forEach((field) => {
        const control = this.surveyForm.get(field);
        if (control?.invalid && control.touched) {
          let errorMessage = '';
          switch (field) {
            case 'firstName':
              if (control.errors?.['required']) {
                errorMessage = 'First name is a required field.';
              } else if (control.errors?.['pattern']) {
                errorMessage = 'First name must contain only letters and spaces.';
              }
              break;
            case 'lastName':
              if (control.errors?.['required']) {
                errorMessage = 'Last name is a required field.';
              } else if (control.errors?.['pattern']) {
                errorMessage = 'Last name must contain only letters and spaces.';
              }
              break;
            case 'zip':
              if (control.errors?.['required']) {
                errorMessage = 'Zip code is a required field.';
              } else if (control.errors?.['pattern']) {
                errorMessage = 'Zip code must be 5 digits.';
              }
              break;
            case 'telephone':
              if (control.errors?.['required']) {
                errorMessage = 'Telephone number is a required field.';
              } else if (control.errors?.['pattern']) {
                errorMessage = 'Invalid telephone number format (e.g., 123-456-7890).';
              }
              break;
            case 'email':
              if (control.errors?.['required']) {
                errorMessage = 'Email is a required field.';
              } else if (control.errors?.['email']) {
                errorMessage = 'Invalid email format.';
              }
              break;
            case 'date':
              errorMessage = 'Date of Survey is a required field.';
              break;
            case 'interestSource':
              errorMessage = 'How did you become interested in the university? is a required field.';
              break;
            case 'likelihood':
              errorMessage = 'Likelihood of recommending this school to others is a required field.';
              break;
            default:
              errorMessage = `${field} is invalid.`;
          }
          if (errorMessage) {
            errorMessages.push(errorMessage);
          }
        }
      });
      alert(errorMessages.join('\n'));
    }
  }

  onZipBlur() {
    const zip = this.surveyForm.get('zip')?.value;
    if (zip && zip.length === 5) {
      this.lookupZipCode(zip);
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}