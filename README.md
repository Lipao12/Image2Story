# Image to Story

Este projeto possui um frontend simples que, inicialmente, é assim:

- Imagem 1:
    
    ![Início da página](https://drive.google.com/uc?export=view&id=1ljMF6ozXK-0UJ5yqO5B4qJu5m2wscKKz)
    

Ao clicar no botão “Aleatório”, o site faz uma requisição à API [https://api.unsplash.com](https://api.unsplash.com/) utilizando o seguinte endpoint `/photos/random?query=landscape&client_id=` para obter uma imagem aleatória.

Como estou utilizando os modelos de Machine Learning, nesse caso Large Lenguage Model, eu preferi utilizar a linguagem Python. Para integrar o meu frontend com o backend, criei uma API em Python utilizando a biblioteca `Flask`.

Ao ser selecionada a imagem, serão realizadas as seguintes etapas:

1. **Chamada ao endpoint `/convert_image` (Método GET):**
    
    Aqui será chamada a função `img2text` que utilizará `pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")`. Inicialmente, o modelo não está treinado.
    
    Este modelo, por algum motivo, apenas aceita URLs de imagens como entrada.
    
    O modelo retornará o texto em inglês, então utilizei o método `Translator` da biblioteca `googletrans` para traduzir o cenário gerado para o português.
    
    O endpoint retornará: `return jsonify({'title': translated_text, 'title_english': text}), 200`.
    
    **OBS:** O modelo tem quase 1 GB de tamanho.
    
2. **Chamada ao endpoint `/create_story` (Método GET):**
    
    Aqui a função `text2story` será chamada. Nela, estou utilizando o modelo `gpt2` para criar a história a partir do cenário retirado da imagem em `/convert_image`.
    
    A história será em inglês, então utilizei o método `Translator` da biblioteca `googletrans` para traduzir a história gerada para o português.
    
    O endpoint retornará: `return jsonify({'story': story_translated, 'story_english': story}), 200`.
    
    **Obs:** Estou utilizando a *API inference*, já que é uma aplicação de demonstração, além de que eu não tenho muito espaço para utilizar o modelo completo. Utilizei a seguinte URL da API: `API_URL = "https://api-inference.huggingface.co/models/gpt2"`. Ao utilizar isso, eu poderia fazer pelo *JavaScript*, mas como eu criei uma API para o primeiro modelo em Python, preferi continuar assim.
    
3. **Chamada ao endpoint `/convert_speech` (Método GET):**
    
    Aqui estou utilizando, novamente, a *API inference*. A URL do modelo é: `API_URL = "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits"`. Basicamente, chamarei a função `text2speech` e passarei a história criada em inglês.
    
    Esta função criará um áudio e retornará o caminho desse áudio.
    
    O endpoint retornará este caminho.
    

Com a imagem selecionada e tudo funcionando corretamente, temos isto:

- Imagem 2:    
    ![Resultado com Imagem Selecionada](https://drive.google.com/uc?export=view&id=1HMgalSy6hSIf7mVT81feYvAB_Vw733IY)
    ![Resultado com História Gerada](https://drive.google.com/uc?export=view&id=1c2vajYYmsxUWpb3X9Axh4V8LjnwqDAcq)
    

Para realizar o upload local da imagem e utilizá-la nos modelos, eu tive que hospedar essa imagem. Para isso, criei o endpoint `/upload` e para ter acesso à imagem `/uploads/<filename>`. Para realizar o upload, toda vez que este endpoint for chamado, eu apago a pasta chamada `uploads` e depois a recrio, assim, eu não fico ocupando muito espaço com as imagens selecionadas localmente.
