-- CreateTable
CREATE TABLE "Suggestion" (
    "id" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "flag" TEXT NOT NULL DEFAULT '🌐',
    "tone" TEXT NOT NULL DEFAULT 'bg-gray-100',
    "currentHeadline" TEXT NOT NULL,
    "currentDetail" TEXT NOT NULL DEFAULT '',
    "suggestedHeadline" TEXT NOT NULL,
    "expectedLift" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'bg-teal-600',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);
