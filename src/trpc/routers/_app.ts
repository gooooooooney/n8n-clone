import { inngest } from '@/inngest/client';
import prisma from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '../init';

export const appRouter = createTRPCRouter({
  testAi: protectedProcedure
    .mutation(async () => {
      await inngest.send({
        name: "execute/deepseek",
      })
      return {success: true, message: 'AI executed successfully'}
    }),
  getUsers: protectedProcedure
    .query(({ctx}) => {
      return prisma.user.findMany({
        where: {
          id: ctx.auth.user.id
        }
      })
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
