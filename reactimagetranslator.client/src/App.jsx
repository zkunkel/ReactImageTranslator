import React, { useState } from 'react';

import './App.css';

import ImageSelector from './components/ImageSelector'
import ImageUploader from './components/ImageUploader'
import ImageDownloader from './components/ImageDownloader'
import ImageUploadPreviews from './components/ImageUploadPreviews'
import ImageDownloadPreviews from './components/ImageDownloadPreviews'
import PythonConsole from './components/PythonConsole'
import OCRSettings from './components/settings/OCRSettings'
import TranslationSettings from './components/settings/TranslationSettings'

function App() {

    const [selectedImages, setSelectedImages] = useState([]);   // image file info selected by user
    const [previews, setPreviews] = useState([]);               // previews from selected local image blobs
    const [imageUrls, setImageUrls] = useState([]);             // translated image urls on server
    const [pythonOutput, setPythonOutput] = useState('');       // holds the python log
    
    return (
        <div className="container">
            <div className="header"><h1 style={{ margin: '10px' }} id="tableLabel">React Image Translator</h1></div>

            <div className="main">
                {/*button to select images*/}
                <ImageSelector setSelectedImages={setSelectedImages} setPreviews={setPreviews} />

                {/*displays previews from selected image blobs*/}
                <ImageUploadPreviews selectedImages={selectedImages} previews={previews} />
            </div>

            <div className="settings">
                <OCRSettings />

                <TranslationSettings />

                {/*uploads and translates images on server*/}
                <ImageUploader selectedImages={selectedImages} setImageUrls={setImageUrls} setPythonOutput={setPythonOutput} />
            </div>

            <div className="console">
                {/*sets up signalr and recieves/displays live python logging in a textbox*/}
                <PythonConsole pythonOutput={pythonOutput} setPythonOutput={setPythonOutput} />
            </div>

            <div className="output">
                {/*displays translated images based on urls of translated files on server*/}
                <ImageDownloadPreviews imageUrls={imageUrls} />

                {/*button to download all of the translated image as a zip*/}
                <ImageDownloader imageUrls={imageUrls} />
            </div>

        </div>

    );

}

export default App;

