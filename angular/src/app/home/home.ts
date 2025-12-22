import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, signal, inject, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})


@Injectable({ providedIn: 'root' })
export class Home implements OnInit {
  title = signal('Storyboard');
  
  prompt : string = "";
  entered_prompt = signal(this.prompt);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  // constructor(private httpClient: HttpClient) { }
  httpClient = inject(HttpClient);
  data: any[] = [];


  ngOnInit(): void {}

  fetchData(prompt: string): Observable<any> {
    const apiURL = 'http://127.0.0.1:8000';
    let params = new HttpParams().append('prompt', prompt); // establishing proper query parameters to match fastAPI

    return this.httpClient.post(apiURL + "/assistant", null, { params: params });
  }


  onSendPrompt(prompt: string): void {
    this.prompt = prompt;
    this.entered_prompt.set(this.prompt);
    
    this.fetchData(prompt).subscribe({
      next: (response) => { 
        console.log('what came through this time:', response); // (update display + log data + perform calculations)
      },
      error: (error) => { 
        console.error('Error:', error); 
      },
      complete: () => { 
        console.log('Request completed.'); // (only happens when finite number of emmisions + notify complete + clean up)
      }
    });
  }

}
