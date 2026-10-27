// Fake data for `yarn start:mock`. Everything here is invented; no real members.
const DAY = 86400000;
const now = () => Date.now();

const member = (id, firstname, lastname, extra = {}) => ({
  id,
  firstname,
  lastname,
  email: `${firstname}.${lastname}@example.com`.toLowerCase(),
  role: 'member',
  status: 'activeMember',
  memberContractOnFile: true,
  subscription: false,
  expirationTime: now() + 200 * DAY,
  address: { street: '12 Main St', city: 'Manchester', state: 'NH', postalCode: '03101' },
  ...extra,
});

// Sign in as admin@example.com for the staff view; any other email is a regular member.
const personas = {
  member: member('member1', 'Test', 'Member', { email: 'member@example.com', subscription: true }),
  admin: member('admin1', 'Alex', 'Admin', {
    email: 'admin@example.com', role: 'admin', isAdmin: true, subscription: true,
  }),
};

const members = [
  personas.member,
  personas.admin,
  member('m3', 'Jordan', 'Lee'),
  member('m4', 'Sam', 'Rivera', { status: 'expired', expirationTime: now() - 20 * DAY }),
  member('m5', 'Casey', 'Nguyen', { status: 'pending', expirationTime: null, memberContractOnFile: false }),
  member('m6', 'Morgan', 'Patel', { subscription: true }),
  member('m7', 'Riley', 'Brooks'),
  member('m8', 'Taylor', 'Kim', { expirationTime: now() + 12 * DAY }),
];

const invoices = [
  { id: 'inv1', name: 'Orientation membership dues', memberId: 'member1', memberName: 'Test Member', resourceClass: 'member', dueDate: now() - DAY, pastDue: true, amount: '65.00', settled: false, subscriptionId: null },
  { id: 'inv2', name: 'Locker rental', memberId: 'member1', memberName: 'Test Member', resourceClass: 'rental', dueDate: now() + 9 * DAY, pastDue: false, amount: '15.00', settled: false, subscriptionId: null },
  { id: 'inv3', name: 'Monthly membership', memberId: 'm3', memberName: 'Jordan Lee', resourceClass: 'member', dueDate: now() - 6 * DAY, pastDue: true, amount: '65.00', settled: false, subscriptionId: 'sub1' },
  { id: 'inv4', name: 'Monthly membership', memberId: 'm6', memberName: 'Morgan Patel', resourceClass: 'member', dueDate: now() + 3 * DAY, pastDue: false, amount: '65.00', settled: false, subscriptionId: 'sub2' },
];

const rentals = [
  { id: 'rental1', memberId: 'member1', memberName: 'Test Member', number: 'L-14', description: 'Locker', status: 'active', contractOnFile: true, expiration: now() + 40 * DAY },
  { id: 'rental2', memberId: 'm3', memberName: 'Jordan Lee', number: 'B-3', description: 'Workbench', status: 'active', contractOnFile: true, expiration: now() + 90 * DAY },
  { id: 'rental3', memberId: 'm6', memberName: 'Morgan Patel', number: 'S-2', description: 'Studio space', status: 'pending_agreement', contractOnFile: false, expiration: now() + 30 * DAY },
];

const checkout = { id: '0123456789abcdef01234567', name: 'Orientation', shopName: 'Facilities', requestorAnnotation: 'Bring your photo ID. Meet the team near the front door.' };

const home = (who) => ({
  member: who,
  slack: { accepted: false, newMembersChannelUrl: null },
  availableCheckouts: [checkout],
  availableVolunteerOpportunities: [
    { id: 't1', kind: 'task', name: 'Organize shared supplies', description: 'Sort the storage bins and label supplies.', credits: 1, shopName: 'Woodshop' },
    { id: 'e1', kind: 'event', name: 'Help at the community open house', description: 'Welcome visitors and demo projects.', credits: 2, date: now() + 14 * DAY },
  ],
});

module.exports = { personas, members, invoices, rentals, home };
