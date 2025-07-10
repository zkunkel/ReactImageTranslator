
export default function ImageDownloadPreviews({ imageUrls }) {
    return (
        <div>
            {imageUrls && imageUrls.length > 0 && <h2 style={{ margin: '1px' }} >Translated Images:</h2>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px' }}>
                {imageUrls && imageUrls.length > 0 ? (
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
    );
}