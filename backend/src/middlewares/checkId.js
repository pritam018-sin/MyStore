import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
  const id = req.params.id || req.params.categoryId || req.params._id;
  if (!id || !isValidObjectId(id)) {
    res.status(404);
    throw new Error(`Invalid Object ID: ${id}`);
  }
  next();
}

export default checkId;