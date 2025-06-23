// File: src/vercel.ts
import { createServer, proxy } from 'aws-serverless-express';
import { Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

let cachedServer: Handler;

async function bootstrapServer(): Promise<Handler> {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await app.init();

  const server = createServer(expressApp);
  return (event, context) => proxy(server, event, context);
}

export const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer(event, context);
};
