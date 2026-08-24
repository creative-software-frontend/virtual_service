const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const express = require('express');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret-deposit-methods-000';

let methods = [];
let nextId = 1;

function seed() {
    methods = [];
    nextId = 1;
}

function clone(x) { return JSON.parse(JSON.stringify(x)); }

// Returns ROW ARRAYS for SELECTs and a ResultSetHeader object for DML.
function route(sql, values = []) {
    const S = String(sql).toLowerCase();
    const v = values;

    if (S.includes('select membership_package_id, membership_expires_at from users')) {
        return []; // no memberships in stub → auth middleware passes
    }
    if (S.includes('update users set last_seen')) return { affectedRows: 1 };
    if (/select role, is_active from users where id = \?/i.test(S)) {
        const map = { 1: 'admin', 10: 'user', 20: 'provider' };
        const role = map[Number(v[0])] || 'user';
        return [{ role, is_active: 1 }];
    }
    if (S.startsWith('delete from deposit_payment_methods')) {
        const id = Number(v[0]);
        const idx = methods.findIndex(m => m.id === id);
        if (idx === -1) return { affectedRows: 0 };
        methods.splice(idx, 1);
        return { affectedRows: 1 };
    }
    if (S.includes('from deposit_requests where payment_method_id')) {
        // reference check used by deleteMethod — this stub has no deposit refs
        return [];
    }
    if (S.includes('from deposit_payment_methods')) {
        const list = S.includes('where is_active = 1')
            ? methods.filter(m => m.is_active === 1)
            : methods;
        if (S.includes('where id = ? limit 1')) {
            const m = methods.find(x => x.id === Number(v[0]));
            return m ? [{ ...m }] : [];
        }
        return list.map(m => ({ ...m }));
    }
    if (S.startsWith('update deposit_payment_methods set is_active = 0')) {
        // deactivate-others: SET is_active=0 WHERE method=? AND is_active=1 [AND id != ?]
        const method = v[0];
        const exclude = v[1] != null ? Number(v[1]) : null;
        methods.forEach(m => { if (m.method === method && m.is_active === 1 && (exclude == null || m.id !== exclude)) m.is_active = 0; });
        return { affectedRows: 1 };
    }
    if (S.includes('insert into deposit_payment_methods')) {
        // (method, provider_name, account_number, account_type, instructions, instruction_image_url, is_active)
        const [method, providerName, accountNumber, accountType, instructions, imageUrl, isActive] = v;
        const dup = methods.some(m => m.method === method && m.account_type !== null && m.account_type === accountType);
        if (dup) { throw Object.assign(new Error('dup'), { code: 'ER_DUP_ENTRY' }); }
        const m = {
            id: nextId++, method,
            provider_name: providerName ?? null,
            account_number: accountNumber,
            account_type: accountType ?? null,
            instructions: instructions ?? null,
            instruction_image_url: imageUrl ?? null,
            is_active: Number(isActive), created_at: null, updated_at: null,
        };
        methods.push(m);
        return { insertId: m.id, affectedRows: 1 };
    }
    if (S.includes('set provider_name = ?') && S.includes('update deposit_payment_methods')) {
        // (provider_name, account_number, account_type, instructions, instruction_image_url, is_active, id)
        const [providerName, accountNumber, accountType, instructions, imageUrl, isActive, id] = v;
        const target = methods.find(m => m.id === Number(id));
        if (!target) return { affectedRows: 0 };
        const dup = methods.some(m => m.id !== target.id && m.method === target.method && m.account_type != null && m.account_type === accountType);
        if (dup) { throw Object.assign(new Error('dup'), { code: 'ER_DUP_ENTRY' }); }
        Object.assign(target, {
            provider_name: providerName ?? null,
            account_number: accountNumber,
            account_type: accountType ?? null,
            instructions: instructions ?? null,
            instruction_image_url: imageUrl ?? null,
            is_active: Number(isActive),
        });
        return { affectedRows: 1 };
    }
    if (S.includes('update deposit_payment_methods set is_active = ? where id = ?')) {
        const [isActive, id] = v;
        const target = methods.find(m => m.id === Number(id));
        if (target) target.is_active = Number(isActive);
        return { affectedRows: target ? 1 : 0 };
    }
    return [];
}

function makeConnection() {
    return {
        async query(sql, values) { return [route(sql, values || []), []]; },
        async beginTransaction() {},
        async commit() {},
        async rollback() {},
        async release() {},
    };
}

const stubDb = {
    query(sql, values, cb) {
        if (typeof values === 'function') { cb = values; values = undefined; }
        const rows = route(sql, values || []);
        if (typeof cb === 'function') return cb(null, rows);
        return Promise.resolve([rows, []]);
    },
    getConnection() { return Promise.resolve(makeConnection()); },
};

const dbPath = require.resolve('../src/config/db.js');
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: stubDb };

const svc = require('../src/services/depositPaymentService');

test.before(() => seed());

const B = { method: 'bkash', account_number: '01880299555', account_type: 'personal', is_active: true };
const N = { method: 'nagad', account_number: '01900000000', account_type: 'personal', is_active: true };

