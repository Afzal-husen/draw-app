import express from "express";
import router from "./routes";
import { errorHandler } from "./middlewares/express-error-handler";

const app = express();
app.use(express.json());
app.use("/api/v1", router);
app.use(errorHandler);

app.listen(3001, () => "http server running at port 3000");
