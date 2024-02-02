Esse projeto temos um frontend simples que de início é assim:

- Imagem 1
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/17c4e6cd-34f2-4c59-aa45-b14448f6dde8/5b59d044-76b6-466d-8c8f-3388bcc942f1/Untitled.png)
    

Ao clicar no botão “Aleatório”, o site faz um request a API [`https://api.unsplash.com`](https://api.unsplash.com/) utilizando o seguinte endpoint `/photos/random?query=landscape&client_id=` para ter uma imagem aleatória.

Como estou utilizando os modelos de ML, nesse caso LLM, eu preferi utilizar a linguagem python. Então, para integrar o meu frontend com o backend eu tive que criar uma API em python utilizando a biblioteca `flask`.

Ao ser selecionado a imagem será feito as seguintes etapas:

- 1. Será chamado o endpoin `/convert_image` que é o método `GET`
    
    Aqui o será chamada a função `img2text` que irá utilizar `pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")`. De primeiro, o modelo não está treinado. 
    
    Esse modelo, por algum motivo, apenas aceita URL da imagem como entrada.
    
    O modelo retornará em inglês, então utilizei o método `Translator` da biblioteca `googletrans` para traduzir o cenário gerado para o português. 
    
    O endpoit retornará `return jsonify({'title': translated_text, 'title_english':text}), 200`.
    
    OBS.: tem quase 1Gb de tamanho.
    
- 2. Será chamado o endpoint `/create_story` que é o método `GET`
    
    Aqui a função `text2speech` será chamada. Nela, estou utilizando o modelo `gpt2` para criar a história a partir do cenário retirado da imagem em `\convert_image`. 
    
    A história será em inglês, então utilizei o método `Translator` da biblioteca `googletrans` para traduzir a história gerada para o português. 
    
    O endpoit retornará `return jsonify({'story': story_translated, 'story_english':story}), 200`
    
    Obs.: estou utilizando a *API interference*, já que é uma aplicação de demonstração, além de que eu não tenho muito espaço para utilizar o modelo completo. Utilizei a seguinte url da API `API_URL = "https://api-inference.huggingface.co/models/gpt2"`. Ao utilizar isso, eu poderia fazer pelo *JavaScript*, mas como eu criei uma API para o primeiro modelo em python, preferi continuar assim.
    
- 3. Será chamado o endpoint `/convert_speech` que é o método `GET`
    
    Aqui estou utilizando, novamente, pela *API interference.* `API_URL = "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits"` é o url do modelo. Basicamente, irei chamar a função `text2speech` e irei passar a história criada em inglês. 
    
    Essa função criará um áudio e retornará o caminho desse áudio.
    
    O endpoint irá retornar esse caminho.
    

Com a imagem selecionada e tudo funcionando corretamente temos isso daqui:

- Imagem 2
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/17c4e6cd-34f2-4c59-aa45-b14448f6dde8/4e196fdc-6e31-4388-8bf8-ceb12673b008/Untitled.png)
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/17c4e6cd-34f2-4c59-aa45-b14448f6dde8/abb95d34-1b29-4a28-8868-2dbd87edef47/Untitled.png)
    

Para realizar o upload local da imagem e utilizar essa imagem nos modelos eu tive que hostear essa imagem. Para isso eu criei o endpoint `/upload` e para ter acesso a imagem `/uploads/<filename>`. Para realizar o upload, toda vez que esse endpoit for chamado, eu apago a pasta chamada `uploads` e depois eu crio ela de novo, assim, eu não fico ocupando muito espaço com as imagens selecionadas localmente.

- Código desses 2 endpoits

   
