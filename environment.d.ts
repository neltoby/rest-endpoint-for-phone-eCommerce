declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URI: string;
      REDIS_HOSTNAME: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
    }
  }
}

export {};
