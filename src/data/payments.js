// Mock transaction ledger for the Monetization > Payments module.
// Deterministic static data — no Math.random()/Date.now() at module scope.

const RAW_PAYMENTS = [
  { payerName: "Amrapali Estates", payerType: "Developer", amount: 59999, purpose: "Subscription", status: "Success", date: "2026-01-08" },
  { payerName: "Rahul Sharma", payerType: "Agent", amount: 1499, purpose: "Featured Listing", status: "Success", date: "2026-01-14" },
  { payerName: "Ramesh Agarwal", payerType: "Owner", amount: 2999, purpose: "Service", status: "Success", date: "2026-01-22" },
  { payerName: "Horizon Developers", payerType: "Developer", amount: 149999, purpose: "Subscription", status: "Pending", date: "2026-02-03" },
  { payerName: "Kavita Singh", payerType: "Agent", amount: 4999, purpose: "Service", status: "Success", date: "2026-02-11" },
  { payerName: "Suresh Kumar", payerType: "Owner", amount: 1499, purpose: "Featured Listing", status: "Failed", date: "2026-02-18" },
  { payerName: "Prestige Homes Pvt Ltd", payerType: "Developer", amount: 29999, purpose: "Subscription", status: "Success", date: "2026-02-26" },
  { payerName: "Arjun Nair", payerType: "Agent", amount: 2999, purpose: "Subscription", status: "Success", date: "2026-03-05" },
  { payerName: "Meena Deshpande", payerType: "Owner", amount: 999, purpose: "Featured Listing", status: "Success", date: "2026-03-12" },
  { payerName: "Skyline Towers Pvt Ltd", payerType: "Developer", amount: 59999, purpose: "Subscription", status: "Pending", date: "2026-03-20" },
  { payerName: "Sneha Pillai", payerType: "Agent", amount: 3499, purpose: "Service", status: "Success", date: "2026-03-27" },
  { payerName: "Anita Verma", payerType: "Owner", amount: 1999, purpose: "Service", status: "Success", date: "2026-04-04" },
  { payerName: "Heritage Homes Rajasthan", payerType: "Developer", amount: 149999, purpose: "Subscription", status: "Success", date: "2026-04-13" },
  { payerName: "Vikram Mehta", payerType: "Agent", amount: 1499, purpose: "Featured Listing", status: "Failed", date: "2026-04-21" },
  { payerName: "Deepak Joshi", payerType: "Owner", amount: 5999, purpose: "Service", status: "Success", date: "2026-05-02" },
  { payerName: "Coastal Realty", payerType: "Developer", amount: 29999, purpose: "Subscription", status: "Success", date: "2026-05-15" },
  { payerName: "Pooja Iyer", payerType: "Agent", amount: 2999, purpose: "Subscription", status: "Pending", date: "2026-05-29" },
  { payerName: "Sunil Kapoor", payerType: "Owner", amount: 999, purpose: "Featured Listing", status: "Success", date: "2026-06-09" },
  { payerName: "Marina Estates", payerType: "Developer", amount: 59999, purpose: "Subscription", status: "Success", date: "2026-06-21" },
  { payerName: "Nikhil Rao", payerType: "Owner", amount: 3999, purpose: "Service", status: "Success", date: "2026-07-02" },
  { payerName: "Rahul Sharma", payerType: "Agent", amount: 4999, purpose: "Service", status: "Success", date: "2026-07-16" },
  { payerName: "Horizon Developers", payerType: "Developer", amount: 149999, purpose: "Subscription", status: "Success", date: "2026-07-30" },
  { payerName: "Kavita Singh", payerType: "Agent", amount: 1499, purpose: "Featured Listing", status: "Pending", date: "2026-08-10" },
  { payerName: "Prestige Homes Pvt Ltd", payerType: "Developer", amount: 29999, purpose: "Subscription", status: "Success", date: "2026-08-24" },
  { payerName: "Meena Deshpande", payerType: "Owner", amount: 999, purpose: "Featured Listing", status: "Success", date: "2026-09-04" },
  { payerName: "Sneha Pillai", payerType: "Agent", amount: 2999, purpose: "Subscription", status: "Success", date: "2026-09-12" },
];

export const PAYMENTS = RAW_PAYMENTS.map((p, index) => ({
  id: `PAY-${3000 + index}`,
  invoiceId: `INV-2026${String(101 + index).padStart(4, "0")}`,
  ...p,
}));
