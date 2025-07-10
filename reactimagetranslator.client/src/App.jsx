import React, { useState } from 'react';

import './App.css';

import ImageSelector from './components/ImageSelector'
import ImageUploader from './components/ImageUploader'
import ImageDownloader from './components/ImageDownloader'
import ImageUploadPreviews from './components/ImageUploadPreviews'
import ImageDownloadPreviews from './components/ImageDownloadPreviews'
import PythonConsole from './components/PythonConsole'

function App() {

    const [selectedImages, setSelectedImages] = useState([]);   // image file info selected by user
    const [previews, setPreviews] = useState([]);               // previews from selected local image blobs
    const [imageUrls, setImageUrls] = useState([]);             // translated image urls on server
    const [pythonOutput, setPythonOutput] = useState('');       // holds the python log
    
    return (
        <div>
            <h1 style={{ margin: '10px' }} id="tableLabel">React Image Translator</h1>

            {/*button to select images*/}
            <ImageSelector setSelectedImages = { setSelectedImages } setPreviews = { setPreviews } />

            {/*displays previews from selected image blobs*/}
            <ImageUploadPreviews selectedImages={selectedImages} previews={previews} />

            {/*uploads and translates images on server*/}
            <ImageUploader selectedImages={selectedImages} setImageUrls={setImageUrls} setPythonOutput={setPythonOutput} />

            {/*sets up signalr and recieves/displays live python logging in a textbox*/}
            <PythonConsole pythonOutput={pythonOutput} setPythonOutput={setPythonOutput} />

            {/*displays translated images based on urls of translated files on server*/}
            <ImageDownloadPreviews imageUrls={imageUrls} />

            {/*button to download all of the translated image as a zip*/}
            <ImageDownloader imageUrls={imageUrls} />
        </div>

    );

}

export default App;

