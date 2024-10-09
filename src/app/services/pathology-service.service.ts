import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { dateTimestampProvider } from "rxjs/internal/scheduler/dateTimestampProvider";

@Injectable({ providedIn: "root" })

export class PathologyService {

  private baseUrl = 'http://localhost:3000';

    // private requisitions_jsonUrl = '/src/assets/requisitions.json'; 
    private blood_test_jsonUrl = '/assets/bloodtests.json'; 

    private requisitions_jsonUrl = 'assets/requisitions.json'
    private jsonUrl = 'assets/bloodtests.json';

    bloodTests : any;
    req_data_existing : any;

    // bloodTests = [{
    //     "testId": 1,
    //     "mnemonic": "HDL",
    //     "description": "High Density Lipoprotein",
    //     "isActive": true
    // },
    // {
    //     "testId": 2,
    //     "mnemonic": "LDL",
    //     "description": "Low Density Lipoprotein",
    //     "isActive": true
    // }, {
    //     "testId": 3,
    //     "mnemonic": "PV",
    //     "description": "Plasma Viscosity",
    //     "isActive": true
    // }, {
    //     "testId": 4, 
    //     "mnemonic": "CRP",
    //     "description": "C-Reactive Protein",
    //     "isActive": true
    // }, {
    //     "testId": 5,
    //     "mnemonic": "CBC",
    //     "description": "Complete Blood Count",
    //     "isActive": true
    // }, {
    //     "testId": 6,
    //     "mnemonic": "TSH",
    //     "description": "Thyroid-stimulating hormone",
    //     "isActive": true
    // }, {
    //     "testId": 7,
    //     "mnemonic": "PTH",
    //     "description": "Parathyroid hormone",
    //     "isActive": true
    // }, {
    //     "testId": 8,
    //     "mnemonic": "ESR",
    //     "description": "Erythrocyte Sedimentation Rate",
    //     "isActive": true
    // }, {
    //     "testId": 9,
    //     "mnemonic": "INR",
    //     "description": "International Normalized Ratio",
    //     "isActive": true
    // }, {
    //     "testId": 10,
    //     "mnemonic": "LFT",
    //     "description": "Liver Function Test",
    //     "isActive": true
    // }, {
    //     "testId": 11,
    //     "mnemonic": "U+E",
    //     "description": "Urea and Electrolytes",
    //     "isActive": true
    // }, {
    //     "testId": 12,
    //     "mnemonic": "CMP",
    //     "description": "Comprehensive Metabolic Panel",
    //     "isActive": true
    // }, {
    //     "testId": 13,
    //     "mnemonic": "WBC",
    //     "description": "White Blood Cell Count",
    //     "isActive": true
    // }, {
    //     "testId": 14,
    //     "mnemonic": "RBC",
    //     "description": "Red Blood Cell Count",
    //     "isActive": true
    // }, {
    //     "testId": 15,
    //     "mnemonic": "HBC",
    //     "description": "Hemoglobin",
    //     "isActive": true
    // }, {
    //     "testId": 16,
    //     "mnemonic": "HCT",
    //     "description": "Hematocrit",
    //     "isActive": true
    // }, {
    //     "testId": 17,
    //     "mnemonic": "PLT",
    //     "description": "Platelets",
    //     "isActive": true
    // }, {
    //     "testId": 18,
    //     "mnemonic": "Na",
    //     "description": "Sodium",
    //     "isActive": true
    // }, {
    //     "testId": 19,
    //     "mnemonic": "K",
    //     "description": "Potassium",
    //     "isActive": true
    // }, {
    //     "testId": 20,
    //     "mnemonic": "CR",
    //     "description": "Creatinine ",
    //     "isActive": true
    // }, {
    //     "testId": 21,
    //     "mnemonic": "Ucr",
    //     "description": "Urine Createnine",
    //     "isActive": true
    // }, {
    //     "testId": 22,
    //     "mnemonic": "Ur",
    //     "description": "Urea",
    //     "isActive": true
    // }, {
    //     "testId": 23,
    //     "mnemonic": "UCE",
    //     "description": "Urea + Createnine+Elect rolytes",
    //     "isActive": true
    // }];


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
        // return this.http.post(`${this.baseUrl}/requisition`,req,)
      }

      // searchFilter(req: any){
      //   console.log('req : searchFilter', req)
      //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      //   return this.http.get(`${this.baseUrl}/searchFilter`, req);
      // }

      searchFilter(searchTerm: string): Observable<any> {
        return this.http.get<any[]>(`${this.baseUrl}/searchFilter?query=${searchTerm}`)
      }

      addResults(req : any){

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseUrl}/updateRequisition`, req, { headers });

        
        
      }
} 