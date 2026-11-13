import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import local from "./index.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const entryBody = `
class OrganizationsService {
  async ownershipTransferInTransaction(dto) {
    await this.repos.organizationUsers.transaction(async () => {
      await this.repos.organizationUsers.update(dto);
    });
  }
}`;

new RuleTester().run("transaction-entry", local.rules["transaction-entry"], {
  valid: [
    {
      filename: "/var/tools/example/apps/api/src/features/projects/service.ts",
      options: [
        {
          participants: [
            {
              file: "apps/api/src/features/projects/service.ts",
              className: "ProjectsService",
              method: "updateLastLetterNumberInTransaction",
              caller: "uploadInTransaction",
            },
          ],
        },
      ],
      code: `class ProjectsService {
        async uploadInTransaction() {
          await this.repo.transaction(async () => {
            await this.updateLastLetterNumberInTransaction("case", 3);
          });
        }
        async updateLastLetterNumberInTransaction(id, number) {
          await this.repo.update(id, number);
        }
      }`,
    },
    entryBody,
    `
class OrganizationsService {
  async ownershipTransferInTransaction(dto) {
    await this.repos.organizationUsers.transaction(async () => {
      await this.repos.organizationUsers.update(dto);
      await this.repos.jobs.create(dto);
    });
  }
}`,
    {
      code: `
class AuthFeatureService {
  async sessionRefresh({ refreshToken }) {
    return this.authRealm.refreshInTransaction(refreshToken);
  }
}`,
      filename: "/srv/deepseek/packages/core/src/features/auth/service.ts",
    },
    {
      code: `
export function usersRoutes(app, service) {
  app.post("/users", async (request) => {
    const dto = request.body;
    return service.userCreateInTransaction(dto);
  });
}`,
      filename: "/srv/deepseek/apps/platform-api/src/features/users/routes.ts",
    },
    {
      code: `
class JobService {
  async runAttemptInTransaction(job, work) {
    await this.jobsRepo.transaction(async () => {
      await outsideTransaction(() => this.jobService.queueInTransaction(job));
    });
  }
}`,
      filename: "/srv/deepseek/packages/core/src/services/job/index.ts",
    },
    `
class JobService {
  async runAttemptInTransaction(job, work) {
    await this.jobsRepo.transaction(async () => {
      await outsideTransaction(async () => {
        await this.repos.sessions.transaction(async () => work(job));
      });
    });
  }
}`,
    `
class Repo {
  async transaction(run) {
    return run(this);
  }
}`,
    `const total = items.reduce((sum, item) => sum + item.count, 0);`,
    {
      code: `
class Repo {
  async transaction(run) {
    return this.kysely.transaction().execute((transaction) => run(transaction));
  }
}`,
      filename: "/srv/example/packages/core/src/repo.ts",
      options: [
        {
          builderFiles: ["packages/core/src/repo.ts"],
        },
      ],
    },
    {
      code: `
async function exerciseBundler() {
  await store.transaction(async () => {
    await store.transaction(async () => store.update(dto));
    await service.createInTransaction(dto);
  });
}`,
      filename: "/srv/deepseek/packages/core/test/repo.test.ts",
    },
  ],
  invalid: [
    {
      filename: "/var/tools/example/apps/api/src/features/projects/service.ts",
      options: [
        {
          participants: [
            {
              file: "apps/api/src/features/projects/service.ts",
              className: "ProjectsService",
              method: "updateLastLetterNumberInTransaction",
              caller: "uploadInTransaction",
            },
          ],
        },
      ],
      code: `class ProjectsService {
        async updateLastLetterNumberInTransaction() {
          await this.other.updateInTransaction();
        }
      }`,
      errors: [
        {
          messageId: "nestedEntry",
        },
      ],
    },
    {
      filename: "/var/tools/example/apps/api/src/features/projects/service.ts",
      options: [
        {
          participants: [
            {
              file: "apps/api/src/features/projects/service.ts",
              className: "ProjectsService",
              method: "updateLastLetterNumberInTransaction",
              caller: "uploadInTransaction",
            },
          ],
        },
      ],
      code: `class ProjectsService {
        async updateLastLetterNumberInTransaction() {
          await this.repo.transaction(async () => {});
        }
      }`,
      errors: [
        {
          messageId: "notEntry",
        },
      ],
    },
    {
      filename: "/var/tools/example/apps/api/src/features/projects/service.ts",
      options: [
        {
          participants: [
            {
              file: "apps/api/src/features/projects/service.ts",
              className: "ProjectsService",
              method: "updateLastLetterNumberInTransaction",
              caller: "uploadInTransaction",
            },
          ],
        },
      ],
      code: `class ProjectsService {
        async updateInTransaction() {
          await this.updateLastLetterNumberInTransaction("case", 3);
        }
      }`,
      errors: [
        {
          messageId: "nestedEntry",
        },
      ],
    },
    {
      filename: "/var/tools/example/apps/platform-api/src/features/other/service.ts",
      code: `class ProjectsService {
        async uploadInTransaction() {
          await this.updateLastLetterNumberInTransaction("case", 3);
        }
      }`,
      errors: [
        {
          messageId: "nestedEntry",
        },
      ],
    },
    {
      code: `
class OrganizationsService {
  async ownershipTransferInTransaction(dto) {
    await this.repos.organizationUsers.transaction(async () => {
      await this.repos.jobs.transaction(async () => this.repos.jobs.create(dto));
    });
  }
}`,
      errors: [
        {
          messageId: "nested",
        },
      ],
    },
    {
      code: `
class OrganizationsService {
  async createInTransaction(dto) {
    await this.repo.transaction(async () => {
      await this.repo.create(dto);
    });
    await this.jobService.queueInTransaction(dto);
  }
}`,
      filename: "/srv/deepseek/apps/platform-api/src/features/organizations/service.ts",
      errors: [
        {
          messageId: "nestedEntry",
        },
      ],
    },
    {
      code: `
class OrganizationsService {
  async update(dto) {
    await this.repo.transaction(async () => {
      await this.other.updateInTransaction(dto);
    });
  }
}`,
      filename: "/srv/deepseek/apps/platform-api/src/features/organizations/service.ts",
      errors: [
        {
          messageId: "notEntry",
        },
        {
          messageId: "nestedEntry",
        },
      ],
    },
    {
      code: `
class OrganizationsService {
  async ownershipTransfer(dto) {
    await this.repos.organizationUsers.transaction(async () => {
      await this.repos.organizationUsers.update(dto);
    });
  }
}`,
      errors: [
        {
          messageId: "notEntry",
        },
      ],
    },
    {
      code: `
async function hydrate() {
  await store.transaction(async () => {});
}`,
      errors: [
        {
          messageId: "notEntry",
        },
      ],
    },
    {
      code: `
class OrganizationsService {
  async ownershipTransfer(dto) {
    await store.transaction().execute((transaction) => transaction.update(dto));
  }
}`,
      filename: "/srv/deepseek/apps/platform-api/src/features/organizations/service.ts",
      errors: [
        {
          messageId: "notEntry",
        },
      ],
    },
  ],
});
