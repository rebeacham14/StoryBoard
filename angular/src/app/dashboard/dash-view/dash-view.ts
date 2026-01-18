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

interface SummaryAnalysis {
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
  ai_data: SummaryAnalysis
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



  // delete mode toggle
  deleteMode: boolean = false;

  // backend response accessor
  responseAccessor: string = 'dashElements';


  // toggle AI panel visibility
  aiPanaelVisible: boolean = false; 
  
  // toggle analysis content visibility
  analysisContentVisible: boolean = false;



  // track current section
  currentSection: string = 'HOME';

  // track aiData
  aiData!: SummaryAnalysis;

  // track userData
  userData!: UserInputData;

  // track AI content
  aiPanelContent: string = "";



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

    this.userData = makeDashElementData.user_data;
    this.aiData = makeDashElementData.ai_data;

    const newDashItem : NewDashItem = {
      name: "TextBox",
      icon: "",
      visible: true,
      title: this.aiData.title,
      data: this.userData.userContent,
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
    this.getDashItems().subscribe((data) => {
      try{

        // check if data has entries
        if(data[this.responseAccessor].length > 0) {
          // update local dashboard items list
          this.dashboardItems = data[this.responseAccessor];
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

  selectDashElement(id: any): void {
    // search for the item in dashboardItems and log its data
    const selectedItem = this.dashboardItems.find(item => item._id === id);
    if (selectedItem) {
      console.log('Selected Dashboard Item Data:', selectedItem.data);
    }
  }


  // element functions
  hideDashElement(id: any): void {
    // search for the item in dashboardItems and toggle its visibility (local update)(remap new list with updated value)
    this.dashboardItems = this.dashboardItems.map(item => {
      if (item._id === id) {
        return { ...item, visible: !item.visible };
      }
      return item;
    });
  }

  saveElementData(id: string, newValue : string): void {
    const newData = newValue;
    this.updateDashItems(id, { data: newData }).subscribe((data) => {
      try{
        this.loadDashboardItems();
      }catch{
        console.error('Error processing update:', data);
      }
    });
  }

  hideAIPanel(): void {    
    // toggle AI panel visibility
    this.aiPanaelVisible = !this.aiPanaelVisible;

    // if AI panel is hidden, hide other content
    if(!this.aiPanaelVisible){
      // Summary 
      this.analysisContentVisible = false;
      // other content sections
      // ...
    }
    // if AI panel is shown, and content is empty, show analysis
    else if (this.aiPanaelVisible && this.aiPanelContent === "") {
      this.analysisContentVisible = true;
      this.aiPanelContent = this.aiData.general_response;
    }

  }

  hideAnalysisContent(): void {

    // if AI panel is hidden, show it && summary content
    if(!this.aiPanaelVisible){
      this.aiPanaelVisible = true;
      this.analysisContentVisible = true;
    }
    else if(this.analysisContentVisible){
      this.aiPanaelVisible = false;
      this.analysisContentVisible = false;
    }

    this.aiPanelContent = 
      `AI Summary:
      ${this.aiData.general_response}
      `
    ;
    
  }
}
