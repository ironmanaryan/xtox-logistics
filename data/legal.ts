/**
 * Legal content for XtoX Logistics.
 * Structured so the same reusable `LegalPage` shell can render Terms,
 * Privacy and Refund policies with a consistent table of contents.
 */

import { company } from "./company";

export interface LegalSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  highlight: string;
  description: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
}

export const LEGAL_UPDATED = "18 October 2026";

export const terms: LegalDoc = {
  slug: "/terms",
  title: "Terms &",
  highlight: "Conditions",
  description:
    "The rules that govern every XtoX quote, booking, shipment and partnership — written plainly so you know exactly what to expect.",
  updated: LEGAL_UPDATED,
  intro: [
    "These Terms & Conditions (\u201cTerms\u201d) apply to every enquiry, quotation, booking, shipment and partnership handled by XtoX Logistics (\u201cXtoX\u201d, \u201cwe\u201d, \u201cus\u201d, \u201cour\u201d), whether through this website, phone, WhatsApp or email.",
    "By submitting a form, accepting a quotation, booking a vehicle or engaging any of our services, you (\u201cyou\u201d, \u201ccustomer\u201d, \u201cpartner\u201d) confirm that you have read, understood and accepted these Terms. If you do not agree, please do not use our services.",
  ],
  sections: [
    {
      id: "about",
      heading: "1. About XtoX Logistics",
      paragraphs: [
        "XtoX Logistics is a logistics and freight services provider operating from Bengaluru, Karnataka, India, with a verified fleet-partner and agent network across India and on international trade lanes.",
        "We operate four service lines: Packers & Movers, Import / Export assistance, SME Transport, and Farmer Agri-Export. Our registered office and current contact details are published on our Customer Support page and in the footer of this website.",
      ],
    },
    {
      id: "acceptance",
      heading: "2. Acceptance of these Terms",
      paragraphs: [
        "These Terms take effect the moment you submit an enquiry, request a quote or confirm a booking with us.",
        "A service-specific quotation, work order, service agreement or invoice may contain additional terms. Where such a document conflicts with these Terms, that service-specific document prevails for that engagement.",
        "You confirm that you are at least 18 years old and legally able to enter into a contract on your own behalf or on behalf of the business you represent.",
      ],
    },
    {
      id: "services",
      heading: "3. The services we provide",
      paragraphs: [
        "Packers & Movers — household and office relocation, including packing, loading, transit, unloading and unpacking.",
        "Import / Export — documentation support, customs clearance coordination through licensed brokers, freight booking (FCL, LCL and air) and door-to-door delivery.",
        "SME Transport — on-demand and contracted full-truck (FTL) and part-load (PTL) freight movement within India.",
        "Farmer Agri-Export — farm-gate pickup, cold-chain movement, assistance with APEDA and other government documentation, and buyer-market price intelligence.",
        "We may use verified third parties — fleet owners, licensed customs house agents, carriers, insurers, warehousing and cold-storage providers — to deliver parts of a service. We remain your single point of contact and accountability.",
      ],
    },
    {
      id: "quotes",
      heading: "4. Quotes, estimates and pricing",
      paragraphs: [
        "Estimates shown on our website or in our calculators are indicative and are generated from standard rates, distances and assumptions. They are not a final offer.",
        "A quotation becomes binding only when issued by our team in writing (email, WhatsApp or a service document) and accepted by you.",
        "Final pricing may change after a physical or video survey, or if the actual weight, volume, distance, access conditions, packing needs, fuel prices or government levies differ from the information you provided.",
        "Unless stated otherwise, quoted prices are exclusive of GST and statutory charges. Applicable taxes are shown separately on the invoice.",
      ],
    },
    {
      id: "booking-payment",
      heading: "5. Bookings, advance and payment",
      paragraphs: [
        "Bookings are confirmed only after we acknowledge them and, where applicable, the agreed advance is received.",
        "Packers & Movers moves typically require an advance of 10–20% to block the slot, with the balance payable after delivery and verification of goods. On-demand transport and express bookings may be prepaid or paid on delivery, as indicated at checkout.",
        "Contract (scheduled fleet) engagements are billed weekly or monthly as agreed in writing.",
        "We may charge for waiting, detention, extra distance, extra labour, toll, parking, entry tax and state-permit costs incurred due to conditions at pickup, in transit or at delivery. Such charges are shared with you before they are applied wherever possible.",
        "Invoices are payable within the credit period stated on them. Delayed payments may attract interest at 1.5% per month, or the maximum permitted by law, whichever is lower.",
      ],
    },
    {
      id: "responsibilities",
      heading: "6. Your responsibilities",
      bullets: [
        "Provide accurate and complete information — addresses, landmarks, floor and lift access, goods description, weight, declared value and any special handling needs.",
        "Declare the true nature and value of goods. Undeclared or wrongly declared goods may void insurance and delay clearance.",
        "Arrange packing or allow our crew to pack as agreed. For self-packed goods, we are not responsible for damage caused by inadequate internal packing.",
        "Ensure an authorised person is present at pickup and delivery to hand over and verify goods.",
        "For EXIM shipments, provide documents and permissions on time, and pay applicable duties, taxes and government fees.",
      ],
    },
    {
      id: "prohibited",
      heading: "7. Prohibited and restricted goods",
      paragraphs: [
        "We do not carry contraband, narcotics, explosives, firearms, currency, human remains, or hazardous or flammable materials without correct declaration and lawful documentation, or any goods prohibited by Indian law or the law of a destination country.",
        "Restricted items — including certain chemicals, batteries, perishables, pharmaceuticals and plant or animal products — require prior written approval, correct documentation and compliance with applicable regulations.",
        "If prohibited goods are tendered, we may refuse, hold or report the consignment as required by law, without liability, and you will bear all resulting costs.",
      ],
    },
    {
      id: "insurance",
      heading: "8. Transit insurance and our liability",
      paragraphs: [
        "Transit insurance is optional and available on most services. Where you opt for it, goods are covered up to the declared value on the insurer's policy terms, subject to the deductible and exclusions in that policy.",
        "Where insurance is not purchased, our liability for loss or damage is limited to the amount stated in the applicable quotation or invoice and, in any case, to the extent permitted by the Carriage by Road Act, 2007 and other applicable law.",
        "We are not liable for loss or damage arising from inherent vice, ordinary wear, inadequate customer packing, electrical or mechanical derangement, leakage, or delays caused by events beyond our reasonable control.",
        `Claims must be reported in writing within ${company.legal.claimWindowDays} days of delivery, with the delivery receipt, photographs and a description of the loss or damage.`,
      ],
    },
    {
      id: "delivery",
      heading: "9. Delivery, proof of delivery and claims",
      paragraphs: [
        "Delivery is complete when goods are handed over at the destination and the proof of delivery (POD) or delivery receipt is signed.",
        "You or your representative should inspect the consignment at delivery and note any shortage or damage on the POD at that time. Unnoted damage is difficult to claim later.",
        "Digital PODs, delivery photographs and e-signatures are accepted as valid proof of delivery.",
      ],
    },
    {
      id: "exim",
      heading: "10. Import / Export services",
      paragraphs: [
        "Customs clearance is carried out by licensed customs house agents acting on your behalf. We coordinate, verify and follow up, but final assessment, duty determination and release decisions rest with the customs authorities.",
        "Duties, taxes, demurrage, detention, port storage, examination and any statutory penalties are payable by you unless we have agreed otherwise in writing.",
        "Estimated transit and clearance timelines are indicative and depend on carriers, ports, customs and destination-country rules.",
      ],
    },
    {
      id: "agri",
      heading: "11. Farmer Agri-Export services",
      paragraphs: [
        "Agri support includes guidance and filing assistance for IEC, APEDA RCMC, FSSAI, phytosanitary and related certificates. Government fees are payable by you, and approvals are granted solely by the concerned authority.",
        "Because fresh produce is perishable, cancellations, quality rejections and market-price changes are governed by our Refund & Cancellation Policy and any crop-specific agreement.",
        "Export realizations shown on our website are indicative market references and are not a guaranteed price.",
      ],
    },
    {
      id: "drivers",
      heading: "12. Driver and fleet partners",
      paragraphs: [
        "Driver, fleet-owner and transporter partners are independent contractors and are not employees, agents or partners of XtoX.",
        "Partners must hold valid licences, permits, fitness, insurance and pollution certificates, and must keep vehicles in roadworthy condition.",
        "Load offers, rates and payment cycles are communicated to partners individually. Payment is generally released within 48 hours of a clean POD, subject to verification.",
        "Partners are responsible for the safety of the consignment from pickup to delivery and for complying with all transport and traffic laws.",
      ],
    },
    {
      id: "service-levels",
      heading: "13. Turnaround and service levels",
      paragraphs: [
        "Our standard aim is to respond to enquiries within 2 business hours and to complete document verification for driver partners within 24 hours.",
        "Response, dispatch, transit and customs timelines are good-faith estimates and may vary with weather, traffic, strikes, congestion, inspections, documentation and other operational factors.",
      ],
    },
    {
      id: "ip",
      heading: "14. Intellectual property and website use",
      paragraphs: [
        "The XtoX name, logo, website content, calculators and written material are owned by XtoX Logistics and protected by applicable law. You may not copy, reproduce or reuse them commercially without our written permission.",
        "You agree not to misuse the website, attempt unauthorised access, scrape data, or submit false or misleading information.",
      ],
    },
    {
      id: "privacy",
      heading: "15. Your information and privacy",
      paragraphs: [
        "We collect and use personal information such as your name, phone number, email, addresses and uploaded documents only to deliver and support our services. Our Privacy Policy explains what we collect, why, how long we keep it and your rights.",
        "By using our services you consent to being contacted by call, SMS, email and WhatsApp about your enquiry, bookings and service updates.",
      ],
    },
    {
      id: "third-party",
      heading: "16. Third-party services",
      paragraphs: [
        "Parts of a service may be delivered by third parties such as carriers, customs brokers, warehouses, cold-storage facilities, payment gateways and insurers. Their own terms may also apply to their part of the service.",
      ],
    },
    {
      id: "liability",
      heading: "17. Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, our total liability for any claim arising out of a service is limited to the freight or service charges paid for that specific consignment or engagement.",
        "We are not liable for indirect, incidental, consequential or economic losses, including loss of profit, business or goodwill.",
      ],
    },
    {
      id: "force-majeure",
      heading: "18. Force majeure",
      paragraphs: [
        "We are not responsible for failure or delay caused by events beyond our reasonable control, including natural disasters, floods, epidemics, war, civil unrest, strikes, government action, road closures, accidents, breakdowns or network failures. We will keep you informed and resume service as soon as reasonably possible.",
      ],
    },
    {
      id: "complaints",
      heading: "19. Complaints and grievance redressal",
      paragraphs: [
        "For any complaint or concern, write to xtoxlogistics.info@gmail.com or call +91 78754 88307 with your booking or LR reference.",
        "We aim to acknowledge complaints within 2 business days and resolve them within 15 business days. Unresolved matters may be escalated to our grievance officer, whose details are available on request and on our Customer Support page.",
      ],
    },
    {
      id: "changes",
      heading: "20. Changes to these Terms",
      paragraphs: [
        "We may update these Terms from time to time to reflect changes in our services or the law. The version published on this page at the time of your booking applies. Please review this page periodically.",
      ],
    },
    {
      id: "law",
      heading: "21. Governing law and jurisdiction",
      paragraphs: [
        `These Terms are governed by ${company.legal.governingLaw}. Subject to applicable consumer protections, the courts at ${company.legal.jurisdiction} have exclusive jurisdiction over any dispute.`,
      ],
    },
    {
      id: "contact",
      heading: "22. Contact us",
      paragraphs: [
        "XtoX Logistics — Head Office: BMTC Complex, Outer Ring Road, Old Madiwala, Kuvempu Nagar, BTM Layout 2nd Stage, Bengaluru, Karnataka 560068, India.",
        "Phone: +91 78754 88307 · Email: xtoxlogistics.info@gmail.com · Support hours: Monday–Sunday, 8 AM – 10 PM.",
      ],
    },
  ],
};

