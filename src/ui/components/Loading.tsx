import { Box, Spinner, Text } from "@chakra-ui/react";

const Loading = (props) => {
  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
      mt={4}
    >
      <Text mb={4}>{props.message}</Text>
      <Spinner size="xl" color="blue.500" thickness="4px" />
    </Box>
  );
};

export default Loading;
