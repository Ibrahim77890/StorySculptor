import React, { memo } from 'react'
import Query from './Query'
import GPT from './GPT'


interface CompHandlerProps {
    payload: {
        type: string;
        prompt: string | {prompt: string, schemaAttr: string} | {script: string, imageUrl: string}[]
    }
}

const CompHandler: React.FC<CompHandlerProps> = memo(({ payload }) => {
    const COMPONENT_MAP: { [key: string]: React.ComponentType<any> } = {
        Query,
        GPT,
    };

    const Component = COMPONENT_MAP[payload.type]
    if(Array.isArray(payload.prompt)) return ""
    return (
        Component ? (
            typeof payload.prompt === "string" ? (
                <Component content={payload.prompt} />
            ) : (
                <Component content={payload.prompt.prompt}/>
            )
        ) : null
    )
});

CompHandler.displayName = 'CompHandler'

export default CompHandler

