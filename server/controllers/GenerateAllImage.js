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
      "https://router.huggingface.co/fal-ai/fal-ai/qwen-image",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          prompt: prompt,
          sync_mode: true
        }),
        // model: "black-forest-labs/FLUX.1-dev"
      }
    );

     if (response.status === 402) {
      return res.status(402).json({
        success: false,
        message:
          "You have exceeded your monthly included credits. Please upgrade to PRO or try again later.",
      });
    }

    // console.log(response.url);

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Hugging Face API returned an error: ${response.statusText} => ${errorText}`);
    }

    // Convert the response to a blob and then to an ArrayBuffer
    // console.log(response.text)
    // const blob = await response.blob();
    // console.log(blob);

    // const buffer = await blob.arrayBuffer();
    // console.log(buffer);


    // Convert the ArrayBuffer to a Base64 string
    // const base64Image = Buffer.from(buffer).toString("base64");
    // console.log(base64Image);

    // Send the Base64 image string as a JSON response
    // res.status(200).json({ photo: base64Image });

    // const result = await response.blob();
    // const data = await response.json();
    // console.log(data);
    
    // console.log(response);
    
    // console.log(result);

     const data = await response.json();
    const imageUrl = data?.images?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL found in API response.");
    }

     const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(
        `Failed to fetch generated image: ${imageResponse.status} ${imageResponse.statusText}`
      );
    }

      const buffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // Send Base64 string
    res.status(200).json({ photo: base64Image });
    
  } catch (error) {
    // Handle errors using the createError function and pass it to the next middleware
    console.log("error : ", error);

    next(error);
  }
};
