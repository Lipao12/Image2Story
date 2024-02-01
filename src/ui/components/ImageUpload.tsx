import { Box, Button, Text } from "@chakra-ui/react";
import { AiOutlineCloudUpload } from "react-icons/ai";

const ImageUploadBox = (props) => {
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      let imageUrl = URL.createObjectURL(selectedFile);
      props.onFileSelect(imageUrl);
    }
  };

  return (
    <form>
      <label htmlFor="file-input">
        <Box
          p={"20px 10px"}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg="#f5f5f5"
          borderRadius="8px"
          style={{ cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <AiOutlineCloudUpload size={"50px"} />
            <Box ml="20px" flexDirection={"column"}>
              <Text fontSize="lg" fontWeight="bold" color="#333">
                Escolha uma imagem local
              </Text>
              <Text fontSize="sm" color="#666">
                Limite 100MB por arquivo. JPG, JPEG
              </Text>
            </Box>
          </div>
          <Button
            colorScheme="blue"
            variant="solid"
            size="md"
            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
            _hover={{ bg: "#1da1f2" }}
            onClick={props.onClickRandom}
          >
            Aleatória
          </Button>
        </Box>
      </label>
      <input
        id="file-input"
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
    </form>
  );
};

export default ImageUploadBox;
