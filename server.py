from model.app import img2txt, text2speech, createStory
from flask import Flask, request, jsonify, send_from_directory
import os
import logging
from flask_cors import CORS
from googletrans import Translator
from werkzeug.utils import secure_filename

# Configurações básicas
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Simplificado CORS
translator = Translator()

# Configurações de upload
UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper functions
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def clear_upload_folder():
    try:
        for file in os.listdir(UPLOAD_FOLDER):
            file_path = os.path.join(UPLOAD_FOLDER, file)
            if os.path.isfile(file_path):
                os.unlink(file_path)
        logger.info("Pasta de uploads limpa com sucesso")
    except Exception as e:
        logger.error(f"Erro ao limpar pasta de uploads: {str(e)}")

# Rotas
@app.route('/convert_image', methods=['GET'])
def convert_image():
    image_url = request.args.get('imageUrl')
    if not image_url:
        return jsonify({'error': 'Parâmetro imageUrl ausente'}), 400

    try:
        # Processamento de imagem
        extracted_text = img2txt(image_url)
        if not extracted_text:
            return jsonify({'error': 'Não foi possível extrair texto da imagem'}), 400

        # Tradução
        translated = translator.translate(extracted_text, dest='pt')
        return jsonify({
            'title': translated.text,
            'title_english': extracted_text
        }), 200

    except Exception as e:
        logger.error(f"Erro em convert_image: {str(e)}")
        return jsonify({'error': 'Falha no processamento da imagem'}), 500

@app.route('/create_story', methods=['GET'])
def handle_create_story():
    text = request.args.get('text')
    if not text or len(text.strip()) < 3:
        return jsonify({'error': 'Texto inválido ou muito curto'}), 400

    try:
        story = createStory(text)
        print(story)
        if not story or not isinstance(story, str):
            return jsonify({'error': 'Falha na geração da história'}), 500

        # Tradução
        translated = translator.translate(story, dest='pt')
        return jsonify({
            'story': translated.text,
            'story_english': story
        }), 200

    except Exception as e:
        logger.error(f"Erro em create_story: {str(e)}")
        return jsonify({'error': 'Erro interno ao gerar história'}), 500

@app.route('/convert_speech', methods=['GET'])
def handle_convert_speech():
    text = request.args.get('text')
    if not text or len(text.strip()) < 3:
        return jsonify({'error': 'Texto inválido ou muito curto'}), 400

    try:
        audio_path = text2speech(text)
        if not audio_path or not os.path.exists(audio_path):
            return jsonify({'error': 'Falha ao gerar áudio'}), 500
            
        return send_from_directory(
            directory=os.path.dirname(audio_path),
            path=os.path.basename(audio_path),
            as_attachment=True
        )
    except Exception as e:
        logger.error(f"Erro em convert_speech: {str(e)}")
        return jsonify({'error': 'Erro na conversão para áudio'}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400

    clear_upload_folder()
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)
        return jsonify({
            'url': f'/uploads/{filename}',
            'filename': filename
        }), 200

    return jsonify({'error': 'Tipo de arquivo não permitido'}), 400

@app.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Inicialização
if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(host='0.0.0.0', port=4000, debug=False)