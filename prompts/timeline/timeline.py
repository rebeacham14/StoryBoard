import ollama

# Initialize Ollama client
client = ollama.Client()

# Define model and prompt
model = "mistral" # replace with desired model name
prompt = "Hi. Are you ready?" # replace with prompt

# Send the query to the model
response = client.generate(model=model, prompt=prompt)

print("Response from Ollama:\n")
print(response.response)
