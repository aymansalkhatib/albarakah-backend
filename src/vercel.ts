// File: src/vercel.ts
import express from 'express';
import { createServer, proxy } from 'aws-serverless-express';
import { Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

let cachedServer: Handler;

async function bootstrapServer(): Promise<Handler> {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await app.init();

  const server = createServer(expressApp);
  return (event, context) => proxy(server, event, context);
}

const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer(event, context);
};

export default handler; // ✅ التصدير كـ default
