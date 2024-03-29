const IMAGE_KEY = "image";

export const transformImages = imageArray => {
  if (Array.isArray(imageArray)) {
    return imageArray.reduce((images, image, index) => {
      images[`${IMAGE_KEY}${index + 1}`] =
        images[`${IMAGE_KEY}${index + 1}`] || image
          ? image.url
            ? image.url[0].childImageSharp
            : image.childImageSharp
          : null;

      return images;
    }, {});
  }
  return {};
};

export const isIframe = () => {
  return typeof window !== `undefined` && window.parent && window.parent !== window;
};
