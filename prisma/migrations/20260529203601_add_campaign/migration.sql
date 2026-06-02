/*
  Warnings:

  - You are about to drop the column `border` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `button` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `dates` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `generatedContent` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tone` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "border",
DROP COLUMN "button",
DROP COLUMN "dates",
DROP COLUMN "description",
DROP COLUMN "icon",
ADD COLUMN     "generatedContent" TEXT NOT NULL,
ADD COLUMN     "goal" TEXT NOT NULL,
ADD COLUMN     "platform" TEXT NOT NULL,
ADD COLUMN     "productType" TEXT NOT NULL,
ADD COLUMN     "tone" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GeneratedCampaign" (
    "id" SERIAL NOT NULL,
    "template" TEXT,
    "customPrompt" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedCampaign_pkey" PRIMARY KEY ("id")
);
