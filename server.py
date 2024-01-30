from model.app import img2txt
from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app, resources={r"/convert_image": {"origins": "http://localhost:5173"}})

translator = Translator()

@app.route('/convert_image', methods=['GET'])
def convert_image():
    imageUrl = request.args.get('imageUrl')
    if not imageUrl:
        return jsonify({'error': 'Missing imageUrl parameter'}), 400

    try:
        text = img2txt(imageUrl)
        translated_text = translator.translate(text, dest='pt').text
        print(translated_text)
        return jsonify({'title': translated_text}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
