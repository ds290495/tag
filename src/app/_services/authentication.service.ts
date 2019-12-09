import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class AuthenticationService {
  
    constructor(private http: HttpClient) { }



    login(email: string, password: string) {

        return this.http.post<any>(appConfig.apiUrl + '/users/authenticate', { email: email.toLowerCase(), password: password, flag: 'backend' })
            .map(user => {

                // login successful if there's a jwt token in the response
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('userId', user._id);
                localStorage.setItem('email', user.email);
                localStorage.setItem('User Type', user.userId);
                localStorage.setItem('username', user.username);
                localStorage.setItem('token', user.token);

                return user;
            });
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('User Type');
        localStorage.removeItem('username');
    }



    addTag(tagData) {
        return this.http.post<any>(appConfig.apiUrl + '/users/addTag', tagData);
    }

    getAlltagdata() {
        return this.http.get<any>(appConfig.apiUrl + '/users/getAlltagdata')
      }


    updatetagData(data) {
    
        return this.http.post<any>(appConfig.apiUrl + '/users/updatetagData', { data: data })
    }

    getqrcode(data) {
        return this.http.post<any>(appConfig.apiUrl + '/users/getqrcode', { data: data })

    }
    getCableInfo(data) {
      return this.http.post<any>(appConfig.apiUrl + '/users/getCableInfo', { data: data })

  }
    gettagdataId(tagId) {
     
        return this.http.get<any>(appConfig.apiUrl + '/users/gettagdataId/' + tagId)
      }

      updatingTagDataReview(tagdata) {
        return this.http.post<any>(appConfig.apiUrl + '/users/updatingTagDataReview', tagdata)
      }

      deletetag(tagid) {
        
        return this.http.delete<any>(appConfig.apiUrl + '/users/deletetag/' + tagid)
      }
    


  addcsvfile(Files) {
    var userId = localStorage.getItem('User Type');
    const formData: any = new FormData();
    const files: Array<File> = Files;
    formData.append("uploads", files);
    formData.append("uploads", userId);
   
    return this.http.post<any>(appConfig.apiUrl + '/addcsvfile', formData )

  }

}