import { Box, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { fetchRandomImage } from "./helpers/unsplash";
import ErrorBox from "./ui/components/ErrorBox";
import ImageUploadBox from "./ui/components/ImageUpload";
import Loading from "./ui/components/Loading";
import StoryContent from "./ui/components/StoryContent";

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [storyText, setStoryText] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const [cenario, setCenario] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [waitingMessage, setWaitingMessage] = useState("Carregando imagem!");
  const [isLoading, setIsLoading] = useState(false);

  const handleLocalFile = async (localImageUrl: string) => {
    setErrorMessage("");
    console.log("Carregando imagem!");
    setIsLoading(true);
    setImageUrl(localImageUrl);
    processImage2Story(localImageUrl);
  };

  const handleRandomImage = async () => {
    setErrorMessage("");
    console.log("Carregando imagem!");
    setIsLoading(true);
    const randomImageUrl = await fetchRandomImage();
    setImageUrl(randomImageUrl);
    processImage2Story(randomImageUrl);
  };

  const convert2Text = async (imageURL: string) => {
    const response = await axios.get("http://localhost:4000/convert_image", {
      params: {
        imageUrl: imageURL,
      },
    });
    //return response.data.title;
    return response.data;
  };

  const createStory = async (text: any) => {
    const response = await axios.get("http://localhost:4000/create_story", {
      params: {
        text: text,
      },
    });
    return response.data;
  };

  const processImage2Story = async (localImageUrl: string) => {
    console.log("Carregando cenário!");
    setWaitingMessage("Criando cenário!");
    let res_cenario = null;
    let res_story = null;

    try {
      res_cenario = await convert2Text(localImageUrl);
      console.log("Res", res_cenario);
      setCenario(res_cenario.title);
      console.log("Carregando história!");
      setWaitingMessage("Criando história!");

      try {
        res_story = await createStory(res_cenario.title_english);
        console.log("story", res_story);
        setStoryText(res_story);
        setWaitingMessage("Criando áudio!");
        console.log("Carregando áudio!");
      } catch (error: any) {
        console.error("Error creating the story:", error);
        setErrorMessage(
          "Desculpe! Ocorreu um erro ao criar a história. Estatos do erro: " +
            error.request.status
        );
      }

      /*try {
        const audio_path = await convert2Speech(res_story.story_english);
        setAudioFile(audio_path);
      } catch (error: any) {
        console.error("Error converting text to speech:", error);
        setErrorMessage(
          "Desculpe! Ocorreu um erro ao converter para áudio. Estatos do erro: " +
            error.request.status
        );
      }*/
    } catch (error: any) {
      console.error("Error converting image to text:", error);
      setErrorMessage(
        "Desculpe! Ocorreu um erro ao criar o cenário da história. Estatos do erro: " +
          error.request.status
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box m={"60px auto"} maxWidth={"600px"}>
      <Heading as="h1" size="xl" mb={4}>
        Criando sua história!!
      </Heading>
      <Text fontSize="xs" mb={4}>
        Escolha uma imagem...
      </Text>

      <ImageUploadBox
        onFileSelect={handleLocalFile}
        onClickRandom={handleRandomImage}
      />

      {isLoading && <Loading message={waitingMessage} />}
      {imageUrl && !isLoading && (
        <StoryContent imageUrl={imageUrl} cenario={cenario} story={storyText} />
      )}
      {errorMessage && <ErrorBox message={errorMessage} />}
    </Box>
  );
}

export default App;
