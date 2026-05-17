-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "clientIco" TEXT,
ADD COLUMN     "senderAddress" TEXT,
ADD COLUMN     "senderIco" TEXT,
ADD COLUMN     "senderName" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyAddress" TEXT,
ADD COLUMN     "companyIco" TEXT,
ADD COLUMN     "companyName" TEXT;
