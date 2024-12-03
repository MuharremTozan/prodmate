import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lines-and-parts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lines-and-parts.component.html',
  styleUrl: './lines-and-parts.component.css'
})
export class LinesAndPartsComponent implements OnInit {
  lineId!: number;
  userId!: number;
  parts: any[] = [];
  partForm!: FormGroup;
  stocks: any[] = [];
  requirmentAmounts: number[] = [];
  showPopup: boolean = false; // Popup kontrolü için
  isReportModalOpen: boolean = false;
  produceTimes: number = 1;
  materialReport: any[] = [];
  produceTimesForm!: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.lineId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchParts(this.lineId);
    this.fetchStocks();
    this.produceTimesForm = this.fb.group({
      produceTimes: [1, [Validators.required, Validators.min(1)]]
    })
  }

  fetchParts(lineId: number): void {
    this.http.get<any[]>(`http://localhost:8080/api/lines-and-parts/${lineId}`)
        .subscribe(response => {
          console.log('Fetched parts:', response); // Gelen yanıtı logla
          this.parts = response.map(part => ({
            ...part,
            partId: part.partId,
            requirements: part.stockRequirements || [] // Requirements ekle
          }));
            this.initPartForm(); // Formu part durumuna göre başlat
        }, error => {
            console.error('Failed to fetch parts:', error);
        });
  }

  fetchStocks(): void {
    this.http.get<any[]>(`http://localhost:8080/api/stocks/user/${this.userId}`)
      .subscribe(response => {
        this.stocks = response;
      }, error => {
        console.error('Failed to fetch stocks:', error);
      });
  }

  initPartForm() {
    const isFinalProductDefault = this.parts.length === 0;

    this.partForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      salePrice: [0, [Validators.required, Validators.min(0)]],
      isFinalProduct: [isFinalProductDefault], // Varsayılan değer buradan geliyor
      stockRequirements: this.fb.array([]),
    });
  }

  openPartForm(): void {
    this.showPopup = true;
    this.initPartForm(); // Formu sıfırla ve varsayılan değerleri yükle
  }

  closePartForm(): void {
    this.showPopup = false;
  }

  get stockRequirements(): FormArray {
    return this.partForm.get('stockRequirements') as FormArray;
  }

  getRequirementFormGroup(index: number): FormGroup {
    return this.stockRequirements.at(index) as FormGroup;
  }
  
  addStockRequirement(): void {
    const requirementForm = this.fb.group({
      stockId: ['', Validators.required], // Dropdown için stok ID'si
      amount: [0, [Validators.required, Validators.min(1)]] // Kullanıcıdan alınan miktar
    });

    this.stockRequirements.push(requirementForm);
  }
  
  removeStockRequirement(index: number): void {
    this.stockRequirements.removeAt(index);
  }

  createPart(): void {
    if (this.partForm.valid) {
      const newPart = { ...this.partForm.value, lineId: this.lineId, userId: this.userId };

      this.http.post(`http://localhost:8080/api/lines-and-parts/create-with-line`, newPart)
        .subscribe(response => {
          if (newPart.isFinalProduct){
            console.log('Part added with new production line: ', response);
          } else {
            console.log('Part added to existing production line: ', response);
          }

          this.fetchParts(this.lineId); // Mevcut üretim hattı partlarını güncelle
        }, error => {
          console.error('Failed to create part:', error);
        }
      )

      }
      this.closePartForm();
    }

    openMaterialReport(): void {
      this.isReportModalOpen = true;
      this.materialReport = []; // Reset report
  }
  
  closeMaterialReport(): void {
      this.isReportModalOpen = false;
      this.produceTimes = 1; // Reset input
      this.materialReport = []; // Clear report
  }

  async calculateNeededMaterials(): Promise<void> {
    const produceTimes = this.produceTimesForm.get('produceTimes')?.value;

    if (!produceTimes || produceTimes < 1) {
        console.error('Invalid produce times value.');
        return;
    }

    const calculatedMaterials: { stockName: string; totalAmount: number }[] = [];
    const visitedLines = new Set<number>(); // Ziyaret edilen üretim hatlarını takip edin
    const visitedParts = new Set<number>(); // Ziyaret edilen parçaları takip edin

    await this.processLine(this.lineId, produceTimes, calculatedMaterials, visitedLines, visitedParts);

    this.materialReport = calculatedMaterials;
    console.log('Final Material Report:', this.materialReport);
}

// Rekursif olarak üretim hatlarını işleyen fonksiyon
async processLine(
  lineId: number, 
  produceTimes: number, 
  calculatedMaterials: any[], 
  visitedLines: Set<number>,
  visitedParts: Set<number>
): Promise<void> {
  if (visitedLines.has(lineId)) {
      console.log(`Line ${lineId} already processed, skipping.`);
      return; // Daha önce işlenmiş bir hattı tekrar işlemeyin
  }

  visitedLines.add(lineId); // Bu hattı işlenmiş olarak işaretle
  const parts = await this.fetchSubProductionLine(lineId);

  for (const part of parts) {
      if (visitedParts.has(part.partId)) {
        console.log(`Part ${part.name} (partId: ${part.partId}) already processed in another line, skipping.`);
            continue; // Bu parça daha önce başka bir hatta işlendi
      }

      visitedParts.add(part.partId); // Bu parça işlenmiş olarak işaretle

      if (!part.stockRequirements) {
          console.warn(`Part ${part.name} has no requirements.`);
          continue;
      }

      // Gereksinimleri hesapla
      part.stockRequirements.forEach((req: any) => {
          const totalAmount = req.amount * part.quantity * produceTimes;
          console.log(`Adding requirement: ${req.stockName}, Total: ${totalAmount}`);
          this.addToCalculatedMaterials(calculatedMaterials, req.stockName, totalAmount);
      });

      // Eğer FinalProduct ve ilk parça değilse, alt hattı işle
      if (part.isFinalProduct && part !== parts[0]) {
          console.log(`Processing sub-production line for part: ${part.name}`);
          const relatedLineIds = await this.fetchSubProductionLinesByPartId(part.partId);

          for (const subLineId of relatedLineIds) {
              console.log(`Processing sub-line ${subLineId} for partId ${part.partId}`);
              await this.processLine(subLineId, produceTimes, calculatedMaterials, visitedLines, visitedParts);
          }
      }
  }
}


// Yardımcı metod: Üretim hattındaki ilk elemanın FinalProduct olduğunu doğrula
isFinalProduct(part: any): boolean {
  const firstPart = this.parts[0];
  return firstPart && firstPart.id === part.id && part.isFinalProduct;
}

// Gereksinimleri birleştirmek için yardımcı fonksiyon
addToCalculatedMaterials(
  materials: { stockName: string; totalAmount: number }[], 
  stockName: string, 
  totalAmount: number
): void {
  const existingMaterial = materials.find(m => m.stockName === stockName);

  if (existingMaterial) {
      existingMaterial.totalAmount += totalAmount;
  } else {
      materials.push({ stockName, totalAmount });
  }
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

fetchSubProductionLinesByPartId(partId: number): Promise<number[]> {
  return this.http.get<number[]>(`http://localhost:8080/api/lines-and-parts/part/${partId}/lines`).toPromise()
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
}






}