export const privacy: LegalDoc = {
  slug: "/privacy",
  title: "Privacy",
  highlight: "Policy",
  description:
    "What we collect, why we collect it, who we share it with, and the control you have over your information.",
  updated: LEGAL_UPDATED,
  intro: [
    "This Privacy Policy explains how XtoX Logistics (\u201cXtoX\u201d, \u201cwe\u201d, \u201cus\u201d) collects, uses, shares, stores and protects your personal information when you use our website, forms, phone, WhatsApp or services.",
    "We follow the Digital Personal Data Protection Act, 2023 and other applicable Indian laws. By using our services you agree to this policy.",
  ],
  sections: [
    {
      id: "collect",
      heading: "1. Information we collect",
      bullets: [
        "Contact details — name, phone number, email address and company name.",
        "Service details — pickup and delivery addresses, route, dates, goods description, weight, value and special instructions.",
        "Documents you upload — invoices, packing lists, bills of lading, IEC, GST, Aadhaar / PAN / land records and similar papers you choose to share.",
        "Account details — if you create an account, your login email and the bookings linked to it.",
        "Payment and billing details — invoice details and, where applicable, transaction references received from our payment partners.",
        "Technical data — device type, browser, IP address and pages visited, collected through standard server logs and cookies.",
        "Communication — messages, chat transcripts and call notes relating to your enquiry or booking.",
      ],
    },
    {
      id: "use",
      heading: "2. How we use your information",
      bullets: [
        "Prepare quotes and deliver the services you request.",
        "Coordinate pickup, transit, delivery and proof of delivery.",
        "Prepare and file documents and coordinate customs clearance.",
        "Assign drivers and provide shipment tracking.",
        "Process payments and issue invoices.",
        "Provide customer support and resolve complaints.",
        "Improve our website, calculators and services.",
        "Comply with legal, tax and regulatory obligations.",
        "Send service updates and relevant offers, with an easy way to opt out.",
      ],
    },
    {
      id: "consent",
      heading: "3. Consent and legal basis",
      paragraphs: [
        "We process your information with your consent — given when you submit a form, upload documents or contact us — and to perform the service you request.",
        "You may withdraw consent at any time by contacting us. Withdrawal does not affect processing already carried out and may limit our ability to continue a service.",
      ],
    },
    {
      id: "sharing",
      heading: "4. Who we share information with",
      bullets: [
        "Fleet partners and drivers assigned to your shipment.",
        "Licensed customs house agents and carriers.",
        "Warehousing and cold-storage providers.",
        "Insurers, where you opt for transit insurance.",
        "Payment gateways and banks for processing payments.",
        "IT, hosting and communication service providers who support our systems.",
        "Professional advisers such as auditors and legal counsel.",
        "Government or law-enforcement authorities where required by law.",
      ],
      paragraphs: [
        "We do not sell your personal information. We share only what is necessary for the relevant purpose.",
      ],
    },
    {
      id: "documents",
      heading: "5. Documents and sensitive information",
      paragraphs: [
        "Documents you upload are used solely to deliver the requested service, such as customs filing or verification. They are stored securely and shared only with the partner who needs them.",
        "Please share only the documents that are required. You are responsible for having the authority to share them.",
      ],
    },
    {
      id: "cookies",
      heading: "6. Cookies and local storage",
      paragraphs: [
        "Our website uses essential cookies and browser local storage to keep the site working — for example, remembering a quote you started so you do not have to retype it.",
        "We do not use cookies for advertising. You can clear cookies or use your browser's private mode at any time; some features may then behave differently.",
      ],
    },
    {
      id: "retention",
      heading: "7. How long we keep your information",
      paragraphs: [
        "We keep booking and shipment records, invoices and supporting documents for as long as needed to provide the service and to meet legal, tax and accounting requirements — generally up to 8 years.",
        "Chat messages and general enquiries are retained for a shorter, reasonable period. Documents are deleted or anonymised once they are no longer required.",
      ],
    },
    {
      id: "security",
      heading: "8. How we protect your information",
      paragraphs: [
        "We use reasonable technical and organisational safeguards, including access controls, encrypted connections and restricted internal access, to protect your information.",
        "No method of transmission or storage is completely secure, so please avoid sharing sensitive information through unverified channels.",
      ],
    },
    {
      id: "rights",
      heading: "9. Your rights",
      bullets: [
        "Access the information we hold about you.",
        "Request correction of inaccurate details.",
        "Request deletion where we are not required to keep it.",
        "Withdraw consent at any time.",
        "Raise a grievance with our grievance officer.",
      ],
      paragraphs: [
        "To exercise any of these rights, contact us using the details below. We may need to verify your identity first.",
      ],
    },
    {
      id: "children",
      heading: "10. Children's privacy",
      paragraphs: [
        "Our services are meant for adults. We do not knowingly collect information from anyone under 18. If you believe a minor has shared information with us, contact us and we will delete it.",
      ],
    },
    {
      id: "transfers",
      heading: "11. Transfers of information",
      paragraphs: [
        "Some of our partners may process information on servers located outside India. Where information is transferred, we take reasonable steps to ensure it remains protected in line with applicable law.",
      ],
    },
    {
      id: "changes",
      heading: "12. Changes to this policy",
      paragraphs: [
        "We may update this policy to reflect changes in our practices or the law. The latest version is always published on this page.",
      ],
    },
    {
      id: "contact",
      heading: "13. Contact and grievance officer",
      paragraphs: [
        "Data and grievance queries: email xtoxlogistics.info@gmail.com or call +91 78754 88307.",
        "Head Office: BMTC Complex, Outer Ring Road, Old Madiwala, Kuvempu Nagar, BTM Layout 2nd Stage, Bengaluru, Karnataka 560068, India.",
      ],
    },
  ],
};

