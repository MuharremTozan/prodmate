import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.css'
})
export class SalesReportComponent {
  finalProducts: any[] = [];
  userId!: number;
  selectedProduct: any = null;
  produceTimes: number = 1;
  calculationResult: any = null;
  calculationForm: FormGroup;
  stocks: { stockId: number; stockName: string; unitCost: number }[] = [];

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.calculationForm = this.fb.group({
      produceTimes: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.fetchPrimaryFinalProducts();
    this.fetchStocks();
    
  }

  fetchPrimaryFinalProducts(): void {
    this.http.get<any[]>(`http://localhost:8080/api/lines-and-parts/primary-final-products?userId=${this.userId}`)
      .subscribe(response => {
        this.finalProducts = response.map(product => ({
          ...product,
          lineId: product.lineId || null, // Line ID kontrolü
          stockRequirements: product.stockRequirements || [] // Gereksinim kontrolü
        }));
        console.log('Fetched Primary Final Products:', this.finalProducts);
      }, error => {
        console.error('Error fetching primary final products:', error);
      });
  }
  
  
  

  openCalculationPopup(product: any): void {
    this.selectedProduct = product;
    this.calculationForm.reset({ produceTimes: 1 });

    console.log('Selected Product for calculation:', this.selectedProduct);
  }

  closeCalculationPopup(): void {
    this.selectedProduct = null;
    this.calculationResult = null; // Hesaplama sonuçlarını sıfırla
  }
  

  async calculateProfit(): Promise<void> {
    if (this.calculationForm.invalid){
      alert('Please enter a valid production amount!');
      return;
    }
    const produceTimes = this.calculationForm.get('produceTimes')?.value;
    const salesRevenue = this.selectedProduct.salePrice * produceTimes;
    const materialCosts = await this.calculateMaterialCosts(this.selectedProduct.partId, this.selectedProduct.lineId, produceTimes);
    const profit = salesRevenue - materialCosts;
  
    this.calculationResult = { salesRevenue, cost: materialCosts, profit };
  }
  
  async calculateMaterialCosts(partId: number, lineId: number, produceTimes: number): Promise<number> {
    const visitedParts = new Set<number>(); 
    const visitedLines = new Set<number>(); 
    const calculatedMaterials: { stockName: string; totalAmount: number; unitCost: number }[] = [];

    console.log("ONEMLI calculateMaterialCosts" + lineId);
    await this.processLineForCosts(partId, lineId, produceTimes, calculatedMaterials, visitedLines, visitedParts);

    // Toplam maliyet hesapla
    const totalCost = calculatedMaterials.reduce((sum, material) => sum + (material.totalAmount * material.unitCost), 0);
    console.log('Final Material Costs:', totalCost, calculatedMaterials);
    return totalCost;
}

async processLineForCosts(
  partId: number,
  lineId: number,
  produceTimes: number,
  calculatedMaterials: any[],
  visitedLines: Set<number>,
  visitedParts: Set<number>
): Promise<void> {
  if (visitedLines.has(lineId)) {
    console.log(`Line ${lineId} already processed, skipping.`);
    return; 
  }

  visitedLines.add(lineId);
  const parts = await this.fetchSubProductionLine(lineId);

  for (const part of parts) {
    if (visitedParts.has(part.partId)){
      console.log(`Part ${part.name} (partId: ${partId}) already processed in another line, skipping.`);
            continue; 
    }

    visitedParts.add(partId);

    if (!part.stockRequirements) {
      console.warn(`Part ${part.name} has no requirements.`);
      continue;
    }

    part.stockRequirements.forEach((req: any) => {
      const totalAmount = req.amount * part.quantity * produceTimes;
      const unitCost = this.getStockCost(req.stockId);
      this.addToCalculatedMaterials(calculatedMaterials, req.stockName, totalAmount, unitCost);
    });
    console.log(`Processed stock requirements for part ${partId} in line ${lineId}`);

    if (part.isFinalProduct && part !== parts[0]) {
      console.log(`Processing sub-production line for part: ${part.name}`);
      const subLines = await this.fetchSubProductionLinesByPartId(partId, lineId);

      for (const subLineId of subLines) {
        console.log(`Processing sub-line ${subLineId} for partId ${partId}`);
        await this.processLineForCosts(partId, subLineId, produceTimes, calculatedMaterials, visitedLines, visitedParts);
      }
    }
  }
}



  addToCalculatedMaterials(
    materials: { stockName: string; totalAmount: number; unitCost: number }[],
    stockName: string,
    totalAmount: number,
    unitCost: number
  ): void {
    const existingMaterial = materials.find(m => m.stockName === stockName);

    if (existingMaterial) {
      existingMaterial.totalAmount += totalAmount;
    } else {
      materials.push({ stockName, totalAmount, unitCost });
    }
  }

  fetchStocks(): void {
    this.http.get<{ stockId: number; stockName: string; unitCost: number }[]>('http://localhost:8080/api/lines-and-parts/stocks')
      .subscribe(response => {
        this.stocks = response;
        console.log('Fetched Stocks:', this.stocks);
      }, error => {
        console.error('Error fetching stocks:', error);
      });
  }

  getStockCost(stockId: number): number {
    const stock = this.stocks.find(s => s.stockId === stockId);
    if (!stock) {
      console.warn(`Stock with ID ${stockId} not found.`);
      return 0; // Varsayılan maliyet
    }
    return stock.unitCost || 0;
  }


// Alt hat verilerini çeken metot
  fetchSubProductionLine(lineId: number): Promise<any[]> {
    if (!lineId) {
        console.error('Line ID is undefined.');
        return Promise.resolve([]);
    }

    return this.http.get<any[]>(`http://localhost:8080/api/lines-and-parts/${lineId}`).toPromise()
        .then(response => {
            console.log('Fetched sub-production line:', response);
            if (!response) {
                console.warn(`No sub parts found for lineId: ${lineId}`);
                return [];
            }
            return response;
        })
        .catch(error => {
            console.error(`Error fetching sub-production line for lineId: ${lineId}`, error);
            return [];
        });
  }

  async fetchSubProductionLinesByPartId(partId: number, currentLineId: number): Promise<number[]> {
    const subLines = await this.http.get<number[]>(`http://localhost:8080/api/lines-and-parts/part/${partId}/lines`).toPromise()
        .then(response => {
            console.log(`Fetched lineIds for partId ${partId}:`, response);
            if (!response) {
              console.warn("No lineIds for partId");
              return [];
            }
            return response;
        })
        .catch(error => {
            console.error(`Error fetching lineIds for partId: ${partId}`, error);
            return [];
        });

        return subLines.filter(lineId => lineId > currentLineId);
  }


}
