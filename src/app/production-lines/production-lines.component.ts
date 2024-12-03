import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-production-lines',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './production-lines.component.html',
  styleUrls: ['./production-lines.component.css']
})
export class ProductionLinesComponent implements OnInit {
  productionLines: any[] = [];
  productionLineForm: FormGroup;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.productionLineForm = this.fb.group({
      name: ['']
    });
  }

  
  
  ngOnInit(): void {
    this.fetchProductionLines();
  }

  fetchProductionLines(): void {
    const userId = this.authService.getUserId();
    if(!userId){
      console.error('User ID is missing');
      return;
    }

    this.http.get(`http://localhost:8080/api/production-lines/${userId}`).subscribe((response: any) => {
      console.log('API Response:', response);
      this.productionLines = response;

    },
    (error) => {
      console.error('Failed to fetch production lines', error);
    }
  );
  }

  createProductionLine(): void {
    const userId = this.authService.getUserId();
    if(!userId){
      alert('User ID not found. Please log in again.');
      return;
    }

    const newLine = {
      name: this.productionLineForm.get('name')?.value,
      userId: userId
    };

    this.http.post('http://localhost:8080/api/production-lines', newLine).subscribe((response: any) => {
      this.productionLines.push(response);
      this.productionLineForm.reset();
    },
    (error) => {
      console.error('Error creating production line:', error);
    }
      );
  }

  navigateToLine(productionLineId: number): void {
    if (!productionLineId) {
      console.error('Line ID is undefined');
      return;
    }
    console.log(productionLineId);
    this.router.navigate(['/production-lines', productionLineId]); // Doğru URL kullanımı
  }



}




