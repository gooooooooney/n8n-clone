/*
  Warnings:

  - You are about to drop the column `inggestEventId` on the `Execution` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inngestEventId]` on the table `Execution` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inngestEventId` to the `Execution` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Execution_inggestEventId_key";

-- AlterTable
ALTER TABLE "Execution" DROP COLUMN "inggestEventId",
ADD COLUMN     "inngestEventId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Execution_inngestEventId_key" ON "Execution"("inngestEventId");
