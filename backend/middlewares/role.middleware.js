export const authorize = (allowedrole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({ message: "No user Exits" });
    }

    if (allowedrole != req.user.role) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
