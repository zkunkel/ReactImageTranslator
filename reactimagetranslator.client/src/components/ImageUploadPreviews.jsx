
export default function ImageUploadPreviews({ selectedImages, previews }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px' }}>
            {selectedImages
                && selectedImages.length > 0 ? (
                selectedImages.map((file, index) => (
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
    );
}