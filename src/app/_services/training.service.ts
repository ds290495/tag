import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}

@Injectable()
export class TrainingService {
    
    constructor(private http: HttpClient) { }


      getAllProduct() {
        return this.http.get<any>(appConfig.apiUrl + '/training/getAllProduct')
      }

      getTrainingItems()
      {
        return this.http.get<any>(appConfig.apiUrl + '/training/getTrainingItems')
      }

      getProductbyId(productid)
      {
        return this.http.get<any>(appConfig.apiUrl + '/training/getProductbyId/'+ productid)
      }

      getTrainingbyProductId(productid)
      {
        return this.http.get<any>(appConfig.apiUrl + '/training/getTrainingbyProductId/'+ productid)
      }

      addmainTraining(mainimage,productid) {
          const formData: any = new FormData();
          formData.append("uploads", mainimage[0], mainimage[0].name);
          return this.http.post<any>(appConfig.apiUrl + '/addmaintrainingProgram',formData
      )
    }

    updateTrainingItems(traininglineitems,mainimage,trainingdata,Files,itemid) {
      console.log('traininglineitems');
       console.log(traininglineitems);
      const formData: any = new FormData();
      const files: Array<File> = Files;

      let k=0;
      for (let j = 0; j < traininglineitems.length; j++) {

        const imageitemfile: File = traininglineitems[j].itemdataimage;
        var checkimage = (traininglineitems[j].itemdataimage)?k++:'';
        formData.append("uploads[]", imageitemfile);
        formData.append("uploadscheck[]",checkimage);
        traininglineitems[j].imagefile =imageitemfile;
      }
      
      formData.append('traininglinetitle', trainingdata.title);
      formData.append('itemid', itemid);
      formData.append('traininglineitems', JSON.stringify(traininglineitems));
      formData.append('trainingdata', JSON.stringify(trainingdata));
      
    return this.http.post<any>(appConfig.apiUrl + '/updatetrainingProgram',formData
    )
  }

    addTrainingItems(traininglineitems,mainimage,trainingdata,Files,productid,datalength) {
       
      const formData: any = new FormData();
      const files: Array<File> = Files;

      const mainfile: File = mainimage;
      let k=0;
      for (let j = 0; j < traininglineitems.length; j++) {

        const imageitemfile: File = traininglineitems[j].itemdataimage;
        var checkimage = (traininglineitems[j].itemdataimage)?k++:'';
        formData.append("uploads[]", imageitemfile);
        formData.append("uploadscheck[]",checkimage);
        traininglineitems[j].imagefile =imageitemfile;
      }
      
      formData.append("mainfile", mainfile);
      formData.append('traininglinetitle', trainingdata.title);
      formData.append('productid', productid);
      formData.append('traininglineitems', JSON.stringify(traininglineitems));
      formData.append('trainingdata', JSON.stringify(trainingdata));
      formData.append('datalength', datalength);
      
    return this.http.post<any>(appConfig.apiUrl + '/addtrainingProgram',formData
    )
  }

    deleteitem(itemid,productid,order) {
      
      return this.http.get<any>(appConfig.apiUrl + '/training/deleteitem/' + itemid + '/' + productid+ '/' + order)
    }

    updateproduct(productdata)
    {
      return this.http.post<any>(appConfig.apiUrl + '/products/updateproduct', productdata)
    }

    updatestatus(itemstatus,itemid)
    {
      return this.http.post<any>(appConfig.apiUrl + '/training/updatestatus' , {'status':itemstatus,'itemid':itemid} )
    }

    getTrainingbyId(itemid)
    {
      return this.http.get<any>(appConfig.apiUrl + '/training/getTrainingbyId/'+ itemid)
    }
    
    removeTrainingItems(lineitemid,trainingid,ordervalue)
    {
      return this.http.get<any>(appConfig.apiUrl + '/training/removeTrainingItems/' + lineitemid + '/' + trainingid+ '/' + ordervalue)
    }

    exportTrainingItems(productid)
    {
      return this.http.get<any>(appConfig.apiUrl + '/training/exportTrainingItems/'+ productid)
    }

    updateOrder(oldid,newid)
    {
      console.log('update here');
      console.log(oldid);
      return this.http.get<any>(appConfig.apiUrl + '/training/getAllproducts')
    }
    reOrderItems(previousIndex,currentIndex)
    {
      return this.http.post<any>(appConfig.apiUrl + '/training/reOrderItems',{'previousIndex':parseInt(previousIndex),'currentIndex':parseInt(currentIndex)})
    }

    reOrderLineItems(previousIndex,currentIndex,itemid)
    {
      console.log(itemid);
      return this.http.post<any>(appConfig.apiUrl + '/training/reOrderLineItems',{'previousIndex':parseInt(previousIndex),'currentIndex':parseInt(currentIndex),'itemid':itemid})
    }

    deleteTrainingProgram(productid)
    {
      return this.http.delete<any>(appConfig.apiUrl + '/training/deleteTrainingProgram/' + productid)
    }
    
}