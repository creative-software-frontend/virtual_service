/**
 * Merchant deposit flow tests.
 *
 * Covers:
 *  - Active/inactive merchant visibility to users & providers
 *  - Admin authorization for merchant mutations
 *  - User/Provider creating a Merchant deposit (with trx + screenshot rules)
 *  - Historical snapshot of merchant details captured at submission time
 *  - Inactive/missing merchant methods are refused for new deposits
 *  - Existing bKash/Nagad deposit flow keeps working unchanged
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const express = require('express');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret-merchant-deposits-000';

// ── Fake database state ──────────────────────────────────────────────────────
let methods = [];
let deposits = [];
let nextMethodId = 1;
let nextDepositId = 1;

function seed() {
    methods = [];
    deposits = [];
    nextMethodId = 1;
    nextDepositId = 1;
}

// Returns ROW ARRAYS for SELECTs and ResultSetHeader objects for DML.
function route(sql, values = []) {
    const S = String(sql).toLowerCase();
    const v = values;

    if (S.includes('select membership_package_id, membership_expires_at from users')) return [];
    if (S.includes('update users set last_seen')) return { affectedRows: 1 };
    if (/select role, is_active from users where id = \?/i.test(S)) {
        const map = { 1: 'admin', 10: 'user', 20: 'provider' };
        const role = map[Number(v[0])] || 'user';
        return [{ role, is_active: 1 }];
    }

    // ── deposit_payment_methods ──
    if (S.startsWith('delete from deposit_payment_methods')) {
        const idx = methods.findIndex(m => m.id === Number(v[0]));
        if (idx === -1) return { affectedRows: 0 };
        methods.splice(idx, 1);
        return { affectedRows: 1 };
    }
    if (S.includes('from deposit_payment_methods where id = ? and method')) {
        const m = methods.find(x => x.id === Number(v[0]) && x.method === 'merchant');
        return m ? [{ ...m }] : [];
    }
    if (S.includes('from deposit_payment_methods where id = ? limit 1')) {
        const m = methods.find(x => x.id === Number(v[0]));
        return m ? [{ ...m }] : [];
    }
    if (S.includes('from deposit_payment_methods')) {
        const list = S.includes('where is_active = 1')
            ? methods.filter(m => m.is_active === 1)
            : methods;
        return list.map(m => ({ ...m }));
    }
    if (S.startsWith('update deposit_payment_methods set is_active = 0')) {
        const method = v[0];
        const exclude = v[1] != null ? Number(v[1]) : null;
        methods.forEach(m => { if (m.method === method && m.is_active === 1 && (exclude == null || m.id !== exclude)) m.is_active = 0; });
        return { affectedRows: 1 };
    }
    if (S.includes('insert into deposit_payment_methods')) {
        const [method, providerName, accountNumber, accountType, instructions, imageUrl, isActive] = v;
        const m = {
            id: nextMethodId++, method,
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
        const [providerName, accountNumber, , instructions, imageUrl, isActive, id] = v;
        const t = methods.find(m => m.id === Number(id));
        if (!t) return { affectedRows: 0 };
        Object.assign(t, {
            provider_name: providerName ?? null,
            account_number: accountNumber,
            instructions: instructions ?? null,
            instruction_image_url: imageUrl ?? null,
            is_active: Number(isActive),
        });
        return { affectedRows: 1 };
    }
    if (S.includes('update deposit_payment_methods set is_active = ? where id = ?')) {
        const t = methods.find(m => m.id === Number(v[1]));
        if (t) t.is_active = Number(v[0]);
        return { affectedRows: t ? 1 : 0 };
    }

    // ── deposit_requests ──
    if (S.includes('select id from deposit_requests where trx_id')) {
        const row = deposits.find(d => d.trx_id === String(v[0]).trim());
        return row ? [{ id: row.id }] : [];
    }
    if (S.startsWith('insert into deposit_requests')) {
        const [userId, amount, method, trxId, screenshotUrl, pmId, provName, acctNum, instr, imgUrl] = v;
        const d = {
            id: nextDepositId++,
            user_id: userId,
            amount: amount,
            method: method,
            trx_id: trxId,
            screenshot_url: screenshotUrl,
            status: 'Pending',
            payment_method_id: pmId ?? null,
            merchant_provider_name: provName ?? null,
            merchant_account_number: acctNum ?? null,
            merchant_instructions: instr ?? null,
            merchant_instruction_image_url: imgUrl ?? null,
            admin_note: null,
            approved_by: null,
            approved_at: null,
            created_at: new Date().toISOString(),
        };
        deposits.push(d);
        return { insertId: d.id, affectedRows: 1 };
    }
    if (S.includes('from deposit_requests')) {
        if (S.includes('where id = ? limit 1')) {
            const d = deposits.find(x => x.id === Number(v[0]));
            return d ? [{ ...d }] : [];
        }
        if (S.includes('where user_id = ?')) {
            return deposits.filter(d => d.user_id === Number(v[0])).map(d => ({ ...d }));
        }
        if (S.includes('where payment_method_id = ?')) return [];
        return deposits.map(d => ({ ...d }));
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

const psvc = require('../src/services/depositPaymentService');
const wsvc = require('../src/services/walletService');

test.before(() => seed());

async function setupActiveMerchant(overrides = {}) {
    return psvc.createMethod({
        method: 'merchant',
        provider_name: 'bKash Merchant',
        account_number: '01811002233',
        instructions: 'Send money as Personal, then submit TrxID.',
        instruction_image_url: '/uploads/deposits/instructions.png',
        is_active: true,
        ...overrides,
    });
}

const USER_ID = 10;
const PROVIDER_ID = 20;

test('active merchant is returned to users; inactive merchant is not', async () => {
    seed();
    const a = await setupActiveMerchant({ provider_name: 'Nagad Merchant' });
    const b = await setupActiveMerchant({ provider_name: 'Old Merchant' }); // activating b deactivates a
    assert.equal(methods.find(m => m.id === a.id).is_active, 0);
    assert.equal(b.is_active, 1);

    const active = await psvc.getActiveMethods();
    assert.equal(active.length, 1);
    assert.equal(active[0].method, 'merchant');
    assert.equal(active[0].provider_name, 'Old Merchant');
});

test('user can create a deposit using Merchant — details snapshotted at submission', async () => {
    seed();
    const m = await setupActiveMerchant();

    const dep = await wsvc.createDepositRequest(USER_ID, {
        amount: 500,
        method: 'Merchant',
        trx_id: 'TRXUSER01',
        screenshot_url: '/uploads/deposits/user.png',
        payment_method_id: m.id,
    });

    assert.equal(dep.method, 'Merchant');
    assert.equal(dep.payment_method_id, m.id);
    assert.equal(dep.merchant_provider_name, 'bKash Merchant');
    assert.equal(dep.merchant_account_number, '01811002233');
    assert.equal(dep.merchant_instructions, 'Send money as Personal, then submit TrxID.');
    assert.equal(dep.merchant_instruction_image_url, '/uploads/deposits/instructions.png');
    assert.equal(dep.status, 'Pending');

    const stored = deposits.find(d => d.trx_id === 'TRXUSER01');
    assert.ok(stored, 'deposit persisted');
    assert.equal(stored.user_id, USER_ID);
});

test('provider can create a deposit using Merchant — same capability as users', async () => {
    seed();
    const m = await setupActiveMerchant({ provider_name: 'Rocket Merchant', account_number: '998877' });

    const dep = await wsvc.createDepositRequest(PROVIDER_ID, {
        amount: 1200.5,
        method: 'Merchant',
        trx_id: 'TRXPROV01',
        screenshot_url: '/uploads/deposits/provider.png',
        payment_method_id: m.id,
    });

    assert.equal(dep.user_id, PROVIDER_ID);
    assert.equal(dep.method, 'Merchant');
    assert.equal(dep.merchant_provider_name, 'Rocket Merchant');
    assert.equal(dep.merchant_account_number, '998877');
});

test('historical deposit retains the merchant number used at submission even after admin changes it', async () => {
    seed();
    const m = await setupActiveMerchant(); // number 01811002233

    await wsvc.createDepositRequest(USER_ID, {
        amount: 100, method: 'Merchant', trx_id: 'TRXOLD01',
        screenshot_url: '/uploads/deposits/a.png', payment_method_id: m.id,
    });

    // Admin changes the merchant configuration afterwards
    await psvc.updateMethod(m.id, {
        account_number: '01777000999',
        provider_name: 'bKash Merchant Renamed',
        instructions: 'New instructions',
    });

    await wsvc.createDepositRequest(USER_ID, {
        amount: 200, method: 'Merchant', trx_id: 'TRXNEW01',
        screenshot_url: '/uploads/deposits/b.png', payment_method_id: m.id,
    });

    const oldDep = deposits.find(d => d.trx_id === 'TRXOLD01');
    const newDep = deposits.find(d => d.trx_id === 'TRXNEW01');

    assert.equal(oldDep.merchant_account_number, '01811002233', 'old deposit keeps original number');
    assert.equal(oldDep.merchant_provider_name, 'bKash Merchant');
    assert.equal(newDep.merchant_account_number, '01777000999', 'new deposit uses updated number');
    assert.equal(newDep.merchant_provider_name, 'bKash Merchant Renamed');
});

test('inactive merchant cannot receive new deposits', async () => {
    seed();
    const m = await setupActiveMerchant();
    await psvc.toggleMethod(m.id, false);

    await assert.rejects(
        () => wsvc.createDepositRequest(USER_ID, {
            amount: 300, method: 'Merchant', trx_id: 'TRXOFF01',
            screenshot_url: '/uploads/deposits/c.png', payment_method_id: m.id,
        }),
        /no longer available/
    );
    assert.equal(deposits.length, 0);
});

test('missing or invalid payment_method_id is rejected for Merchant deposits', async () => {
    seed();
    await setupActiveMerchant();

    await assert.rejects(
        () => wsvc.createDepositRequest(USER_ID, {
            amount: 300, method: 'Merchant', trx_id: 'TRXNOID',
            screenshot_url: '/uploads/deposits/d.png',
        }),
        /valid payment method selection/
    );

    await assert.rejects(
        () => wsvc.createDepositRequest(USER_ID, {
            amount: 300, method: 'Merchant', trx_id: 'TRXBADID',
            screenshot_url: '/uploads/deposits/e.png', payment_method_id: 'abc',
        }),
        /valid payment method selection/
    );

    await assert.rejects(
        () => wsvc.createDepositRequest(USER_ID, {
            amount: 300, method: 'Merchant', trx_id: 'TRXGHOST',
            screenshot_url: '/uploads/deposits/f.png', payment_method_id: 999,
        }),
        /not found/
    );
    assert.equal(deposits.length, 0);
});

test('existing bKash deposit flow continues to work unchanged', async () => {
    seed();
    const dep = await wsvc.createDepositRequest(PROVIDER_ID, {
        amount: 750,
        method: 'bKash',
        trx_id: 'TRXBKASH1',
        screenshot_url: '/uploads/deposits/bkash.png',
    });

    assert.equal(dep.method, 'bKash');
    assert.equal(dep.payment_method_id, null);
    assert.equal(dep.merchant_account_number, null);
    assert.equal(dep.status, 'Pending');
});

test('duplicate trx_id is still rejected across all methods', async () => {
    seed();
    await wsvc.createDepositRequest(USER_ID, {
        amount: 50, method: 'Nagad', trx_id: 'TRXDUP01', screenshot_url: '',
    });
    await assert.rejects(
        () => wsvc.createDepositRequest(USER_ID, {
            amount: 60, method: 'Nagad', trx_id: 'TRXDUP01', screenshot_url: '',
        }),
        /already exists/
    );
});

// ── Route level: active merchant exposure + admin-only mutations ────────────
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

test('route: active merchant returned to both user and provider; inactive hidden', async () => {
    seed();
    const m1 = await setupActiveMerchant();
    const m2 = await setupActiveMerchant({ provider_name: 'Disabled Merchant' }); // m2 active, m1 deactivated
    await psvc.toggleMethod(m2.id, false);   // both off
    await psvc.toggleMethod(m1.id, true);    // m1 active again — m2 stays inactive

    for (const [id, role] of [[USER_ID, 'user'], [PROVIDER_ID, 'provider']]) {
        const { status, json } = await call('GET', '/api/deposit-methods', { token: sign(id, role) });
        assert.equal(status, 200);
        assert.equal(json.methods.length, 1);
        assert.equal(json.methods[0].method, 'merchant');
        assert.equal(json.methods[0].account_number, '01811002233');
        assert.equal(json.methods[0].instruction_image_url, '/uploads/deposits/instructions.png');
    }
});

test('route: non-admin cannot mutate merchant config (create/update/toggle/delete)', async () => {
    seed();
    const m = await setupActiveMerchant();
    const userTok = sign(USER_ID, 'user');
    const provTok = sign(PROVIDER_ID, 'provider');
    const body = { method: 'merchant', provider_name: 'Hacker Merchant', account_number: '1234567890' };

    assert.equal((await call('POST', '/api/admin/deposit-methods', { token: userTok, body })).status, 403);
    assert.equal((await call('PUT', `/api/admin/deposit-methods/${m.id}`, { token: provTok, body: { account_number: '000000' } })).status, 403);
    assert.equal((await call('PATCH', `/api/admin/deposit-methods/${m.id}/toggle`, { token: userTok, body: { is_active: false } })).status, 403);
    assert.equal((await call('DELETE', `/api/admin/deposit-methods/${m.id}`, { token: userTok })).status, 403);
    assert.equal(methods.find(x => x.id === m.id).is_active, 1, 'merchant untouched');
});
