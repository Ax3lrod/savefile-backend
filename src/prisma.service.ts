import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. ambil connection string dari environment variable
    const connectionString = process.env.DATABASE_URL;
    // 2. buat pool koneksi ke Postgres
    const pool = new Pool({ connectionString });
    // 3. buat adapter Prisma untuk Postgres
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
