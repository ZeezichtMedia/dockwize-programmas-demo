import type { ChatChannel, ChatMessage } from "../types";

export const channels: ChatChannel[] = [
  {
    id: "ch_jp7_general",
    name: "Algemeen",
    type: "cohort",
    cohortId: "c_jp7",
    memberIds: [
      "u_marleen", "u_jeroen", "u_aisha", "u_bram", "u_chantal", "u_finn",
      "u_isabel", "u_omar", "u_sanne", "u_imro", "u_hans", "u_nicola",
    ],
    description: "Alle deelnemers en coaches van Jouw Programma voorjaar 2026.",
    createdAt: "2026-04-08T08:00:00Z",
  },
  {
    id: "ch_jp7_random",
    name: "Random",
    type: "cohort",
    cohortId: "c_jp7",
    memberIds: [
      "u_marleen", "u_jeroen", "u_aisha", "u_bram", "u_chantal", "u_finn",
      "u_isabel", "u_omar", "u_sanne",
    ],
    description: "Off-topic, koffietips, mooie weekends.",
    createdAt: "2026-04-08T08:00:00Z",
  },
  {
    id: "ch_subgroup_horeca",
    name: "Horeca-club",
    type: "subgroup",
    cohortId: "c_jp7",
    memberIds: ["u_chantal", "u_sanne"],
    description: "Chantal en Sanne — beide horeca, sparren wekelijks.",
    createdAt: "2026-04-15T13:00:00Z",
  },
  {
    id: "ch_subgroup_tech",
    name: "Tech founders",
    type: "subgroup",
    cohortId: "c_jp7",
    memberIds: ["u_jeroen", "u_bram", "u_omar"],
    description: "Hardware + SaaS + drones. Wekelijkse sparring op donderdagavond.",
    createdAt: "2026-04-22T19:00:00Z",
  },
  {
    id: "ch_dm_marleen_hans",
    name: "Marleen ↔ Hans",
    type: "direct",
    memberIds: ["u_marleen", "u_hans"],
    createdAt: "2026-04-08T10:00:00Z",
  },
];

