import { Box, Text } from "@chakra-ui/react";

const ErrorBox = ({ message }) => {
  return (
    <Box
      mt={8}
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      backgroundColor="red.100"
    >
      <Text color="red.500" fontWeight="bold">
        Opa! Aconteceu um erro:
      </Text>
      <Text mt={2}>{message}</Text>
    </Box>
  );
};

export default ErrorBox;
