import { Redis } from "@upstash/redis";

// 1. global 객체 타입 정의
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

// 2. 인스턴스가 없으면 생성 (환경변수 사용 권장)
export const redis =
  globalForRedis.redis ??
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

// 3. 개발 환경에서만 전역 객체에 저장
if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
