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


interface AIAnalysisData {
    title: string
    general_response: string
    connections: string
    lore_summary: string
    gap_suggestions: string
    new_idea_suggestions: string
    logic_conflicts: string
    user_question_responses: string[];
}


interface UserInputData {
    section: string;
    userContent: string;
    userQueries: string[];
    last_working_on: string;
    current_element_content: string;
}

interface MakeDashElementData {
  user_data: UserInputData;
  ai_data: AIAnalysisData;
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

  // track user input
  userContent : string = "";

  // track if user content is long
  userContentLong: boolean = false;
  
  // track AI latest response
  lastAIResponse : string = "";


  // track current section
  currentSection: string = 'HOME';

  // backend url
  aiURL: string = URLS.AI;

  // backend url
  url: string = URLS.CHAT;

  // backend response accessor
  responseAccessor: string = 'chatElements';

  // tracks load state
  isLoading = false; 

  // chat-response-to-dash-text ability
  canMakeDashText : boolean = false;

  // chat window visibility
  chatVisible: boolean = false;

  // messages visibility
  messagesVisible: boolean = true;

  // notepad visibility
  notepadView: boolean = false;


  // track aiData
  aiData!: AIAnalysisData;
  
  // track userData
  userData!: UserInputData;
  
  

  constructor(private http: HttpClient) { }  
  ngOnInit(): void {
    // check if this is a new chat or if its part of an existing chat

    // if (first chat) { auto send first chat saying hi && load chat }
    // const userContent = "Hi, my name in Ryan";

    // load chat with new messagePair
    this.updateChat();
    
    
    // else { just load existing chat }
    // this.updateChat();
  }



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
  private onMakeDashText = new EventEmitter<MakeDashElementData>();
  // make event emitter accessible
  @Output()
  public onMakeDashTextEvent = this.onMakeDashText;
  // tell dash to make a text based on latest AI response
  makeDashText() : void {

    // check if there is information in lore analysis
    if(!this.aiData) {
      console.log("No lore analysis data found. Cannot make dash text.");
    }
    else{

      if(this.canMakeDashText && this.currentSection !== 'HOME'){
        console.log("Making dash text...");

        const makeDashElementData : MakeDashElementData  = {
          user_data: this.userData,
          ai_data: this.aiData
        };

        // call make dash function to generate text for dashboard
        this.onMakeDashText.emit(makeDashElementData);

        // reset can make dash text
        this.canMakeDashText = false;

        // hide chat view (reveal more dash view)
        this.chatVisible = false;

      }
      else if(!this.canMakeDashText){
        console.log("First message not sent yet. Cannot make dash text.");
      }
      else if(this.currentSection === 'HOME'){
        console.log("Choose a section before making a dashboard item.");
      }
    }



  }



  // get all message-pairs from backend
  getChatItems() : Observable<any> {
    try {
      const allMessages = this.http.get<any>(this.url);
      return allMessages;
    } catch (error) {
      console.error("Error fetching chat items:", error);
      throw error;
    }    
  }



  // configure chat section dropdown
  selectSectionDropdown(section: string) {
    const sectionDropdown = document.getElementById('section-select') as HTMLInputElement;
    if (sectionDropdown) {
      sectionDropdown.value = section;
    }
    else {
      console.error("Section dropdown not found.");
    }
  }

  // configure chat based on section (doesnt interact with dashboard)
  configureChat(section: string) : boolean {

    console.log("Configuring chat to section: " + section);
    // change section (chat section selector), ai url, backend url, and response accessor based on input
    // const sectionDropdown = document.getElementById('section-select') as HTMLInputElement;
      
    switch (section) {

      case 'HOME':
          this.currentSection = section;
          this.url = URLS.CHAT;
          this.aiURL = URLS.AI;
          this.responseAccessor = 'chatElements';
          this.selectSectionDropdown('HOME');
        return true;

      case 'GAMEPLAY':
        this.currentSection = section;
        this.url = URLS.GAMEPLAY_CHAT;
        this.aiURL = URLS.GAMEPLAY_AI;
        this.responseAccessor = 'gameplayChat';
        this.selectSectionDropdown('GAMEPLAY');
      return true;

      case 'LORE':
        this.currentSection = section;
          this.url = URLS.LORE_CHAT;
          this.aiURL = URLS.LORE_AI;
          this.responseAccessor = 'loreChat';
          this.selectSectionDropdown('LORE');
        return true;

      case 'NOVEL':
          this.currentSection = section;
          this.url = URLS.NOVEL_CHAT;
          this.aiURL = URLS.NOVEL_AI;
          this.responseAccessor = 'novelChat';
          this.selectSectionDropdown('NOVEL');
        return true;

      case 'SCREENPLAY':
        this.currentSection = section;
        this.url = URLS.SCREENPLAY_CHAT;
        this.aiURL = URLS.SCREENPLAY_AI;
        this.responseAccessor = 'screenplayChat';
        this.selectSectionDropdown('SCREENPLAY');
      return true;

      case 'TIMELINE':
          this.currentSection = section;
          this.url = URLS.TIMELINE_CHAT;
          this.aiURL = URLS.TIMELINE_AI;
          this.responseAccessor = 'timelineChat';
          this.selectSectionDropdown('TIMELINE');
        return true;

      default:
        return false;
    }
  }

