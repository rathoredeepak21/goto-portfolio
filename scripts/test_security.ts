import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxjmpwiiibqwkxscdsjh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4am1wd2lpaWJxd2t4c2Nkc2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwOTM2ODksImV4cCI6MjEwNjY2OTY4OX0.qVH3R4pv8fAvgxsxSCba22YJe54CSkBeiUvdxdZERtU';

const anonClient = createClient(supabaseUrl, supabaseKey);

async function runSecurityTests() {
  console.log('==============================================');
  console.log('RUNNING SUPABASE SECURITY & RLS AUDIT TESTS');
  console.log('==============================================');

  // Test 1: Logged-out user -> SELECT public portfolio data
  const { data: projects, error: pSelectErr } = await anonClient.from('projects').select('id, title').limit(3);
  console.log('1. Logged-out SELECT projects:', pSelectErr ? `FAILED: ${pSelectErr.message}` : `ALLOWED (count: ${projects?.length})`);

  const { data: techs, error: tSelectErr } = await anonClient.from('technologies').select('id, name').limit(3);
  console.log('   Logged-out SELECT technologies:', tSelectErr ? `FAILED: ${tSelectErr.message}` : `ALLOWED (count: ${techs?.length})`);

  // Test 2: Logged-out user -> Contact message submission
  const testMsgId = `test-msg-${Date.now()}`;
  const { error: msgInsertErr } = await anonClient.from('contact_messages').insert({
    id: testMsgId,
    name: 'Auditor',
    email: 'auditor@example.com',
    message: 'Test public inquiry',
  });
  console.log('2. Public INSERT contact_messages:', msgInsertErr ? `DENIED: ${msgInsertErr.message}` : 'ALLOWED (Intended for contact form)');

  // Test 3: Logged-out user -> Attempt to read contact messages (Should be private/admin only)
  const { data: messages, error: msgSelectErr } = await anonClient.from('contact_messages').select('*');
  console.log('3. Logged-out SELECT contact_messages:', msgSelectErr ? `DENIED: ${msgSelectErr.message}` : `Result count: ${messages?.length}`);

  // Test 4: Logged-out user -> Attempt unauthorized INSERT into profiles with admin role
  const { error: profileHackErr } = await anonClient.from('profiles').insert({
    id: 'hacker-uuid',
    email: 'hacker@bad.com',
    role: 'admin',
  });
  console.log('4. Logged-out INSERT into profiles (Privilege escalation attempt):', profileHackErr ? `DENIED (${profileHackErr.message})` : 'FAILED: Insertion succeeded!');

  // Test 5: Check Supabase Auth endpoint response on invalid credentials
  const { data: badAuth, error: badAuthErr } = await anonClient.auth.signInWithPassword({
    email: 'nonexistent-admin@gotop.dev',
    password: 'wrong-password',
  });
  console.log('5. Supabase Auth with invalid credentials:', badAuthErr ? `REJECTED (${badAuthErr.message})` : 'FAILED: Accepted invalid credentials');

  console.log('==============================================');
  console.log('AUDIT COMPLETE');
  console.log('==============================================');
}

runSecurityTests();
