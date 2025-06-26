import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import * as signalR from '@microsoft/signalr';
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

    
    //const [pythonOutput, setPythonOutput] = useState('');
    //useEffect(() => {
    //    const connection = new signalR.HubConnectionBuilder()
    //        .withUrl('https://localhost:44307/outputHub')
    //        .build();

    //    connection.on('ReceiveOutput', (line) => {
    //        setOutput(prev => prev + line + '\n');
    //    });

    //    connection.start();

    //    return () => connection.stop();
    //}, []);


    //const handleClick = () => {
    //    alert('Button clicked!');
    //};


    return (
        <div>
            <h1 id="tableLabel">React Translator</h1>

            
            <div className="input-group">
                <input type="file" accept="image/*" multiple onChange={onFileChange} />
            </div>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB, {file.type})
                        {previews[index] && file.type.startsWith("image/") && (
                            <div><img src={previews[index]} alt={file.name} width="100" /></div>
                        )}
                        {previews[index] && file.type.startsWith("text/") && (
                            <pre>{previews[index]}</pre>
                        )}
                    </li>
                ))}
            </ul>

            {files && (
                <button
                    onClick={onFileUpload}
                    className="submit"
                >Translate selected images</button>
            )}

            {/*<div>*/}
            {/*    <textarea value={pythonOutput} readOnly rows={20} cols={80} />;*/}
            {/*</div>*/}


            
            <div>
                <h2>Translated Images</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
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
                        <div>No images translated yet</div>
                    )}
                </div>
            </div>


            
            {imageUrls.length > 0 && (
                <button onClick={downloadImages} disabled={downloading}>
                    {downloading ? 'Creating ZIP...' : 'Download translated images as ZIP'}
                </button>
            )}


        </div>



    );

}

export default App;

