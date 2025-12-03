/*
  Warnings:

  - Added the required column `language` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "language" "Language" NOT NULL,
ADD COLUMN     "reasoning_for_level" TEXT;
