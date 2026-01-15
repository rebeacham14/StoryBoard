ollama
- mistral model

.venv

pip install: 
- fastapi
- uvicorn
- requests
- ollama
- python-dotenv

npm install:
- angular/cli

ng add:
- @angular/material


database
- mongoDB
__________________________________________________



These are my notes for Storyboard.
I hope you enjoy the story.

----------------------------------------


- framed as this guy really trying to make it from a dream... well, multiple dreams...
- Simple reality studios


12/14/25

researched data structures and algorithyms (DSA)
- listXarrayXset, heaps (max/min), hash maps,  | binary search (modified), 
- --- next: bread/depth search


Got scammed from a fake NVIDIA email. Crazy story. Ended up pushing me to start my portfolio. Got so excited though, that i dreamed about what it would be like being that developed. Thats where I want to be, and I'll never let go of that. I have been carless (public transportation), laptop had screen issues (traveled with a monitor), even against the odds I had to fight. 

This pushed me into striving for the best of my self. I look around and see nothing... nothing but potential and opportunity. I know I'm that guy. Now it's time to do that thing.


------

Python venv setup

Git Repo Set up

Documentation prep
- git:
- --- A one-sentence high-level overview of what the project does and why it exists


-------

got it to work tonight. 
Now, time to figure out the ML model suited for categorizing my notes, and implementing user input to AI server



12/14/25
(tech with tim)

creating models to facilitate objectives and different features:

