export type Scheme = {
  id: string;
  title: string;
  agency: string;
  description: string;
  link?: string;
};

export const SCHEMES: Scheme[] = [
  {
    id: "kisan-card",
    title: "Kisan Card (Punjab)",
    agency: "Government of Punjab",
    description:
      "Interest-free credit for small farmers to buy certified seed, fertilizer and pesticides from authorised dealers. Registered farmers get a magnetic-strip card linked to their land record.",
    link: "https://kisaancard.punjab.gov.pk/",
  },
  {
    id: "green-tractor",
    title: "Green Tractor Scheme",
    agency: "Government of Punjab",
    description:
      "Subsidised tractors (up to Rs. 1 million rebate) allocated through a computerised balloting system for farmers holding 12.5 to 50 acres.",
  },
  {
    id: "solar-tubewell",
    title: "Solar Tubewell Subsidy",
    agency: "Ministry of National Food Security",
    description:
      "Up to 60% subsidy on solar photovoltaic systems for agricultural tubewells to cut diesel and electricity costs.",
  },
  {
    id: "livestock-insurance",
    title: "Livestock Insurance Scheme",
    agency: "SBP / Provincial Govts",
    description:
      "Mandatory insurance cover on livestock loans up to Rs. 5 lakh, premium borne by the government for small farmers.",
  },
  {
    id: "wheat-support",
    title: "Wheat Support Price",
    agency: "Federal Cabinet / PASSCO",
    description:
      "Annual minimum support price for wheat procurement; farmers can sell to PASSCO / provincial food departments at declared rates.",
  },
  {
    id: "benazir-hari",
    title: "Benazir Hari Card (Sindh)",
    agency: "Government of Sindh",
    description:
      "Direct input subsidy for tenant farmers via a debit card usable at approved agri-input shops.",
  },
];
