import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable()
export class HttpRequestService {
    apiUrl: string = environment.apiUrl;

    constructor(private router: Router,
                private httpClient: HttpClient) {
    }

    public get(url: string, parameter?: any): Observable<any> {
        return this.httpClient.get(this.getFullUrl(url) + this.parseParametersToString(parameter))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onEnd();
            });
    }

    public delete(url: string): Observable<any> {
        return this.httpClient.delete(this.getFullUrl(url))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onEnd();
            });
    }

    public put(url: string, body: any): Observable<any> {
        return this.httpClient.put(this.getFullUrl(url), body)
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onEnd();
            });
    }

    public post(url: string, body: any): Observable<any> {
        return this.httpClient.post(this.getFullUrl(url), body)
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onEnd();
            });
    }

    // private requestOptions(options?: CustomsHttpClient): CustomsHttpClient {
    // if (options == null) {
    //     options = new CustomsHttpClient();
    // }
    //
    // if (options.headers == null) {
    //     options.headers = new Headers();
    // }
    // return options;
    // }

    private parseParametersToString(paramter: any) {
        if (paramter == null)
            return '';
        let queryString = `?draw=${paramter.draw}&length=${paramter.length}&start=${paramter.start}`;
        for (var property in paramter.search) {
            if (paramter.search.hasOwnProperty(property)) {
                queryString += `&${property}=${paramter.search[property]}`;
            }
        }

        if (paramter.order && paramter.order.length) {
            let columnIndex = paramter.order[0].column;
            queryString += `&order=${paramter.columns[columnIndex].name}`;
            queryString += `&orderby=${paramter.order[0].dir}`;
        }
        return queryString;
    }

    private getFullUrl(url: string): string {
        return this.apiUrl + url;
    }

    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        return Observable.throw(error);
    }

    private onSuccess(res: Response): void {
        console.log('Request successful');
    }

    private onError(res: Response): void {
        if (res.status == 401) {
            this.router.navigate(["/login"]);
        }
        console.log('Error, status code: ' + res.status);
    }

    private onEnd(): void {
    }


}