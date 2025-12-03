/*
  Warnings:

  - The values [vocab,grammar,reading,listening] on the enum `ProblemType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `answer_index` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `answer_text` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `translation` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - Added the required column `answerIndex` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `subType` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `question` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `options` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `explanation` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('KO', 'EN', 'JP', 'CN', 'VN');

-- CreateEnum
CREATE TYPE "ProblemSubType" AS ENUM ('KANJI_READING', 'ORTHOGRAPHY', 'WORD_FORMATION', 'CONTEXT', 'PARAPHRASE', 'USAGE', 'GRAMMAR_FORM', 'GRAMMAR_ORDER', 'TEXT_GRAMMAR', 'SHORT_PASSAGE', 'MID_PASSAGE', 'LONG_PASSAGE', 'INTEGRATED_PASSAGE', 'THEMATIC_PASSAGE', 'INFO_RETRIEVAL', 'TASK_BASED', 'POINT_COMPREHENSION', 'SUMMARY', 'QUICK_RESPONSE', 'INTEGRATED_COMPREHENSION');

-- AlterEnum
BEGIN;
CREATE TYPE "ProblemType_new" AS ENUM ('VOCAB', 'GRAMMAR', 'READING', 'LISTENING');
ALTER TABLE "Problem" ALTER COLUMN "type" TYPE "ProblemType_new" USING ("type"::text::"ProblemType_new");
ALTER TYPE "ProblemType" RENAME TO "ProblemType_old";
ALTER TYPE "ProblemType_new" RENAME TO "ProblemType";
DROP TYPE "public"."ProblemType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "answer_index",
DROP COLUMN "answer_text",
DROP COLUMN "translation",
ADD COLUMN     "answerIndex" INTEGER NOT NULL,
ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "content" JSONB NOT NULL,
ADD COLUMN     "grammar" JSONB,
ADD COLUMN     "imageUrl" TEXT,
DROP COLUMN "subType",
ADD COLUMN     "subType" "ProblemSubType" NOT NULL,
DROP COLUMN "question",
ADD COLUMN     "question" JSONB NOT NULL,
DROP COLUMN "options",
ADD COLUMN     "options" JSONB NOT NULL,
DROP COLUMN "explanation",
ADD COLUMN     "explanation" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "SolveHistory" ADD COLUMN     "timeTaken" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
ADD COLUMN     "nativeLang" "Language" NOT NULL DEFAULT 'KO',
ADD COLUMN     "targetLevel" INTEGER NOT NULL DEFAULT 1;
