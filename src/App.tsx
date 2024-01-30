import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineCloudUpload } from "react-icons/ai";
import { fetchRandomImage } from './helpers/unsplash';


function App() {
  const [imageUrl, setImageUrl] = useState('');

  const handleRandomImage = async () => {
    const imageUrl = await fetchRandomImage();
    setImageUrl(imageUrl);
  };

  return (
    <Box 
      m={"60px auto"} 
      maxWidth={"600px"} 
      >
      <Heading as="h1" size="xl" mb={4}>Criando sua história!!</Heading>
      <Text fontSize='xs' mb={4}>Escolha uma imagem...</Text>

      <Box
        p={"20px 10px"}
        display="flex" 
        alignItems="center" 
        justifyContent="space-between"
        bg="#f5f5f5"
        borderRadius="8px">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AiOutlineCloudUpload size={"50px"} />
          <Box
            ml="20px" 
            flexDirection={"column"}
          >
            <Text fontSize="lg" fontWeight="bold" color="#333">Escolha uma imagem local</Text>
            <Text fontSize="sm" color="#666">Limite 100MB por arquivo. JPG, JPEG</Text>
          </Box>
        </div>
        <Button 
          colorScheme="blue"
          variant="solid"
          size="md"
          boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
          _hover={{ bg: "#1da1f2" }}
          onClick={handleRandomImage}
        >
          Aleatória
        </Button>
      </Box>

      {imageUrl && (
        <Box mt={4}>
          <img src={imageUrl} alt="Imagem aleatória" style={{ maxWidth: '100%' }} />
          <Accordion mt={4} allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex='1' textAlign='left'>
                    Cenário
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Accordion mt={4} allowMultiple>
            <AccordionItem>
              <h1>
                <AccordionButton>
                  <Box as="span" flex='1' textAlign='left'>
                    História
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h1>
              <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      )}
    </Box>
  );
}

export default App;
