-- AlterTable
ALTER TABLE "users" ADD COLUMN     "canceled_at" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
