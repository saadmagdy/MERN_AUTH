const asyncHandeler = (api) => {
  return (req, res, next) => {
    api(req, res, next).catch((error) => {
      next(error);
    });
  };
};
export default asyncHandeler;
