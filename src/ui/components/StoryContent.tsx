import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import { DostAnim } from "./dots-animation/dots-animation";

interface StoryContentProps {
  imageUrl: string;
  cenario: string;
  audioFile?: string;
  story: { story: string; story_english: string };
}

const StoryContent = (props: StoryContentProps) => {
  const [story, setStory] = useState({ story: "", story_english: "" });
  //const [stringToCreate, setStringToCreate] = useState("");
  //const [audioPath, setAudioPath] = useState("");
  const [isLoadingText, setIsLoadingText] = useState(false);
  //const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);

  useEffect(() => {
    setStory(props.story);
  }, [props.story]);

  const continueStory = async (text_english: any, text_portuguese: any) => {
    try {
      console.log("O que estou querendo enviar: ", text_english.stringToCreate);
      setIsLoadingText(true);
      const response = await axios.get("http://localhost:4000/create_story", {
        params: {
          text: text_english.stringToCreate,
        },
      });

      const new_story_portuguese = verifyText(
        response.data.story,
        text_portuguese
      );

      const new_story_english = verifyText(
        response.data.story_english,
        text_english
      );

      setStory((prevStory: any) => ({
        story: prevStory.story + " " + new_story_portuguese,
        story_english: prevStory.story_english + " " + new_story_english,
      }));
      //setStringToCreate("");
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setIsLoadingText(false);
    }
  };

  const verifyText = (text_response: string, substring_sent: any) => {
    return text_response.replace(substring_sent.stringToCreate.trim(), "");
  };

  const findStringAfterLastPeriod = (inputString: string) => {
    // Verificar se termina com algum dos "lastPeriod", caso sim, remova ele
    /*if (
      inputString.charAt(inputString.length - 1) === "." ||
      inputString.charAt(inputString.length - 1) === "!" ||
      inputString.charAt(inputString.length - 1) === "?"
    ) {
      inputString = inputString.slice(0, -1);
    }*/
    const lastPeriodIndex = Math.max(
      inputString.lastIndexOf("."),
      inputString.lastIndexOf("!"),
      inputString.lastIndexOf("?")
    );

    if (lastPeriodIndex === -1 || lastPeriodIndex === inputString.length - 1) {
      const words = inputString.split(" ");
      const lastTwoWords = words.slice(-2).join(" ");
      //setStringToCreate(lastTwoWords);
      return { stringToCreate: lastTwoWords, idxStart: lastPeriodIndex };
    }
    console.log(inputString.substring(lastPeriodIndex + 1));
    return {
      stringToCreate: inputString.substring(lastPeriodIndex + 1),
      idxStart: lastPeriodIndex,
    };
    //setStringToCreate(inputString.substring(lastPeriodIndex + 1));
  };

  const handleContinuar = () => {
    console.log("Continuar História");
    console.log("Props: ", story); //props.story);
    const lastPStringPT = findStringAfterLastPeriod(story.story);
    const lastPStringEN = findStringAfterLastPeriod(story.story_english);
    continueStory(lastPStringEN, lastPStringPT);
  };

  /*const convert2Speech = async () => {
    //setIsLoadingAudio(true);
    try {
      const response = await axios.get("http://localhost:4000/convert_speech", {
        params: {
          text: story.story_english,
        },
      });
      //setAudioPath(response.data.audio_file);
    } catch (err: any) {
      console.log(err);
    } finally {
      //setIsLoadingAudio(false);
    }
  };*/

  return (
    <Box mt={4}>
      {/* Imagem responsiva */}
      <Box
        position="relative"
        width="100%"
        borderRadius="5px"
        overflow="hidden"
        boxShadow="sm"
      >
        <img
          src={props.imageUrl}
          alt="Imagem escolhida"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </Box>

      {/* Acordeões responsivos */}
      <Box mt={4}>
        <Accordion allowMultiple>
          {/* Cenário */}
          <AccordionItem border="none" mb={4}>
            <AccordionButton
              bg="gray.100"
              borderRadius="md"
              _hover={{ bg: "gray.200" }}
              px={4}
              py={3}
            >
              <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
                Cenário
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <Text fontSize="md" whiteSpace="pre-wrap">
                {props.cenario}
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* História */}
          <AccordionItem border="none">
            <AccordionButton
              bg="gray.100"
              borderRadius="md"
              _hover={{ bg: "gray.200" }}
              px={4}
              py={3}
            >
              <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
                História
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <Box
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                boxShadow="sm"
                bg="white"
              >
                <Text mb={4} whiteSpace="pre-wrap" fontSize="md">
                  {props.story.story}
                </Text>
                {isLoadingText ? (
                  <DostAnim />
                ) : (
                  <Button
                    colorScheme="blue"
                    size="md"
                    width={{ base: "100%", md: "auto" }}
                    onClick={handleContinuar}
                    isLoading={isLoadingText}
                  >
                    Continuar História
                  </Button>
                )}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      {/* Seção de Áudio 
      <Box mt={6}>
        <Button
          onClick={convert2Speech}
          colorScheme="teal"
          size="md"
          width={{ base: "100%", md: "auto" }}
          isLoading={isLoadingAudio}
          loadingText="Gerando Áudio..."
        >
          Gerar Áudio da História
        </Button>

        {false && audioPath && !isLoadingAudio && (
          <Box mt={4}>
            <audio controls style={{ width: "100%" }} src={audioPath}>
              Seu navegador não suporta a reprodução de áudio.
            </audio>
            <Text fontSize="xs" mt={2} color="gray.500">
              Obs.: por enquanto, o áudio será em inglês :)
            </Text>
          </Box>
        )}
      </Box>*/}
    </Box>
  );
};

export default StoryContent;
