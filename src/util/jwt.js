import jwt from "jsonwebtoken";
import { updateUser } from "../models/user/UserModel.js";
import { createNewSession } from "../models/session/SessionTokenModel.js";

export const signAccessJWT = async (payload) => {
  //create jwt
  const accessJWT = jwt.sign(payload, process.env.JWT_ACCESS, {
    expiresIn: "15m",
  });

  //store the key
  const obj = {
    associate: payload.email,
    token: accessJWT,
  };

  await createNewSession(obj);

  return accessJWT;
};

//verify jwt
export const verifyAccessJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS);
    return decoded;
  } catch (error) {
    return error.message.includes("jwt expired")
      ? "jwt expired"
      : error.message;
  }
};

//refresh jwt
export const signRefreshJWT = async (payload) => {
  const refreshJWT = jwt.sign(payload, process.env.JWT_REFRESH, {
    expiresIn: "30d",
  });

  //store the key
  await updateUser(
    { email: payload.email },
    {
      refreshJWT,
    }
  );

  return refreshJWT;
};

//verify jwt
export const verifyRefreshJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH);

    return decoded;
  } catch (error) {
    return "logout";
  }
};
