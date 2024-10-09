import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { PathologyService } from '../../services/pathology-service.service';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn,FormArray } from '@angular/forms';
import { isNgTemplate } from '@angular/compiler';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',
  styleUrl: './requisition.component.css'
})
export class RequisitionComponent {

  @Input() showComponent: string = '';
  @Output() componentValueChange: EventEmitter<string> = new EventEmitter<string>();

  requisitionForm: FormGroup;
  genderOptions = ['M', 'F', 'U'];
  selectedDateTime: string = '';
  showAge: number = 0;
  itemData :any; 

  tests: any[] = [];
  bloodTests: any;

  constructor(public pathologyService: PathologyService, private formbuilder: FormBuilder, private http: HttpClient) {
   

    this.selectedDateTime = this.getCurrentDateTime();
    const currentDate = this.getCurrentDate();

    console.log("currentDate : ", currentDate)

  
    //this.itemData = this.pathologyService.getBloodtestList();   
    let jsonVal = JSON.stringify(this.itemData);

    
    console.log("this is itemData", jsonVal)

    this.requisitionForm = this.formbuilder.group({
      requisitionId: ['',[
        Validators.required,
        Validators.pattern(/^[0-9]{4}$/),
        Validators.min(1),
        Validators.max(9999)]],

      time_sample_taken: [this.selectedDateTime],

      first_name: ['',
        Validators.nullValidator,
      ],
      last_name: ['',
        Validators.nullValidator,
      ],
      gender: ['',
        Validators.required

      ],

      dob: [currentDate, [
        Validators.required,
        this.dobValidation
      ]],

      age: [{ value: this.showAge, disabled: true }],

      contact_number: ['+27', [Validators.required, this.cellNumbrValidator]],

      itemData: this.formbuilder.array([]),

      testsArray: this.formbuilder.array([])
      
    });
    

    this.requisitionForm.get('dob')?.valueChanges.subscribe(selectedDate => {
      console.log('Selected Date:', selectedDate);
      console.log('hallo')
      this.onDateChange(selectedDate);
    });

    console.log("selected :", this.selectedDateTime)

  }

  ngOnInit(): void {

    const currentDateTime = this.getCurrentDateTime();
    
    console.log("loadBloodTest")

    this.pathologyService.getBloodtestList().subscribe(data =>{
      
      this.itemData = data;

      console.log("loadBloodTests : data " , this.itemData);
      this.addCheckboxes();
    });

  }

  private addCheckboxes(): void {

    this.itemData.forEach((test : any) => {
      this.testsArray.push(new FormControl()); // Use isActive from the JSON data
    });
  }

  get testsArray(): FormArray {
    return this.requisitionForm.get('testsArray') as FormArray;
  }

  cellNumbrValidator(control: AbstractControl): { [key: string]: boolean } | null {

    const cellphonePattern = /^\d{10}$/;
    const valid = cellphonePattern.test(control.value);
    return valid ? null : { invalidCellphone: true };

  }

  onDateChange(selectedDate: string) {

    const dateOfBirth = this.requisitionForm.get('dob')?.value;
    const currentDate = this.requisitionForm.get('time_sample_taken')?.value;

    console.log("dateOfBirth", dateOfBirth)
    console.log("currentDate", currentDate)

    
    if (dateOfBirth && currentDate && new Date(dateOfBirth) > new Date(currentDate)) {
      return { dateOfBirthInvalid: true }; 
    }else{

      console.log('Date changed to:', selectedDate);
  
      this.calculateAge();
      return null;
    }

  }

  dobValidation(control: AbstractControl): { [key: string]: boolean } | null {

    const dateOfBirth = control.get('dob')?.value;
    const currentDate = control.get('time_sample_taken')?.value;

    if (dateOfBirth && currentDate) {
      const dobDate = new Date(dateOfBirth);

      const currentDateObj = new Date(currentDate);
      currentDateObj.setHours(0, 0, 0, 0);

      if (dobDate > currentDateObj) {
        console.log("Something went wrong !")
        return { dateOfBirthInvalid: true }; 
      }
    }

    return null;

  }


  getCurrentDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }


  getCurrentDateTime(): string {

    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  onSubmit() {
    console.log(this.requisitionForm.value);

    const selectedTests = this.requisitionForm.value.testsArray
    .map((checked: boolean, index: number) => checked ? this.itemData[index] : null)
    .filter((value: any) => value !== null);

  console.log('Selected Tests:', selectedTests);

    if (this.requisitionForm.valid) {
      const formValue = this.requisitionForm.value;
      const testList = {
        testsArray: formValue.testsArray
      };

      const requisitionData = {
        requisitionId: formValue.requisitionId,
        time_sample_taken: formValue.time_sample_taken,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        gender: formValue.gender,
        dob: formValue.dob,
        age: this.requisitionForm.get('age')?.value, 
        contact_number: formValue.contact_number,
        selectedTests: selectedTests,
        // itemData: formValue.itemData,  // This will contain the array of item data if populated?
        // testsArray: formValue.testsArray // This will contain the array of selected test items
      };
  
      console.log('Requisition JSON:', JSON.stringify(requisitionData, null, 2));

      this.pathologyService.createNewRequisition(JSON.stringify(requisitionData, null, 2)).subscribe(data=>{
        console.log("Post call response", data);
        this.setComponent('viewRequisitions');
      });

    } else {
      this.requisitionForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  
  }

  onBlur() {

  }

  calculateAge() {

    console.log("dob", this.requisitionForm.get('dob'))
    console.log("time_sample_taken", this.requisitionForm.get('time_sample_taken'))

    const dob = new Date(this.requisitionForm.get('dob')?.value);
    const time_sample_taken = new Date(this.requisitionForm.get('time_sample_taken')?.value);


    let calculatedage = time_sample_taken.getFullYear() - dob.getFullYear();
    if(dob.getFullYear() > time_sample_taken.getFullYear()){
      console.log("dob is greater than time_sample_taken")
    }
    this.showAge = calculatedage;

    console.log("Age is : ", this.showAge)
    this.requisitionForm.get('age')?.setValue(this.showAge);

  }

  get requisitionId() {
    return this.requisitionForm.get('requisitionId');
  }
  get first_name() {
    return this.requisitionForm.get('first_name');
  }

  get gender() {
    return this.requisitionForm.get('gender');
  }

  setComponent(value: string): void{
    this.componentValueChange.emit(value)
  }




}
