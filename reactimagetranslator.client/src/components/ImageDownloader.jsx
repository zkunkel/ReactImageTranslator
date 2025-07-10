import React, { useState } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';

function ImageDownloader({ imageUrls }) {

    const [downloading, setDownloading] = useState(false);

    const downloadImages = async () => {
        setDownloading(true);
        const zip = new JSZip();
        const folderToDownload = zip.folder("translatedImages"); // create a folder inside the zip

        // use Promise.all to fetch all image data concurrently
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
        await Promise.all(fetchPromises);

        // generate the zip file
        zip.generateAsync({ type: 'blob' })
            .then((content) => {
                saveAs(content, 'translatedImages.zip');
            })
            .catch((error) => {
                console.error("Error generating zip:", error);
            });
        setDownloading(false);
    };

    return (
        <div>
            {imageUrls && imageUrls.length > 0 && (
                <button onClick={downloadImages} disabled={downloading}>
                    {downloading ? 'Creating ZIP...' : 'Download translated images as ZIP'}
                </button>
            )}
        </div>
    );
}

export default ImageDownloader;