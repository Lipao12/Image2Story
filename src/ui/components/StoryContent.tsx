import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import { DostAnim } from "./dots-animation/dots-animation";

interface StoryContentProps {
  imageUrl: string;
  cenario: string;
  audioFile: string;
  story: { story: string; story_english: string };
}

const StoryContent = (props: StoryContentProps) => {
  const [story, setStory] = useState({ story: "", story_english: "" });
  //const [stringToCreate, setStringToCreate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStory(props.story);
  }, [props.story]);

  const continueStory = async (text_english: any, text_portuguese: any) => {
    try {
      console.log("O que estou querendo enviar: ", text_english.stringToCreate);
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const verifyText = (text_response: string, substring_sent: any) => {
    return text_response.replace(substring_sent.stringToCreate, "");
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

  return (
    <Box mt={4}>
      <img
        src={props.imageUrl}
        alt="Imagem escolhida"
        style={{ maxWidth: "100%", borderRadius: "5px" }}
      />
      <Accordion mt={4} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Cenário
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>{props.cenario}</AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Accordion mt={4} marginBottom={4} allowMultiple>
        <AccordionItem>
          <h1>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                História
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h1>
          <AccordionPanel pb={4}>
            <Box
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="md"
              bg="gray.50"
            >
              <Text marginBottom={4} whiteSpace="pre-wrap">
                {story.story}
              </Text>
              {isLoading ? (
                <DostAnim />
              ) : (
                <Text
                  as="em"
                  display="inline-block"
                  padding="8px 16px"
                  borderRadius="8px"
                  backgroundColor="blue.500"
                  color="white"
                  fontWeight="bold"
                  _hover={{
                    cursor: "pointer",
                    backgroundColor: "blue.600",
                  }}
                  onClick={handleContinuar}
                >
                  Continuar
                </Text>
              )}
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <audio controls style={{ width: "100%" }} src={props.audioFile}>
        Seu navegador não suporta a reprodução de áudio.
      </audio>
      <Text fontSize="xs" mt={4}>
        Obs.: por hora o áudio será do texto em inglês, mas já estamos
        trabalhando para corrigir isso :)
      </Text>
    </Box>
  );
};

export default StoryContent;
