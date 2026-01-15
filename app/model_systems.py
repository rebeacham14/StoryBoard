import ollama

# check if model is created (ollama create <name> -f ./ModelFile_<name>)...
# model_names_to_check = {"assistant", "gameplay", "lore", "novel", "screenplay", "timeline"} # ["Gaurd", "Lex", "Ahnya", "Karmedus", "Leozo", "Midori"]

# from a dictionary of installed models, get model names from the list
# models = ollama.list() 
# installed_models = [model['name'] for model in models['models']]

# models that are confirmed installed
# model_names_confirmed = []

# for each model installed, check if names match --> add to confirmed models
# for name in model_names_to_check:
#     if name in installed_models:
#         model_names_confirmed.append(name)
#         print(f"The model '{name}' exists locally.")
#     else:
#         print(f"The model '{name}' does not exist locally.")
        # Optional: pull the model if it's missing
            # print(f"Attempting to pull the model '{model_name_to_check}'...")
            # ollama.pull(model_name_to_check)





# get system design
def getSystem(name:str):
    try:
        system = f"app_sections/{name}/system/{name}_system"
        with open(system, 'r') as file:
            content = file.read()
            return(content+"\n")
    except FileNotFoundError:
        print(f"Error: The file '{system}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# get instruction design
def getInstructions(name:str):
    try:
        instructions = f"app_sections/{name}/system/{name}_system"
        with open(instructions, 'r') as file:
            content = file.read()
            return(content+"\n")
    except FileNotFoundError:
        print(f"Error: The file '{instructions}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")




