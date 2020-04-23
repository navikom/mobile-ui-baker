const canvas = {
  toBlob: jest.fn((cb) => {
    cb(null);
  }),
  toDataURL: jest.fn(() => '')
};
const html2canvas = jest.fn(() => Promise.resolve(canvas));

module.exports = html2canvas;