  // fetch AI response from fastAPI backend
  fetchAIResponse(userContent: string, dataObject: any): Observable<any> {
    
    // response is loading 
    this.isLoading = true;
    console.log("Chat is loading...");


    let params;
    let response;

    // check current section for proper request format
    switch (this.currentSection) {
      case 'LORE':
        
        // establish parameters
        params = new HttpParams();

        // Pass 'dataObject' directly as the body
        // retireve AI response
        response = this.http.post(this.aiURL, dataObject, { params: params }).subscribe({
          next: (response) => {
            


            
            this.canMakeDashText = true;

            return response;
          },
          error: (error) => {
            console.error("Error fetching Lore AI response:", error);
            throw error;
          }
        });

        // // return response
        // return response;
        break;
    
      default:

        // establish parameters (string as is)
        params = new HttpParams().append('userContent', userContent); // establishing proper query parameters to match fastAPI
      
        // get AI response
        response = this.http.post(this.aiURL, null, { params: params });

        // return response
        return response;

    }
    

    return this.http.post(this.aiURL, dataObject);

    // try {
    //   // if data is a string...
    //   if (dataObject.userContent === undefined) {
    //     console.log("Data object is a string.");
        
    //     // establish parameters (string as is)
    //     const params = new HttpParams().append('userContent', dataObject); // establishing proper query parameters to match fastAPI
      
    //     // get AI response
    //     const response = this.http.post(this.aiURL, null, { params: params });

    //     // return response
    //     return response;
    //   }
    //   // if data is an object...
    //   else {

    //     console.log("Data is an object.");

    //     // // establish parameters
    //     // const params = new HttpParams();

    //     // // Pass 'dataObject' directly as the body
    //     // // retireve AI response
    //     // const response = this.http.post(this.aiURL, dataObject, { params: params });

    //     // // return response
    //     // return response;


    //     // convert data object to fastAPI object
    //     // const fastAPIObject = JSON.stringify(dataObject);
    //     // console.log("fastAPIObject :", fastAPIObject);


    //     const requestOptions = {
    //       method: 'POST',
    //       headers: {'Content-Type': 'application/json'},
    //       body: JSON.stringify(dataObject),
    //       withCredentials: true // Add this line
    //     };

    //     return this.http.post(this.aiURL, dataObject, requestOptions);
    //   }

    // } catch (error) {
    //   console.error("Error fetching AI response:", error);
    //   throw error;
    // }
     
    
  
  }

  // store a new message pair in the database
  storeMessagePair(userContent: string, aiContent: string) : Observable <NewMessagePair> {
    try{
      // create message pair object
      const messagePair: NewMessagePair = {
        userContent: userContent,
        aiContent: aiContent
      };

      // // post message pair to backend
      // console.log("Storing message pair @:", this.url);

      return this.http.post<NewMessagePair>(this.url, messagePair);
    }
    catch(error){
      console.error("Error storing message pair:", error);
      throw error;
    }
  }

