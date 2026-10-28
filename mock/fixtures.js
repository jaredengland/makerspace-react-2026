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

const shopTools = [
  { id: 't-saw', name: 'Table saw', wikiUrl: '', disabled: false, reservable: true, prerequisiteIds: [], prerequisiteNames: [], unmetPrerequisiteIds: [], unmetPrerequisiteNames: [], checkoutRequestable: true, reservationAvailable: true, description: 'Cabinet saw with a riving knife.', locationName: 'Woodshop' },
  { id: 't-lathe', name: 'Wood lathe', wikiUrl: '', disabled: false, reservable: false, prerequisiteIds: [], prerequisiteNames: [], unmetPrerequisiteIds: [], unmetPrerequisiteNames: [], checkoutRequestable: true, reservationAvailable: false, locationName: 'Woodshop' },
  { id: 't-laser', name: 'Laser cutter', wikiUrl: '', disabled: false, reservable: true, prerequisiteIds: [], prerequisiteNames: [], unmetPrerequisiteIds: [], unmetPrerequisiteNames: [], checkoutRequestable: true, reservationAvailable: true, locationName: 'Electronics' },
];
const shop = (id, name, tools) => ({
  id, name, wikiUrl: '', slackChannel: name.toLowerCase(), disabled: false, reservable: true,
  reservationsAvailable: true, resourceManagersWikiUrl: '', resourceManagers: [{ id: 'm3', name: 'Jordan Lee' }],
  upcomingVolunteerEvents: [], volunteerTasks: [], canAddTool: false, canCreateVolunteerTask: false,
  isShopManager: false, tools,
});
const workshops = { canAddShop: false, workshops: [shop('s-wood', 'Woodshop', shopTools.slice(0, 2)), shop('s-elec', 'Electronics', shopTools.slice(2))] };

const catalogShop = (w) => ({
  id: w.id, name: w.name, wikiUrl: '', slackChannel: w.slackChannel, disabled: false, toolCount: w.tools.length,
  reservable: true, maxConcurrentReservations: 2, reservationHorizonDays: 30, maxReservationDurationHours: 4,
  reservationRequiresApproval: false, reservationPrerequisiteToolIds: [],
});
const reservationCatalog = {
  toolGroups: [],
  shops: workshops.workshops.map(catalogShop),
  tools: shopTools.map((t, i) => ({ ...t, shopId: i < 2 ? 's-wood' : 's-elec' })),
};

const fixCatalog = {
  shops: [{ id: 's-wood', name: 'Woodshop' }, { id: 's-elec', name: 'Electronics' }],
  tools: [{ id: 't-saw', name: 'Table saw', shopId: 's-wood', outOfService: false }, { id: 't-laser', name: 'Laser cutter', shopId: 's-elec', outOfService: false }],
  canCreate: true, openCount: 1, openLimit: null, centralSlackEnabled: false, assignees: [], creationUnavailableReason: null,
};
const fixTickets = [{
  id: 'fix1', title: 'Blade guard is loose', description: 'The blade guard rattles at high speed.', category: 'broken',
  status: 'open', confirmation: 'unverified', priority: 2, submittedPriority: 2, shopId: 's-wood', shopName: 'Woodshop',
  toolId: 't-saw', toolName: 'Table saw', outOfService: false, publicReadOnly: false, iBrokeIt: false, iCanFixIt: false,
  assignees: [], announceToSlack: false, announcementNote: '', revision: 1,
  createdAt: new Date(now() - 2 * DAY).toISOString(), updatedAt: new Date(now() - DAY).toISOString(),
  capabilities: {}, reporter: { id: 'm3', name: 'Jordan Lee' },
}];

const systemConfig = {
  checkout: { checkout_expiration_notice_days: 14, can_manage: true },
  flags: { slack_sync_enabled: false, slack_profile_sync_enabled: false, volunteer_bounty_token_enabled: false, require_totp_admin: false, require_totp_board: false, require_totp_rm: false, signup_lockout_enabled: false },
  jobs: [{ key: 'card_expiration_check', task: 'Card expiration check', last_run_at: new Date(now() - DAY).toISOString(), last_run_status: 'success' }],
  slack: { slack_channel_treasurer: '', slack_channel_rm: '', slack_channel_admin: '', slack_channel_logs: '', slack_channel_tickets: '', slack_channel_new_members: '', volunteer_pending_slack_channel: '', channel_cache: { available: false, total_channels: null, last_updated_at: null } },
  volunteer: { volunteer_credits_per_discount: '10', volunteer_max_discounts_per_year: '12', volunteer_discount_id: '', volunteer_task_max_credit: '5', ticket_bounty_max_credit: '5', volunteer_bounty_token: '', volunteer_rolling_days: '30', volunteer_leaderboard_top: '10' },
  totp: { require_totp_admin: false, require_totp_board: false, require_totp_rm: false },
  reservation: { reservation_token: '' },
  job_schedule: { channel_cache_refresh_day: '1', card_expiration_check_day: '1', garbage_collect_day: '1' },
};

module.exports = { personas, members, invoices, rentals, home, workshops, reservationCatalog, fixCatalog, fixTickets, systemConfig };
