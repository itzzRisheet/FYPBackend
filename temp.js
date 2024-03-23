import axios from "axios";

const temp = async () => {
  const options = {
    method: "POST",
    url: "https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "b79cee61f7msh7d57bdb8220c1b0p1fcb13jsn8b60ff87af10",
      "X-RapidAPI-Host": "chatgpt-gpt4-ai-chatbot.p.rapidapi.com",
    },
    data: {
      query:
        "generate an image of a cat climbing mount everest with the help of a stick",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

temp();
