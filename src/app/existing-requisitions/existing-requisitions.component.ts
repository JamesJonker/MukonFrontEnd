import { Component , OnInit ,Input, Output, EventEmitter } from '@angular/core';
import { PathologyService } from '../../app/services/pathology-service.service'

export interface Order {
  requisitionId: number;
  time_sample_taken: string;
  first_name: string;
  last_name: string;
}

@Component({
  selector: 'app-existing-requisitions',
  templateUrl: './existing-requisitions.component.html',
  styleUrl: './existing-requisitions.component.css'
})
export class ExistingRequisitionsComponent {
  @Output() componentValueChange: EventEmitter<string> = new EventEmitter<string>();


  req_data: any;
  dynamicColumns: string[] = ['requisitionId', 'first_name', 'last_name', 'age', 'contact_number', 'dob', 'gender', 'time_sample_taken'];

  showGrid : boolean = false;

  columnHeaders: any = {
    requisitionId: 'Requisition ID',
    first_name: 'First Name',
    last_name: 'Last Name',
    age: 'Age',
    contact_number: 'Contact Number',
    dob: 'Date of Birth',
    gender: 'Gender',
    time_sample_taken: 'Time Sample Taken',
  };    
  

  constructor(public pathologyService: PathologyService){

    this.pathologyService.getJsonFile().subscribe(data=>{

      if(Object.keys(data).length != 0){
        
        console.log("not empty");
        
      }else{
        console.log("Empty");
        this.req_data = "Nothing found"
        return;
      }

      if(data === "No requisitions found"){
        this.req_data = "Nothing found"
        return;
      }else{
        this.showGrid = true;
        console.log("found data", data)
              this.req_data = data;
      } 
      
    });

  }

  ngOnInit(){

  }

  getLimitedTests(tests: any[], limit: number) {
    return tests.slice(0, limit);
  }

  addResults(reqData: any){
    console.log("selected requisition : ", reqData);

    this.setComponent({value: 'showResults', data:JSON.stringify(reqData)});
  }

  setComponent(value: any): void{

    this.componentValueChange.emit(value)
    
  }


}
