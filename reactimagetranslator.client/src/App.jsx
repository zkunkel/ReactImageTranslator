import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import './App.css';

function App() {

    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    //const [imageUrls, setImageUrls] = useState([]);

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
            console.log('Uploading file...');

            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));
            
            try {
                //const result = await fetch('https://localhost:44307/api/filehandler/UploadFiles', {
                //    method: 'POST',
                //    body: formData,
                //});
                //const res = await axios.get("https://localhost:44307/api/python/version");
                

                const result = await axios.post("https://localhost:44307/api/filehandler/UploadFiles", formData)
                const data = await result.data;

                const res = await fetch("https://localhost:44307/api/python/translate");

                console.log(data);


                // display translated images
                //const response = await fetch('https://localhost:44307/api/python/getimages');
                //if (!response.ok) {
                //    throw new Error(`HTTP error! status: ${response.status}`);
                //}
                //const tlimdata = await response.json();
                //setImageUrls(tlimdata);


            } catch (error) {
                console.error(error);
            }
        }
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
                <input type="file" multiple onChange={onFileChange} />
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


            {/*<div>*/}
            {/*    <h1>My Image Gallery</h1>*/}
            {/*    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>*/}
            {/*        {imageUrls.length > 0 ? (*/}
            {/*            imageUrls.map((url, index) => (*/}
            {/*                <img*/}
            {/*                    key={index}*/}
            {/*                    src={url}*/}
            {/*                    alt={`Gallery Image ${index}`}*/}
            {/*                    style={{ width: '200px', height: '150px', objectFit: 'cover' }}*/}
            {/*                />*/}
            {/*            ))*/}
            {/*        ) : (*/}
            {/*            <div>No images found.</div>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</div>*/}


        </div>








    );


    async function populateWeatherData() {
        const response = await fetch('weatherforecast');
        if (response.ok) {
            const data = await response.json();
            setForecasts(data);
        }
    }
}

export default App;

