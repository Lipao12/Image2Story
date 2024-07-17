const createStory = async (text) => {
    const response = await axios.get("http://localhost:4000/create_story", {
      params: {
        text: text,
      },
    });
    return response.data;
  };

export { createStory };

