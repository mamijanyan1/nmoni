import fs from 'node:fs';
import { after, before, beforeEach, describe, test } from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

const PROJECT_ID = 'demo-marketing-rules';
const WORKSPACE_ID = 'workspace-alpha';
const OTHER_WORKSPACE_ID = 'workspace-beta';

let testEnv;

function authedDb(uid, claims = {}) {
  return testEnv.authenticatedContext(uid, claims).firestore();
}

function anonDb() {
  return testEnv.unauthenticatedContext().firestore();
}

async function seedWorkspace() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, `workspaces/${WORKSPACE_ID}`), { name: 'Alpha workspace' });
    await setDoc(doc(db, `workspaces/${OTHER_WORKSPACE_ID}`), { name: 'Beta workspace' });
    await setDoc(doc(db, `workspaces/${WORKSPACE_ID}/members/member-user`), {
      active: true,
      role: 'member',
    });
    await setDoc(doc(db, `workspaces/${WORKSPACE_ID}/members/manager-user`), {
      active: true,
      role: 'manager',
    });
    await setDoc(doc(db, `workspaces/${WORKSPACE_ID}/members/admin-user`), {
      active: true,
      role: 'admin',
    });
    await setDoc(doc(db, `workspaces/${OTHER_WORKSPACE_ID}/members/member-user`), {
      active: true,
      role: 'member',
    });
    await setDoc(doc(db, `workspaces/${WORKSPACE_ID}/tasks/task-1`), {
      title: 'Draft campaign post',
    });
    await setDoc(doc(db, `workspaces/${OTHER_WORKSPACE_ID}/tasks/task-2`), {
      title: 'Other workspace task',
    });
    await setDoc(doc(db, `workspaces/${WORKSPACE_ID}/secrets/api`), {
      token: 'super-secret',
    });
  });
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await seedWorkspace();
});

after(async () => {
  await testEnv.cleanup();
});

describe('workspace authentication boundary', () => {
  test('denies anonymous reads and writes, including the formerly public main workspace id', async () => {
    const db = anonDb();

    await assertFails(getDoc(doc(db, `workspaces/${WORKSPACE_ID}`)));
    await assertFails(getDoc(doc(db, 'workspaces/smm_workspace_main')));
    await assertFails(setDoc(doc(db, `workspaces/${WORKSPACE_ID}`), { name: 'Anonymous write' }));
  });
});

describe('workspace member read scope', () => {
  test('allows a member to read only workspaces where they have membership', async () => {
    const memberDb = authedDb('member-user');
    const outsiderDb = authedDb('outsider-user');

    await assertSucceeds(getDoc(doc(memberDb, `workspaces/${WORKSPACE_ID}/tasks/task-1`)));
    await assertSucceeds(getDoc(doc(memberDb, `workspaces/${OTHER_WORKSPACE_ID}/tasks/task-2`)));
    await assertFails(getDoc(doc(outsiderDb, `workspaces/${WORKSPACE_ID}/tasks/task-1`)));
  });

  test('allows a member to read their own member document but not another member profile', async () => {
    const memberDb = authedDb('member-user');

    await assertSucceeds(getDoc(doc(memberDb, `workspaces/${WORKSPACE_ID}/members/member-user`)));
    await assertFails(getDoc(doc(memberDb, `workspaces/${WORKSPACE_ID}/members/manager-user`)));
  });
});

describe('workspace manager writes', () => {
  test('allows manager/admin writes to operational workspace data and denies member writes', async () => {
    const managerDb = authedDb('manager-user');
    const adminDb = authedDb('admin-user');
    const memberDb = authedDb('member-user');

    await assertSucceeds(setDoc(doc(managerDb, `workspaces/${WORKSPACE_ID}/tasks/task-3`), { title: 'Manager task' }));
    await assertSucceeds(setDoc(doc(adminDb, `workspaces/${WORKSPACE_ID}/campaigns/campaign-1`), { title: 'Admin campaign' }));
    await assertFails(setDoc(doc(memberDb, `workspaces/${WORKSPACE_ID}/tasks/task-4`), { title: 'Member task' }));
  });

  test('allows workspace role custom claims to authorize manager writes without a role document', async () => {
    const claimedManagerDb = authedDb('claimed-manager', {
      workspaceRoles: {
        [WORKSPACE_ID]: 'manager',
      },
    });

    await assertSucceeds(setDoc(doc(claimedManagerDb, `workspaces/${WORKSPACE_ID}/logs/log-1`), { message: 'Claim authorized' }));
  });
});

describe('admin-only sensitive collections', () => {
  test('allows only admins to read and write sensitive collections', async () => {
    const adminDb = authedDb('admin-user');
    const managerDb = authedDb('manager-user');
    const memberDb = authedDb('member-user');

    await assertSucceeds(getDoc(doc(adminDb, `workspaces/${WORKSPACE_ID}/secrets/api`)));
    await assertSucceeds(setDoc(doc(adminDb, `workspaces/${WORKSPACE_ID}/billing/invoice-1`), { status: 'draft' }));
    await assertFails(getDoc(doc(managerDb, `workspaces/${WORKSPACE_ID}/secrets/api`)));
    await assertFails(setDoc(doc(managerDb, `workspaces/${WORKSPACE_ID}/integrations/meta`), { connected: true }));
    await assertFails(getDoc(doc(memberDb, `workspaces/${WORKSPACE_ID}/secrets/api`)));
  });

  test('allows a global admin custom claim to manage sensitive collections', async () => {
    const globalAdminDb = authedDb('global-admin', { admin: true });

    await assertSucceeds(deleteDoc(doc(globalAdminDb, `workspaces/${WORKSPACE_ID}/secrets/api`)));
  });
});
