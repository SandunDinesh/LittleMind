/*
 * CHILD MENTAL-HEALTH PROFESSIONALS (Sri Lanka)
 * --------------------------------------------------------------------------
 * Compiled by the researcher from public hospital, university and directory
 * listings (October 2026). Listed for information only: LittleMind is not
 * affiliated with these professionals and they have not reviewed this tool.
 * Contact details can change - always confirm through the hospital or the
 * official channel. Before any public deployment, confirm that each person
 * agrees to be listed.
 *
 * type: "psychiatrist" = child & adolescent psychiatry (medical doctor)
 *       "paediatrician" = child development (medical doctor)
 *       "psychologist"  = psychologist / counsellor
 *       "development"   = child development & education specialist
 */

export type ExpertType = "psychiatrist" | "paediatrician" | "psychologist" | "development"

export type Professional = {
  id: string
  name: string
  role: string
  focus: string
  institution: string
  district: string
  type: ExpertType
  contact: string          // shown as text
  tel?: string             // for a tel: link
  email?: string           // for a mailto: link
  whatsapp?: string        // for a wa.me link (digits only)
}

export const TYPE_LABEL: Record<ExpertType, string> = {
  psychiatrist: "Child & adolescent psychiatrist",
  paediatrician: "Paediatrician",
  psychologist: "Psychologist / counsellor",
  development: "Child development specialist",
}

const LRH = "+94112693711"
const NIMH = "+94112578234"

