import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

   res.cookie("token", token, {
    httpOnly: true,
    secure: false,        // true only if using HTTPS (production)
    sameSite: "lax",      // IMPORTANT for localhost
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
