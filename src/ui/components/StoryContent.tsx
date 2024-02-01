// ImageContent.js

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";

const StoryContent = (props) => {
  return (
    <Box mt={4}>
      <img
        src={props.imageUrl}
        alt="Imagem escolhida"
        style={{ maxWidth: "100%" }}
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
          <AccordionPanel pb={4}>{props.story}</AccordionPanel>
        </AccordionItem>
      </Accordion>

      <audio controls style={{ width: "100%" }}>
        <source src={props.audioFile} type="audio/mpeg" />
        Não há suporte
      </audio>
      <Text fontSize="xs" mt={4}>
        Obs.: por hora o áudio será do texto em inglês, mas já estamos
        trabalhando para corrigir isso :)
      </Text>
    </Box>
  );
};

export default StoryContent;
