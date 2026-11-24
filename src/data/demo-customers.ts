import { daysAgo } from "@/lib/date";
import type { AdminCustomer } from "@/types/admin";

const RAW: Array<Omit<AdminCustomer, "notes">> = [
  { id: "cust_1", name: "Maya Thompson", email: "maya.t@example.com", phone: "+501-600-1101", country: "Belize", city: "Belize City", createdAt: daysAgo(80) },
  { id: "cust_2", name: "Jordan Ellis", email: "jordan.ellis@example.com", phone: "+1-305-555-0142", country: "United States", city: "Miami", createdAt: daysAgo(75) },
  { id: "cust_3", name: "Sofia Ramirez", email: "sofia.r@example.com", phone: "+501-600-2218", country: "Belize", city: "San Ignacio", createdAt: daysAgo(70) },
  { id: "cust_4", name: "Chris Patel", email: "chris.patel@example.com", phone: "+1-713-555-0190", country: "United States", city: "Houston", createdAt: daysAgo(68) },
  { id: "cust_5", name: "Aaliyah Grant", email: "aaliyah.g@example.com", phone: "+501-600-3340", country: "Belize", city: "Belmopan", createdAt: daysAgo(65) },
  { id: "cust_6", name: "Noah Brooks", email: "noah.brooks@example.com", phone: "+1-404-555-0177", country: "United States", city: "Atlanta", createdAt: daysAgo(62) },
  { id: "cust_7", name: "Elena Vargas", email: "elena.v@example.com", phone: "+1-213-555-0114", country: "United States", city: "Los Angeles", createdAt: daysAgo(58) },
  { id: "cust_8", name: "Marcus Chin", email: "marcus.chin@example.com", phone: "+501-600-4488", country: "Belize", city: "Orange Walk", createdAt: daysAgo(55) },
  { id: "cust_9", name: "Priya Shah", email: "priya.shah@example.com", phone: "+1-212-555-0166", country: "United States", city: "New York", createdAt: daysAgo(52) },
  { id: "cust_10", name: "Daniel Okoro", email: "daniel.o@example.com", phone: "+1-312-555-0133", country: "United States", city: "Chicago", createdAt: daysAgo(50) },
  { id: "cust_11", name: "Isla Bennett", email: "isla.b@example.com", phone: "+501-600-5599", country: "Belize", city: "Dangriga", createdAt: daysAgo(48) },
  { id: "cust_12", name: "Ethan Cole", email: "ethan.cole@example.com", phone: "+1-512-555-0188", country: "United States", city: "Austin", createdAt: daysAgo(45) },
  { id: "cust_13", name: "Camila Ortiz", email: "camila.o@example.com", phone: "+1-305-555-0121", country: "United States", city: "Coral Gables", createdAt: daysAgo(42) },
  { id: "cust_14", name: "Ryan Castillo", email: "ryan.c@example.com", phone: "+501-600-6670", country: "Belize", city: "Corozal", createdAt: daysAgo(40) },
  { id: "cust_15", name: "Harper Diaz", email: "harper.d@example.com", phone: "+1-702-555-0155", country: "United States", city: "Las Vegas", createdAt: daysAgo(38) },
  { id: "cust_16", name: "Liam Foster", email: "liam.f@example.com", phone: "+1-617-555-0198", country: "United States", city: "Boston", createdAt: daysAgo(36) },
  { id: "cust_17", name: "Nina Flores", email: "nina.f@example.com", phone: "+501-600-7781", country: "Belize", city: "Belize City", createdAt: daysAgo(34) },
  { id: "cust_18", name: "Owen Hartley", email: "owen.h@example.com", phone: "+1-206-555-0144", country: "United States", city: "Seattle", createdAt: daysAgo(32) },
  { id: "cust_19", name: "Zoe Mitchell", email: "zoe.m@example.com", phone: "+1-415-555-0109", country: "United States", city: "San Francisco", createdAt: daysAgo(30) },
  { id: "cust_20", name: "Andre Lopez", email: "andre.l@example.com", phone: "+501-600-8892", country: "Belize", city: "San Pedro", createdAt: daysAgo(28) },
  { id: "cust_21", name: "Grace Kim", email: "grace.kim@example.com", phone: "+1-214-555-0171", country: "United States", city: "Dallas", createdAt: daysAgo(26) },
  { id: "cust_22", name: "Victor Hale", email: "victor.h@example.com", phone: "+1-602-555-0138", country: "United States", city: "Phoenix", createdAt: daysAgo(24) },
  { id: "cust_23", name: "Amara Wells", email: "amara.w@example.com", phone: "+501-600-9903", country: "Belize", city: "Punta Gorda", createdAt: daysAgo(22) },
  { id: "cust_24", name: "Benjamin Cruz", email: "ben.cruz@example.com", phone: "+1-407-555-0160", country: "United States", city: "Orlando", createdAt: daysAgo(20) },
  { id: "cust_25", name: "Chloe Sanders", email: "chloe.s@example.com", phone: "+1-919-555-0127", country: "United States", city: "Raleigh", createdAt: daysAgo(18) },
  { id: "cust_26", name: "Diego Morales", email: "diego.m@example.com", phone: "+501-600-1014", country: "Belize", city: "Belmopan", createdAt: daysAgo(16) },
  { id: "cust_27", name: "Emma Navarro", email: "emma.n@example.com", phone: "+1-858-555-0182", country: "United States", city: "San Diego", createdAt: daysAgo(14) },
  { id: "cust_28", name: "Felix Brown", email: "felix.b@example.com", phone: "+1-303-555-0150", country: "United States", city: "Denver", createdAt: daysAgo(12) },
  { id: "cust_29", name: "Gia Santos", email: "gia.s@example.com", phone: "+501-600-2125", country: "Belize", city: "Belize City", createdAt: daysAgo(10) },
  { id: "cust_30", name: "Henry Quinn", email: "henry.q@example.com", phone: "+1-503-555-0193", country: "United States", city: "Portland", createdAt: daysAgo(8) },
  { id: "cust_31", name: "Ivy Reynolds", email: "ivy.r@example.com", phone: "+1-901-555-0116", country: "United States", city: "Memphis", createdAt: daysAgo(5) },
  { id: "cust_32", name: "Jake Ortega", email: "jake.o@example.com", phone: "+501-600-3236", country: "Belize", city: "San Ignacio", createdAt: daysAgo(2) },
];

export const SEED_CUSTOMERS: AdminCustomer[] = RAW.map((c) => ({
  ...c,
  notes: [],
}));
