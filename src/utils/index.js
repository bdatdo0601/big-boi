export const gcd = (a, b) => {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
};

export const getImageMeta = async url =>
  new Promise((res, rej) => {
    const img = new Image();
    img.src = url;
    img.onload = function() {
      const divisor = gcd(this.width, this.height);
      res({
        width: this.width,
        height: this.height,
        aspectWidth: this.width / divisor,
        aspectHeight: this.height / divisor,
      });
    };
    img.onerror = () => {
      rej("Unable to get image meta data");
    };
  });

export default {
  getImageMeta,
};
