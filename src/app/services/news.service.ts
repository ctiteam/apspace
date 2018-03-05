import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';



const   baseUrl = 'https://webspace.apiit.edu.my/news/rss.xml';

@Injectable()

export class NewsService{
    
    http: any;
  
    constructor(private _http: Http){
        
    }
    
    getPosts(){
        return this._http.get(baseUrl)
        .map(res => res.json());
    }
}
