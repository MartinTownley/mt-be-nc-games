exports.handle404NonExistentPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle500ServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};