test('create: valid bkash method is created active', async () => {
    seed();
    const m = await svc.createMethod(B);
    assert.equal(m.method, 'bkash');
    assert.equal(m.account_number, '01880299555');
    assert.equal(m.account_type, 'personal');
    assert.equal(m.is_active, 1);
});

test('create: validation rejects bad method, type and mobile number', async () => {
    seed();
    await assert.rejects(() => svc.createMethod({ ...B, method: 'paypal' }), /method must be "bkash", "nagad" or "merchant"/);
    await assert.rejects(() => svc.createMethod({ ...B, account_type: 'business' }), /account_type must be "personal" or "agent"/);
    await assert.rejects(() => svc.createMethod({ ...B, account_number: '12345' }), /valid Bangladesh mobile/);
    assert.equal(methods.length, 0);
});

test('duplicate (method, account_type) is rejected with 409', async () => {
    seed();
    await svc.createMethod(B);
    await assert.rejects(() => svc.createMethod(B), /already exists/);
    assert.equal(methods.length, 1);
});

test('only one ACTIVE method per type: activating a second bkash deactivates the first', async () => {
    seed();
    const personal = await svc.createMethod(B);
    const agent = await svc.createMethod({ ...B, account_type: 'agent' });
    assert.equal(agent.is_active, 1);
    assert.equal(methods.find(m => m.id === personal.id).is_active, 0, 'previous active bkash deactivated');
    assert.equal(methods.filter(m => m.method === 'bkash' && m.is_active === 1).length, 1);
});

test('user-visible active list excludes inactive methods', async () => {
    seed();
    await svc.createMethod(B);
    await svc.createMethod({ ...B, account_type: 'agent', is_active: false });
    await svc.createMethod(N);
    const active = await svc.getActiveMethods();
    assert.equal(active.length, 2); // bkash personal + nagad personal (agent inactive)
    assert.ok(active.every(m => m.is_active === 1));
});

test('update: changing account_number/type works, duplicate type rejected', async () => {
    seed();
    const a = await svc.createMethod(B);
    await svc.createMethod(N);
    const updated = await svc.updateMethod(a.id, { account_number: '01700000000', account_type: 'agent' });
    assert.equal(updated.account_number, '01700000000');
    assert.equal(updated.account_type, 'agent');
    // creating another agent-type would duplicate -> rejected
    await assert.rejects(() => svc.createMethod({ ...B, account_type: 'agent' }), /already exists/);
});

test('toggle: enabling a method deactivates the other active same-method row', async () => {
    seed();
    const personal = await svc.createMethod(B);
    const agent = await svc.createMethod({ ...B, account_type: 'agent', is_active: false });
    const toggled = await svc.toggleMethod(personal.id, false); // turn personal off
    assert.equal(toggled.is_active, 0);
    const agentOn = await svc.toggleMethod(agent.id, true); // agent on
    assert.equal(agentOn.is_active, 1);
    assert.equal(methods.find(m => m.id === personal.id).is_active, 0);
    assert.equal(methods.filter(m => m.method === 'bkash' && m.is_active === 1).length, 1);
});

// ── Route-level authorization ────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use('/api/deposit-methods', require('../src/routes/paymentMethodRoutes').userRouter);
app.use('/api/admin/deposit-methods', require('../src/routes/paymentMethodRoutes').adminRouter);
app.use((req, res) => res.status(404).json({ message: 'not found' }));

let server;
let base;

test.before(async () => {
    server = http.createServer(app);
    await new Promise(r => server.listen(0, r));
    base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
    if (server) await new Promise(r => server.close(r));
});

