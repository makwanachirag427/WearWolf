import { Request, Response } from "express";
import { HandleError } from "../uitls/error";
import User from "../models/user.model";
import { generateToken, setCookies } from "../config/token";
import { type RequestType } from "../types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENVVARS } from "../uitls/envVars";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateToken(user._id.toString());

    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    HandleError(res, error, "signup controller");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(user._id.toString());
      setCookies(res, accessToken, refreshToken);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Email or password is incorrect" });
    }
  } catch (error) {
    HandleError(res, error, "login controller");
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    HandleError(res, error, "logout controller");
  }
};

export const getProfile = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    HandleError(res, error, "getProfile controller");
  }
};

export const refreshToken = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token provided" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      ENVVARS.REFRESH_TOKEN_SECRET
    ) as JwtPayload;

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      ENVVARS.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: ENVVARS.NODE_ENV !== "development",
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    HandleError(res, error, "refreshToken controller");
  }
};

export const PLACEHOLDER = async (
  req: RequestType,
  res: Response
): Promise<void> => {
  try {
  } catch (error) {
    HandleError(res, error, "PLACEHOLDER controller");
  }
};
