import * as dotenv from "dotenv";
// import { createError } from "../error.js";

dotenv.config();

// Controller to generate an image using Hugging Face FLUX
export const generateImage = async (req, res, next) => {
  try {
    // Extract the prompt from the request body
    const { prompt } = req.body;
    // console.log(prompt);
    

    // Call the Hugging Face API with the provided prompt
    const response = await fetch(
      "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    // console.log(response.url);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Hugging Face API returned an error: ${response.statusText}`);
    }

    // Convert the response to a blob and then to an ArrayBuffer
    const blob = await response.blob();
    // console.log(blob);
    
    const buffer = await blob.arrayBuffer();
    // console.log(buffer);
    

    // Convert the ArrayBuffer to a Base64 string
    const base64Image = Buffer.from(buffer).toString("base64");
    // console.log(base64Image);
    
    // Send the Base64 image string as a JSON response
    res.status(200).json({ photo: base64Image });
  } catch (error) {
    // Handle errors using the createError function and pass it to the next middleware
    next();
  }
};
