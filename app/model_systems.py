import ollama


# check if model is created (ollama create <name> -f ./ModelFile_<name>)...
model_names_to_check = ["Gaurd", "Lex", "Ahnya", "Karmedus", "Leozo", "Midori"] # [assistant, gameplay, lore, novel, sscreenplay, timeline]

# Get a dictionary of installed models
models = ollama.list() 

# Extract just the model names from the list
installed_models = [model['name'] for model in models['models']]


for name in model_names_to_check:
    if name in installed_models:
        print(f"The model '{name}' exists locally.")
    else:
        print(f"The model '{name}' does not exist locally.")
        # Optional: pull the model if it's missing
            # print(f"Attempting to pull the model '{model_name_to_check}'...")
            # ollama.pull(model_name_to_check)




# get assistant system design + instructions

general_assistant_system = 'app_sections/assistant/system/ModelFile_Assistant'
general_assistant_instructions = 'app_sections/assistant/system/Assistant_Instructions'






def getSystem(name:str):
    
    try:
        with open(general_assistant_system, 'r') as file:
            content = file.read()
            return(content+"\n\n")
    except FileNotFoundError:
        print(f"Error: The file '{general_assistant_system}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

def getInstructions():
    try:
        with open(general_assistant_instructions, 'r') as file:
            content = file.read()
            return(content+"\n\n")
    except FileNotFoundError:
        print(f"Error: The file '{general_assistant_instructions}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

assistant_system = getAssistantSystem()
assistant_instructions = getAssistantInstructions()




