import jwt from "jsonwebtoken";
import { ENVVARS } from "../uitls/envVars";
import { Response } from "express";

export const generateToken = (
  userId: string
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign({ userId }, ENVVARS.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, ENVVARS.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  const isProd = ENVVARS.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: isProd,
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: isProd,
  });
};
