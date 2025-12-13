{
  "name": "pmg-quiz",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "prisma:migrate": "prisma migrate dev --name init",
    "prisma:generate": "prisma generate",
    "prisma:seed": "ts-node --prefer-ts-exts prisma/seed.ts",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "next": "14.3.1",
    "next-auth": "^5.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "stripe": "^12.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.1.6"
  }
}# PMG
One way forward 
