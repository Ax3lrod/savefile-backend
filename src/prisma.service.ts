import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Ambil URL dari environment
    const connectionString = process.env.DATABASE_URL;

    // 2. Buat koneksi pool pakai driver 'pg'
    const pool = new Pool({ connectionString });

    // 3. Masukkan ke adapter Prisma
    const adapter = new PrismaPg(pool);

    // 4. Panggil constructor asli Prisma dengan adapter tersebut
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
