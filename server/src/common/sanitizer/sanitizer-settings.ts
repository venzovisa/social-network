import * as sanitize from 'sanitize-html';

export const sanitizerSettings: sanitize.IOptions = {
  allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'p', 'br', 'iframe', 'blockquote', 'ul', 'ol', 'li', 'code'],
  allowedAttributes: {
    '*': ['data-*', 'alt'],
    'iframe': ['width', 'height', 'src', 'title', 'allow', 'allowfullscreen'],
    'p': ['class'],
    'code': ['class'],
  },
  allowedSchemes: ['http', 'https', 'data'],
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
  allowedIframeDomains: ['youtube.com', 'zoom.us'],
};
