import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from  './users';
import { Observable } from  'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlaskBackendService {
  constructor(private httpClient: HttpClient) {}
  FLASK_API_SERVER = "http://127.0.0.1:5000";

  readUsers(): Observable<Users[]>{
    return this.httpClient.get<Users[]>(`${this.FLASK_API_SERVER}/users`);
  }

}
