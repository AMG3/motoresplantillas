import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import { Products } from "./Products.js";
import { engine } from "express-handlebars";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 8080;
const products = new Products();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", "./src/views");
app.set("view engine", "hbs");

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

app.get("/", (req, res) => {
  res.render("pages/add-product", {});
});

app.get("/products-list", (req, res) => {
  const productList = products.getAll();
  res.render("pages/products-list", { productList });
});

app.post("/products", (req, res) => {
  const product = req.body;
  let newId = 0;
  const allProducts = products.getAll();

  if (allProducts.length > 0) {
    newId = allProducts[allProducts.length - 1].id + 1;
  }

  const newProduct = { id: newId, ...product };
  products.addProduct(newProduct);
  res.redirect("/products-list");
});

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando puerto ${PORT}`);
});

server.on("error", (err) => console.error(err));
