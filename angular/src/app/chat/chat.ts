import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { Injectable } from '@angular/core';

import { URLS } from '../urls';

interface MessagePair {
  _id: string;
  userContent: string;
  aiContent: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NewMessagePair {
  userContent: string;
  aiContent: string;
}


@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})

@Injectable({ providedIn: 'root' })
export class Chat  {

  allMessages : MessagePair[] = [];

  userContent : string = "";
  lastAIResponse : string = "";
  canMakeDashText : boolean = false;

  // track current section
  currentSection: string = 'HOME';

  // backend url
  aiURL: string = URLS.AI;

  // backend url
  url: string = URLS.CHAT;

  // backend response accessor
  responseAccessor: string = 'chatElements';

  isLoading = true; // Optional: for indicating chat loading

  chatVisible: boolean = true;

  notepadView: boolean = false;



  // create event emitter for section selection
  private onSectionDirection = new EventEmitter<string>();

  // make event emitter accessible
  @Output()
  public onSectionDirectionEvent = this.onSectionDirection;

  // sends section direction to dashboard
  directToSection(section: string) {
    if(section === 'HOME' || section === 'LORE' || section === 'GAMEPLAY' || section === 'NOVEL' || section === 'SCREENPLAY' || section === 'TIMELINE') {
      this.onSectionDirection.emit(section);
    }
    else {
      console.log("No matching section found for chat direction.");
    }
  }



  // create event emitter for section selection
  private onMakeDashText = new EventEmitter<string>();

  // make event emitter accessible
  @Output()
  public onMakeDashTextEvent = this.onMakeDashText;
  makeDashText() : void {
    if(this.canMakeDashText && this.currentSection !== 'HOME'){
      console.log("Making dash text:", this.lastAIResponse);

      // call make dash function to generate text for dashboard
      this.onMakeDashText.emit(this.lastAIResponse);

      // reset can make dash text
      this.canMakeDashText = false;

    }
    else if(!this.canMakeDashText){
      console.log("First message not sent yet. Cannot make dash text.");
    }
    else if(this.currentSection === 'HOME'){
      console.log("Choose a section before making a dashboard item.");
    }
  }




  constructor(private http: HttpClient) { }  
  ngOnInit(): void {
    // check if this is a new chat or if its part of an existing chat

    // if (first chat) { auto send first chat saying hi && load chat }
    // const userContent = "Hi, my name in Ryan";

    // load chat with new messagePair
    this.loadChat();
    
    // this.fetchAIResponse(userContent).subscribe({
    //   next: (response) => { 
    //     console.log('what came through this time:', response);       
      
    //     // load chat with new messagePair
    //     this.loadChat();

    //   },
    //   error: (error) => { 
    //     console.error('Error:', error); 
    //   },
    //   // complete: () => { 
    //   //   console.log('Request completed.'); // (only happens when finite number of emmisions + notify complete + clean up)
    //   // }
    // });

    
    // else { just load existing chat }
    // this.loadChat();
  }

  // fetch AI response from fastAPI backend
  fetchAIResponse(userContent: string): Observable<any> {
    let params = new HttpParams().append('userContent', userContent); // establishing proper query parameters to match fastAPI
    return this.http.post(this.aiURL, null, { params: params });
  }

  getChatItems() : Observable <any> {
    return this.http.get<any>(this.url);
  }

  // store a new message pair in the database
  storeMessagePair(userContent: string, aiContent: string) : Observable <NewMessagePair> {
    const messagePair: NewMessagePair = {
      userContent: userContent,
      aiContent: aiContent
    };
    return this.http.post<NewMessagePair>(this.url, messagePair);
  }

  configureChat(section: string) : boolean {

    console.log("Configuring chat to section: " + section);
    // change section, ai url, backend url, and response accessor based on section
    switch (section) {

      case 'HOME':
          this.currentSection = section;
          this.url = URLS.CHAT;
          this.aiURL = URLS.AI;
          this.responseAccessor = 'chatElements';
        return true;

      case 'GAMEPLAY':
        this.currentSection = section;
        this.url = URLS.GAMEPLAY_CHAT;
        this.aiURL = URLS.GAMEPLAY_AI;
        this.responseAccessor = 'gameplayChat';
      return true;

      case 'LORE':
          this.currentSection = section;
          this.url = URLS.LORE_CHAT;
          this.aiURL = URLS.LORE_AI;
          this.responseAccessor = 'loreChat';
        return true;

      case 'NOVEL':
          this.currentSection = section;
          this.url = URLS.NOVEL_CHAT;
          this.aiURL = URLS.NOVEL_AI;
          this.responseAccessor = 'novelChat';
        return true;

      case 'SCREENPLAY':
        this.currentSection = section;
        this.url = URLS.SCREENPLAY_CHAT;
        this.aiURL = URLS.SCREENPLAY_AI;
        this.responseAccessor = 'screenplayChat';
      return true;

      case 'TIMELINE':
          this.currentSection = section;
          this.url = URLS.TIMELINE_CHAT;
          this.aiURL = URLS.TIMELINE_AI;
          this.responseAccessor = 'timelineChat';
        return true;

      default:
          console.log("No matching section found. Chat more to determine a valid section.");
        return false;
    }
  }

