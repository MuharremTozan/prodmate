import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.css'
})
export class StockManagementComponent implements OnInit{
  stocks: any[] = [];
  stockForm!: FormGroup;
  showPopup: boolean = false;
  isEditMode: boolean = false;
  editingStockId!: number | null;
  userId!: number;

  constructor(private http: HttpClient, private fb: FormBuilder, private authService: AuthService){}

  ngOnInit(): void {
    this.setUserId();
    this.fetchStocks();
    this.initForm();
  }

  setUserId(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userId = parseInt(userId, 10);
    } else {
      console.error('User ID not found');
    }
  }

  fetchStocks(): void {
    if (!this.userId) {
      console.error('User ID is required to fetch stocks.');
      return;
    }
    this.http.get<any[]>(`http://localhost:8080/api/stocks/user/${this.userId}`)
      .subscribe(response => {
        this.stocks = response;
      }, error => {
        console.error('Failed to fetch stocks:', error);
      });
  }

  initForm(): void {
    this.stockForm = this.fb.group({
      name: ['', Validators.required],
      purchasePrice: [0, [Validators.required, Validators.min(0)]]
    });

  }

  addStock(): void {
    if (this.stockForm.valid) {
      this.http.post(`http://localhost:8080/api/stocks/user/${this.userId}`, this.stockForm.value)
        .subscribe(response => {
          this.stocks.push(response); 
          this.closePopup();
        }, error => {
          console.error('Failed to add stock:', error);
        });
    }
  }

  openPopup(): void {
    this.showPopup = true;
    this.isEditMode = false;
    this.stockForm.reset();
  }

  openEditPopup(stock : any): void {
    this.showPopup = true;
    this.isEditMode = true;
    this.editingStockId = stock.stockId;
    this.stockForm.patchValue(stock);
  }

  updateStock(): void {
    if (this.stockForm.valid && this.editingStockId) {
      this.http.put(`http://localhost:8080/api/stocks/${this.editingStockId}`, this.stockForm.value)
        .subscribe(response => {
          const index = this.stocks.findIndex(stock => stock.stockId === this.editingStockId);
          if (index > -1) {
            this.stocks[index] = response; 
          }
          this.closePopup();
        }, error => {
          console.error('Failed to update stock:', error);
        });
    }
  }

  deleteStock(stockId: number): void {
    if (confirm('Are you sure you want to delete this stock?')) {
      this.http.delete(`http://localhost:8080/api/stocks/${stockId}`)
        .subscribe(() => {
          this.stocks = this.stocks.filter(stock => stock.stockId !== stockId);
        }, error => {
          console.error('Failed to delete stock:', error);
        });
    }
  }

  closePopup(): void {
    this.showPopup = false;
    this.stockForm.reset();
    this.editingStockId = null;
  }

}
