const P = {
  carmenOrtega:  "https://firebasestorage.googleapis.com/v0/b/applec-965f4.firebasestorage.app/o/users%2F9VAuCpPdslThktGiGQ6c03KEjas2%2Favatar?alt=media&token=38180db5-162b-43ec-a3d9-95c94190b8dd",
  vicent:        "https://firebasestorage.googleapis.com/v0/b/applec-965f4.firebasestorage.app/o/users%2F9VAuCpPdslThktGiGQ6c03KEjas2%2Fmember-avatars%2Ffake-uid-vicent?alt=media&token=5058028f-39ce-462a-bc2c-3a175a3e8fd5",
  amparo:        "https://firebasestorage.googleapis.com/v0/b/applec-965f4.firebasestorage.app/o/users%2F9VAuCpPdslThktGiGQ6c03KEjas2%2Fmember-avatars%2Ffake-uid-amparo?alt=media&token=255d959b-a2cc-44b5-9346-25f465f636e4",
  josepAntoni:   "https://firebasestorage.googleapis.com/v0/b/applec-965f4.firebasestorage.app/o/users%2F9VAuCpPdslThktGiGQ6c03KEjas2%2Fmember-avatars%2Ffake-uid-josepantoni?alt=media&token=31da8994-1c31-40b3-aa20-574c13890f63",
  laia:          "https://firebasestorage.googleapis.com/v0/b/applec-965f4.firebasestorage.app/o/users%2F9VAuCpPdslThktGiGQ6c03KEjas2%2Fmember-avatars%2Ffake-uid-laia?alt=media&token=0e812acf-adda-4ecf-9238-5b1496f302c5",
  raul:          "https://firebasestorage.googleapis.com/v0/b/applec-965f4.firebasestorage.app/o/users%2F9VAuCpPdslThktGiGQ6c03KEjas2%2Fmember-avatars%2Ffake-uid-raul?alt=media&token=b5bed521-0380-46fc-9f15-f058c1caa0d4",
  consuelo:      "https://firebasestorage.googleapis.com/v0/b/applec-965f4.firebasestorage.app/o/users%2F9VAuCpPdslThktGiGQ6c03KEjas2%2Fmember-avatars%2Ffake-uid-consuelo?alt=media&token=7a25485f-6554-484a-a5e9-730250536ce6",
  miquel:        "https://firebasestorage.googleapis.com/v0/b/applec-965f4.firebasestorage.app/o/users%2F9VAuCpPdslThktGiGQ6c03KEjas2%2Fmember-avatars%2Ffake-uid-miquel?alt=media&token=6e65ddfc-34eb-437b-8b8a-74b7f8fd6bba",
  dolors:        "https://firebasestorage.googleapis.com/v0/b/applec-965f4.firebasestorage.app/o/users%2F9VAuCpPdslThktGiGQ6c03KEjas2%2Fmember-avatars%2Ffake-uid-dolors?alt=media&token=9f0d824f-558a-4f27-a25f-eb6611c69146",
  carmenSoriano: "https://firebasestorage.googleapis.com/v0/b/applec-965f4.firebasestorage.app/o/users%2F9VAuCpPdslThktGiGQ6c03KEjas2%2Fmember-avatars%2FeLZ9TmMefMacxb9W0uyY47plzWB3?alt=media&token=f97cd103-6f0d-4f4b-a218-9397f7390fae",
};

export interface FeedComment {
  id: string;
  author: { firstName: string; lastName: string; role: "admin" | "organizer" | "member"; photoUrl?: string };
  timeAgo: string;
  text: string;
  likesCount: number;
}

export interface FeedLinkedEvent {
  name: string;
  day: string;
  month: string;
  location: string;
  time: string;
}

export interface FeedPostData {
  id: string;
  author: { firstName: string; lastName: string; role: "admin" | "organizer" | "member"; photoUrl?: string };
  timeAgo: string;
  text: string;
  imageUrl: string | null;
  linkedEvent: FeedLinkedEvent | null;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  comments: FeedComment[];
}

