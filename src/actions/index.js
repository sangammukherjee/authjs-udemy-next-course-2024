"use server";

import { signIn, signOut } from "@/auth";
import {
  NewPasswordSchema,
  ResetSchema,
  SignInSchema,
  SignUpSchema,
} from "@/config/schema";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/helpers";
import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { v4 as uuidv4 } from "uuid";

const generateVerificationToken = async (email) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await prisma.verificationToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const signUpAction = async (formValues) => {
  const validateFields = SignUpSchema.safeParse(formValues);

  if (!validateFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { name, email, password } = validateFields.data;
  const hashPassword = await bcrypt.hash(password, 10);

  //user is already in database or not
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return {
      error: "Email already in use. Please try witha different email",
    };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  const createVerificationToken = await generateVerificationToken(email);

  console.log(createVerificationToken, "createVerificationToken");

  await sendVerificationEmail(email, createVerificationToken.token);

  return {
    success: "Email verification sent! Please check your email",
  };
};

export const verifyEmailAction = async (token) => {
  const existingToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return {
      error: "Token does not exist",
    };
  }

  const isTokenExpired = new Date(existingToken.expires) < new Date();

  if (isTokenExpired) {
    return {
      error: "Token has expired",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return {
      error: "Email does not exist",
    };
  }

  const confirmEmailAccount = prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  const deleteToken =
    existingToken &&
    prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

  await prisma.$transaction([confirmEmailAccount, deleteToken]);

  return {
    success: "Email verified",
  };
};

export const signInAction = async (formValues) => {
  const validateFields = SignInSchema.safeParse(formValues);

  if (!validateFields.success) {
    return {
      error: "Invalid Fields",
    };
  }

  const { email, password } = validateFields.data;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser || !existingUser.email) {
    return {
      error: "Email does not exist",
    };
  }

  if (!(await bcrypt.compare(password, existingUser.password))) {
    return {
      error: "Invalid password",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: "Confimation email sent",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/users",
    });

    return {
      success: "Successfully logged in",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError" || "CredentialsSignin":
          return {
            error: "Invalid credentials",
          };

        default:
          return {
            error: "Something went wrong",
          };
      }
    }

    throw error;
  }
};

export const logoutAction = async () => {
  await signOut({
    redirectTo: "/login",
  });
};

export const resetPasswordAction = async (formValues) => {
  const validateFields = ResetSchema.safeParse(formValues);

  if (!validateFields.data) {
    return {
      error: "Invalid fields",
    };
  }

  const { email } = validateFields.data;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return {
      error: "Email not found",
    };
  }

  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return {
    success: "Reset email send! Please check your inbox",
  };
};

export const newPasswordAction = async (formValues, token) => {
  if (!token) {
    return {
      error: "Token is not found !",
    };
  }

  const validateFields = NewPasswordSchema.safeParse(formValues);

  if (!validateFields.success) {
    return {
      error: "Invalid fields !",
    };
  }

  const { password } = validateFields.data;

  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return {
      error: "Invalid token",
    };
  }

  const hasTokenExpired = new Date(existingToken.expires) < new Date();

  if (hasTokenExpired) {
    return {
      error: "Token is expired",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: existingToken.email,
    },
  });

  if (!existingUser) {
    return {
      error: "User email is not presend! Please try again",
    };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashPassword,
    },
  });

  //imp step
  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    success: "Your password is updated successfully!",
  };
};
