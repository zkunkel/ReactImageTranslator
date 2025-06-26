import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import saveAs from 'file-saver'; 
import { HubConnectionBuilder, HttpTransportType, LogLevel, HubConnectionState } from '@microsoft/signalr';
//import * as signalR from '@microsoft/signalr';
import './App.css';

function App() {

    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [downloading, setDownloading] = useState(false);

    const onFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);

        // generate previews for images or text
        const previewData = selectedFiles.map(file => {
            if (file.type.startsWith("image/")) {
                return URL.createObjectURL(file);
            } else if (file.type.startsWith("text/")) {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsText(file);
                });
            } else {
                return Promise.resolve(null);
            }
        });

        Promise.all(previewData).then(setPreviews);
    };

    const onFileUpload = async () => {
        if (files) {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));
            
            try {
                //const result = await fetch('https://localhost:44307/api/filehandler/UploadFiles', {
                //    method: 'POST',
                //    body: formData,
                //});
                setPythonOutput("") //reset console text

                const result = await axios.post("https://localhost:44307/api/filehandler/UploadFiles", formData)
                const data = await result.data;

                const res = await fetch("https://localhost:44307/api/python/translate");

                console.log(data);

                // display translated images
                //const response = await axios.get('https://localhost:44307/api/python/getimages') does this randomly fail sometimes????
                const response = await fetch('https://localhost:44307/api/python/getimages');
                if (!response.ok)
                    throw new Error(`Error status: ${response.status}`);

                const translatedImageUrls = await response.json();
                setImageUrls(translatedImageUrls);
                

            } catch (error) {
                console.error(error);
            }
        }
    };

    const downloadImages = async () => {
        setDownloading(true);
        const zip = new JSZip();
        const folderToDownload = zip.folder("translatedImages"); // Create a folder inside the zip

        // Use Promise.all to fetch all image data concurrently
        const fetchPromises = imageUrls.map(async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
                }
                const blob = await response.blob();
                const fileName = url.substring(url.lastIndexOf('/') + 1);

                // Add the file to the zip folder
                folderToDownload.file(fileName, blob);
            } catch (error) {
                console.error(`Error processing ${url}:`, error);
            }
        });
        await Promise.all(fetchPromises); // Wait for all fetches to complete

        // Generate the zip file
        zip.generateAsync({ type: 'blob' })
            .then((content) => {
                saveAs(content, 'translatedImages.zip');
            })
            .catch((error) => {
                console.error("Error generating zip:", error);
            });
        setDownloading(false);
    };

    
    const [pythonOutput, setPythonOutput] = useState('');
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


    //const handleClick = () => {
    //    alert('Button clicked!');
    //};


    return (
        <div>
            <h1 style={{ margin: '10px' }} id="tableLabel">React Image Translator</h1>

            {/*file picker*/}
            <div className="input-group">
                <input type="file" accept="image/*" style={{ padding: '10px' }} multiple onChange={onFileChange} />
            </div>

            {/*displays uploaded images*/}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px' }}>
                {files.length > 0 ? (
                    files.map((file, index) => (
                        <img
                            key={index}
                            src={previews[index]}
                            alt={file.name}
                            style={{ width: '200px', height: '300px', objectFit: 'cover' }}
                        />
                    ))
                ) : (
                    <div></div>
                )}
            </div>

            {/*button to translate images*/}
            {files.length > 0 && (
                <button style={{ marginBottom: '10px' }} onClick={onFileUpload}> Translate selected images </button>
            )}

            {/*python logging textbox*/}
            <div>
                {pythonOutput.length > 0 &&
                    <textarea ref={pythonTextArea} value={pythonOutput} style={{ padding: '10px' }} readOnly rows={20} cols={80} />
                }
            </div>


            {/*displays translated images based on urls*/}
            <div>
                {imageUrls.length > 0 && <h2 style={{ margin: '1px' }} >Translated Images:</h2>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px' }}>
                    {imageUrls.length > 0 ? (
                        imageUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`image ${index}`}
                                style={{ width: '200px', height: '300px', objectFit: 'cover' }}
                            />
                        ))
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>


            {/*button to download all of the translated image as a zip*/}
            {imageUrls.length > 0 && (
                <button onClick={downloadImages} disabled={downloading}>
                    {downloading ? 'Creating ZIP...' : 'Download translated images as ZIP'}
                </button>
            )}


        </div>



    );

}

export default App;

