import jwt from "jsonwebtoken";

export const genToken =  (user, res) => {
  try {
    const payload = {
      id: user._id,
      role: user.role || "admin",
    };

    const token =  jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }); //for hours 1h ,  for secs. 60

    console.log(token);

    res.cookie("health", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  } catch (error) {
    throw error;
  }
};