  // load chat messages into view
  async updateChat(): Promise<void> {
    // get all chat items from backend
    this.getChatItems().subscribe((data) => {
      
      console.log("Loading this chat data:", data);
      
      try{
        // map response data to allMessages array (save last AI response for dash text creation)
        if (data[this.responseAccessor].length > 0) {
          this.allMessages = data[this.responseAccessor].map((item: MessagePair) => item);   
          this.lastAIResponse = this.allMessages[this.allMessages.length - 1].aiContent;       
        }
        else {
          console.error("No chat data found.");
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    }); 
  }

  // send user input to AI and save message-pair
  sendAndSaveChat(userContent: string): void {

    try {
      switch (this.currentSection) {

        // case 'GAMEPLAY':

        // break;

        case 'LORE':

          // prepare extra data for lore analysis
          let userQueries : string[] = [];
          const last_working_on = ""
          let current_element_content = "";

          const newUserInputData : UserInputData = {
            "section": this.currentSection,
            "userContent": userContent,
            "userQueries": userQueries,
            "last_working_on": last_working_on,
            "current_element_content": current_element_content
          };


          // show data being sent
          console.log("Sending to LORE AI. Data:", newUserInputData);

          // sending to '/lore' backend for AI analysis
          this.fetchAIResponse(newUserInputData.userContent, newUserInputData).subscribe({
            next: (response) => {

              // expecting <AIAnalysisData> response
              console.log("Lore analysis data:", response);

              this.aiData = response as AIAnalysisData;
              this.userData = newUserInputData;

              // after AI responds...
              // save message pair
              this.storeMessagePair(userContent, response['general_response']).subscribe({
                next: (storedPair : NewMessagePair) => {
                  console.log('Stored message after Lore analysis: ', storedPair);

                  // response is done loading 
                  this.isLoading = false;
                  console.log("Chat is done loading.");

                  // enable 'make dash text' button
                  this.canMakeDashText = true;

                },
                error: (error) => {
                  console.error('Error storing message pair:', error);
                }
              });
     
            },
            error: (error) => { 
              console.error('Error sending user input:', error); 
            },
          });


          // console.log("Sending user input to LORE AI: ", newUserInputData);

        break;

        // case 'NOVEL':

        // break;

        // case 'SCREENPLAY':

        // break;

        // case 'TIMELINE':

        // break;

        default:

          // fetch response from ai in selected section
          this.fetchAIResponse(userContent, "").subscribe({
            next: (response) => {
              console.log("Send & Save default response:", response);
              this.storeMessagePair(userContent, response['response']).subscribe({
                next: (storedPair : NewMessagePair) => {
                  console.log('Stored message pair:', storedPair);
                },
                error: (error) => {
                  console.error('Error storing message pair:', error);
                }
              });


              // chat is finished loading 
              this.isLoading = false;
              console.log("Chat is done loading.");

              // enable 'make dash text' button
              this.canMakeDashText = true;
            },
            error: (error) => { 
              console.error('Error sending user input:', error); 
            },
          });

        break;
      }


    } catch (error) {
      console.error("Error processing AI response for section " + this.currentSection + ":", error);
    }

  }

  // core chat logic when user sends input
  async chatLogic(userContent: string) : Promise<void> {

    // if this section is home 
    if(this.currentSection === 'HOME'){
      try {
        // send user input & get AI response
        console.log("Sending user input to HOME AI...");
  
        await this.fetchAIResponse(userContent, "").subscribe({
          next: (response) => {           

            // // save message pair
            // this.storeMessagePair(userContent, response['response']);

            // if the section changes...
            if(response['section'] !== this.currentSection) {
              console.log("Chat determined new section: " + this.currentSection + " --> " + response['section']);

              // configure new section 
              if(this.configureChat(response['section'])){
                this.directToSection(response['section']);
                console.log("Chat configured to new section.");
              
                // send user content to new AI + save message pair
                console.log("Sending user content to new section AI and saving message pair.");
                // console.log("content :", userContent);                

                this.sendAndSaveChat(userContent);

                // // update chat
                // this.updateChat();

                // enable send button - chat finished loading
                // this.isLoading = false;
                
                // // direct dashboard
                // this.directToSection(response['section']);

                // // enable 'make dash text' button
                // this.canMakeDashText = true;

                // show end of chat logic
                console.log("End of chat logic for section change.");

              }
              // if configuration was unsuccessful
              else{

                console.log("No matching section found. Chat more to determine a valid section.");

                // save message pair
                this.storeMessagePair(userContent, response['response']).subscribe({
                  next: (storedPair : NewMessagePair) => {
                    console.log('Stored message pair:', storedPair);

                  },
                  error: (error) => {
                    console.error('Error storing message pair:', error);
                  }
                });

                // update chat
                this.updateChat();

                // enable send button - chat finished loading
                this.isLoading = false;
              }
            }
            // if section didnt change...
            else{
              console.log("Section did not change.");

              // send user content to new AI + save message pair
              this.sendAndSaveChat(userContent);

              // update chat
              this.updateChat();
            }
            
          },
          error: (error) => { 
            console.error('Error sending user input:', error); 
          },
        });


      } catch (error) {
        console.error("Error sending user input:", error);
      }
    }

    // if section is not home
    else{
      // send to ai + save message pair
      this.sendAndSaveChat(userContent);

      // update chat
      this.updateChat();

      // // enable 'make dash text' button
      // this.canMakeDashText = true;
    }



  }

  // when send button is clicked, update display, then switch to detected section
  async onSend(userContent: string): Promise<void> {
    // SETUP

    // get input field
    const inputField = document.getElementById('userInput') as HTMLInputElement;

    // check if input empty
    if(userContent.trim() === '') {
      console.error("Input is empty. Please enter a message.");
      return;
    }

    // clear input field
    inputField.value = '';

    // configure section to user choice from html dropdown 
    const sectionSelect = document.getElementById('section-select') as HTMLInputElement;
    const userSectionSelection = sectionSelect.value;
    console.log("User selected section:", userSectionSelection);
    this.configureChat(userSectionSelection);


    // check user input length
    if(userContent.length > 500) {
      console.log("Input over 500 characters.");
      this.userContentLong = true;
    }
    


    // CORE LOGIC
    try{
      console.log("Waiting for chat to return...");
      await this.chatLogic(userContent);
    }catch(error){
      console.error("Error in chat logic:", error);
    }

    // chat 'finished loading' is found inside block above

  }



  hideChat() : void {
    this.chatVisible = !this.chatVisible;
  }

  toggleMessagesView() : void {
    this.messagesVisible = !this.messagesVisible;
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






