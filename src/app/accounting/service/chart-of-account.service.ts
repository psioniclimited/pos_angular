import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChartOfAccount } from '../../_model/chart-of-account';
import { Observable } from 'rxjs';
import { _ } from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountService {
  constructor(private http: HttpClient) {}

  index(filters: any): Observable<ChartOfAccount[]> {
    let params = new HttpParams();
    _.map(filters, function(value, key) {
      params = params.set(key, value);
    });

    return this.http.get<ChartOfAccount[]>('/chart_of_account', {
      params: params
    });
  }
  store(chartOfAccount: ChartOfAccount, parentId: number) {
    return this.http.post<ChartOfAccount>(
      '/chart_of_account/' + parentId,
      chartOfAccount
    );
  }
  update(id: string, chartOfAccount: ChartOfAccount) {
    return this.http.put('/chart_of_account/' + id, chartOfAccount);
  }
  show() {}

  delete(id: number) {
    return this.http.delete<ChartOfAccount>('/chart_of_account/' + id);
  }
}
