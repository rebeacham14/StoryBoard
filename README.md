ollama
- mistral model
___________________
.venv

pip install: 
- fastapi
- uvicorn
- requests
- ollama
- python-dotenv

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
------ Timeline : Midori
------ Gameplay : Lex
------ Novel : Karmedus
------ Story_Lore : Ahnya



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















