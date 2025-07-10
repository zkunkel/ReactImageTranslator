
export default function ImageSelector({ setSelectedImages, setPreviews }) {

    const onFileChange = (event) => {
        const selectedImages = Array.from(event.target.files);
        setSelectedImages(selectedImages);

        // generate previews for images or text
        const previewData = selectedImages.map(file => {
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

    return (
        <div className="input-group">
            <input type="file" accept="image/*" style={{ padding: '10px' }} multiple onChange={onFileChange} />
        </div>
    );

    
}

