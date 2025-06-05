// import { PrismaClient } from "@prisma/client" //crash DB

//OK for DB :
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient()

export default prisma

