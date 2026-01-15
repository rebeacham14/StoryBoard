# App Ideas:

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

# models' systems & instructions
import model_systems


###############################

# Get the absolute path of the directory containing 'app_sections'
# In this case, 'app' directory
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
# Append the project root to sys.path
sys.path.append(current_dir)

###############################


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

placeholder_prompt = """You are an expert product information extractor.
Your task is to extract product details from the user's input.
YOU MUST output a single, strictly valid JSON object that conforms to the provided schema.
Do not add any introductory or explanatory text outside the JSON.
"""
###############################


class AssistantResponse(BaseModel):
    section: str
    response: str


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


@app.post("/assistant")
def generate(userContent: str):
    
    # add instructions with user input
    final_input = f"{assistant_instructions} : {userContent}"

    # feed model the final input
    response = ollama.chat(
        model="mistral", 
        options={"temperature": 0.5}, 
        messages=[
            {'role': 'system', 'content': assistant_system}, 
            {"role": "user","content": final_input}
        ], 
        format=AssistantResponse.model_json_schema(), # Pass the Pydantic schema here
    )
    try:

        # store ollama response
        response_data = AssistantResponse.model_validate_json(response['message']['content'])
        
        # separate data --> SECTION & FINAL_RESPONSE
        section = response_data.section.lower()
        final_response = response_data.response

    # if parsing doesnt work
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
    

    # if section is determined, go to it & carry-over user input (prompt)
    if(section != "UNCLEAR"):
        print(f"Directing to: {section}. Transferring prompt.")
        # return RedirectResponse(url=f"/{section.lower()}?prompt={prompt}", status_code=302)
        
        # return message w/o section
        # return final_response

        # return both message & section
        return response_data

    # if section none
    elif(section == None):
        print("Section not found. Sometheing went wrong.")
        return ("Section not found. Sometheing went wrong.")

    # if section is unclear, prompt to try again
    else:
        print("direction unclear. try again.")
        return ("direction unclear. try again.")
    


@app.post("/gameplay")
def generate(userContent: str):

    # add instructions with user input
    final_input = f"{gameplay_instructions} : {userContent}"

    # feed model the final input
    response = ollama.chat(
        model="mistral", 
        options={"temperature": 0.5}, 
        messages=[
            {'role': 'system', 'content': gameplay_system}, 
            {"role": "user","content": final_input}
        ], 
        format=AssistantResponse.model_json_schema(), # Pass the Pydantic schema here
    )
    try:

        # store ollama response
        response_data = AssistantResponse.model_validate_json(response['message']['content'])
        
        # separate data --> SECTION & FINAL_RESPONSE
        section = response_data.section.lower()
        final_response = response_data.response

    # if parsing doesnt work
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
    

    # if section is determined, go to it & carry-over user input (prompt)
    if(section != "UNCLEAR"):
        print(f"Directing to: {section}. Transferring prompt.")
        # return RedirectResponse(url=f"/{section.lower()}?prompt={prompt}", status_code=302)
        
        # return message w/o section
        # return final_response

        # return both message & section
        return response_data

    # if section none
    elif(section == None):
        print("Section not found. Sometheing went wrong.")
        return ("Section not found. Sometheing went wrong.")

    # if section is unclear, prompt to try again
    else:
        print("direction unclear. try again.")
        return ("direction unclear. try again.")
    


@app.post("/lore")
def generate(userContent: str):

    # add instructions with user input
    final_input = f"{lore_instructions} : {userContent}"

    # feed model the final input
    response = ollama.chat(
        model="mistral", 
        options={"temperature": 0.5}, 
        messages=[
            {'role': 'system', 'content': lore_system}, 
            {"role": "user","content": final_input}
        ], 
        format=AssistantResponse.model_json_schema(), # Pass the Pydantic schema here
    )
    try:

        # store ollama response
        response_data = AssistantResponse.model_validate_json(response['message']['content'])
        
        # separate data --> SECTION & FINAL_RESPONSE
        section = response_data.section.lower()
        final_response = response_data.response

    # if parsing doesnt work
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
    

    # if section is determined, go to it & carry-over user input (prompt)
    if(section != "UNCLEAR"):
        print(f"Directing to: {section}. Transferring prompt.")
        # return RedirectResponse(url=f"/{section.lower()}?prompt={prompt}", status_code=302)
        
        # return message w/o section
        # return final_response

        # return both message & section
        return response_data

    # if section none
    elif(section == None):
        print("Section not found. Sometheing went wrong.")
        return ("Section not found. Sometheing went wrong.")

    # if section is unclear, prompt to try again
    else:
        print("direction unclear. try again.")
        return ("direction unclear. try again.")
    


