import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SurveyFormComponent } from './survey-form/survey-form.component';
import { ListAllSurveysComponent } from './list-all-surveys/list-all-surveys.component';


export const routes: Routes = [
        {path: '', component: WelcomeComponent},
        {path: 'survey-form', component: SurveyFormComponent},
        {path: 'list-all-surveys', component: ListAllSurveysComponent}
];
