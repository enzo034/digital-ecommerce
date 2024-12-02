import express, { Request, Response, Router } from 'express';
import cors from 'cors'
import fileUpload from 'express-fileupload';
import path from 'path'

interface Options {
  port: number;
  routes: Router;
  public_path: string;
}


export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path } = options;
   
    this.publicPath = public_path;
    this.port = port;
    this.routes = routes;
  }



  async start() {


    //* Middlewares
    this.app.use(express.json({
      verify: (req: Request & { rawBody?: string }, res: Response, buf: Buffer) => { // Se debe extender rawBody ya que no existe la propiedad como tal
        req.rawBody = buf.toString();
      }
    })) // from raw
    this.app.use(express.urlencoded({ extended: true })); // from x-www-form-urlencoded
    this.app.use(cors());
    this.app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    }));

    //* Public Folder
    this.app.use(express.static(this.publicPath));

    //* Router
    this.app.use(this.routes);

    //* SPA
    this.app.get('*', (req, res) => {

      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);

  });

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });

  }

  public close() {
    this.serverListener?.close();
  }

}