  loadChat(): void {
    this.getChatItems().subscribe((data) => {
      console.log("Loading this chat data:", data);
      try{
        if (data[this.responseAccessor].length > 0) {
          this.allMessages = data[this.responseAccessor];
        }
        else {
          console.error("No chat data found.");
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    }); 
  }

  parentLoadChat(section: string): void {
    this.currentSection = section;
    this.loadChat();
  }




  // when send button is clicked, update display, then switch to detected section
  onSend(userContent: string): void {

    // clear input field
    const inputField = document.getElementById('userInput') as HTMLInputElement;
    inputField.value = '';

    // mark that first message has been sent
    this.canMakeDashText = true;

    // change section based on user section dropdown
    const sectionSelect = document.getElementById('section-select') as HTMLInputElement;
    sectionSelect.value = this.currentSection;

    // check if user input is a large text
    if(userContent.length > 500) {
      console.log("Input over 500 characters.");
      // send to analysis chat
    }


    // fetch AI response from backend
    this.fetchAIResponse(userContent).subscribe({
      next: (response) => { 
        console.log('AI response after user send:', response); // (update display + log data + perform calculations)

        // store message pair (regardless of section change)
        this.storeMessagePair(userContent, response['response']).subscribe({
          next: (storedPair : NewMessagePair) => {
            
        
            // if the section remains the same...
            if(response['section'] == this.currentSection) {
              console.log("Section unchanged");

              // load chat with messagePair
              this.loadChat();

              // save last AI response for dash text generation
              this.lastAIResponse = response['response'];
            }
            
            // if the section changes...
            else{

              // configure chat (if possible) ...
              if(this.configureChat(response['section'])){

                // load chat from new section
                this.loadChat();

                // direct dashboard to desired section
                this.directToSection(response['section']);

                // get response from ai in new section
                console.log("using: " + storedPair);

                this.fetchAIResponse(userContent).subscribe({
                  next: (newResponse) => { 
                    
                    // save new message pair to database
                    this.storeMessagePair(userContent, newResponse['response']).subscribe({
                      next: (newStoredPair : NewMessagePair) => {

                        console.log('Stored new message pair after section switch:', newStoredPair);

                        // load new chat with new messagePair
                        this.loadChat();

                        // save last AI response for dash text generation
                        this.lastAIResponse = newResponse['response'];
                      },

                      error: (error) => {
                        console.error('Error storing message pair:', error);
                      }
                    });

                  },

                  error: (error) => { 
                    console.error('Error:', error); 
                  },
                });


                console.log("At end of switching into new section and loading new chat with transfered response. Will direct dashboard.");

                // // direct dashboard to desired section 
                // this.directToSection(response['section']);
                // console.log("From chat: chat & dashboard configured to section :: " + this.currentSection);
                
              }

              // if section not configurable...
              else{
                console.log("Section undetectable. Chat more to get a valid section.");
              }

            }

          },
          error: (error) => { 
            console.error('Error:', error); 
          },
        });

      },
      error: (error) => { 
        console.error('Error:', error); 
      },
      // complete: () => { 
      //   console.log('Request completed.'); // (only happens when finite number of emmisions + notify complete + clean up)
      // }
    });
  }

  hideChat() : void {
    this.chatVisible = !this.chatVisible;
  }

  toggleNotePad() : void {
    this.notepadView = !this.notepadView;
  }

}


///////////////////////////////
// Notes

        // const tempID = (this.allMessages.length + 1).toString();
            
            // auto update ui with new message pair without reloading entire chat history
            // this.allMessages = [
            //   ...this.allMessages,
            //   {
            //     _id: tempID,
            //     userContent: storedPair.userContent,
            //     aiContent: storedPair.aiContent,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   }
            // ];

            
        // store the new message pair in the database
        // this.storeMessagePair(userContent, response).subscribe({
        //   next: (storedPair : NewMessagePair) => {
        //     console.log('Stored message pair:', storedPair);
        //   },
        //   error: (error) => {
        //     console.error('Error storing message pair:', error);
        //   }
        // });


// ideas

// check if input is empty before sending request
// add loading spinner while waiting for response
// the ability to clear chat history
// the template story is the core




///////////////////////////////






