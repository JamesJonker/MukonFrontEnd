import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn,FormArray } from '@angular/forms';
import { PathologyService } from '../services/pathology-service.service';




interface Requisition {
  requisitionId: string;
  patient: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
  };
  tests: { mnemonic: string }[];
  sampleTakenAt: string;
}


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})

export class ReportComponent {

  
@Input() receiveData: any = [];

  reportForm: FormGroup;
  directoryHandle: any = null; 
  
  selectedDirectoryHandle: any;
  preview : any;

  constructor(private formbuilder: FormBuilder) {

    this.reportForm = this.formbuilder.group({
      reportType: ['json', Validators.required]
    });

    
  }

  ngOnInit(): void {

    console.log('receiveData', this.receiveData);
    let typeofReport = this.reportForm.get('reportType')?.value;

    this.reportForm.get('reportType')?.valueChanges.subscribe(value => {
      this.onReportTypeChange(value); 

    });

    if (typeofReport === 'json') {

      this.preview = JSON.stringify(this.getRequisitionData());
    } else {

      this.preview = this.generateTextReport();
    }
    
  }


  async onSubmit() {

    const reportType = this.reportForm.get('reportType')?.value;
    console.log("reportType",reportType)
    const reportContent = this.getRequisitionData();

    }
  

  async generateReport() {

    const reportType = this.reportForm.get('reportType')?.value;
    console.log("reportType",reportType)
    const reportContent = this.getRequisitionData();

    if (reportType === 'json') {
      this.downloadFile('report.json', JSON.stringify(reportContent, null, 2), 'application/json');
    } else {
      const textData = this.createTextReportContent(reportContent);
      this.downloadFile('report.txt', textData, 'text/plain');
    }


  } 

  onReportTypeChange(value: string) {
    console.log('Report Type changed to:', value);

    let typeofReport = this.reportForm.get('reportType')?.value;

    
    if (typeofReport === 'json') {

      this.preview = JSON.stringify(this.getRequisitionData());
    } else {

      this.preview = this.createTextReportContent(this.receiveData.requisition);
      console.log("preview text",this.preview)
    }
  }

  async selectDirectory() {
    if ('showDirectoryPicker' in window) {
      try {
        this.directoryHandle = await (window as any).showDirectoryPicker();
        alert('Directory selected successfully.');
        console.log(this.directoryHandle);
      } catch (err) {
        console.error('Directory selection failed:', err);
        alert('Failed to select directory.');
      }
    } else {
      alert('Your browser does not support the File System Access API.');
    }
  }

  async generateJsonReport() {
    const requisition = this.getRequisitionData();
    const jsonData = JSON.stringify(requisition, null, 2);
    const fileHandle = await this.directoryHandle.getFileHandle('requisition_report.json', { create: true });
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(jsonData);
    await writableStream.close();
  }

  async generateTextReport() {
    const requisition = this.getRequisitionData();
    const textData = this.createTextReportContent(requisition);
    const fileHandle = await this.directoryHandle.getFileHandle('requisition_report.txt', { create: true });
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(textData);
    await writableStream.close();
  }

  getRequisitionData(): Requisition {

    return this.receiveData.requisition;
  }

  createTextReportContent(requisition: Requisition): string {
    return `

Requisition Report
------------------
Requisition ID: ${this.receiveData.requisition.requisitionId}
Patient Name: ${this.receiveData.requisition.first_name} ${this.receiveData.requisition.last_name}
Age: ${this.receiveData.requisition.age}
Gender: ${this.receiveData.requisition.gender}
Tests: ${this.receiveData.requisition.selectedTests.map((test:any) => test.mnemonic + " " + "Result : " + " " + test.result + " " + "Comment" + " " + test.comment).join(', ')}
Sample Taken At: ${this.receiveData.requisition.time_sample_taken}
    `.trim();
  }

  downloadFile(filename: string, content: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}


