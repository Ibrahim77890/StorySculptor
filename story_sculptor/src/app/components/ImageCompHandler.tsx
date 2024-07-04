import React, { memo } from 'react'
import GPTImages from './GPTImages';


interface CompHandlerProps {
    payload: {
        type: string;
        prompt: string | {prompt: string, schemaAttr: string} | {script: string, imageUrl: string}[]
    }
}

const ImageCompHandler: React.FC<CompHandlerProps> = memo(({ payload }) => {
    const COMPONENT_MAP: { [key: string]: React.ComponentType<any> } = {
        GPTImages
    };

    const Component = COMPONENT_MAP[payload.type]
    if(Array.isArray(payload.prompt)) return <GPTImages imageUrls={payload.prompt}/>
});

ImageCompHandler.displayName = 'CompHandler'

export default ImageCompHandler

