import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { createNewUser, findUser, updateUser } from "../models/user/UserModel";
import { signAccessJWT, signRefreshJWT, verifyRefreshJWT } from "../util/jwt";
import {
  emailOtp,
  emailVerificationNotification,
  newCustomerAccountEmailVerificationEmail,
  passwordUpdateNotification,
} from "../util/nodemailer";
import {
  createNewSession,
  deleteSession,
} from "../models/session/SessionTokenModel";
import { hashPassword } from "../util/bcrypt";

//user login
//have to add login  validation
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //find user by email
    const user = await findUser({ email });
    if (user?._id) {
      const isPasswordMatch = await comparePassword(password, user.password);
      if (isPasswordMatch) {
        user.password = undefined;
        user.__v = undefined;
        res.json({
          status: "success",
          mesasge: "Login Success",
          user,
          tokens: {
            accessJWT: await signAccessJWT({ email }),
            refreshJWT: await signRefreshJWT({ email }),
          },
        });

        return;
      }
    }
    res.json({
      status: "error",
      message: "Invalid Login Details",
    });
  } catch (error) {
    next(error);
  }
});

// user registration
router.post("/register", async (req, res, next) => {
  try {
    req.body.password = hashPassword(req.body.password);

    req.body.emailVerificationCode = uuidv4();

    const result = await createNewUser(req.body);
    console.log(result);

    if (result?._id) {
      const uniqueLink = `${process.env.FRONTEND_ROOT_URL}/verify?c=${result.emailVerificationCode}&email=${result.email}`;
      newCustomerAccountEmailVerificationEmail(uniqueLink, result);

      res.json({
        status: "success",
        mesasge:
          "New user has been registered! We have sent you an email. Please check your email including junk folder and follow the steps given below",
      });

      return;
    }

    res.json({
      status: "error",
      message: "Error, unable to create a new user",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.mesasge = "There is already user exists with this email";
      error.errorCode = 200;
    }
    next(error);
  }
});

//user email verification
router.post("/verify", async (req, res, next) => {
  try {
    // chek if the combination of email and code exist in db, if so set the status active and code to "" in the db, also update is email verified to true
    const obj = {
      status: "active",
      isEmailVerified: true,
      emailVerificationCode: "",
    };

    const user = await updateUser(req.body, obj);

    if (user?._id) {
      //send email notification
      emailVerificationNotification(user);

      res.json({
        status: "success",
        message: "Your account has been verified. You may login now.",
      });
      return;
    }

    res.json({
      status: "error",
      mesasge: "The link is invalid or expired.",
    });
  } catch (error) {
    next(error);
  }
});

//OTP request
router.post("/request-otp", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        status: "error",
        message: "Invalid request",
      });
    }

    const user = await findUser({ email });

    if (user?._id) {
      //create OTP (6 digit code)
      const token = numString(6);
      const obj = {
        token,
        associate: email,
      };

      //store the otp and email in a new table callled sessions in database

      const result = await createNewSession(obj);

      if (result?._id) {
        //send otp to user's email
        emailOtp({ email, token });

        return res.json({
          status: "success",
          message:
            "We have sent you an OTP to your email, check your email and fill up the form below.",
        });
      }
    }

    res.json({
      status: "error",
      message: "Wrong email",
    });
  } catch (error) {
    next(error);
  }
});

//request link for reset password
router.patch("/reset-password", async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    const deletedToken = await deleteSession({ email, otp });

    if (deletedToken?._id) {
      //emcrypt password and update password
      const user = await updateUser(
        { email },
        { password: hashPassword(password) }
      );

      if (user?._id) {
        //send email notification
        passwordUpdateNotification(user);

        return res.json({
          status: "success",
          message: "Your password has been updated successfully",
        });
      }
    }

    res.json({
      status: "error",
      message:
        "We are unable to update your password at this time. Invalid or expired token.",
    });
  } catch (error) {
    next(error);
  }
});

//return user information
router.get("/user-profile", (req, res, next) => {
  try {
    const user = req.userInfo;
    user.password = undefined;

    res.json({
      status: "success",
      message: "user found",
      user,
    });
  } catch (error) {
    next(error);
  }
});

//return new accessJWT
router.get("new-accessjwt", async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(req.headers, "hey");

    const { email } = verifyRefreshJWT(authorization);

    if (email) {
      const user = await findUser({ email });

      if (user?.refreshJWT === authorization) {
        //create accessJWT and return

        const accessJWT = await signAccessJWT({
          email,
        });

        if (accessJWT) {
          return res.json({
            status: "success",
            accessJWT,
          });
        }
      }
    }

    res.status(401).json({
      status: "error",
      message: "Unauthenticated",
    });
  } catch (error) {
    next(error);
  }
});
