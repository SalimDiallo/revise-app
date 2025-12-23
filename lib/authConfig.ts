import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import prisma from "./prisma";
import { env } from "@/src/env";

// Fonction pour construire les providers dynamiquement
const buildProviders = () => {
  const providers: any[] = [];

  // Authentification par Email/Mot de passe (toujours activée)
  providers.push(
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "votreemail@exemple.com" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Aucun utilisateur trouvé avec cet email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    })
  );

  // GitHub Provider (seulement si les credentials sont configurés)
  if (env.GITHUB_ID && env.GITHUB_SECRET) {
    providers.push(
      GithubProvider({
        clientId: env.GITHUB_ID,
        clientSecret: env.GITHUB_SECRET,
      })
    );
  }

  // Google Provider (seulement si les credentials sont configurés)
  if (env.GOOGLE_ID && env.GOOGLE_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: env.GOOGLE_ID,
        clientSecret: env.GOOGLE_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      })
    );
  }

  return providers;
};

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: buildProviders(),
  session: {
    strategy: "jwt", // Utiliser JWT pour la compatibilité avec Credentials
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

export const getAuthSession = () => getServerSession(authConfig);
