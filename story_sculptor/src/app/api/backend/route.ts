import { NextApiRequest, NextApiResponse } from "next"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import OpenAI from "openai";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseApiKey = process.env.SUPABASE_API_KEY!;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const apiKey = process.env.CUSTOM_API_KEY;

if (!supabaseUrl || !supabaseApiKey || !apiKey) {
    throw new Error('SUPABASE_URL and SUPABASE_API_KEY must be defined in the environment variables.');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseApiKey);

interface scriptInterface {
    point: number;
    description: string;
}

interface imgInterface {
    imageG: string;
    imageUrls: string[];
}

async function imageGen(script: scriptInterface[]): Promise<string | imgInterface> {
    try {
        const numberOfImages = 1;
        const imageSize = '1024x1024'
        let response: string[] = [];

        // for (const imageGen of script) {
        //     response.push(await openai.images.generate({
        //         prompt: imageGen.description,
        //         n: numberOfImages,
        //         size: imageSize,
        //     }).then(data => data.data[0].url || ""))
        // }
        for (const imageGen of script) {
        response.push(
            await fetch('https://9xlud5ryka.execute-api.ap-south-1.amazonaws.com/default/imagine',
                {
                    method: 'POST',
                    body: JSON.stringify({prompt: imageGen?.description}) ,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${apiKey}`
                    }
                 }).then(response => response?.json()).then(res=>{
                    if(res.image_base64){
                        const req:string = res.image_base64.replace(/\"/g, '');
                        const data:string = "data:image/png;base64,"+req
                        return data
                    }else return "Base 64 image not found"
                 }))
                }

        if (response.length > 0) {
            return { imageG: "Successful generation of image Urls", imageUrls: response };
        } else {
            return "No images obtained"
        }
    } catch (err) {
        console.error("Error in the image generation function", err)
        return "Error in image generation"
    }
}

interface payloadProps {
    type: string;
    prompt: string | { prompt: string, schemaAttr: string } | string[];
}

const sendPayload = async (content: payloadProps): Promise<void> => {
    await supabase.from("chat_history").insert([{ payload: content }]).then(data => console.log(data))
}

export const POST = async (req: NextRequest) => {
    try {
        const { message } = await req.json();

        await sendPayload({ type: 'Query', prompt: message });

        const response: boolean = await scriptGen(message)
        if (response) {
            return NextResponse.json({ status: 200 });
        } else {
            return NextResponse.json("Some Function error", { status: 404 })
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

export async function sendMoviesDetailsPayload(type: string | { type: string, id: any }, payload: any): Promise<number | boolean> {
    try {
        if (type === 'movie_payload') {
            const response: any = await supabase.from('movies_details').insert([{ movie_payload: payload }]).select('id');
            if (response.error) {
                console.error("Error in inserting data:", response.error);
                return false;
            }
            if (response.data && response.data.length > 0) {
                const responseId = response.data[0].id;
                return responseId;
            } else {
                console.error("No data returned from the insert operation.");
                return false;
            }
        } else if (typeof type !== 'string' && type.type === 'movie_image_urls') {
            await supabase.from('movies_details').update({ movie_image_urls: payload }).eq('id', type.id);
            await sendPayload({ type: 'GPTImages', prompt: payload.imageUrls })
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error in sending payload to movies_details:", error);
        return false;
    }
}

export async function scriptGen(message: string): Promise<boolean> {
    try {
        //Pass this message to generate the movie_story and script array
        const response = await promptGen(message)
        if (typeof response === 'string') {
            console.log("Wrong Response: ", response)
            return false;
        } else {
            console.log("Correct response: ", response)

            await sendPayload({ type: 'GPT', prompt: response?.movie_story })

            //Send Movie data to this function to populate data in movies_details table
            const rowId: any = await sendMoviesDetailsPayload('movie_payload', response)

            if (typeof rowId === 'number') {
                const secondaryResponse = await imageGen(response?.script)
                if (typeof secondaryResponse !== 'string') {
                    const responseType = await sendMoviesDetailsPayload({ type: 'movie_image_urls', id: rowId }, secondaryResponse)
                    return responseType ? (true) : (console.log("Error in movie image urls sending"), false);
                }
                return (console.log("Error in image generation"), false);
            } else return (console.log("Error in movie payload sending"), false);
        }
    } catch (error) {
        console.error("Error in scriptGen function", error)
        return false;
    }
}

export async function promptGen(message: string): Promise<any> {
    try {
        const gptPrompt = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'system',
                content: `You are an assistant that helps users create short movie stories based on their input. The user shall provides details such as title, genre, setting time period, setting location, main characters with descriptions, theme, tone, plot summary, key scenes with descriptions suitable for generating digital illustrations, and special elements in form of string and you have to parse those details from it, but not necessaily all the details will be provided. If the user does not provide certain details, you should randomly generate them to the best of scenario. For movie_story, strictly use the details provided by the user.
                            Once the movie_story is generated, create a 4-liner script from that movie_story where each point includes a detailed prompt suitable for DALL-E 2 image generation. Each prompt should be standalone and detailed enough for generating specific scenes.
                            For the response, return a JSON object with two properties:
                            - movie_story: string (the complete short movie story based upon findings of details from the user input string)
                            - script: array of objects, each object having:
                            - point: number (the sequence number of the scene)
                            - description: string (the detailed prompt for image generation)

                            Your response should never be string and only JSON object, even if you want to ask something, place it in the JSON object as a separate key-value pair.
                            Here is an example of the expected JSON output:
                            {
                            "movie_story": "Once upon a time in a distant galaxy, there was a brave explorer named Zara...",
                            "script": [
                                { "point": 1, "description": "A vast galaxy with colorful nebulae and distant stars, highlighting a sleek spaceship zooming through space." },
                                { "point": 2, "description": "The interior of a futuristic spaceship, with Zara, a courageous explorer, looking at a holographic map." },
                                { "point": 3, "description": "An alien planet with towering crystal structures and exotic vegetation, with Zara stepping out of her spaceship." },
                                { "point": 4, "description": "A climactic battle scene between Zara and a menacing alien creature in a crystal cave, with beams of light and dramatic shadows." }
                            ]
                            }

                            User's input: ${message}`
            }]
        });

        if (gptPrompt.choices.length > 0 && gptPrompt.choices[0].message?.content) {
            console.log(gptPrompt.choices[0].message)
            const response: any = await JSON.parse(gptPrompt.choices[0].message?.content)
            console.log("JSON Response: ", response)
            return response
        } else {
            console.error('No response from OpenAI API');
            return "";
        }
    } catch (err) {
        console.error("Error in promptGen function: ", err);
        return "";
    }
}