
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-list-all-surveys',
  imports: [CommonModule, HttpClientModule, MatTableModule],
  templateUrl: './list-all-surveys.component.html',
  styleUrl: './list-all-surveys.component.css'
})
export class ListAllSurveysComponent implements OnInit{
  dataSource = new MatTableDataSource<any>(); // Initialize MatTableDataSource
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'streetAddress', 'zip', 'city', 'state', 'telephone', 'email', 'date', 'campuslikes', 'interestSource', 'likelihood', 'comments']; // Specify columns to display

  constructor(private http: HttpClient, private router: Router) {} // Inject Router here

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords(): void {
    this.http.get<any[]>('http://localhost:8080/surveys')
      .subscribe({
        next: data => {
          this.dataSource.data = data; // Set data to MatTableDataSource
          console.log('Records fetched successfully!', data);
        },
        error: error => {
          console.error('Error fetching records:', error);
          alert('There was an error fetching the records.');
        }
      });

  }

  onCancel() {
    this.router.navigate(['/']); // Now router is available and this will work
  }
}

