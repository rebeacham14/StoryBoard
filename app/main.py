from fastapi import FastAPI
import ollama

app = FastAPI()

@app.post("/generate")
def generate(prompt: str):
    response = ollama.chat(model="mistral", messages=[{"role": "user","content": prompt}])
    return {"response": response["message"]["content"]}








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
