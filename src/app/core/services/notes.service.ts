import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INote } from '../interfaces/trip.interface';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class NoteService {
  private apiUrl = 'http://localhost:3000/notes'; 

  constructor(private http: HttpClient) {}

  saveNote(noteDTO: INote): Observable<any> {
    return this.http.post(`${this.apiUrl}`, noteDTO);
  }
}
