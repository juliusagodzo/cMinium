import Condominio from "../../../models/Condominio";
import { dbConnect, runMiddleware } from "../../../utils/index";
import Morgan from "morgan";

dbConnect();

export default async (req, res) => {
  const { method, body } = req;
  const morgan = Morgan("dev");

  switch (method) {
    case "GET":
      try {
        const condomini = await Condominio.find();
        await runMiddleware(req, res, morgan);
        return res.status(200).json(condomini);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "POST":
      try {
        const newCondominio = new Condominio(body);
        const savedCondominio = await newCondominio.save();
        await runMiddleware(req, res, morgan);
        return res.status(200).json(savedCondominio);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    default:
      return res.status(400).json({ msg: "This method is not supported" });
  }
};