export const messages: ChatMessage[] = [
  // Algemeen channel
  {
    id: "m1",
    channelId: "ch_jp7_general",
    authorId: "u_imro",
    content:
      "Welkom allemaal in Jouw Programma voorjaar 2026. Stel jezelf even voor in 2 zinnen. Wie ben je, wat doe je, wat zoek je in dit programma?",
    timestamp: "2026-04-08T09:15:00Z",
    reactions: { "👋": ["u_marleen", "u_jeroen", "u_aisha", "u_bram", "u_chantal"] },
  },
  {
    id: "m2",
    channelId: "ch_jp7_general",
    authorId: "u_marleen",
    content:
      "Marleen — De Werkbrand, helpt mensen hun personal brand zo te bouwen dat hun werk er voor hen werkt. Ik zoek scherpte in mijn aanbod en moed om te kiezen.",
    timestamp: "2026-04-08T09:42:00Z",
    reactions: { "🔥": ["u_chantal", "u_isabel"] },
  },
  {
    id: "m3",
    channelId: "ch_jp7_general",
    authorId: "u_jeroen",
    content:
      "Jeroen, North Sea Lab. Sensoren voor mossel- en oestercultuur. Zoek vooral hulp met commercie — bouwen lukt me wel, verkopen minder.",
    timestamp: "2026-04-08T09:48:00Z",
    reactions: { "🦪": ["u_marleen", "u_bram"] },
  },
  {
    id: "m4",
    channelId: "ch_jp7_general",
    authorId: "u_aisha",
    content:
      "Aisha, Studio Kind. Sustainable kinderkleding made-to-order. Ik wil weten of ik klein wil blijven of echt naar schaal.",
    timestamp: "2026-04-08T10:02:00Z",
  },
  {
    id: "m5",
    channelId: "ch_jp7_general",
    authorId: "u_imro",
    content:
      "Heel mooi om iedereen te lezen. De eerste sessie is volgende dinsdag (15 april), 19:00 in de Brasserie. Bekijk vooraf de welkomstvideo + intake-template in de bibliotheek.",
    timestamp: "2026-04-08T16:00:00Z",
  },
  {
    id: "m6",
    channelId: "ch_jp7_general",
    authorId: "u_chantal",
    content:
      "Iemand die toevallig een goede boekhouder kent voor horeca? Mijn huidige stopt eind van het jaar.",
    timestamp: "2026-04-22T14:30:00Z",
  },
  {
    id: "m7",
    channelId: "ch_jp7_general",
    authorId: "u_sanne",
    content: "Ja! Ik werk met Theo van Bruggen, fijn type, met name horeca. Stuur ik je nu in een DM.",
    timestamp: "2026-04-22T14:34:00Z",
    replyToId: "m6",
    reactions: { "🙏": ["u_chantal"] },
  },
  {
    id: "m8",
    channelId: "ch_jp7_general",
    authorId: "u_hans",
    content:
      "Even een tip: voor de SWOT-opdracht — verzin geen Threats omdat de matrix dat vraagt. Schrijf de drie dingen op waar je 's nachts wakker van ligt. Daar zit je echte SWOT.",
    timestamp: "2026-04-24T08:12:00Z",
    reactions: { "💡": ["u_marleen", "u_jeroen", "u_finn", "u_isabel"], "👀": ["u_bram"] },
  },
  {
    id: "m9",
    channelId: "ch_jp7_general",
    authorId: "u_bram",
    content:
      "Heeft iemand de financieel-model video van vorige week al gekeken? Ik liep vast op de cashflow tab.",
    timestamp: "2026-05-01T19:21:00Z",
  },
  {
    id: "m10",
    channelId: "ch_jp7_general",
    authorId: "u_omar",
    content:
      "Ja gekeken, ik zit op hetzelfde punt. Zullen we donderdag tijdens onze tech-sparring even samen er door heen?",
    timestamp: "2026-05-01T19:35:00Z",
    replyToId: "m9",
    reactions: { "👍": ["u_bram", "u_jeroen"] },
  },
  {
    id: "m11",
    channelId: "ch_jp7_general",
    authorId: "u_isabel",
    content:
      "Toevallig vandaag mijn 50e doelgroep-interview gedaan voor JTBD. Holy moly, je leert pas wat na de 30e. Doorgaan dus.",
    timestamp: "2026-05-04T11:48:00Z",
    reactions: { "🚀": ["u_nicola", "u_aisha", "u_marleen"], "💪": ["u_finn"] },
  },
  {
    id: "m12",
    channelId: "ch_jp7_general",
    authorId: "u_imro",
    content:
      "Reminder: dinsdag 6 mei, 19:00 — sessie 5 in Brasserie PZEM 41. Onderwerp: Pitch Architectuur. Vooraf graag de video van Hans bekijken (zie bibliotheek).",
    timestamp: "2026-05-05T08:00:00Z",
  },
  {
    id: "m13",
    channelId: "ch_jp7_general",
    authorId: "u_finn",
    content: "Ben er. Heb een eerste pitch klaar — feedback meer dan welkom 🙏",
    timestamp: "2026-05-05T08:11:00Z",
    reactions: { "💪": ["u_imro", "u_hans"] },
  },
  // Subgroup horeca
  {
    id: "m20",
    channelId: "ch_subgroup_horeca",
    authorId: "u_chantal",
    content:
      "Sanne, ik liep gisteren tegen iets aan: mijn Mollie-koppeling met Untill werkt scheef bij dagaanbiedingen. Hoe los jij dat op?",
    timestamp: "2026-04-26T09:14:00Z",
  },
  {
    id: "m21",
    channelId: "ch_subgroup_horeca",
    authorId: "u_sanne",
    content:
      "Ah ja die. Ik heb het opgelost door dagaanbiedingen als aparte categorie te taggen — DM ik je vanavond mijn workflow.",
    timestamp: "2026-04-26T09:30:00Z",
    reactions: { "🙌": ["u_chantal"] },
  },
  // Subgroup tech
  {
    id: "m30",
    channelId: "ch_subgroup_tech",
    authorId: "u_jeroen",
    content: "Donderdag 19:00 koffie + cashflow doorploeteren bij mij in de loods?",
    timestamp: "2026-05-02T15:00:00Z",
  },
  {
    id: "m31",
    channelId: "ch_subgroup_tech",
    authorId: "u_bram",
    content: "Ja, ik neem stroopwafels mee.",
    timestamp: "2026-05-02T15:04:00Z",
    reactions: { "🧇": ["u_omar", "u_jeroen"] },
  },
  // DM Marleen ↔ Hans
  {
    id: "m40",
    channelId: "ch_dm_marleen_hans",
    authorId: "u_marleen",
    content:
      "Hans, ik heb je feedback op de SWOT verwerkt. Ik vond je opmerking over leveranciers-afhankelijkheid raak — heb het hele blok opnieuw geschreven.",
    timestamp: "2026-05-03T20:14:00Z",
  },
  {
    id: "m41",
    channelId: "ch_dm_marleen_hans",
    authorId: "u_hans",
    content:
      "Top, ik kijk er morgen naar. Een vraag terug: ben je al begonnen met je doelgroep-interviews?",
    timestamp: "2026-05-04T07:30:00Z",
  },
  {
    id: "m42",
    channelId: "ch_dm_marleen_hans",
    authorId: "u_marleen",
    content: "3 gepland deze week, 2 gehad. Ik mail je vrijdag mijn synthese.",
    timestamp: "2026-05-04T07:42:00Z",
    reactions: { "👍": ["u_hans"] },
  },
];

export const messagesForChannel = (channelId: string) =>
  messages.filter((m) => m.channelId === channelId).sort((a, b) => a.timestamp.localeCompare(b.timestamp));

export const channelsForUser = (userId: string) =>
  channels.filter((c) => c.memberIds.includes(userId));