export const PROFESSIONALS: Professional[] = [
  { id: "e01", name: "Dr. Swarna Wijethunga", role: "Consultant Child Psychiatrist", focus: "Child & adolescent mental health; developmental, emotional and behavioural disorders", institution: "Lady Ridgeway Hospital for Children", district: "Colombo", type: "psychiatrist", contact: "+94 11 269 3711 / 269 3712", tel: LRH },
  { id: "e02", name: "Dr. Apeksha Hewageegana", role: "Consultant Child & Adolescent Psychiatrist", focus: "Emotional, behavioural and developmental problems", institution: "Lady Ridgeway Hospital for Children", district: "Colombo", type: "psychiatrist", contact: "Hospital: +94 11 269 3711", tel: LRH },
  { id: "e03", name: "Dr. Dulangi Dahanayake", role: "Consultant Child & Adolescent Psychiatrist", focus: "Child mental health; developmental and behavioural disorders", institution: "Lady Ridgeway Hospital for Children", district: "Colombo", type: "psychiatrist", contact: "Hospital: +94 11 269 3711", tel: LRH },
  { id: "e04", name: "Prof. Miyuru Chandradasa", role: "Professor; Child & Adolescent Psychiatrist (MBBS, MRCPsych, MD Psychiatry)", focus: "Child and adolescent psychiatry, adolescent mental health, research", institution: "University of Kelaniya / Colombo North Teaching Hospital", district: "Gampaha", type: "psychiatrist", contact: "Through the University of Kelaniya" },
  { id: "e05", name: "Dr. Udena Attygalle", role: "Consultant Child & Adolescent Psychiatrist", focus: "Child and adolescent psychiatry", institution: "Colombo South Teaching Hospital, Kalubowila", district: "Colombo", type: "psychiatrist", contact: "Through the hospital / Ministry of Health" },
  { id: "e06", name: "Dr. Darshani Hettiarachchi", role: "Child & Adolescent Psychiatrist", focus: "Child and adolescent mental health", institution: "Teaching Hospital Karapitiya", district: "Galle", type: "psychiatrist", contact: "Through the hospital" },
  { id: "e07", name: "Dr. Rasitha Perera", role: "Child & Adolescent Psychiatrist", focus: "Child mental health", institution: "Sirimavo Bandaranaike Memorial Children's Hospital, Peradeniya", district: "Kandy", type: "psychiatrist", contact: "Through the hospital" },
  { id: "e08", name: "Dr. Anuradha Herath", role: "Child & Adolescent Psychiatrist", focus: "Child and adolescent mental health", institution: "Teaching Hospital Anuradhapura", district: "Anuradhapura", type: "psychiatrist", contact: "Through the hospital" },
  { id: "e09", name: "Dr. Wajantha Kotalawala", role: "Psychiatrist, child & adolescent psychiatry service", focus: "Child and adolescent mental health", institution: "National Institute of Mental Health, Angoda", district: "Colombo", type: "psychiatrist", contact: "NIMH: +94 11 257 8234", tel: NIMH },
  { id: "e10", name: "Dr. Senani Wijetunge", role: "Acting Child & Adolescent Psychiatrist", focus: "Child and adolescent psychiatry", institution: "National Institute of Mental Health, Angoda", district: "Colombo", type: "psychiatrist", contact: "NIMH: +94 11 257 8234", tel: NIMH },
  { id: "e11", name: "Dr. Ruwangi Dissanayake", role: "Consultant Paediatrician", focus: "Child development and developmental assessment", institution: "Lady Ridgeway Hospital for Children", district: "Colombo", type: "paediatrician", contact: "+94 11 269 3711 / 269 3712", tel: LRH },
  { id: "e12", name: "Dr. Kalharie N. Pitigala", role: "Psychologist (PhD Psychology; MSc Clinical & Health Psychology)", focus: "Counselling, child and adolescent psychology", institution: "Visiting Consultant, Asiri Medical Hospitals / IMH", district: "Colombo", type: "psychologist", contact: "IMH: imh.colombo.sl@gmail.com", email: "imh.colombo.sl@gmail.com" },
  { id: "e13", name: "Ms. Pathmasri Sivalingam", role: "Clinical Psychologist (BSc Psychology; MPhil Clinical Psychology)", focus: "Children and adolescents; stress, anxiety, trauma, behaviour", institution: "SLIIT / clinical services", district: "Colombo", type: "psychologist", contact: "pathmasri.s@sliit.lk", email: "pathmasri.s@sliit.lk" },
  { id: "e14", name: "Ms. Vimala Periyannanpillai", role: "Chartered Psychologist", focus: "Children, adolescents and families; behaviour, anxiety", institution: "Colombo / online", district: "Colombo", type: "psychologist", contact: "Through TherapyRoute" },
  { id: "e15", name: "Dr. Chandrika Ismail", role: "Psychologist", focus: "Children and adolescents; emotional, behavioural and developmental challenges; learning difficulties; assessments", institution: "Colombo", district: "Colombo", type: "psychologist", contact: "WhatsApp +94 77 717 6867 / Call +94 77 810 0003", tel: "+94778100003", whatsapp: "94777176867" },
  { id: "e16", name: "Mrs. Privini Sandanayake, PhD", role: "Licensed Psychologist", focus: "Adolescents, assessment, abuse, life transitions", institution: "Colombo", district: "Colombo", type: "psychologist", contact: "+94 77 551 0937", tel: "+94775510937" },
  { id: "e17", name: "Dr. Wazeer Latiff", role: "Certified Psychologist", focus: "Adolescent psychological issues, assessment", institution: "Colombo", district: "Colombo", type: "psychologist", contact: "Through TherapyRoute" },
  { id: "e18", name: "Dr. Nilmi Kotuwelle", role: "Counselling Psychologist / Licensed Addiction Counselor", focus: "Children, adolescents, trauma, severe stress", institution: "Nirvana Psychological Counseling Center", district: "Colombo", type: "psychologist", contact: "Through the Nirvana centre" },
  { id: "e19", name: "Ms. Iresha Kariyawasam", role: "Counselling Psychologist", focus: "Counselling, psychotherapy, family and child-related work", institution: "Colombo", district: "Colombo", type: "psychologist", contact: "Through TherapyRoute" },
  { id: "e20", name: "Prof. Sir Romesh Jayasinghe", role: "Counselling Psychologist / Psychotherapist (PhD Applied Psychology)", focus: "Children, adolescents and families; psychological assessment and intervention", institution: "Colombo", district: "Colombo", type: "psychologist", contact: "Through professional profile" },
  { id: "e21", name: "Dr. Shanika Anthony", role: "Clinical / Health & Child Psychologist", focus: "Child psychology, clinical and health psychology", institution: "Colombo", district: "Colombo", type: "psychologist", contact: "Through the hospital / institution" },
  { id: "e22", name: "Prof. Hemamali Perera", role: "Child Psychiatrist", focus: "Child and adolescent psychiatry", institution: "Colombo", district: "Colombo", type: "psychiatrist", contact: "Through the hospital" },
  { id: "e23", name: "Dr. Sudarshi Seneviratne", role: "Consultant Child & Adolescent Psychiatrist", focus: "Child and emotional development; creative activities and colouring in child development", institution: "Colombo", district: "Colombo", type: "psychiatrist", contact: "Institutional / private channel" },
  { id: "e24", name: "Dr. Ajay Jeyaseelan", role: "Psychological Counsellor (MBBS, MCGP)", focus: "Family, psychological and counselling issues", institution: "IMH Sri Lanka", district: "Colombo", type: "psychologist", contact: "IMH: imh.colombo.sl@gmail.com", email: "imh.colombo.sl@gmail.com" },
  { id: "e25", name: "Ms. Maya Dissanayake", role: "Child Development & Child Education Specialist (MSc)", focus: "Child development and education", institution: "IMH Sri Lanka", district: "Colombo", type: "development", contact: "IMH: imh.colombo.sl@gmail.com", email: "imh.colombo.sl@gmail.com" },
]

/** Shown after a High result: child & adolescent psychiatrists that have a direct hospital phone line. */
export const HIGH_RESULT_EXPERTS = PROFESSIONALS.filter((p) => ["e01", "e02", "e09"].includes(p.id))

/** Shown with every High result (frontend only). */
export const SAFETY_MESSAGE =
  "LittleMind is a research screening tool, not a diagnosis. A drawing alone cannot show whether a child is stressed, " +
  "unwell or unsafe. If you are worried, talk to a qualified professional. If a child is in danger, call 1929 or 119 now."

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
