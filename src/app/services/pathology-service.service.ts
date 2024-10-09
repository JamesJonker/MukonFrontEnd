import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dateTimestampProvider } from "rxjs/internal/scheduler/dateTimestampProvider";

@Injectable({ providedIn: "root" })

export class PathologyService {

  private baseUrl = 'http://localhost:3000';

    private blood_test_jsonUrl = '/assets/bloodtests.json'; 

    private requisitions_jsonUrl = 'assets/requisitions.json'
    private jsonUrl = 'assets/bloodtests.json';

    bloodTests : any;
    req_data_existing : any;


    constructor(private http: HttpClient) {}
    

    
    getRequisitionData(): Observable<any> {

        return this.http.get(this.requisitions_jsonUrl);

      }

      getBloodtestList(): Observable<any> {

        return this.http.get(this.jsonUrl);

      }

      getRequisitionexisting(){
        console.log('getRequisitionexisting -- 1', this.req_data_existing);
        return this.req_data_existing;
      }

      getJsonFile() {
        return this.http.get(`${this.baseUrl}/requisition`);
      }

      createNewRequisition(req: any) {

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseUrl}/createReq`, req, { headers });
      }

      searchFilter(searchTerm: string): Observable<any> {
        return this.http.get<any[]>(`${this.baseUrl}/searchFilter?query=${searchTerm}`)
      }

      addResults(req : any){

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseUrl}/updateRequisition`, req, { headers });

        
        
      }
} 