export const refund: LegalDoc = {
  slug: "/refund-policy",
  title: "Refund &",
  highlight: "Cancellation",
  description:
    "How cancellations, rescheduling and refunds work across our services — what is refundable, what is not, and how long a refund takes.",
  updated: LEGAL_UPDATED,
  intro: [
    "This policy explains how cancellations and refunds work for services booked with XtoX Logistics. It should be read together with our Terms & Conditions.",
    "The amounts and timelines below are our standard practice. Any different terms agreed in writing on a quotation or work order will apply to that booking.",
  ],
  sections: [
    {
      id: "overview",
      heading: "1. Our approach",
      paragraphs: [
        "We keep our cancellation terms simple: cancel early and most of your money comes back; cancel late and only genuine, already-incurred costs are deducted.",
      ],
    },
    {
      id: "movers",
      heading: "2. Cancellations by you — Packers & Movers",
      bullets: [
        "Cancelled before the survey, or more than 72 hours before the move date — full refund of any advance, less actual bank or payment-gateway charges.",
        "Cancelled 24–72 hours before the move date — refund of the advance, less any survey and slot-blocking costs already incurred.",
        "Cancelled within 24 hours of the scheduled move, or after packing or loading has begun — the advance may be retained, and work already performed plus mobilisation costs become payable.",
        "If goods are already in transit, cancellation is treated as a return delivery at extra cost; the return leg is chargeable.",
      ],
    },
    {
      id: "by-xtox",
      heading: "3. Cancellations by XtoX",
      paragraphs: [
        "If we are unable to perform a confirmed move for reasons within our control, we will offer a reschedule at no extra cost or refund the amount paid for the unperformed part of the service.",
      ],
    },
    {
      id: "reschedule",
      heading: "4. Rescheduling",
      paragraphs: [
        "You can reschedule a move or booking at no extra charge if you tell us at least 48 hours before the scheduled slot, subject to availability. Later reschedules may attract a small slot-change fee where a vehicle or crew was already committed.",
      ],
    },
    {
      id: "transport",
      heading: "5. SME Transport and Express bookings",
      bullets: [
        "Cancel before a vehicle is assigned — full refund.",
        "Cancel after a vehicle or driver has been assigned or has started moving towards pickup — a cancellation charge covering the distance and time already committed applies.",
        "Once a trip has started, no refund is available for the completed portion; unused optional add-ons are refunded.",
      ],
    },
    {
      id: "exim",
      heading: "6. Import / Export services",
      bullets: [
        "Government fees, customs duty, port charges, demurrage, detention, examination, freight and carrier cancellation charges are payable by you and are non-refundable once incurred.",
        "Our service fees may be refundable on a pro-rata basis for work not yet performed if you cancel in writing before documentation is filed.",
        "Freight cancellations follow the concerned shipping line, airline or carrier's cancellation rules.",
      ],
    },
    {
      id: "agri",
      heading: "7. Farmer Agri-Export services",
      bullets: [
        "Because fresh produce is perishable, cancellation terms depend on the crop and the stage of the shipment. Cancellations before collection or pre-cooling are generally refundable, less costs incurred.",
        "After harvest, grading, packing or cold-chain movement has begun, or once a booking with a buyer or carrier is confirmed, the costs already incurred are non-refundable.",
        "If a shipment is rejected or delayed by authorities, quality or force majeure, we help you salvage, re-route or re-market the produce, and refunds are assessed case by case.",
      ],
    },
    {
      id: "non-refundable",
      heading: "8. Charges that are generally non-refundable",
      bullets: [
        "Government and statutory fees.",
        "Customs duty, port, demurrage and detention charges.",
        "Paid surveys.",
        "Third-party carrier, warehousing and cold-storage charges once incurred.",
        "Insurance premiums.",
        "Payment-gateway or bank charges.",
      ],
    },
    {
      id: "timeline",
      heading: "9. How refunds are processed",
      paragraphs: [
        "Approved refunds are initiated within 5–7 business days of approval.",
        "Refunds are made to the original payment method. Depending on your bank or payment provider, the amount may take a further 5–10 business days to reflect.",
        "Where the original method is unavailable, we may issue a bank transfer or a service credit, as agreed with you.",
      ],
    },
    {
      id: "request",
      heading: "10. How to request a cancellation or refund",
      paragraphs: [
        "Contact us with your booking or LR reference: email xtoxlogistics.info@gmail.com or call / WhatsApp +91 78754 88307.",
        "We will confirm the applicable deduction, if any, and the expected refund timeline in writing.",
      ],
    },
    {
      id: "disputes",
      heading: "11. Disputes and chargebacks",
      paragraphs: [
        "If you disagree with a deduction, write to us first and we will review it in good faith. Raising a chargeback before contacting us may delay resolution.",
      ],
    },
    {
      id: "contact",
      heading: "12. Contact us",
      paragraphs: [
        "Questions about this policy? Reach our support desk, Monday–Sunday, 8 AM – 10 PM: xtoxlogistics.info@gmail.com · +91 78754 88307.",
      ],
    },
  ],
};

export const legalDocs: LegalDoc[] = [terms, privacy, refund];
