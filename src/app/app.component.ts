import { Component, OnInit } from '@angular/core';
import { PathologyService } from '../../src/app/services/pathology-service.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ClientApp_mukon';

  showComponent : string ='viewRequisitions';
  componentData : any;

  constructor(public pathologyService: PathologyService){

  }
  ngOnInit(){

    console.log("componentData", this.componentData)


  }

  getCompValue(eventData: any){

    console.log("getCompValue : ", eventData);

    this.showComponent = eventData.value;
    console.log('showComponent',this.showComponent);

    if(eventData.data){

      this.componentData = JSON.parse(eventData['data']);
    }else{
      this.componentData = [];
    }
  }

}
