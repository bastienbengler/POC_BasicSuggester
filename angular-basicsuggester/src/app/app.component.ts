import { Component, OnInit, Injectable } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, AbstractControl, NgForm, Validators } from '@angular/forms';
import {Observable } from 'rxjs';
import { Subject } from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, merge, catchError, tap, switchMap } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import "rxjs/add/observable/of";
import { pluck } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept' : 'application/json'
  })
};

export class zelp {
  score: number;
  scoreAR: number;
  scoreED: number;
  scoreFC: number;
  scoreFP: number; 
  scoreJW: number;
  scoreLC: number;
  scoreLN: number;
  scoreSD: number;
  word: string;
}

@Injectable()
export class RequestSuggesterService {
  constructor(private http: HttpClient) {}

  search(term: string) {
    if (term === '') {
      return [];
    }

    return this.http.put<Array<zelp>>("/api/suggester", {"val": term }, httpOptions);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RequestSuggesterService]
})
export class AppComponent {
  title = 'app';
  
  public searchForm : FormGroup;
  public basicsuggestion : string[]

  model: any;
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);



  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private _service: RequestSuggesterService) {
    this.createForm();
  }

  ngOnInit() {
    this.searchForm.get('name').valueChanges
    .debounceTime(500)
    .subscribe(val => {
      this.http.put<Array<zelp>>("/api/suggester", {"val": this.searchForm.get('name').value }, httpOptions)
      .subscribe(data => this.basicsuggestion = data.map(x => x.word));
    })
  }

  createForm() {
    this.searchForm = this.fb.group({
      name: ['', Validators.required ]
    });
  }

  searchCustom = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    tap(() => this.searching = true),
    switchMap(term =>
      this.http.put("/api/suggester", {"val": term }, httpOptions)
      .map((data : object[]) => data.map((el : zelp) => el.word)) // << ES6
    ),
    tap(()=> this.searching = false))
}