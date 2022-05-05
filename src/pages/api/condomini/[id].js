import Condominio from "../../../models/Condominio";
import { dbConnect, runMiddleware } from "../../../utils/index";
import Morgan from "morgan";

dbConnect();

export default async (req, res) => {
  const {
    method,
    body,
    query: { id },
  } = req;
  const morgan = Morgan("dev");

  switch (method) {
    case "GET":
      try {
        const condominio = await Condominio.findById(id);
        if (!condominio) return res.status(404).json({ msg: "Questo condominio non esiste" });
        await runMiddleware(req, res, morgan);
        return res.status(200).json(condominio);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "DELETE":
      try {
        const deletedCondominio = await Condominio.findByIdAndDelete(id);
        if (!deletedCondominio)
          return res.status(404).json({ msg: "Questo condominio non esiste" });
        await runMiddleware(req, res, morgan);
        return res.status(204).json();
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updatedCondominio = await Condominio.findByIdAndUpdate(id, body, {
          new: true,
          runValidators: true,
        });

        if (!updatedCondominio)
          return res.status(404).json({ msg: "Questo condominio non esiste" });
        return res.status(200).json(updatedCondominio);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    default:
      return res.status(400).json({ msg: "Questo metodo non è supportato" });
  }
};
