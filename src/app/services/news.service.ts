import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()

export class NewsService{
    http: any;
    baseUrl: String;

    constructor(http: Http){
        this.http = http;
        this.baseUrl = 'http://sample-env.spzzs8mgyy.ap-southeast-2.elasticbeanstalk.com/news/rss.xml';
    }

    getPosts(){
        return this.http.get(this.baseUrl)
        .map(res => res.json());
    }
}