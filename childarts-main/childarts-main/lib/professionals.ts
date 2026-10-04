/*
 * DEMO PROFESSIONAL PROFILES
 * --------------------------------------------------------------------------
 * The 10 profiles below are FICTIONAL placeholders for the prototype UI.
 * They are not real people, and no phone numbers or clinic addresses are given.
 * Before any real use, replace them with professionals you have verified
 * (e.g. SLMC registration for doctors, professional body membership for
 * psychologists) and who have agreed to be listed.
 *
 * The SUPPORT_SERVICES list contains real Sri Lankan public services
 * (numbers checked October 2026 against official websites).
 */

export type Professional = {
  id: string
  name: string
  role: string
  focus: string[]
  district: string
  languages: string[]
  mode: string
}

export const DEMO_PROFESSIONALS: Professional[] = [
  { id: "p01", name: "Dr. Demo Profile A", role: "Consultant Child & Adolescent Psychiatrist", focus: ["Anxiety", "Behaviour"], district: "Colombo", languages: ["Sinhala", "English"], mode: "In person / Online" },
  { id: "p02", name: "Ms. Demo Profile B", role: "Clinical Child Psychologist", focus: ["Play therapy", "Early childhood"], district: "Gampaha", languages: ["Sinhala", "English"], mode: "In person" },
  { id: "p03", name: "Dr. Demo Profile C", role: "Developmental Paediatrician", focus: ["Development", "Sleep"], district: "Kandy", languages: ["Sinhala", "English"], mode: "In person" },
  { id: "p04", name: "Mr. Demo Profile D", role: "Child Counsellor", focus: ["Grief", "Family change"], district: "Jaffna", languages: ["Tamil", "English"], mode: "In person / Online" },
  { id: "p05", name: "Dr. Demo Profile E", role: "Consultant Psychiatrist (Child services)", focus: ["Trauma-informed care"], district: "Galle", languages: ["Sinhala", "English"], mode: "In person" },
  { id: "p06", name: "Ms. Demo Profile F", role: "Educational Psychologist", focus: ["School stress", "Learning"], district: "Kurunegala", languages: ["Sinhala", "English"], mode: "Online" },
  { id: "p07", name: "Ms. Demo Profile G", role: "Art Therapist", focus: ["Art therapy", "Emotional expression"], district: "Colombo", languages: ["English", "Tamil"], mode: "In person" },
  { id: "p08", name: "Dr. Demo Profile H", role: "Paediatrician", focus: ["General child health", "Referral"], district: "Batticaloa", languages: ["Tamil", "Sinhala"], mode: "In person" },
  { id: "p09", name: "Mr. Demo Profile I", role: "Clinical Psychologist", focus: ["Anxiety", "Parent guidance"], district: "Matara", languages: ["Sinhala"], mode: "Online" },
  { id: "p10", name: "Ms. Demo Profile J", role: "Child Protection Social Worker", focus: ["Safeguarding", "Family support"], district: "Anuradhapura", languages: ["Sinhala", "Tamil"], mode: "In person" },
]

export type SupportService = {
  name: string
  phone: string
  tel: string
  description: string
  hours: string
  source: string
}

export const SUPPORT_SERVICES: SupportService[] = [
  {
    name: "1929 Child Helpline – National Child Protection Authority",
    phone: "1929",
    tel: "1929",
    description: "Report or get advice about child abuse or a child at risk. Sinhala, Tamil and English.",
    hours: "24/7 · free",
    source: "https://childprotection.gov.lk/en/what-we-do/1929-call-centre-helpline",
  },
  {
    name: "1926 National Mental Health Helpline – NIMH",
    phone: "1926",
    tel: "1926",
    description: "Mental health advice and guidance from the National Institute of Mental Health.",
    hours: "See NIMH website",
    source: "https://nimh.health.gov.lk/en/1926-national-mental-health-helpline/",
  },
  {
    name: "Lady Ridgeway Hospital for Children – Child & Adolescent Psychiatry",
    phone: "+94 11 269 3711",
    tel: "+94112693711",
    description: "Government children's hospital in Colombo with a child and adolescent psychiatry service.",
    hours: "Hospital switchboard",
    source: "https://lrh.health.gov.lk/departments4/specialist-services-2/",
  },
  {
    name: "Sri Lanka Sumithrayo",
    phone: "+94 11 268 2535",
    tel: "+94112682535",
    description: "Confidential emotional support for anyone in distress.",
    hours: "Mon–Fri, 9:00–17:00",
    source: "https://befrienders.org/find-support-now/sri-lanka-sumithrayo/",
  },
  {
    name: "Emergency – Police",
    phone: "119",
    tel: "119",
    description: "If a child is in immediate danger.",
    hours: "24/7",
    source: "",
  },
  {
    name: "Emergency – Suwa Seriya Ambulance",
    phone: "1990",
    tel: "1990",
    description: "Free emergency ambulance service.",
    hours: "24/7 · free",
    source: "",
  },
]

/** Fisher–Yates shuffle, returns the first n items. */
export function pickRandom<T>(items: T[], n: number): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, n)
}
