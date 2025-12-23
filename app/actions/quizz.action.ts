// "use server";

// import { getAuthSession } from "@/lib/authConfig";
// import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

// export const decrementNumberAction = async () => {
//   const session = await getAuthSession();

//   if (!session?.user.id) {
//     return;
//   }

//   const getCountMax = await prisma.user.findUniqueOrThrow({
//     where: { id: session.user.id },
//     select: { usageMax: true },
//   });

//   const countMax = getCountMax?.usageMax;

//   if (!countMax) {
//     throw new Error("error data");
//   }

//   const user = await prisma.user.update({
//     where: {
//       id: session.user.id,
//     },
//     data: {
//       usageMax: countMax <= 0 ? 0 : countMax - 1,
//     },
//   });
//   revalidatePath("/dashboard");
//   revalidatePath("/quizz");

//   return user.usageMax;
// };
