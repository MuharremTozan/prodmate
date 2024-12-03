import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionLinesService {
  private baseUrl = 'http://localhost:8080/api/production-lines';

  constructor(private http: HttpClient) {}

  getProductionLines(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createProductionLine(productionLine: { name: string }): Observable<any> {
    return this.http.post(this.baseUrl, productionLine);
  }
}