AI app (python, windows, vs code)
writing immersive world for my original videogame. 
So many notes, hard to organize and create a narrative for interactive 3d gameplay/ programming.
custom AI, takes all notes and organize story details into components 
- input: story/world building notes
- output: 
-1- chronological timeline (events), 
-2- readable cohesive novel with dynamic suggestions (story telling devices [conflict/climax/resolution, foreshadowing, plot twists, symbolism, themes, etc.)
-3- tracker of characters/events(major)/locations details/traits
-4- helper for combining/flowing narrative & creative gameplay mechanics


Today:
-1- chronological timeline (events)

"
You are my specialized archivist and the Chronicler of my original fantasy universe named [Xorkii]. 
You have expertise in organizing creative notes and ideas into a chronological time line of events that can be modified and altered to achieve impactful story and world cohesion. 
Your duty is to manage a precise timeline of historical events.
- When adding events, ensure they do not contradict existing lore.
- Always output new events in a structured JSON format.
- Keep track of causal relationships between events. 
"


i learned rather than ollama3.2, "mistral" model is better for 'complex instructions, [and] general-purpose world-building'


created this new model
C:...> ollama create Midori -f ./ModelFile_Timeline
--- had to execute in sys terminal, not vscode


learning about:
- fastapi / uvicorn

Next:
- set up git/vscode to track changes
- create models for other sections (give raw notes to agent to organize)
--- each section agent is a character
------ Assistant : Gaurd (THQ)
------ Gameplay : Lex
------ Lore : Ahnya
------ Novel : Karmedus
------ Screenplay : Leozo
------ Timeline : Midori



12/16/25


Finishing engineering preompts for each model/section

Next:
- learn how to create a "source of thruth" (SoT)
--- a document that stores json-structured data for each character, item, location, & event
--- prompting models to structure json and populate SoT
--- then, parsing the json when interacting with user


-------------


SoT
- runs in main
--- takes/merges text from data/raw_notes into a single SoT document
--- organizes info into json formatting for models to understand
- models pull from SOT



establishing section-particular features (novel - text to speech reading)

learn about:
- streamlit (python)


was able to create json templaate for novel input


finished engineering prompts for these models:
- Timeline
- Novel
- Lore

-------------

Next:
- research how gamemechanics can be an extension of narrative
--- what makes mechanics fun and engaging
--- how to stay in sync with narritive




12/17/25

finished model for gameplay

next:
- finalize all models, keeping prompts congruent.
- initialize lore model and establish/populate LORE DATABASE with notes 
--- remove previous models first


-----------------

ran Lore Agent system through GPT
needed better:
- formalization
- separation of concerns
- machine-enforceable constraints
- Industry standard (Canon updates → strict schema && Suggestions → sandboxed, non-persistenta)



Pros:
implicitly separating reasoning, decision, state mutation



Feature	- Your Prompt	-Industry Standard
Role specificity	✅ Excellent	✅ Required
Human approval loop	✅ Excellent	✅ Required
Structured data	⚠️ Partial	✅ Enforced schema
CRUD diffs	⚠️ Implicit	✅ Explicit
Separation of concerns	⚠️ Mixed	✅ Layered
Validation	❌ Missing	✅ Mandatory
State tracking	❌ Prompt-only	✅ Backend-controlled



12/19/25

connecting UX flow through input
- design UI
--- implement AI tools in workflow

organize model disigns
- separate instructions from system


organize project directory



mechanics notes:
    500 days of summer inspo:
    expectation vs reality side by side panelle
    - after first play through
    - different interpretations
    - - wouldve never been here without what happened before (they interact, and are effected by eachother [like a cosmic astom bouncing off another and never to interact again])


course on angular
- mixing angular with fast api
- building angular components


12/20/25

trynna send data from angular to fast API
- user input prompt --> AI model


12/21/25

was able to communicate input value based on button click
- #myPrompt in inputElement
- (click)="onSendPrompt(myPrompt.value)"
- string prompt variable, signal variable (to show on screen)
- onSendPrompt(prompt) {this.prompt = prompt; signalVariable.set(value)}

next:
- fetch/send data in angular from/to python (fast)API

ran into (422 unprocessable content)
- headers in angular?
- not headers, it was model replying in a way that broke the code, returned null for some values

next:
- force the model to reply in a consistent way
--- pydantic models

=============
from pydantic import BaseModel
class ProductInfo(BaseModel):
    name: str
    category: str
    price: float
    description: str
system_prompt = """You are an expert product information extractor.
Your task is to extract product details from the user's input.
YOU MUST output a single, strictly valid JSON object that conforms to the provided schema.
Do not add any introductory or explanatory text outside the JSON.
"""
response = chat(
    model='mistral', # or mistral:instruct
    messages=[
        {'role': 'system', 'content': system_prompt},
        {'role': 'user', 'content': 'Tell me about the new "Wireless Ergonomic Mouse" which costs $49.99 and is in the "Electronics" category.'}
    ],
    format=ProductInfo.model_json_schema(), # Pass the Pydantic schema here
)
try:
    product_data = ProductInfo.model_validate_json(response['message']['content'])
    print(f"Name: {product_data.name}")
    print(f"Category: {product_data.category}")
    print(f"Price: ${product_data.price}")
    print(f"Description: {product_data.description}")
except json.JSONDecodeError as e:
    print(f"Failed to decode JSON: {e}")
    print(f"Raw response content: {response['message']['content']}")

=================

12/22/25

time to establish a pydantic model to the AI's response

make sure to implement instructions in system, not in separate query with user prompt

pydantic schema + refined system and instructions design to produce desired model response

finally was able to send angular input to fastAPI and got a successful response

next:
- refactor all other model systems and create api end points
- create css for UI
- when section is determined, switch to corect section, carrying over user input
- after user input, populate database (vector database?)


UI outline [MVP (Minimum Viable Product)]:

product type + target user
- web app for professionals & creatives (wreiters & game devs). 
- brainstorm & organize by saving ideas into a project with multiple sections (save to database)
- user can use to help organize/create story world adn game ideas

main goal + main feature
- start new project
--- 1st: brainstorm (what the world/game is about)
- freely move through sections adn projects
- ask questions + make suggestions to narrow vision

user scenario (examples)


desired outcome
- a concsise project (either story, world, game, or combo), will all basic features  



12/24/25

had trouble with (*ngFor), displaying the items in dictionary established in .ts file
- @for (item of dict; track item) {...}




1/1/26


how to reply to this email with the same word count and including these topics
- my interest in music
- swe during covid
- 
- game company
- intentional networking is important
- 




Great to meet you, I appreciate you for reaching out!
- Hi Cheyenne,
- thank you for getting back to me. I trust you're enjoying the company of close friends and family.


Honestly, my path to professional experience has been a little non-traditional so far since I haven’t had an internship yet. 

- You and I are experiencing a similar journey. My "free time" is often spent on platforms like Indeed and Handshake in search of technical internships and opportunities.  
- It's a cool coincedince that we both work with Coding Mind  While reading through your experiences I couldn't help but notice some cool coincidences. 
- I started  relate to your experience. I changed my direction during the pandemic and 




focusing on building experience through group projects, and being really intentional about networking.



 attended NSBE’s Fall Regional Conference, which helped me meet professionals and learn more about what companies are looking for, and I’ve tried to follow up and keep those connections active.



On the work side, I’ve been at Petco part-time while I finish my degree
- 
- but haven't really 







Would love to hear what you’ve been doing as well, are you currently looking for internships, aiming for full-time roles after graduation, or exploring internal opportunities where you work?



------------

1/8/26

big vision:
- ai that helps you create videogames & movies (world building elements, lore {timeline / scenes})


to do:
- draggable textboxes 
- text box widgets 


now:
- draggable text boxes 
- 



1/9/25

making elements hide-able 



1/10/26
made it hideable 
- create visible variable in item
- use @if(item.visible)


Next:
- when type in box and hide, value disappears
- when refresh window, list clears
--->
session storage


1/11/26

need to save data --> database --> firebase
nope, learned firebase isnt free, can establish other full databse in same time with no cost

integrate express / mongodb 


built new storyboard project mongo atlas
- ip address
- cluster

set up mongoose schema and basic crud operations
- user
- dashboard elements 

async function when retrieving the data from dashElements (back end database)



1/12/26

got elements to keep data after hide 
- {{item.data}} in textarea value

now save new values on button press
- completed

fixed warning
- "The configured tracking expression (track by identity) caused re-creation of the entire collection"
- instead of @for track item --> treack item._id [has to be a unique identifier]

completed
- delete (mode) button


optional next:
- save location so elements go to the last place intead of all reloading in the corner

next:
- complete ai/user pipeline

currently: completing backend routes in backend server.ts and chat.ts


1/13/26

completed:
was able to get chat initialized
- send first message (hi), get response
- display messagePairs in chat box + scroll


next
- seamlses back and forth + chat display
--- display doesnt auto load after request
- smart interaction (chat directs to different sections)
- chat helps create dash elements


completed:
- seamlses back and forth + chat display (no auto load)


[smart interaction]
i have build an angular app and successfully configureds it to communicate with python AI model via fast api to determine the desired section based on the user input message sent. I want to include a feature where my angular app then displays different html sections based on the determined section variable
--->

ollama advice : dom routing 
---
In your Angular component, use the service to call the API and navigate to the appropriate HTML section based on the response:
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userMessage: string = '';
  determinedSection: string;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {}

  async onSubmit() {
    const response = await this.apiService.determineSection(this.userMessage).toPromise();
    if (response.section) {
      this.determinedSection = response.section;
      // Navigate to the appropriate HTML section
      this.router.navigate([this.determinedSection]);
    }
  }
}
Update your Angular routing module:
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';

