from dotenv import find_dotenv, load_dotenv
from transformers import pipeline
import os
import requests
import json


load_dotenv(find_dotenv())
HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

def img2txt(url):
    image_to_text = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")

    text = image_to_text(url)[0]['generated_text']
    return text

def createStory(input_text): # use llama to do this
    #API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1"
    #API_URL = "https://api-inference.huggingface.co/models/gpt2"
    #API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf"
    try:
        system_input = '''Imagine you've come across an intriguing piece of text in an old diary. 
        The text reads: 'Once upon a time, in a distant city, there was an old clock that...'. 
        Create a story based on this snippet, exploring who might have written it, the significance of the clock in the city, and how it impacted the lives of the people around.'''
        system_input = "you are a skilled storyteller, tasked with weaving a tale inspired by this theme."
        system_input = "You are a skilled storyteller. You must continue a story from a given passage."
        API_URL = "https://api-inference.huggingface.co/models/openai-community/gpt2"
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"}
        payloads = {
            "system":system_input,
            "inputs": input_text,
        }
        response = requests.post(API_URL, headers=headers, json=payloads)

        
        if response.status_code != 200:
            return f"Erro na API: {response.text}", 500
        
        data = response.json()
        print(response.json())
        
        if isinstance(data, list) and len(data) > 0:
            return data[0].get('generated_text', '')
        
        return ""
    
    except Exception as exception:
        return{
            "body":{"error":"Bad Request", "message":str(exception)},
            "status_code":400
        }

def text2speech(message):
    try:
            
        API_URL = "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits"
        #API_URL = "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h"
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"}
        payloads = {
            "inputs": message
        }
        response = requests.post(API_URL, headers=headers, json=payloads)
        if response.status_code == 200:
            with open('audio.mp3', 'wb') as file:
                file.write(response.content)
            return 'audio.mp3'
    except Exception as exception:
        return{
            "body":{"error":"Failed to convert text to speech", "message":str(exception)},
            "status_code":400
        }
    #    raise Exception(f"Failed to convert text to speech. Status code: {response.status_code}")
    #with open('audio.mp3', 'wb') as file: #.flac
    #    file.write(response.content)
    
if __name__ == '__main__':
    #description = img2txt("https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/dingo-charissa-allan.jpg")
    #print(description)
    print(createStory("a lake surrounded by mountains and clouds, it's re…s what's really great about our project.'\n\nA full"))