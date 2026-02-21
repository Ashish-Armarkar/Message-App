import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 },
      );
    }

    const existingVerifiedUserByEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingVerifiedUserByEmail) {
      if (existingVerifiedUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "Email is already registered" },
          { status: 400 },
        );
      } else {
        const hasedPassword = await bcrypt.hash(password, 10);
        existingVerifiedUserByEmail.password = hasedPassword;
        existingVerifiedUserByEmail.verifyCode = verifyCode;
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        existingVerifiedUserByEmail.verifyCodeExpiry = expiryDate;
        await existingVerifiedUserByEmail.save();
      }
    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }

    //Send verification Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return Response.json(
      { success: false, message: "Database connection error" },
      { status: 500 },
    );
  }
}
