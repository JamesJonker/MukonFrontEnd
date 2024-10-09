import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn,FormArray } from '@angular/forms';
import { PathologyService } from '../services/pathology-service.service';


@Component({
  selector: 'app-req-results',
  templateUrl: './req-results.component.html',
  styleUrl: './req-results.component.css'
})

export class ReqResultsComponent {

  @Input() receiveData: any = [];

  @Output() componentValueChange: EventEmitter<string> = new EventEmitter<string>();

  resultForm: FormGroup;

  searchResult: any;

  constructor(private formbuilder: FormBuilder, public pathologyService: PathologyService){

    this.resultForm = this.formbuilder.group({
      requisitionId: [],
      time_sample_taken: [],
      first_name: [],
      last_name: [],
      gender: [],
      dob: [],
      age: [],
      contact_number: [],
      selectedTests: []
    });

  }

  ngOnInit(): void {
    console.log('receiveData', this.receiveData);

    if(this.receiveData.length !=0){

      this.searchResult = this.receiveData.requisition;

      console.log('receiveData is not empty')

      this.resultForm = this.formbuilder.group({
        requisitionId: this.receiveData.requisition.requisitionId,
        time_sample_taken: this.receiveData.requisition.time_sample_taken,
        first_name: this.receiveData.requisition.first_name,
        last_name: this.receiveData.requisition.last_name,
        gender: this.receiveData.requisition.gender,
        dob: this.receiveData.requisition.dob,
        age: this.receiveData.requisition.age,
        contact_number: this.receiveData.requisition.contact_number,
        selectedTests: this.formbuilder.array(this.initSelectedTests())

      });

    }

  }

  initSelectedTests() {
    let tests :any = []

    console.log("receiveData", this.receiveData)

    if(Object.keys(this.receiveData).length != 0){
       tests = this.receiveData.requisition.selectedTests;
    }else{
      
       tests = this.searchResult.selectedTests;
       console.log("tests", tests);
    }

    return tests.map((test:any) => this.formbuilder.group({
      testId: [test.testId],
      mnemonic: [test.mnemonic],
      description: [test.description],
      isActive: [test.isActive],
      result: [test.result],  
      comment: [test.comment]  
    }));
  }

  get selectedTests(): FormArray {
    return this.resultForm.get('selectedTests') as FormArray;
  }

  onSubmit() {

    console.log(this.resultForm.value);
    const formData = this.resultForm.value;

    console.log("formData" , formData.selectedTests);
    

    const newTestsData = [];


    const requisitionData = {
      requisitionId: formData.requisitionId,
      time_sample_taken: formData.time_sample_taken,
      first_name: formData.first_name,
      last_name: formData.last_name,
      gender: formData.gender,
      dob: formData.dob,
      age: formData.age, 
      contact_number: formData.contact_number,

      selectedTests: formData.selectedTests,
 
    };
    //call pathology service

    this.pathologyService.addResults(requisitionData).subscribe(data=>{
      console.log('updated requisition', data);
    });

  }

  genReport(){}

  setComponent(value: string): void{

    let val = ({value: 'showReport', data:this.resultForm});

    this.componentValueChange.emit(value)
  }

  searchReq(){

    console.log("reqid : " , this.resultForm.get('requisitionId')?.value);
    const serachVal = this.resultForm.get('requisitionId')?.value;

    console.log("reqid : " , serachVal);
    this.pathologyService.searchFilter(serachVal).subscribe(data=>{

      console.log("this is te requisition found", data);

      this.searchResult = data;

      this.resultForm = this.formbuilder.group({
        requisitionId: this.searchResult.requisitionId,
        time_sample_taken: this.searchResult.time_sample_taken,
        first_name: this.searchResult.first_name,
        last_name: this.searchResult.last_name,
        gender: this.searchResult.gender,
        dob: this.searchResult.dob,
        age: this.searchResult.age,
        contact_number: this.searchResult.contact_number,
        selectedTests: this.formbuilder.array(this.initSelectedTests())
      });

    });
    return;


  }
}