function sign(id, role) { return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' }); }
async function call(method, path, { token, body } = {}) {
    const res = await fetch(`${base}${path}`, {
        method,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    let json = null;
    try { json = await res.json(); } catch (_) {}
    return { status: res.status, json };
}

test('route: user read requires auth and returns only active methods', async () => {
    seed();
    await svc.createMethod(B);
    await svc.createMethod({ ...B, account_type: 'agent', is_active: false });

    const noTok = await call('GET', '/api/deposit-methods');
    assert.equal(noTok.status, 401);

    const userTok = sign(10, 'user');
    const { status, json } = await call('GET', '/api/deposit-methods', { token: userTok });
    assert.equal(status, 200);
    assert.equal(json.methods.length, 1);
    assert.equal(json.methods[0].account_type, 'personal');
});

test('route: provider can read active methods', async () => {
    seed();
    await svc.createMethod(B);
    const provTok = sign(20, 'provider');
    const { status, json } = await call('GET', '/api/deposit-methods', { token: provTok });
    assert.equal(status, 200);
    assert.equal(json.methods.length, 1);
});

test('route: admin can list/create/toggle; non-admin cannot mutate', async () => {
    seed();
    const adminTok = sign(1, 'admin');

    const userPost = await call('POST', '/api/admin/deposit-methods', { token: sign(10, 'user'), body: B });
    assert.equal(userPost.status, 403);
    const provPost = await call('POST', '/api/admin/deposit-methods', { token: sign(20, 'provider'), body: B });
    assert.equal(provPost.status, 403);
    const noTokCreate = await call('POST', '/api/admin/deposit-methods', { body: B });
    assert.equal(noTokCreate.status, 401);

    const create = await call('POST', '/api/admin/deposit-methods', { token: adminTok, body: B });
    assert.equal(create.status, 201);
    assert.equal(create.json.method.method, 'bkash');

    const list = await call('GET', '/api/admin/deposit-methods', { token: adminTok });
    assert.equal(list.status, 200);
    assert.equal(list.json.methods.length, 1);

    const id = create.json.method.id;
    const toggle = await call('PATCH', `/api/admin/deposit-methods/${id}/toggle`, { token: adminTok, body: { is_active: false } });
    assert.equal(toggle.status, 200);
    assert.equal(toggle.json.method.is_active, 0);
});

test('route: admin create rejects invalid input with 400', async () => {
    seed();
    const adminTok = sign(1, 'admin');
    const bad = await call('POST', '/api/admin/deposit-methods', { token: adminTok, body: { method: 'paypal', account_number: '01880299555', account_type: 'personal' } });
    assert.equal(bad.status, 400);
    const badNum = await call('POST', '/api/admin/deposit-methods', { token: adminTok, body: { method: 'bkash', account_number: '123', account_type: 'personal' } });
    assert.equal(badNum.status, 400);
    assert.equal(methods.length, 0);
});

// ── Merchant method (service level) ─────────────────────────────────────────

const M = { method: 'merchant', provider_name: 'bKash Merchant', account_number: '01811002233', instructions: 'Send money as Personal', instruction_image_url: '/uploads/deposits/instructions.png', is_active: true };

test('merchant create: valid merchant method with all fields is created active', async () => {
    seed();
    const m = await svc.createMethod(M);
    assert.equal(m.method, 'merchant');
    assert.equal(m.provider_name, 'bKash Merchant');
    assert.equal(m.account_number, '01811002233');
    assert.equal(m.account_type, null);
    assert.equal(m.instructions, 'Send money as Personal');
    assert.equal(m.instruction_image_url, '/uploads/deposits/instructions.png');
    assert.equal(m.is_active, 1);
});

test('merchant create: optional fields default to null when omitted', async () => {
    seed();
    const m = await svc.createMethod({ method: 'merchant', provider_name: 'Nagad Merchant', account_number: '55-0099', is_active: true });
    assert.equal(m.account_number, '550099');
    assert.equal(m.instructions, null);
    assert.equal(m.instruction_image_url, null);
});

test('merchant create: validation rejects missing name, bad number and bad image url', async () => {
    seed();
    await assert.rejects(() => svc.createMethod({ ...M, provider_name: undefined }), /provider_name is required/);
    await assert.rejects(() => svc.createMethod({ ...M, provider_name: 'x' }), /provider_name is required/);
    await assert.rejects(() => svc.createMethod({ ...M, account_number: '12ab' }), /valid merchant number/);
    await assert.rejects(() => svc.createMethod({ ...M, account_number: '12345' }), /valid merchant number/);
    await assert.rejects(() => svc.createMethod({ ...M, instruction_image_url: 'javascript:alert(1)' }), /instruction_image_url/);
    assert.equal(methods.length, 0);
});

// ── Merchant method (route level) ───────────────────────────────────────────

test('route: non-admin cannot create/update/delete a merchant; admin can manage it', async () => {
    seed();
    const created = await call('POST', '/api/admin/deposit-methods', { token: sign(1, 'admin'), body: M });
    assert.equal(created.status, 201);
    const id = created.json.method.id;

    // user/provider/no-token mutations are forbidden
    assert.equal((await call('POST', '/api/admin/deposit-methods', { token: sign(10, 'user'), body: M })).status, 403);
    assert.equal((await call('PUT', `/api/admin/deposit-methods/${id}`, { token: sign(10, 'user'), body: { account_number: '01700000000' } })).status, 403);
    assert.equal((await call('DELETE', `/api/admin/deposit-methods/${id}`, { token: sign(20, 'provider') })).status, 403);
    assert.equal((await call('POST', '/api/admin/deposit-methods', { body: M })).status, 401);

    // admin can update the merchant number
    const upd = await call('PUT', `/api/admin/deposit-methods/${id}`, { token: sign(1, 'admin'), body: { account_number: '01999888777' } });
    assert.equal(upd.status, 200);
    assert.equal(upd.json.method.account_number, '01999888777');
    assert.equal(methods.find(m => m.id === id).account_number, '01999888777');

    // unreferenced merchant can be deleted by admin
    const del = await call('DELETE', `/api/admin/deposit-methods/${id}`, { token: sign(1, 'admin') });
    assert.equal(del.status, 200);
    assert.equal(del.json.deleted, true);
    assert.equal(methods.length, 0);

    // deleting bkash is refused by design
    const b = await svc.createMethod(B);
    const delB = await call('DELETE', `/api/admin/deposit-methods/${b.id}`, { token: sign(1, 'admin') });
    assert.equal(delB.status, 400);
});