import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { mnmHttpInterceptorParams } from "projects/mnm-webapp/src/public_api";

@Injectable()
export class AppService {
    constructor(private http: HttpClient) { }

    public test(): Observable<any> {
        let params = new HttpParams();
        params = params.set(mnmHttpInterceptorParams.sustainOnNavigation, 'true');

        return this.http.post('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png', {}, { params: params })
    }
}