export const FEED_POSTS: FeedPostData[] = [
  {
    id: "post-1",
    author: { firstName: "Laia", lastName: "Calatayud Martí", role: "organizer", photoUrl: P.laia },
    timeAgo: "Hace 3h",
    text: "Qué cena más bonita anoche 🥂 No faltó nadie y la paella estaba de 10. ¡Esto es la Falla!",
    imageUrl: "/assets/feed/sopar.png",
    linkedEvent: { name: "Sopar de Benvinguda", day: "15", month: "MAR", location: "Local social de la falla", time: "21:00" },
    likesCount: 14,
    commentsCount: 3,
    likedByMe: true,
    comments: [
      { id: "c1-1", author: { firstName: "Laura", lastName: "Ortega", role: "admin", photoUrl: P.carmenOrtega }, timeAgo: "Hace 2h", text: "Quina cena tan guapa! M'ho vaig passar genial amb tots vosaltres ❤️", likesCount: 4 },
      { id: "c1-2", author: { firstName: "Raül", lastName: "Monzó Pérez", role: "member", photoUrl: P.raul }, timeAgo: "Hace 3h", text: "La paella estava boníssima! Repetim prompte 😋", likesCount: 2 },
      { id: "c1-3", author: { firstName: "Amparo", lastName: "Tortosa Gil", role: "member", photoUrl: P.amparo }, timeAgo: "Hace 3h", text: "¡Fue una noche increíble! Muchas gracias a todos por venir 🙌", likesCount: 3 },
    ],
  },
  {
    id: "post-2",
    author: { firstName: "Josep Antoni", lastName: "Blasco", role: "organizer", photoUrl: P.josepAntoni },
    timeAgo: "Hace 6h",
    text: "Quina nit! No me'n puc oblidar 🥹 Va ser perfecte de principi a fi. Gràcies a tots els que vau venir!",
    imageUrl: "/assets/feed/assaig.png",
    linkedEvent: { name: "Sopar de Benvinguda", day: "15", month: "MAR", location: "Local social de la falla", time: "21:00" },
    likesCount: 9,
    commentsCount: 2,
    likedByMe: false,
    comments: [
      { id: "c2-1", author: { firstName: "Consuelo", lastName: "Martí Soler", role: "member", photoUrl: P.consuelo }, timeAgo: "Hace 5h", text: "Ja ho crec! Va ser una nit per no oblidar 🎉", likesCount: 2 },
      { id: "c2-2", author: { firstName: "Vicent", lastName: "Ferrer", role: "admin", photoUrl: P.vicent }, timeAgo: "Hace 5h", text: "Molt bé organitzat! Bravo als organitzadors 👏", likesCount: 5 },
    ],
  },
  {
    id: "post-3",
    author: { firstName: "Consuelo", lastName: "Martí Soler", role: "member", photoUrl: P.consuelo },
    timeAgo: "Ayer",
    text: "Primera vegada que porte la indumentària completa i estic plorant 😭❤️ Vos espere a tots a la processó!",
    imageUrl: "/assets/feed/indumentaria.png",
    linkedEvent: null,
    likesCount: 22,
    commentsCount: 3,
    likedByMe: true,
    comments: [
      { id: "c3-1", author: { firstName: "Laura", lastName: "Ortega", role: "admin", photoUrl: P.carmenOrtega }, timeAgo: "Ayer", text: "Estàs preciosa! Queda molt bé la indumentària ❤️", likesCount: 6 },
      { id: "c3-2", author: { firstName: "Laia", lastName: "Calatayud Martí", role: "organizer", photoUrl: P.laia }, timeAgo: "Ayer", text: "Quina monada! 😍 T'esperem a la processó!", likesCount: 3 },
      { id: "c3-3", author: { firstName: "Carmen", lastName: "Soriano Blasco", role: "member", photoUrl: P.carmenSoriano }, timeAgo: "Ayer", text: "Increïble! La primera vegada sempre és especial 🥹", likesCount: 4 },
    ],
  },
  {
    id: "post-4",
    author: { firstName: "Carmen", lastName: "Soriano Blasco", role: "member", photoUrl: P.carmenSoriano },
    timeAgo: "Hace 2 días",
    text: "La millor nit de l'any 🔥😍 Fins l'any que ve!",
    imageUrl: "/assets/feed/crema.png",
    linkedEvent: null,
    likesCount: 31,
    commentsCount: 4,
    likedByMe: true,
    comments: [
      { id: "c4-1", author: { firstName: "Vicent", lastName: "Ferrer", role: "admin", photoUrl: P.vicent }, timeAgo: "Hace 2 días", text: "La cremà és màgia pura. Fins l'any que ve! 🔥", likesCount: 7 },
      { id: "c4-2", author: { firstName: "Miquel Àngel", lastName: "Vercher Llopis", role: "member", photoUrl: P.miquel }, timeAgo: "Hace 2 días", text: "Quina foto! Captura perfecta del moment 📸", likesCount: 4 },
      { id: "c4-3", author: { firstName: "Dolors", lastName: "Pons Aparici", role: "member", photoUrl: P.dolors }, timeAgo: "Hace 2 días", text: "¡Qué emoción siempre! Se me pone la piel de gallina 🥹", likesCount: 3 },
      { id: "c4-4", author: { firstName: "Raül", lastName: "Monzó Pérez", role: "member", photoUrl: P.raul }, timeAgo: "Hace 2 días", text: "Fins l'any que ve! Ja contem els dies 🙌", likesCount: 2 },
    ],
  },
  {
    id: "post-5",
    author: { firstName: "Raül", lastName: "Monzó Pérez", role: "member", photoUrl: P.raul },
    timeAgo: "Hace 2 días",
    text: "Ya tengo las entradas para el sopar. ¿Quién más viene? ¡Apuntaos antes de que se cierre! 🎉",
    imageUrl: null,
    linkedEvent: null,
    likesCount: 7,
    commentsCount: 3,
    likedByMe: false,
    comments: [
      { id: "c5-1", author: { firstName: "Amparo", lastName: "Tortosa Gil", role: "member", photoUrl: P.amparo }, timeAgo: "Hace 2 días", text: "¡Yo también tengo las mías! Nos vemos allí 🥂", likesCount: 1 },
      { id: "c5-2", author: { firstName: "Carmen", lastName: "Soriano Blasco", role: "member", photoUrl: P.carmenSoriano }, timeAgo: "Hace 2 días", text: "¡Me apunto! Ya tengo ganas 🎉", likesCount: 2 },
      { id: "c5-3", author: { firstName: "Consuelo", lastName: "Martí Soler", role: "member", photoUrl: P.consuelo }, timeAgo: "Hace 2 días", text: "Jo també! Ens veiem allí 🙌", likesCount: 1 },
    ],
  },
  {
    id: "post-6",
    author: { firstName: "Miquel Àngel", lastName: "Vercher Llopis", role: "member", photoUrl: P.miquel },
    timeAgo: "Hace 3 días",
    text: "Quina passada l'excursió! El castell de Xàtiva és una meravella 🏰 Hem d'anar-hi tots junts l'any que ve",
    imageUrl: "/assets/feed/excursio.png",
    linkedEvent: { name: "Excursió a Xàtiva", day: "25", month: "ABR", location: "Estació del Nord, València", time: "09:00" },
    likesCount: 18,
    commentsCount: 3,
    likedByMe: true,
    comments: [
      { id: "c6-1", author: { firstName: "Josep Antoni", lastName: "Blasco", role: "organizer", photoUrl: P.josepAntoni }, timeAgo: "Hace 3 días", text: "Quina excursió més bonica! Repetim l'any que ve 🏰", likesCount: 3 },
      { id: "c6-2", author: { firstName: "Dolors", lastName: "Pons Aparici", role: "member", photoUrl: P.dolors }, timeAgo: "Hace 3 días", text: "¡Fue una excursión increíble! El castillo es espectacular 😍", likesCount: 4 },
      { id: "c6-3", author: { firstName: "Laura", lastName: "Ortega", role: "admin", photoUrl: P.carmenOrtega }, timeAgo: "Hace 3 días", text: "Molt bona foto! Bon equip 📸❤️", likesCount: 5 },
    ],
  },
  {
    id: "post-7",
    author: { firstName: "Dolors", lastName: "Pons Aparici", role: "member", photoUrl: P.dolors },
    timeAgo: "Hace 3 días",
    text: "¡Menuda excursión! Xàtiva es preciosa y la compañía inmejorable 🙌 Muchas gracias a los organizadores por planificarlo tan bien",
    imageUrl: null,
    linkedEvent: { name: "Excursió a Xàtiva", day: "25", month: "ABR", location: "Estació del Nord, València", time: "09:00" },
    likesCount: 12,
    commentsCount: 2,
    likedByMe: false,
    comments: [
      { id: "c7-1", author: { firstName: "Laia", lastName: "Calatayud Martí", role: "organizer", photoUrl: P.laia }, timeAgo: "Hace 3 días", text: "Gràcies a tots per venir! Va ser un plaer 😊", likesCount: 3 },
      { id: "c7-2", author: { firstName: "Amparo", lastName: "Tortosa Gil", role: "member", photoUrl: P.amparo }, timeAgo: "Hace 3 días", text: "¡La mejor excursión del año! 🏰✨", likesCount: 2 },
    ],
  },
  {
    id: "post-8",
    author: { firstName: "Vicent", lastName: "Ferrer", role: "admin", photoUrl: P.vicent },
    timeAgo: "Hace 4 días",
    text: "La falla d'enguany és una obra d'art 🔥 Enhorabona a tots els artistes fallers i a tots vosaltres per fer-ho possible. Sou increïbles! 👏",
    imageUrl: null,
    linkedEvent: null,
    likesCount: 27,
    commentsCount: 3,
    likedByMe: false,
    comments: [
      { id: "c8-1", author: { firstName: "Laura", lastName: "Ortega", role: "admin", photoUrl: P.carmenOrtega }, timeAgo: "Hace 4 días", text: "Totalment d'acord! Enguany s'han superat 👏🔥", likesCount: 6 },
      { id: "c8-2", author: { firstName: "Laia", lastName: "Calatayud Martí", role: "organizer", photoUrl: P.laia }, timeAgo: "Hace 4 días", text: "¡Qué orgullo de falla! 😭❤️", likesCount: 4 },
      { id: "c8-3", author: { firstName: "Raül", lastName: "Monzó Pérez", role: "member", photoUrl: P.raul }, timeAgo: "Hace 4 días", text: "Increïble feina la dels artistes! 👏👏", likesCount: 3 },
    ],
  },
];
