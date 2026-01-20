import { Component, ViewChild } from '@angular/core';
import { CdkDrag, CdkDragHandle, DragDropModule, CdkDragDrop} from '@angular/cdk/drag-drop';
import {Observable, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import {FormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';

// import backend urls
import { URLS } from '../../urls';

// import widget panel
import { WidgetPanel } from '../widget/widget-panel';
import { SidePanel } from '../../sidePanel/side-panel/side-panel';
import { Chat } from '../../chat/chat';

interface DashboardItem {
  _id: string;
  name: string;
  icon: string;
  visible: boolean;
  title?: string;
  data?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NewDashItem {
  name: string;
  icon: string;
  visible: boolean;
  title?: string;
  data?: string;
}

interface UserInputData {
  section: string;
  userContent: string;
  userQueries: string[];
  last_working_on: string;
  current_element_content: string;
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

interface MakeDashElementData {
  user_data: UserInputData
  ai_data: AIAnalysisData
}



@Component({
  selector: 'app-dash-view',
  imports: [DragDropModule, WidgetPanel, SidePanel, Chat],
  templateUrl: './dash-view.html',
  styleUrl: './dash-view.css',
})
export class DashView {

  // backend url
  url: string = URLS.DASHBOARD;
  
  // dashboard items 
  dashboardItems : DashboardItem[] = [];



  // A unique ID for the new items container
  dashboardContainerId = 'dashboard-list'; 
  
  // A unique ID for the main container 
  widgetContainerId = 'widget-list'; 

  // list of possible widget items
  // widgetItems = ['Text', 'Image', 'Refference'];
  widgetItems = ['Text'];



  // track delete mode
  deleteMode: boolean = false;

  // backend response accessor
  responseAccessor: string = 'dashElements';

  // track current section
  currentSection: string = 'HOME';

  // track user input
  userInput: string = "";

  // track aiData
  aiData!: AIAnalysisData;

  // track userData
  userData!: UserInputData;

  // track AI panel visibility
  aiPanaelVisible: boolean = false; 
  // track AI section & content & visibility
  aiPanelContentVisible: boolean = false;
  aiPanelSection: string = "";
  aiPanelContent: string = "";

  // track selected dash element
  selectedDashElementId: string = "";

  // track list of ai data 
  listOfAIData: { [key: string]: AIAnalysisData } = {};

  // track if new analysis generated
  newAnalysisGenerated: boolean = false;
  // track new analysis data
  newAnalysisData: string = "";

  // track can commit to record
  canComitToRecord: boolean = true;



  // point to widget panel component
  @ViewChild(WidgetPanel) widgetPanel!: WidgetPanel;

  // point to side panel component
  @ViewChild(SidePanel) sidePanel!: SidePanel;

  // point to chat component
  @ViewChild(Chat) chat!: Chat;
  


  // on load, get dashboard items from backend
  constructor(private http: HttpClient) { }  
  ngOnInit(): void {

    // this.sidePanel!.onSelectSectionEvent.subscribe((section: string) => {
    //   this.handleSectionChange(section);
    // });

    // this.chat!.onSectionDirectionEvent.subscribe((section: string) => {
    //   this.handleSectionDirection(section);
    // });

    this.loadDashboardItems();    
  }

  // ngAfterViewInit(): void {
  //   // this.widgetPanel.onDropEvent.subscribe((event: CdkDragDrop<string[]>) => {
  //   //   this.handleDropEvent(event);
  //   // });
  // }


  // handlers for events from child components
  // widget panel functions
  handleDropEvent(event: CdkDragDrop<string[]>) {
    // if drop from widget to dashboard
    const previousContainer = event.previousContainer;
    const isWidgetContainer = previousContainer && previousContainer.element && previousContainer.element.nativeElement.id === this.widgetPanel.widgetContainerId;
    if (isWidgetContainer && event.container.id === this.dashboardContainerId) {
      // ... your existing code for handling the drop event in DashView
    }  
  }
  // side panel functions
  handleSectionChange(section: string) : void {
    console.log("Directing DashView to section: " + section);
    this.handleSectionDirection(section);

    console.log("Directing Chat to section: " + section);
    this.chat.configureChat(section);
  }
  // chat functions
  handleSectionDirection(section: string) : void {
    console.log("DashView handling direction to: " + section);

    // update current section
    this.currentSection = section;

    // direct side panel (section & scope)
    this.sidePanel!.parentDirect(section, 'notes');

    // direct chat panel
    this.chat!.configureChat(section);

    // configure dashboard based on section direction
    this.configureDashboard(section);



    // reload dashboard items based on new section
    this.loadDashboardItems();    
  }
  handleMakeDashText (makeDashElementData: MakeDashElementData) : void {
    console.log("Making new dash text item. Data: " + makeDashElementData);

    // const finalString = [aiResponse, aiAnalysisObject].join('\n\n');
    // const userAndAIData = JSON.stringify(finalString);

    // track user and ai data
    this.userData = makeDashElementData.user_data;
    this.aiData = makeDashElementData.ai_data;

    // create an object that holds user and ai data
    const allData ={
      "user_content": this.userData.userContent,
      "ai_analysis": this.aiData
    };

    // stringify the object
    const JSONData: string = JSON.stringify(allData)

    // create new dashboard item with all data
    const newDashItem : NewDashItem = {
      name: "TextBox",
      icon: "",
      visible: false,
      title: this.aiData.title,
      data: JSONData,
    };

    // add the new dashboard item to the backend
    this.addDashItem(newDashItem).subscribe((response) => {
      console.log('Dashboard item added:', response);
      // Refresh the dashboard items list to include the newly added item
      this.loadDashboardItems();
    });

  }



  // requests to backend
  getDashItems() : Observable <any> {
    console.log("Fetching from URL: " + this.url);
    return this.http.get<any>(this.url);
  }
  addDashItem(item: NewDashItem) : Observable <NewDashItem> {
    return this.http.post<NewDashItem>(this.url, item);
  }
  updateDashItems(id: string, updateData: any) : Observable <any> {
    return this.http.put<any>(`${this.url}/${id}`, updateData);
  }
  deleteDashElement(id : string): void {
    this.http.delete(`${this.url}/${id}`).subscribe((data) => {
      try{
        this.loadDashboardItems();
      }catch{
        console.error('Error processing delete:', data);
      }
    });

    this.deleteMode = false;

    // this.loadDashboardItems();
  }


  // dashboard functions
  configureDashboard(section: string) : void {
    // change backend url and response accessor based on section
    switch (section) {
      case 'HOME':
          this.url = URLS.HOME_DASH;
          this.responseAccessor = 'homeElements';
        break;
      case 'GAMEPLAY':
          this.url = URLS.GAMEPLAY_DASH;
          this.responseAccessor = 'gameplayElements';
        break;

      case 'LORE':
          this.url = URLS.LORE_DASH;
          this.responseAccessor = 'loreElements';
        break;

      case 'NOVEL':
          this.url = URLS.NOVEL_DASH;
          this.responseAccessor = 'novelElements';
        break;

      case 'SCREENPLAY':
          this.url = URLS.SCREENPLAY_DASH;
          this.responseAccessor = 'screenplayElements';
        break;

      case 'TIMELINE':
          this.url = URLS.TIMELINE_DASH;
          this.responseAccessor = 'timelineElements';
        break;

      default:
          console.log("No matching section found.");
        break;
    }
    console.log("Dash configured to section: " + this.currentSection);
  }
  
  drop(event: CdkDragDrop<string[]>) {
    // if drop is in the same container
    if (event.previousContainer === event.container) {
      console.log('Dropped in the same container.');
      // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    // if drop from widget to dashboard
    else if (event.previousContainer.id === this.widgetContainerId && event.container.id === this.dashboardContainerId) {
      // If pulled from widget container, and dropped into dashboard container, convert the Widget into a dashboard item
      const itemTitle = event.container.data[event.previousIndex];

      const newDashItem : NewDashItem = {
        name: "TextBox",
        icon: "",
        visible: true,
        title: itemTitle,
        data: "data",
      };

      // add the new dashboard item to the backend
      this.addDashItem(newDashItem).subscribe((response) => {
        console.log('Dashboard item added:', response);
        // Refresh the dashboard items list to include the newly added item
        this.getDashItems().subscribe((data) => {
          this.dashboardItems = data[this.responseAccessor];
        });
      });

    }

  }

  unlockDeleteDashElement(): void {
    this.deleteMode = !this.deleteMode;
  }  

  loadDashboardItems(): void {
    
    // request dashboard items from backend
    this.getDashItems().subscribe((data) => {
      try{
        console.log('Dashboard url+accessor:', this.url, '+', this.responseAccessor);

        // check if data has entries
        if(data[this.responseAccessor].length > 0) {
          // update local dashboard items list
          // this.dashboardItems = data[this.responseAccessor];

          // map incoming data to Dashboard Items
          console.log('Mapping dash items...');


          // debugging
          // track new data separately
          // const parsedData = JSON.parse('{user content: "test", ai_analysis: {title: "test title"}}');
          // console.log("Parsed data: ", parsedData);

          // store ai-data in list
          // this.listOfAIData[item._id] = parsedData.ai_analysis;



          // this needs to happen after all data is loaded
          this.dashboardItems = data[this.responseAccessor].map((item: DashboardItem) => {
            
            // track new data separately
            const parsedData = JSON.parse(item.data? item.data : '{}');

            // store ai-data in list
            if(parsedData.ai_analysis) {
              this.listOfAIData[item._id] = parsedData.ai_analysis;
            }else{
              console.log(item.data);
            }
            
            return {
              ...item, 
              visible: false,
            };
          });



        }else {
          console.error('No dashboard items found in the data:', data);
          this.dashboardItems = [];
        }
      }catch{
        console.error('Error processing dashboard items:', data);
      }
    });

    console.log("Dashboard items loaded.");
  }

  selectDashElement(id: string): void {
    // set selected element id
    this.selectedDashElementId = id;
    console.log('Selected Dashboard Item ID:', this.selectedDashElementId);
    
  }


  // element functions
  hideDashElement(id: any): void {
            
    // search for the item in dashboardItems and toggle its visibility (local update)(remap new list with updated value)
    this.dashboardItems = this.dashboardItems.map(item => {
      if (item._id === id) {
        return { ...item, visible: !item.visible };
      }
      console.log("Toggled visibility for item ID: " + id + " to " + item.visible);
      return item;
    });

        
    // find the item to update
    const itemToUpdate = this.dashboardItems.find(item => item._id === id);
    
    // after toggle, if visible, show data
    if(itemToUpdate?.visible === true){

      // decode item data and set element content
      // ...
      this.userInput = JSON.parse(itemToUpdate.data?itemToUpdate.data:"").user_content.trim();
    
    }
    else{
      console.log("Element data hidden.");
    }
  }
  async toggleAIPanel(): Promise<void> {    
    // toggle AI panel visibility
    this.aiPanaelVisible = !this.aiPanaelVisible;
  }
  toggleAnalysisContent(analysisType: string): void {

    // toggle analysis content visibility
    this.aiPanelContentVisible = !this.aiPanelContentVisible;
    
    // if analysis content is hidden, clear contents
    if(!this.aiPanelContentVisible){
      console.log("Hiding analysis content.");
      this.aiPanelContent = "";
      this.aiPanelSection = "";
      return;
    }
    // if analysis content is showing, display correct content
    else {
      console.log("Opening analysis content.");
      switch (analysisType) {
        case 'general_summary':
            this.aiPanelContent = this.listOfAIData[this.selectedDashElementId].general_response;
            this.aiPanelSection = 'General Summary';
          break;
        case 'connections':
            this.aiPanelContent = this.listOfAIData[this.selectedDashElementId].connections;
            this.aiPanelSection = 'Connections';
          break;
        case 'lore_summary':
            this.aiPanelContent = this.listOfAIData[this.selectedDashElementId].lore_summary;
            this.aiPanelSection = 'Lore Summary';
          break;
        case 'gap_suggestions':
            this.aiPanelContent = this.listOfAIData[this.selectedDashElementId].gap_suggestions;
            this.aiPanelSection = 'Gap Suggestions';
          break;
        case 'new_idea_suggestions':
            this.aiPanelContent = this.listOfAIData[this.selectedDashElementId].new_idea_suggestions;
            this.aiPanelSection = 'New Idea Suggestions';
          break;
        case 'user_question_responses':
            this.aiPanelContent = 'user question responses...';
            this.aiPanelSection = 'User Question Responses';
          break;
        default:
            console.log(`Cant find --${analysisType}-- type found.`);
          break;
      }
    }

  }

  saveElementData(id: string, userContent: string): void {
    
    // start save process
    console.log("Saving element data...");


    // find the item to update
    // const itemToUpdate = this.dashboardItems.find(item => item._id === id);

    // create an object that holds user and ai-data
    const allData = {
      "user_content": userContent,
      "ai_analysis": this.listOfAIData[id]
    };

    // stringify the object
    const JSONData: string = JSON.stringify(allData);

    // update data for element in database
    this.updateDashItems(id, { data: JSONData }).subscribe((data) => {
      try{
        this.loadDashboardItems();
      }catch{
        console.error('Error processing update:', data);
      }
    });
  }
  comitToRecord(id: string): void {
    console.log("Comitting element to record...");

    // get user input
    const targetItem = this.dashboardItems.find(item => item._id === id);
    const commitData = JSON.parse(targetItem?.data?targetItem.data:"").user_content.trim();

    // commit to backend and retrieve confirmation string (success/fail)
    const response = this.http.post<string>('http://127.0.0.1:8000/lore-commit', commitData);
    // show results
    console.log("Commitment results: ", response);
    
  }


  // analysis functions
  generateNewAnalysis(analysisType: string): void {
    console.log(`Generating new ${analysisType}..."`);
    // call backend to generate new summary
    // newAnalysisData = this.http.get<any>(this.url);
    // store new summary
    // this.newAnalysisData = newAnalysisData;
    
    // set flag to show new analysis available
    this.newAnalysisGenerated = true;
  
  }
  acceptNewAnalysis(id : string): void {
    console.log(`Accepting new analysis for item ID: ${id}..."`);
    
    // enable ability to generate new analysis
    this.newAnalysisGenerated = false;
    
    // update aiData for the item
    // this.listOfAIData[id].general_response = this.newAnalysisData;

    // save updated data to backend
    // this.saveElementData(id, this.userInput);
  
  }
  prevAnalysis(): void {
    console.log("Reverting to previous analysis...");
    
    // enable ability to generate new analysis
    this.newAnalysisGenerated = false;
    
    // logic to view previous analysis
    // clear new analysis data
    // this.newAnalysisData = "";
  }





}
