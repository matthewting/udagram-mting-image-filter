import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  // Root URI call
  // app.get("/", (req: Request, res: Response) => {
  //   res.status(200).send("Welcome to the image filter processor!");
  // });

  app.get("/filteredimage/",
    async (req, res) => {
      const imageUrl = req.query.image_url;

    // Check url existence
    if (!imageUrl) {
      return res.status(400)
        .send({error:`image_url is required`});
    }

    // http://localhost:8082/filteredimage?image_url=https://sites.psu.edu/lifeitmoveson/files/2017/10/orange-1hoca2l.jpg
    // Validate url
    if (!isUrl(imageUrl)) {
      return res.status(400)
        .send('image_url is invalid');
    }

    try {
      const filteringImage = await filterImageFromURL(imageUrl)
      res.sendFile(filteringImage, () => {
        deleteLocalFiles([filteringImage])
      });
    } catch (e) {
      return res.status(422).send({error:'image processing failed!'})      
    }
  });

  const isUrl = (imageUrl: string) => {
    try {
      new URL(imageUrl)
      return true
    } catch (e) {
      return false
    }
  }


  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();