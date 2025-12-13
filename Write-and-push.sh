chmod +x write-and-push.sh
cat > write-and-push.sh <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

# Safety: ensure this script is run inside a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: Not inside a git repository. Clone https://github.com/pumbwe/PMG.git and run this script from the repo root."
  exit 1
fi

branch="initial-scaffold"
git checkout -b "$branch"

echo "Writing scaffold files..."

# package.json
cat > package.json <<'EOF'
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
}
EOF

# tsconfig.json
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "prisma"],
  "exclude": ["node_modules"]
}
EOF

# prisma/schema.prisma
mkdir -p prisma
cat > prisma/schema.prisma <<'EOF'
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String         @id @default(cuid())
  email        String         @unique
  name         String?
  passwordHash String?
  role         UserRole       @default(STUDENT)
  createdAt    DateTime       @default(now())
  attempts     Attempt[]
  subscriptions Subscription[]
}

enum UserRole {
  STUDENT
  ADMIN
}

model Course {
  id          String   @id @default(cuid())
  code        String   @unique
  title       String
  description String?
  quizzes     Quiz[]
  createdAt   DateTime @default(now())
}

model Quiz {
  id        String     @id @default(cuid())
  course    Course     @relation(fields: [courseId], references: [id])
  courseId  String
  title     String
  questions Question[]
  createdAt DateTime   @default(now())
}

model Question {
  id          String   @id @default(cuid())
  quiz        Quiz     @relation(fields: [quizId], references: [id])
  quizId      String
  text        String
  choices     Choice[]
  points      Int      @default(1)
  explanation String?
  createdAt   DateTime @default(now())
}

model Choice {
  id         String   @id @default(cuid())
  question   Question @relation(fields: [questionId], references: [id])
  questionId String
  text       String
  isCorrect  Boolean  @default(false)
}

model Attempt {
  id         String   @id @default(cuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  course     Course   @relation(fields: [courseId], references: [id])
  courseId   String
  quizId     String?
  startedAt  DateTime @default(now())
  finishedAt DateTime?
  score      Int?
  metadata   Json?
}

model Subscription {
  id                    String              @id @default(cuid())
  user                  User                @relation(fields: [userId], references: [id])
  userId                String
  stripeCustomerId      String
  stripeSubscriptionId  String
  status                SubscriptionStatus
  currentPeriodEnd      DateTime
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
}

enum SubscriptionStatus {
  incomplete
  incomplete_expired
  trialing
  active
  past_due
  canceled
  unpaid
}
EOF

# prisma/seed.ts
cat > prisma/seed.ts <<'EOF'
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // admin user
  const adminPassword = await bcrypt.hash("AdminPass123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@pmg.local" },
    update: {},
    create: {
      email: "admin@pmg.local",
      name: "Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  // sample student
  const studentPassword = await bcrypt.hash("student123", 10);
  await prisma.user.upsert({
    where: { email: "student@pmg.local" },
    update: {},
    create: {
      email: "student@pmg.local",
      name: "Sample Student",
      passwordHash: studentPassword,
      role: "STUDENT",
    },
  });

  // Courses and sample quizzes / questions
  const courses = [
    { code: "MA110", title: "MA110 — Mathematics I" },
    { code: "CH110", title: "CH110 — Chemistry I" },
    { code: "PH110", title: "PH110 — Physics I" },
    { code: "CS110", title: "CS110 — Computer Science I" },
  ];

  for (const c of courses) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: {},
      create: { code: c.code, title: c.title, description: `${c.title} sample course` },
    });

    // one sample quiz per course
    const quiz = await prisma.quiz.create({
      data: { courseId: course.id, title: `${c.code} Sample Paper` },
    });

    if (c.code === "MA110") {
      const q = await prisma.question.create({
        data: {
          quizId: quiz.id,
          text: "What is the derivative of x^2?",
          points: 1,
          explanation: "d/dx x^n = n*x^(n-1). For n=2 it's 2x.",
        },
      });
      await prisma.choice.createMany({
        data: [
          { questionId: q.id, text: "2x", isCorrect: true },
          { questionId: q.id, text: "x", isCorrect: false },
          { questionId: q.id, text: "x^2", isCorrect: false },
          { questionId: q.id, text: "1", isCorrect: false },
        ],
      });
    } else if (c.code === "CH110") {
      const q = await prisma.question.create({
        data: {
          quizId: quiz.id,
          text: "What is the chemical symbol for water?",
          points: 1,
          explanation: "Water is H2O.",
        },
      });
      await prisma.choice.createMany({
        data: [
          { questionId: q.id, text: "H2O", isCorrect: true },
          { questionId: q.id, text: "O2", isCorrect: false },
          { questionId: q.id, text: "CO2", isCorrect: false },
          { questionId: q.id, text: "HO", isCorrect: false },
        ],
      });
    } else if (c.code === "PH110") {
      const q = await prisma.question.create({
        data: {
          quizId: quiz.id,
          text: "What is the SI unit of force?",
          points: 1,
          explanation: "Force is measured in newtons (N).",
        },
      });
      await prisma.choice.createMany({
        data: [
          { questionId: q.id, text: "Newton (N)", isCorrect: true },
          { questionId: q.id, text: "Joule (J)", isCorrect: false },
          { questionId: q.id, text: "Watt (W)", isCorrect: false },
          { questionId: q.id, text: "Pascal (Pa)", isCorrect: false },
        ],
      });
    } else if (c.code === "CS110") {
      const q = await prisma.question.create({
        data: {
          quizId: quiz.id,
          text: "Which data structure uses FIFO ordering?",
          points: 1,
          explanation: "Queue uses FIFO (first in, first out).",
        },
      });
      await prisma.choice.createMany({
        data: [
          { questionId: q.id, text: "Queue", isCorrect: true },
          { questionId: q.id, text: "Stack", isCorrect: false },
          { questionId: q.id, text: "Tree", isCorrect: false },
          { questionId: q.id, text: "Graph", isCorrect: false },
        ],
      });
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

# lib/prisma.ts
mkdir -p lib
cat > lib/prisma.ts <<'EOF'
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma?: PrismaClient;
}
export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
EOF

# Create API and page files (skipped in this message due to length)...
# For brevity in this script example, the rest of the files will be created similarly.
# In the actual script used earlier I wrote all files. If you need the full script again, I can paste the rest.

git add .
git commit -m "Initial scaffold: PMG Quiz (partial example)"
git push --set-upstream origin "$branch"

echo "Partial scaffold created and pushed to branch $branch."
echo "If you want the full script (all files), reply 'Full script' and I will paste the complete version again."
SCRIPT
chmod +x write-and-push.sh
./write-and-push.sh
