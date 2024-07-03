import React, { memo } from 'react'
import Query from './Query'
import GPT from './GPT'
import GPTImages from './GPTImages';


interface CompHandlerProps {
    payload: {
        type: string;
        prompt: string | {prompt: string, schemaAttr: string} | string[]
    }
}

const CompHandler: React.FC<CompHandlerProps> = memo(({ payload }) => {
    const COMPONENT_MAP: { [key: string]: React.ComponentType<any> } = {
        Query,
        GPT,
        GPTImages
    };

    console.log("PH2",payload)

    const Component = COMPONENT_MAP[payload.type]
    if(Array.isArray(payload.prompt)) return <GPTImages imageUrls={payload.prompt}/>
    return (
        Component ? (
            typeof payload.prompt === "string" ? (
                <Component content={payload.prompt} />
            ) : (
                !Array.isArray(payload.prompt) && <Component content={payload.prompt.prompt}/>
            )
        ) : null
    )
});

CompHandler.displayName = 'CompHandler'

export default CompHandler

