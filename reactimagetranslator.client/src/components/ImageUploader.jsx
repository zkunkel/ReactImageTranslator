import axios from 'axios';

export default function ImageUploader({ selectedImages, setImageUrls, setPythonOutput }) {

    const onFileUpload = async () => {
        if (selectedImages) {
            const formData = new FormData();
            selectedImages.forEach((image) => formData.append('files', image));

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

    return (
        <div>
            {selectedImages && selectedImages.length > 0 && (
                <button style={{ marginBottom: '10px' }} onClick={onFileUpload}> Translate selected images </button>
            )}
        </div>
    );
}
