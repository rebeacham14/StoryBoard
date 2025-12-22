# runs when app opens
# loads notes (SoT for models to pull from)
# displays editing raw notes (manual w/ minimal AI)
# Displays different sections (include section for adding pics from phone)
### each section displays dedicated features
# color code everything (labels/tags)


# when an element is clicked :
### allow editing
### when done, send to confirmation function (sumary of how this fits into everything and what it changes/affects) (accept/deny)
### after confirm, make final commits (allow version control and returns) (maybe a different section that keeps)


###############################

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

import ollama
import json

import sys
import os

###############################




# Get the absolute path of the directory containing 'app_sections'
# In this case, 'app' directory
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
# Append the project root to sys.path
sys.path.append(current_dir)


# models' systems & instructions
import model_systems

# get system + instruction designs
assistant_system = model_systems.getSystem("assistant")
assistant_instructions = model_systems.getInstructions("assistant")

gameplay_system = model_systems.getSystem("gameplay")
gameplay_instructions = model_systems.getInstructions("gameplay")

lore_system = model_systems.getSystem("lore")
lore_instructions = model_systems.getInstructions("lore")

novel_system = model_systems.getSystem("novel")
novel_instructions = model_systems.getInstructions("novel")

screenplay_system = model_systems.getSystem("screenplay")
screenplay_instructions = model_systems.getInstructions("screenplay")

timeline_system = model_systems.getSystem("timeline")
timeline_instructions = model_systems.getInstructions("timeline")





app = FastAPI()

origins = [
    # agular ports
    "http://localhost:4200", 
    "http://127.0.0.1:4200",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials= True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# class Response(BaseModel):
#     section: str
#     response : str


@app.post("/assistant")
def generate(prompt: str):
    
    # add instructions with user input
    final_input = f"{assistant_instructions} \n {prompt}"

    # feed model the final input
    response = ollama.chat(model="mistral", options={"temperature": 0.5}, messages=[{'role': 'system', 'content': assistant_system}, {"role": "user","content": final_input}], format='json')
    
    # parse model response to retrieve SECTION & RESPONSE 
    try:
        # store ollama response
        json_string = response["message"]["content"]
        
        # getSection(prompt)

        # transform response into json data
        data = json.loads(json_string) # returns [role, content]
        # pureResponse = data["content"]


        # separate data --> SECTION & FINAL_RESPONSE
        section = data.get('section')
        final_response = data.get('response')

    # if parsing doesnt work
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
    
    # if section is determined, go to it & carry-over user input (prompt)
    # if(section == None):
    #     print("Section not found.")
    #     return final_response

    # if section is determined, go to it & carry-over user input (prompt)
    if(section != "UNCLEAR" and section != None):
        print(f"Directing to: {section}. Transferring prompt.")
        return RedirectResponse(url=f"/{section.lower()}?prompt={prompt}", status_code=302)
    
    # if section is unclear, prompt to try again
    else:
        print("direction unclear...\n")
        return data
    

# def getSection(response:str):
#     fullResponse = "Which section does this fall under [GREETING, GAMEPLAY, LORE, NOVEL, SCREENPLAY, OR TIMELINE]:\n" + response + "\nIf more than one category qualifies, respond with [MULTIPLE]. If none apply, respond with [UNCLEAR]. Always respond with only one word, all caps. "
#     _2ndResponse = ollama.chat(model="mistral", options={"temperature": 0.5}, messages=[{"role": "user","content": fullResponse}], format='json')
#     return _2ndResponse["message"]



@app.post("/gameplay")
def generate(prompt: str):
    # add instructions with user input
    final_input = f"{lore_instructions} \n {prompt}"
    
    # feed model the final input
    response = ollama.chat(model="mistral", options={"temperature": 0.5}, messages=[{'role': 'system', 'content': lore_system}, {"role": "user","content": final_input}], format='json')


@app.post("/lore")
def generate(prompt: str):

    # add instructions with user input
    final_input = f"{lore_instructions} \n {prompt}"
    
    # feed model the final input
    response = ollama.chat(model="mistral", options={"temperature": 0.5}, messages=[{'role': 'system', 'content': lore_system}, {"role": "user","content": final_input}], format='json')
    




@app.post("/novel")
def generate(prompt: str):
    # add instructions with user input
    final_input = f"{lore_instructions} \n {prompt}"
    
    # feed model the final input
    response = ollama.chat(model="mistral", options={"temperature": 0.5}, messages=[{'role': 'system', 'content': lore_system}, {"role": "user","content": final_input}], format='json')

@app.post("/screenplay")
def generate(prompt: str):
    # add instructions with user input
    final_input = f"{screenplay_instructions} \n {prompt}"
    
    # feed model the final input
    response = ollama.chat(model="mistral", options={"temperature": 0.5}, messages=[{'role': 'system', 'content': screenplay_system}, {"role": "user","content": final_input}], format='json')


@app.post("/timeline")
def generate(prompt: str):
    # add instructions with user input
    final_input = f"{lore_instructions} \n {prompt}"
    
    # feed model the final input
    response = ollama.chat(model="mistral", options={"temperature": 0.5}, messages=[{'role': 'system', 'content': lore_system}, {"role": "user","content": final_input}], format='json')


# -- with every /generate... comes a systems Agent

# landing:
# - sign in
# - welcome (tutorial)

# generate
# - how can I help you? ... sounds like a sequence concern, directing you to timeline ("Midori")
# - decide if it shoud go to one of the other systems
# --- UI: one bar input + selectable pannels

# systems :
# - backend: system constraints
# - front end: take input
# --- take input, send it through filtration (backend), output response
# - backend: regulate + gain approval + commit to document + return seggestion
# - detect if its time to go to another section
# --- explicit prompt (/bye --> home) || UI press




# takes/merges text from data/raw_notes into a single SoT document
# organizes info into json formatting for models to understand

# def load_notes():
#     notes = []
#     for file in raw_notes_dir:
#         notes.append(open(file).read())
#     return "\n\n".join(notes)




# import requests
# import json

# # set up base URL for local Ollama API
# url = "http://127.0.0.1:11434/api/chat"


# payload = {
#     "model": "mistral",
#     "messages":[
#         {
#             "role": "user",
#             "content": "Hi. Are you ready?",
#         }
#     ],
# }

# response = requests.post(url, json = payload, stream = True)

# if response.status_code == 200:
#     print("Streaming response from Ollama:")
#     for line in response.iter_lines(decode_unicode=True):
#         if line :
#             try:
#                 #parse each line as a JSON object
#                 json_data = json.loads(line)
#                 if "message" in json_data and "content" in json_data["message"]:
#                     print(json_data["message"]["content"], end="")
#             except json.JSONDecoderError:
#                 print(f"\nFailed to parse line {line}")
#     print() # final product ends with a new line
# else:
#     print("Not gettign response:")
