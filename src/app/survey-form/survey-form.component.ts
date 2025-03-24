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
      firstName: ['' ],
      lastName: [''],
      streetAddress: [''],
      zip: [''],
      city: ['' ],
      state: ['' ],
      telephone: [''],
      email: [''],
      date: [''],
      interestSource: [''],
      likelihood: [''],
      comments: ['']
    });
  }

  // ngOnInit() {
  //   // Load the zip code data from the JSON file
  //   this.http.get<any>('assets/zipcodes.json').subscribe({
  //     next: data => {
  //       this.zipCodeData = data.zipcodes; // Extract the zipcodes array
  //     },
  //     error: error => {
  //       console.error('Error loading zip code data:', error);
  //     }
  //   });
    

  //   // Subscribe to zip code value changes
  //   this.zipSubscription = this.surveyForm.get('zip')?.valueChanges.subscribe(zip => {
  //     if (zip && zip.length === 5) {
  //       this.lookupZipCode(zip);
  //     } else {
  //       // Clear city and state if zip is invalid
  //       this.surveyForm.patchValue({ city: '', state: '' });
  //     }
  //   });
  // }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.zipSubscription) {
      this.zipSubscription.unsubscribe();
    }
  }

  // lookupZipCode(zip: string) {
  //   const zipInfo = this.zipCodeData.find(item => item.zip === zip);
  //   if (zipInfo) {
  //     // Update city and state form controls
  //     this.surveyForm.patchValue({
  //       city: zipInfo.city,
  //       state: zipInfo.state
  //     });
  //   } else {
  //     // Clear city and state if zip code not found
  //     this.surveyForm.patchValue({ city: '', state: '' });
  //   }
  // }
  

  get formattedCampusLikes() {
    return this.selectedCampusLikes.join(',');
  }

  // Method to handle changes in campus likes checkboxes
  onCampusLikeChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedCampusLikes.push(value);
    } else {
      this.selectedCampusLikes = this.selectedCampusLikes.filter(item => item !== value);
    }
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      const surveyData = {
        ...this.surveyForm.getRawValue(),
        campusLikes: this.formattedCampusLikes
      };
      // Send data to the backend server
      this.http.post('http://localhost:8080/surveys', surveyData)
        .subscribe({
          next: response => {
            console.log('Survey submitted successfully!', response);
            alert('Survey submitted successfully!');
            this.router.navigate(['/']);
          },
          error: error => {
            console.error('Error submitting survey:', error);
            alert('There was an error submitting the survey.');
            // console.log(surveyData);
          }
        });
    } else {
      alert('Please fill in all required fields.');
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}



