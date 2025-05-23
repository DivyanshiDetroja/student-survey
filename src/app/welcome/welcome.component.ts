import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  constructor(private router: Router) { }

  navigateToSurvey(){
    this.router.navigate(['/survey-form']);
  }
  navigateToRecords(){
    this.router.navigate(['/list-all-surveys']);
  }
}