const routes: Routes = [
  { path: '', component: ChatComponent },
  // Add route for each HTML section you want to display
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
---


gemeni advice: if/switch html
---
<div [ngSwitch]="determinedSection">
  <div *ngSwitchCase="'home'">
    <h2>Welcome Home</h2>
    <p>This is the home section content.</p>
  </div>

  <div *ngSwitchCase="'profile'">
    <h2>User Profile</h2>
    <p>View your profile details here.</p>
  </div>
---


challenge communicating widget drag/drop to dash item list
- widget : 
--- private onDrop = new EventEmitter<CdkDragDrop<string[]>>();
  @Output()
  public onDropEvent = this.onDrop;
  drop (event: CdkDragDrop<string[]>) {thsi.onDrop.emit(event)}

- dash : 
--- @ViewChild(WidgetPanel) widgetPanel!: WidgetPanel;
  ngAfterViewInit(): {
    this.widgetPanel.onDropEvent.subscribe((event: CdkDragDrop<string[]>) => {
      this.handleDropEvent(event);
    });
  }
  handleDropEvent(event: CdkDragDrop<string[]>) {
    // if drop from widget to dashboard
    if (event.previousContainer === this.widgetPanel.widgetContainerId && event.container.id === this.dashboardContainerId) {
      // ... your existing code for handling the drop event in DashView
    }
  }
--- instanceof (for type comparisons)

successfully wrote code. no errors in vs but next: run to debugg

going to go get my car out of the shop, lol



currently :
- circular dependency error (dash & widgetPanel)
- dashboard displays, but widget is Missing
- dash items are missing
- chat is missing

had to remove irrelavent dash dependancy from widget panel


compelted responsive nav scope button


[update dashboard via sidepanel]
i have an angular17 project with different components. sidepanel, dashboard, and chat. how to update dashboard data from sidepanel on button click


want to trigger event and update dashboard with info pertaining to the section
- EventEmitter? similar to drop event
- Shared Communication Service (angular service)

used eventEmitter 

successfully comunicated between side panel and dashboard

next: connect chat to dashboard

successfully connected chat to dashboard

next: populate dash values based on section direction
- create databases for sections to pull info from
--- finish chat databases for sectoins
- different set of widgets depending on section

- get section from parent dash component in side panel when chat directs
- in chat, handle when response section is undefined


completed dashboard section databases

now : creating databases and linking chat to detect/direct section based on user prompt


1/14/26

quick next:
- hide button for chat (hide button for all)


now : configure AI for lore (upon switching sections, needs lore AI for response)

--- editing AI system/instruction design
\/ lore
Use the information in the LORE DATABASE. I will specify the record file and LORE DATABASE source directory later. For now, help me decide how to organize my ideas using the following json template:
{
    "universeName":"Kaj"
    "worlds":[
        {
            "worldName": "Xorkii",
            "characters": [
            {
                "id": "C001",
                "name": "Elara Meadowlight",
                "element":"earth"
                "class": "scholar",
                "abilities":["shapeshift", "flight"], 
                "stats": { "strength": 12, "dexterity": 16, "intelligence": 10 },
                "inventory": ["I002", "I004"], // References item IDs
                "currentLocation": "L002", // References location IDxt
            },
            // more characters
            ],
            "items": [
            {
                "id": "I001",
                "name": "Sunstone Amulet",
                "type": "Accessory",
                "description": "Glows with warm light.",
                "effects": { 
                    "defense": 2, 
                    "magic_resist": 1, 
                    "radius_freeze":30, 
                    "orgin":["pointer", 30],
                    // more effects 
                }
            },
            // more items
            ],
            "locations": [
            {
                "id": "L001",
                "name": "Whispering Woods",
                "type": "Forest",
                "description": "Ancient, eerie woods.",
                "connections": ["L002"] // Links to other locations
            },
            {
                "id": "L002",
                "name": "Oakhaven Village",
                "type": "Town",
                "description": "A peaceful village.",
                "connections": ["L001"]
            },
            // more locations
            ],
            "events": [
            {
                "id": "E001",
                "name":"The Dragon's Arrival",
                "time": 52, // float type that indicates year
                "location": ["City of E", "Tower of R"], // list of locations
                "occurrences": "Detailed description of what happens during the event",
                "characters": ["C001"], // Can list character/NPC IDs
                "items": ["Item X", "Item Y"],
                "triggers": ["C001 reaches Oakhaven", "I001 is used"], // list of precedding occurrances that lead to this event
            },
            // ... more events
            ]
        }
    ]
}, 
Your goal is to accurately track, update, and retrieve detailed information about characters, items, locations, and events within the provided world lore. Maintain perfect consistency.
When prompted with new information, you must update the relevant entry in the LORE DATABASE. 
If the entry does not exist, create a new one. All updates must be fact-checked against the existing data. 
If asked to retrieve information, provide a concise summary. 
Do not invent facts or hallucinate details. If you are unsure, ask for clarification. If unable to come to a conclusion after 10 tries, state the information is unavailable and prompt user to try again (reset tries).
When recieving new input:
- Step 1: Analyze the new input for conflicts with the current LORE DATABASE. 
- Step 2: If no conflict exists, propose an update. 
- Step 3: Wait for confirmation before finalizing the entry.
Sometimes, make diverse and inclusive suggestion ideas on lore and new inputs, promoting cohesion, consistency, and imact.
For easy retrieval, list character traits and location descriptions in bullet points rather than dense paragraphs, unless requested.
Track:
- Character arcs
- Motivations
- Contradictions
- Symbolic meaning
Rules of Engagement:
- start each reply with a line stating if source of record file and LORE DATABASE is assigned ("record file: missing --- LORE DATABASE: connected (./FilePath)")
- I, the human author, retain ultimate accountability for the lore. your role is to support the process, but the final judgment and creative decisions rest with me.
- always require confirmation before committing changes to any files
- clearly explain how you reached a certain conclusion about your suggestions, referencing the source material used
- Don't commit new entries without permission.
- All your generated content is a starting point, not a final product. You an d I both must review, refine, and adapt the material to fit my unique vision, style, and the nuances of this project.
- When generating new ideas or making suggestions, adhere to the established canon and flag potential inconsistencies for review. However, be open to making/taking suggestions for "what-ifs" (e.g., "What if this item does this?"), but these simulations should have a clear purpose of how it enhances, and should be clearly marked as non-canonical until approved by me
- The goal is to enhance the creative workflow and overcome creative blocks, not to substitute human creativity or critical thinking skills.
- No need to include in every response, but ensure that the creative input is significant enough to claim copyright over the final work. If not, let me know.


\/ gameplay
For each suggestion:
- fist, define the overarching story arc (where is the player in terms of the story timeline; what are surrounding events/characters etc.)
- then, think step-by-step through a player's interaction. For example: 1. The player finds a cursed relic. 2. How does this change the world state? 3. What new creative gameplay mechanics does this relic unlock?
- then, propose three possible gameplay mechanics that fit the purpose (e.g., "when the player enters this emotional state, activate the 'Corruption' meter mechanic").
- then, evaluate how these mechanics advance the story and integrate with the existing system(s), and/or identify three weaknesses where the narrative logic conflicts with player agency. Suggest a rewrite that fixes these gaps. Require a confirmation and settle of this issue before continuing.
Mechanics/systems you suggest should reinforce:
- Character arcs
- Themes
- Emotional pacing
- Player agency
Examples of how narrative manifests in gameplay:
- player makes a betrayal --> a permanent debuff to social stats
- audio logs revealing lore while the player explores
- characters will have conversations with you about things like how many attempts you've made, what weapons and powers you're using, the enemies you're fighting, and so on
- once you only catch the tail end of what the Camerata is saying: "... that, I believe, is the true purpose of the Transistor."Sword boyfriend: "Wait, say that again?" He does not. That is how you are told that yes, there is more to this, and no, you are not getting the whole picture, and never were.
- There's a scene where player character is a detective and has a suspect that goes for their jacket pocket. A qte prompt floes up and as a player you automatically respond in the same way the detective might automatically respond to a hostile suspect seemingly going for a weapon. It turns out to be a crucifix and if you just let the qte go by it would have been fine. It's a real wham moment for how instinct is not always good.
- like Silent Hill 2: you roam through a desolated, nightmarish town. You navigate mazes, you struggle with riddles, you confront or evade monsters. You're in a constant pursue, and you also descend a lot - in a literal sense. All of this works as a metaphor to accepting a truth that your character denied and ran away from - as well as making a decision as to what will be the consequences of this truth. the game utilize every single artistic device available to support and enhance the narrative - from art and sound design to pacing to even camera angles. the settings, the enemy designs, even the gloom-and-rot aesthetics are manifestations of the protagonist's trauma and guilt.
Rules of Engagement:
- start each reply with a line stating if source of record file and LORE DATABASE is assigned ("record file: missing --- LORE DATABASE: connected (./FilePath)")
- Provide detailed, actionable feedback and creative options, not just generic encouragement.
- Ask clarifying questions if my instructions are vague.
- When adding events, ensure they do not contradict existing rules/systems, enless it has a cool/intentional reason for doing so.
- Mechanics must serve engagement, immersion, and fun. Avoid complexity for complexity's sake; focus on meaningful choices.
- mechanics should create challenge, not random frustration. Manage player expectations and ensure mechanics/systems feel fair or purposeful, serving a clear goal.
- some systems/mechanics should be dynamic, able to be trained and refined based on player feedback, allowing for gradual introduction of complex features.
After we get all the ideas conceptiualized, we will focus on specific areas, and you will work with me to implement these ideas into code.






