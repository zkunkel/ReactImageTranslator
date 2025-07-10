import React, { useEffect, useState, useRef } from 'react';
import { HubConnectionBuilder, HttpTransportType, LogLevel, HubConnectionState } from '@microsoft/signalr';
//import * as signalR from '@microsoft/signalr';

export default function PythonConsole({ pythonOutput, setPythonOutput }) {

    useEffect(() => {

        const newConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl('https://localhost:44307/recvPython', {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        newConnection.on('recvPython', (message) => {
            setPythonOutput(prev => prev + message + '\n');
        });

        try {
            newConnection.start()
                .then(() => console.log("signalr connected"))
                .catch(err => console.error('Error starting signalR connection: ', err));
        } catch { }

        //return () => {
        //    newConnection.stop()
        //        .then(() => console.log('SignalR Disconnected'))
        //        .catch((err) => console.error('Error while stopping connection: ', err));
        //};
    }, []);


    // auto scroll for python log
    const pythonTextArea = useRef(null);
    useEffect(() => {
        if (pythonTextArea.current) {
            pythonTextArea.current.scrollTop = pythonTextArea.current.scrollHeight;
        }
    }, [pythonOutput]);


    return (
        <div>
            {pythonOutput.length > 0 &&
                <textarea ref={pythonTextArea} value={pythonOutput} style={{ padding: '10px' }} readOnly rows={20} cols={80} />
            }
        </div>
    );
}
