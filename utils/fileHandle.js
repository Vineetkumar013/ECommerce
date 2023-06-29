const multipleFileHandle = async (files, req) => {
  let images = [];
  console.log(files)

  for (let i = 0; i < files.length; i++) {
    images.push(files[i].filename);
  }
  const imageURL = ``;
  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    imagesLinks.push({
      public_id: images[i],
      url: `${imageURL}/${images[i]}`,
    });
  }
  console.log(imagesLinks)
  return imagesLinks;
};

const singleFileHandle = async (file) => {
  const imageLink = {
   
    url: `${process.env.IMAGE_BASE_URL}/${file.filename}`,

}
  console.log('imageLink',imageLink)

  return imageLink;
};

module.exports = {
  multipleFileHandle,
  singleFileHandle,
};