@app.post("/novel")
def generate(userContent: str):

    # add instructions with user input
    final_input = f"{novel_instructions} : {userContent}"

    # feed model the final input
    response = ollama.chat(
        model="mistral", 
        options={"temperature": 0.5}, 
        messages=[
            {'role': 'system', 'content': novel_system}, 
            {"role": "user","content": final_input}
        ], 
        format=AssistantResponse.model_json_schema(), # Pass the Pydantic schema here
    )
    try:

        # store ollama response
        response_data = AssistantResponse.model_validate_json(response['message']['content'])
        
        # separate data --> SECTION & FINAL_RESPONSE
        section = response_data.section.lower()
        final_response = response_data.response

    # if parsing doesnt work
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
    

    # if section is determined, go to it & carry-over user input (prompt)
    if(section != "UNCLEAR"):
        print(f"Directing to: {section}. Transferring prompt.")
        # return RedirectResponse(url=f"/{section.lower()}?prompt={prompt}", status_code=302)
        
        # return message w/o section
        # return final_response

        # return both message & section
        return response_data

    # if section none
    elif(section == None):
        print("Section not found. Sometheing went wrong.")
        return ("Section not found. Sometheing went wrong.")

    # if section is unclear, prompt to try again
    else:
        print("direction unclear. try again.")
        return ("direction unclear. try again.")
    


@app.post("/screenplay")
def generate(userContent: str):

    # add instructions with user input
    final_input = f"{screenplay_instructions} : {userContent}"

    # feed model the final input
    response = ollama.chat(
        model="mistral", 
        options={"temperature": 0.5}, 
        messages=[
            {'role': 'system', 'content': screenplay_system}, 
            {"role": "user","content": final_input}
        ], 
        format=AssistantResponse.model_json_schema(), # Pass the Pydantic schema here
    )
    try:

        # store ollama response
        response_data = AssistantResponse.model_validate_json(response['message']['content'])
        
        # separate data --> SECTION & FINAL_RESPONSE
        section = response_data.section.lower()
        final_response = response_data.response

    # if parsing doesnt work
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
    

    # if section is determined, go to it & carry-over user input (prompt)
    if(section != "UNCLEAR"):
        print(f"Directing to: {section}. Transferring prompt.")
        # return RedirectResponse(url=f"/{section.lower()}?prompt={prompt}", status_code=302)
        
        # return message w/o section
        # return final_response

        # return both message & section
        return response_data

    # if section none
    elif(section == None):
        print("Section not found. Sometheing went wrong.")
        return ("Section not found. Sometheing went wrong.")

    # if section is unclear, prompt to try again
    else:
        print("direction unclear. try again.")
        return ("direction unclear. try again.")
    


@app.post("/timeline")
def generate(userContent: str):

    # add instructions with user input
    final_input = f"{timeline_instructions} : {userContent}"

    # feed model the final input
    response = ollama.chat(
        model="mistral", 
        options={"temperature": 0.5}, 
        messages=[
            {'role': 'system', 'content': timeline_system}, 
            {"role": "user","content": final_input}
        ], 
        format=AssistantResponse.model_json_schema(), # Pass the Pydantic schema here
    )
    try:

        # store ollama response
        response_data = AssistantResponse.model_validate_json(response['message']['content'])
        
        # separate data --> SECTION & FINAL_RESPONSE
        section = response_data.section.lower()
        final_response = response_data.response

    # if parsing doesnt work
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
    

    # if section is determined, go to it & carry-over user input (prompt)
    if(section != "UNCLEAR"):
        print(f"Directing to: {section}. Transferring prompt.")
        # return RedirectResponse(url=f"/{section.lower()}?prompt={prompt}", status_code=302)
        
        # return message w/o section
        # return final_response

        # return both message & section
        return response_data

    # if section none
    elif(section == None):
        print("Section not found. Sometheing went wrong.")
        return ("Section not found. Sometheing went wrong.")

    # if section is unclear, prompt to try again
    else:
        print("direction unclear. try again.")
        return ("direction unclear. try again.")
    





# App Flow Ideas:

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
