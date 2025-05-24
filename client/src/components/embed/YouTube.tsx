import sanitizeHtml from 'sanitize-html';
import { SANITIZER_SETTINGS } from '../../common/constants';

const YouTube = ({ url }: { url: string }) => {
    const cleanURL = sanitizeHtml(url, SANITIZER_SETTINGS);

    return (
        <iframe
            style={{
                marginTop: '1rem',
                borderRadius: '10px',
                aspectRatio: '16 / 9',
                width: '100%',
                height: 'auto'
            }}
            src={cleanURL}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen>
        </iframe>
    )
}

export default YouTube;