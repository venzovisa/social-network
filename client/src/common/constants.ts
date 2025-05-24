export const API = "http://localhost:5000";

export const REACTION_WEIGHT = {
  1: 20,
  2: 15,
  3: 10,
  4: 5,
  5: 1,
  6: -10,
  7: -20,
};

export const SANITIZER_SETTINGS = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "em",
    "p",
    "br",
    "iframe",
    "blockquote",
    "ul",
    "ol",
    "li",
    "code",
  ],
  allowedAttributes: {
    "*": ["data-*", "alt"],
    iframe: ["width", "height", "src", "title", "allow", "allowfullscreen"],
    p: ["class"],
    code: ["class"],
  },
  allowedSchemes: ["http", "https", "data"],
  allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
  allowedIframeDomains: ["youtube.com", "zoom.us"],
};

export const YOUTUBE_EMBED = "https://www.youtube.com/embed/";
export const YOUTUBE_REGEX = new RegExp(
  /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\\_]*)(&(amp;)?‌​[\w\\?‌​=]*)?/
);

export enum POLITICAL_ORIENTATION {
  "neutral",
  "socialist",
  "democrat",
  "nationalist",
}
