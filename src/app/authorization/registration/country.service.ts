import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from "../shared/interfaces";
@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = 'https://countryapi.io/api/all?apikey=uwiGllCZTm55C1F7y4xNulIsSa7to20yPgse0X1Q';
  constructor(private http: HttpClient) {}
  getAllCountries(): Observable<Country[]> {
    return this.http.get(this.apiUrl).pipe(
      map(
        (response: Country) => Object.values(response).map(country => country.name).sort())
    );
  }
}
