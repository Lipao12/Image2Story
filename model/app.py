from dotenv import find_dotenv, load_dotenv
from transformers import pipeline
import os
import requests
import json


load_dotenv(find_dotenv())
HUGGINFACE_API_TOKEN = os.getenv("HUGGINFACE_API_TOKEN")

def img2txt(url):
    image_to_text = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")

    text = image_to_text(url)[0]['generated_text']
    return text

def createStory(input): # use llama to do this
    API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1"
    headers = {"Authorization": f"Bearer {HUGGINFACE_API_TOKEN}"}
    payloads = {
        "inputs": input,
    }
    response = requests.post(API_URL, headers=headers, json=payloads)
    if response.status_code == 200:
        data = json.loads(response.content)
        generated_text = data[0]['generated_text']
        return generated_text
    else:
        print(f"Request failed with status code: {response.status_code}")
        return None

def text2speech(message):
    API_URL = "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits"
    headers = {"Authorization": f"Bearer {HUGGINFACE_API_TOKEN}"}
    payloads = {
        "inputs": message
    }
    response = requests.post(API_URL, headers=headers, json=payloads)
    if response.status_code == 200:
        with open('audio.mp3', 'wb') as file: #.flac
            file.write(response.content)
        return 'audio.mp3'
    else:
        raise Exception(f"Failed to convert text to speech. Status code: {response.status_code}")
    #with open('audio.mp3', 'wb') as file: #.flac
    #    file.write(response.content)
    
if __name__ == '__main__':
    print(img2txt("photo.jpg"))
    #description = img2txt("https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/dingo-charissa-allan.jpg")
    #print(description)
    #print(createStory("a lighthouse on the coast with a cloudy sky"))