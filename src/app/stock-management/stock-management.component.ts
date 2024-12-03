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
      amount: [0, [Validators.required, Validators.min(1)]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      isStockable: [true]
    });

    this.stockForm.get('isStockable')?.valueChanges.subscribe(isStockable => {
      if (!isStockable) {
        this.stockForm.patchValue({ amount: 0});
        this.stockForm.get('amount')?.disable();
      } else {
        this.stockForm.get('amount')?.enable();
      }
  });
  }

  addStock(): void {
    if (this.stockForm.valid) {
      this.http.post(`http://localhost:8080/api/stocks/user/${this.userId}`, this.stockForm.value)
        .subscribe(response => {
          this.stocks.push(response); // Yeni stok listeye ekleniyor
          this.closePopup(); // Popup'ı kapat
        }, error => {
          console.error('Failed to add stock:', error);
        });
    }
  }

  openPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.stockForm.reset(); // Formu sıfırla
  }

}
