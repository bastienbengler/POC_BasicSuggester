import { Component, OnInit, Injectable } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, AbstractControl, NgForm, Validators } from '@angular/forms';
import {Observable } from 'rxjs';
import { Subject } from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, merge, catchError, tap, switchMap } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import "rxjs/add/observable/of";
import { pluck } from 'rxjs/operators';
import {NgbTypeaheadConfig} from '@ng-bootstrap/ng-bootstrap';

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
  providers: [RequestSuggesterService, NgbTypeaheadConfig]
})
export class AppComponent {
  title = 'app';
  
  public searchForm : FormGroup;

  model: any;
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private _service: RequestSuggesterService,
    config: NgbTypeaheadConfig) {
    this.createForm();
    //config.showHint = true;
    //config.editable = false;
  }

  ngOnInit() {
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
    filter(term => term.trim().split(" ")[term.trim().split(" ").length - 1] != null),
    switchMap(term =>
      this.http.put("/api/suggester", {"val": term.trim().split(" ")[term.trim().split(" ").length - 1] }, httpOptions)
      .map((data : object[]) => (data && data.map((el : zelp) => el.word)) || [])),
      tap(()=> this.searching = false)
    )

  myformatter(value: any) {
    console.log("ici");
    let tmp = this._inputValueBackup.trim().split(" ");
      tmp.pop();
      tmp.push(value);
    return tmp.join(' ');
  }
}