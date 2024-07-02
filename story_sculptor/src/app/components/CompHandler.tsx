import React, { memo } from 'react'
import Query from './Query'
import GPT from './GPT'

interface MessageHandler {
    message: {
        type: string;
        content: string | { title: string; };
    },
}

interface CompHandlerProps {
    payload: MessageHandler;
    sendPayload: (payloadToSend?: MessageHandler) => void;
}

const CompHandler: React.FC<CompHandlerProps> = memo(({ payload, sendPayload }) => {
    const COMPONENT_MAP: { [key: string]: React.ComponentType<any> } = {
        Query,
        GPT
    };

    const Component = COMPONENT_MAP[payload.message.type]
    return (
        Component ? <Component content={payload.message.content} sendPayload={sendPayload} /> : null
    )
});

CompHandler.displayName = 'CompHandler'

export default CompHandler

