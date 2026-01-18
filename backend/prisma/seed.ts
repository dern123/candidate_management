import { PrismaClient, CandidateStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1) Skills pool
  const skillNames = [
    "React",
    "TypeScript",
    "Node.js",
    "Express",
    "PostgreSQL",
    "Prisma",
    "REST API",
    "Docker",
    "Testing",
    "Git",
  ];

  // create skills (skip duplicates)
  const skills = await Promise.all(
    skillNames.map((name) =>
      prisma.skill.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const pickSkills = (count: number) => {
    const shuffled = [...skills].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((s) => s.id);
  };

  // 2) Candidates seed data
  const candidates = [
    {
      name: "Anna Kovalenko",
      position: "Frontend Developer",
      status: CandidateStatus.active,
      email: "anna.kovalenko@example.com",
      phone: "+380 67 111 22 33",
      description: "Strong React/TS, experience with design systems and accessibility.",
      skillCount: 4,
    },
    {
      name: "Denys Melnyk",
      position: "Backend Developer",
      status: CandidateStatus.interview,
      email: "denys.melnyk@example.com",
      phone: "+380 50 222 33 44",
      description: "Node.js, Express, DB modeling, writes clean REST APIs.",
      skillCount: 5,
    },
    {
      name: "Iryna Shevchenko",
      position: "Full-stack Developer",
      status: CandidateStatus.active,
      email: "iryna.shevchenko@example.com",
      phone: "+380 93 333 44 55",
      description: "Full-stack with React + Node, likes pragmatic architecture.",
      skillCount: 5,
    },
    {
      name: "Oleksii Bondarenko",
      position: "QA Engineer",
      status: CandidateStatus.rejected,
      email: "oleksii.bondarenko@example.com",
      phone: "+380 66 444 55 66",
      description: "Manual+automation, test plans, bug triage, good communication.",
      skillCount: 3,
    },
    {
      name: "Kateryna Hrytsenko",
      position: "DevOps Engineer",
      status: CandidateStatus.interview,
      email: "kateryna.hrytsenko@example.com",
      phone: "+380 97 555 66 77",
      description: "Docker, CI/CD, observability, helps teams ship reliably.",
      skillCount: 4,
    },
    {
      name: "Mykola Petrenko",
      position: "Product Designer",
      status: CandidateStatus.active,
      email: "mykola.petrenko@example.com",
      phone: "+380 63 777 88 99",
      description: "UX/UI, handoff, component thinking, improves product clarity.",
      skillCount: 2,
    },
  ];

  // 3) Create candidates with relations
  for (const c of candidates) {
    const created = await prisma.candidate.upsert({
      where: { email: c.email },
      update: {
        name: c.name,
        position: c.position,
        status: c.status,
        phone: c.phone,
        description: c.description,
      },
      create: {
        name: c.name,
        position: c.position,
        status: c.status,
        email: c.email,
        phone: c.phone,
        description: c.description,
      },
    });

    const skillIds = pickSkills(c.skillCount);

    // clear old links then add new
    await prisma.candidateSkill.deleteMany({
      where: { candidateId: created.id },
    });

    await prisma.candidateSkill.createMany({
      data: skillIds.map((skillId) => ({
        candidateId: created.id,
        skillId,
      })),
    });
  }

  console.log(">>>>>> Seed completed >>>>>");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
