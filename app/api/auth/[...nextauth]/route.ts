import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // 👇 1. 로그인 시 실행되는 콜백
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // 구글 로그인 성공 시, DB에 유저 정보를 없으면 생성(Create), 있으면 업데이트(Update)
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            // id는 자동 생성됨 (cuid)
          },
        });
        return true; // 로그인 허용
      } catch (error) {
        console.error("로그인 DB 저장 실패:", error);
        return false; // 로그인 차단
      }
    },

    // 👇 2. 세션에 DB의 유저 ID(cuid) 포함시키기
    async session({ session, token }) {
      if (session.user && token.sub) {
        // DB에서 실제 유저 정보를 조회해서 ID를 가져오는 것이 가장 확실함
        // (JWT token.sub가 구글 ID일 수도 있고 DB ID일 수도 있어서 확인 필요)
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
        });

        if (dbUser) {
          session.user.id = dbUser.id; // DB의 String ID를 세션에 덮어씌움
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };
