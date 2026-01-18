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



analyzer_system = """
You are an expert content analyzer. 
Your task is to analyze input, compare against the master record_file, and provide structured feedback detailing key components and elements.
"""

###############################

LORE_FILE_PATH = os.path.join(current_dir, "app_sections", "lore", "lore_file.txt")

class AssistantResponse(BaseModel):
    section: str
    response: str

class AnalyzerResponse(BaseModel):
    response: str

class SummaryAnalysis(BaseModel):
    title: str
    general_response: str
    connections: str
    lore_summary: str
    gap_suggestions: str
    new_idea_suggestions: str
    logic_conflicts: str
    user_question_responses: list[str]

class UserInputData(BaseModel):
    section: str
    userContent: str
    userQueries: list[str]
    last_working_on: str
    current_element_content: str

app = FastAPI()

origins = [
    # agular ports
    "http://localhost:4200"  # Angular server
    # "http://127.0.0.1:4200",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials= True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def getLoreText() -> str:
    lore_txt = ""
    
    # extract txt from record_file as lore_txt
    try:
        with open(LORE_FILE_PATH, 'r') as file:
            lore_txt = file.read()  # Read the entire file content into a string
        return lore_txt

    except FileNotFoundError:
        print(f"Error: The file '{LORE_FILE_PATH}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")



def analyze_input(input: str, use_record_file: bool, direction: str) -> str:
    
    lore_txt = getLoreText()
    
    # add instructions with user input
    if(input == ""):
        final_input = f"{direction} : {lore_txt}"
    elif(use_record_file == False):
        final_input = f"{direction} :: {input}"
    else:
        final_input = f"{direction} :: {input} :record_file: {lore_txt}"
    

    # feed model the final input
    response = ollama.chat(
        model="mistral", 
        options={"temperature": 0.2}, 
        messages=[
            {'role': 'system', 'content': analyzer_system}, 
            {"role": "user","content": final_input}
        ], 
        format=AnalyzerResponse.model_json_schema(), # Pass the Pydantic schema here
    )
    try:
        # ollama response
        response_data = AnalyzerResponse.model_validate_json(response['message']['content'])
        
        # return analysis response
        final_response = response_data.response
        return final_response
    
    # if parsing doesnt work
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")


def summary_analysis(userContent_summaries: list, record_file_summaries: list, userInputData: UserInputData) -> SummaryAnalysis:

    # get the element the user was last working on
    last_working_on = userInputData.last_working_on



    # transform userContent_summaries into single text
    combined_userContent_summaries = " ".join(userContent_summaries)

    # transform record_file_summaries into single text
    # combined_record_file_summaries = " ".join(record_file_summaries)


    # track answers to user questions
    user_question_responses = []

    # create a title based on the user content
    topic_title = analyze_input(userInputData.userContent, False, "Provide a concise title summarizing the main topic of this input.")

    # [ general analysis of entire user input ]
    general_response = analyze_input(userInputData.userContent, False, "Provide a 100 word concise summary of this input. Relate it to the lore.")

    # return connections between current text element summaries
    connections = analyze_input(combined_userContent_summaries, True, "Illustrate connections between user input and the lore.")
    
    # returns summary of lore
    lore_summary = analyze_input("", True, "Summarize the lore in 100 words; strictly what is in the lore only. Provide feedback regarding key elements.")

    # returns suggestions to fill in gaps in lore
    gap_suggestions = analyze_input("", True, "Suggest gaps in the lore that need filling for consistency.")
    
    # returns suggestions to start new ideas to expand lore
    new_idea_suggestions = analyze_input("", True, "Suggest new ideas to expand the lore")

    # returns conflicts in logic within the lore
    logic_conflicts = analyze_input("", True, "Identify conflicts and holes within the lore.")

    # for each question, adds response[str] (based on the lore) to list of responses
    # try:
    #     for question in userInputData.userQueries:
    #         user_question_responses.append(analyze_input(question, True, "respond to user's questions based on the lore"))

    # except Exception as e:
    #     print(f"An error occurred while processing user questions: {e}")
    #     return None
    

    return SummaryAnalysis(
        title= topic_title,
        general_response = general_response,
        connections = connections,
        lore_summary = lore_summary,
        gap_suggestions = gap_suggestions,
        new_idea_suggestions = new_idea_suggestions,
        logic_conflicts = logic_conflicts,
        user_question_responses = ["response_1", "response_2"],
    )


# breaks down large text into list of smaller summaries
def digest_input(text: str, chunk_size = 3000) -> list:
    # track the blocks of text to analyze
    list_of_chunks = []

    # track the summaries from each chunk
    list_of_summaries = []


    # if text is small, send whole input to be analyzed
    if len(text) < 3000:
        list_of_chunks.append(text)
    # if text is large, break into chunks
    else:
        # Loop from the start of the text to the end, in steps of chunk_size
        for start_index in range(0, len(text), chunk_size):
            # Slice the text from the current start_index up to start_index + chunk_size
            chunk = text[start_index:start_index + chunk_size]
            list_of_chunks.append(chunk)

    # for each chunk, get summary and add to list_of_summaries
    for chunk in list_of_chunks:
        summary = analyze_input(chunk, False, "provide a 1000 character concise summary of the following text")
        list_of_summaries.append(summary)

    return list_of_summaries






# analyzes and returns object with helpful insight
def lore_check(userInputData: UserInputData) -> SummaryAnalysis:


    # debugging

    lore_txt = getLoreText()

    print(userInputData.userContent)
    
    # large text broken down into list of smaller summaries
    # [ userContent ]
    userContent_summaries = digest_input(userInputData.userContent)
    # [ record_file ]
    record_file_summaries = digest_input(lore_txt)


    # - AI takes both lists of summaries and returns:
    # [ last_working_on ]
    # [ connections to other sections (chooses a random section and finds relateability)]
    # [ lore summary (key elements) ]
    # [ suggestions to fill in gaps ]
    # [ suggestions to start new idea ]
    # [ conflicts in logic ]
    # [ response to user questions ]
    new_SummaryAnalysis_object = summary_analysis(userContent_summaries, record_file_summaries, userInputData)


    # summary_analysis = SummaryAnalysis (        
    #     general_response = general_analysis,
    #     connections = "connections",
    #     lore_summary = "lore_summary",
    #     gap_suggestions = "gap_suggestions",
    #     new_idea_suggestions = "new_idea_suggestions",
    #     logic_conflicts = "logic_conflicts",
    #     user_question_responses = ["response1", "response2"]
    # )

    return new_SummaryAnalysis_object











    # lore_txt = getLoreText()
    
    # # large text broken down into list of smaller summaries
    # # [ userContent ]
    # userContent_summaries = digest_input(userInputData.userContent)
    # # [ record_file ]
    # # record_file_summaries = digest_input(lore_txt)
    
    # # - AI takes both lists of summaries and returns:
    # # [ last_working_on ]
    # # [ connections to other sections (chooses a random section and finds relateability)]
    # # [ lore summary (key elements) ]
    # # [ suggestions to fill in gaps ]
    # # [ suggestions to start new idea ]
    # # [ conflicts in logic ]
    # # [ response to user questions ]
    # # new_SummaryAnalysis_object = summary_analysis(userContent_summaries, record_file_summaries, userInputData)

    # # return new_SummaryAnalysis_object





@app.post("/assistant")
def generate(userContent: str):
    
    print("Received userContent:", userContent)


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

        # print("Ollama response content:", response['message']['content'])
        # ollama response --> AssistantResponse object
        response_data = AssistantResponse.model_validate_json(response['message']['content'])

        print("AssistantResponse object:", response_data)


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

        # ollama response
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
def generate(userInputData: UserInputData):

    print("Received userInputData:", userInputData)

    # check section

    match userInputData.section.lower():
        case 'gameplay':
            print("gameplay analysis...")
            pass
        case 'lore':
            print("lore analysis...")
            # perform lore check analysis with user input data
            final_analysis = lore_check(userInputData)
            pass
        case 'novel':   
            print("novel analysis...")
            pass
        case 'timeline':
            print("timeline analysis...")
            pass
        case 'screenplay':
            print("screenplay analysis...")
            pass
        case _:
            print("section not recognized. defaulting to general assistant...")
            pass

    # create UserInputData object for lore_check


    # return final_analysis


    # debugging
    return final_analysis


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
