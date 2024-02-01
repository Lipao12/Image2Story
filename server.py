from model.app import img2txt, text2speech, createStory
from flask import Flask, request, jsonify, send_from_directory
import os
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app, resources={
    r"/convert_image": {"origins": "http://localhost:5173"},
    r"/convert_speech": {"origins": "http://localhost:5173"},
    r"/create_story": {"origins": "http://localhost:5173"},
    r"/upload": {"origins": "http://localhost:5173"},
})

translator = Translator()

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/convert_image', methods=['GET'])
def convert_image():
    imageUrl = request.args.get('imageUrl')
    if not imageUrl:
        return jsonify({'error': 'Missing imageUrl parameter'}), 400

    try:
        text = img2txt(imageUrl)
        translated_text = translator.translate(text, dest='pt').text
        return jsonify({'title': translated_text, 'title_english':text}), 200
    except Exception as e:
        return jsonify({'error': f'Pegar URL: {str(e)}'}), 500

@app.route('/create_story', methods=['GET'])
def create_story():
    text = request.args.get('text')
    if not text:
        return jsonify({'error': 'Missing text parameter'}), 400
    try:
        story = createStory(text)
        print(story)
        story_translated = translator.translate(story, dest='pt').text
        return jsonify({'story': story_translated, 'story_english':story}), 200
        #return jsonify({'story': story}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/convert_speech', methods=['GET'])
def convert_speech():
    text = request.args.get('text')
    if not text:
        return jsonify({'error': 'Missing text parameter'}), 400
    try:
        audio_file = text2speech(text)
        return jsonify({'audio_file': audio_file}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def clear_upload_folder():
    for file in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(e)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    clear_upload_folder()

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        filename = file.filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'url': f'/uploads/{filename}'})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
