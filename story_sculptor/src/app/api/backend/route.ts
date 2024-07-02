import { NextApiRequest, NextApiResponse } from "next"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import OpenAI from "openai";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { log } from "console";
import { JsonObject } from "langchain/tools";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseApiKey = process.env.SUPABASE_API_KEY!;
const openai = new OpenAI()

if (!supabaseUrl || !supabaseApiKey) {
    throw new Error('SUPABASE_URL and SUPABASE_API_KEY must be defined in the environment variables.');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseApiKey);


interface payloadProps {
    type: string;
    prompt: string;
}


const sendPayload = async (content: payloadProps): Promise<void> => {
    await supabase.from("chats_history").insert([{ payload: content }]).then(data => console.log(data))
}
interface moviePayload {
    option: string;
    choice: string | { name: string, description: string }[] | { scene: string, description: string }[];
}

/*
Explanation
id: A unique identifier for each movie entry.
title: The title of the movie.
genre: The genre of the movie (e.g., Action, Comedy, Drama).
setting_time_period: The time period in which the movie is set (e.g., Medieval, Modern, Future).
setting_location: The location where the movie takes place (e.g., City, Village, Space).
main_characters: A JSONB field to store an array of main characters, each with a brief description (e.g., appearance, personality, role).
plot_summary: A brief overview of the movie's storyline.
key_scenes: A JSONB field to store an array of key scenes, each with a detailed description (e.g., Opening Scene, Climax, Resolution).
theme: The underlying theme or message of the movie (e.g., Good vs. Evil, Love conquers all).
tone: The overall tone of the movie (e.g., Dark, Light-hearted, Serious, Whimsical).
special_elements: Any specific elements or props that are crucial to the storyline (e.g., a magical artifact, a futuristic device).
*/

//This function should try to fill all the details of the last stated row in table and fill all of its attributes so at a time I wont allow user to tell about any other movie
const sendMoviePayload = async (content: moviePayload): Promise<void> => {
    try {
        const lastRow = await supabase.from("movies").select("*").order("created_at", { ascending: false }).limit(1);
        if (lastRow.error) {
            console.error("Error fetching last row:", lastRow.error.message);
            return;
        }

        const { data: existingRow } = lastRow;
        if (!existingRow || existingRow.length === 0) {
            console.error("No existing rows found in 'movies' table.");
            const { data, error } = await supabase.from("movies").insert([{
                [content.option]: content.choice
            }]);
            return;
        }

        const lastId = existingRow[0].id;
        const updatePayload = { [content.option]: content.choice };

        const { data, error } = await supabase
            .from("movies")
            .update(updatePayload)
            .match({ id: lastId });

        if (error) {
            console.error("Error updating last row:", error.message);
        } else {
            console.log("Data updated successfully:", data);
        }
    } catch (error) {
        console.error("Error inserting data:", error);
    }
};

interface rephraser {
    content: string | { name: string, description: string }[] | { scene: string, description: string }[];
}

async function rephraserInput(inputString: string): Promise<string> {
    const gptAnswer = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: 'system',
            content: `Extract the details of a movie from the following string. The details should include the title, genre, setting time period, setting location, main characters with descriptions, plot summary, key scenes with descriptions suitable for generating illustrations, theme, tone, and special elements. If any detail is not found, assume a random value. Additionally, generate a 4-point script of the movie from the provided description and include it in the JSON object. Format the extracted details as a JSON object. 

                String:
                "[inputString]"

            Format:
            {
                "title": "[TITLE]",
                "genre": "[GENRE]",
                "setting_time_period": "[SETTING_TIME_PERIOD]",
                "setting_location": "[SETTING_LOCATION]",
                "main_characters": [
                    {
                        "name": "[CHARACTER_NAME]",
                        "description": "[CHARACTER_DESCRIPTION]"
                    },...
                ],
                "plot_summary": "[PLOT_SUMMARY]",
                "key_scenes": [
                    {
                        "scene": "[SCENE_NAME]",
                        "description": "[SCENE_DESCRIPTION]"
                    },...
                ],
                "theme": "[THEME]",
                "tone": "[TONE]",
                "special_elements": "[SPECIAL_ELEMENTS]"
            }`
        }]
    });

    if(gptAnswer.choices.length > 0 && gptAnswer.choices[0].message?.content){
        return "Database enteries done";
    }else{
        throw new Error('No response from OpenAI API');
    }
}



//This function will generate the script for the images to be generated by DALL.e_2 and this will only have four liners script due to limitation
const scriptGenerator = async (query: string) => {
    //I want to generate a string having all the attributes wise details of a particular movie proposed by user
    //Initially ask the user all the details of movie particularly those specified in the database
    await rephraserInput(query)


    const lastQueried = await supabase.from("chat_history").select('*').order("created_at", { ascending: false }).eq('payload.type', 'GPT');
    //This function should ask the user about all the details and return control to user prompt until he specifically entered all the details for that movie
    //Here i also have to determine what is the last prompt i asked from user so under its value i hae to sendMoviePayload
    let lastAsked = "";
    let requiredResponse = "";
    sendMoviePayload({ option: lastAsked, choice: requiredResponse })

    //if(database for this movie serial is not fulfilled all of its fields then not progress further)
    //Then give this response to gpt-3.5-turbo to generate points based script for the movie and then store it in the chat_history table under name script
    //Then provide that script to dalle model to get images from it, at most will be four images at most for a particular movie
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { statement } = req.body;
        await sendPayload({ type: 'Query', prompt: statement })
        scriptGenerator(statement)
    }
}

export default handler