import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()

export class NewsService{
    http: any;
    baseUrl = 'https://webspace.apiit.edu.my/news/rss.xml';

    constructor(private _http: Http){
        
    }
    getPosts(){
        return this._http.get(this.baseUrl)
        .map(res => res.json());
    }

    /*
    getPosts(){
             let params = new URLSearchParams();
                params.set('format', 'json');
                params.set('callback', 'CALL_BACK');
                let queryString = `?callback=CALL_BACK`;
                return this._jsonp.get(this.baseUrl + queryString)
                    .map((response: Response) => response.json());
        }
        */
}
