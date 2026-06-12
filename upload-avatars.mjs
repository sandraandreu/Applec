import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { readFileSync } from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyAJeY-8kNLS46E2kIZ-RdJqiuIzyU4GGVQ",
  authDomain: "applec-965f4.firebaseapp.com",
  projectId: "applec-965f4",
  storageBucket: "applec-965f4.firebasestorage.app",
  messagingSenderId: "188523165760",
  appId: "1:188523165760:web:d5c57cd2e3ff6293f407a5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const D = 'c:/Users/sandr/Downloads';

const assignments = [
  {
    firstName: 'Vicent', lastName: 'Ferrer Navarro',
    image: `${D}/retrato-al-aire-libre-del-hombre-de-años-99625593.webp`,
    contentType: 'image/webp',
  },
  {
    firstName: 'Josep Antoni', lastName: 'Blasco Pérez',
    image: `${D}/depositphotos_74896235-stock-photo-backpacker-man-taking-selfie-on.jpg`,
    contentType: 'image/jpeg',
  },
  {
    firstName: 'Miquel Àngel', lastName: 'Vercher Llopis',
    image: `${D}/people-travel-adventure-concept-attractive-young-bearded-adventurer-wearing-backpack-cap-taking-selfie_273609-1860.jpg`,
    contentType: 'image/jpeg',
  },
  {
    firstName: 'Raül', lastName: 'Monzó Pérez',
    image: `${D}/premium_photo-1679769911227-429b4e1b184b.avif`,
    contentType: 'image/avif',
  },
  {
    firstName: 'Amparo', lastName: 'Tortosa Gil',
    image: `${D}/retrato-mujer-madura-atractiva-feliz-al-aire-libre_74855-19369.avif`,
    contentType: 'image/avif',
  },
  {
    firstName: 'Laia', lastName: 'Calatayud Martí',
    image: `${D}/retrato-mujer-joven-sonriente-tomando-selfie-parque_23-2148027178.avif`,
    contentType: 'image/avif',
  },
  {
    firstName: 'Carmen', lastName: 'Soriano Blasco',
    image: `${D}/feliz-mujer-joven-atractiva-ama-casa-sentada-sofa-mirando-camara-casa-moderna-acogedora-sonriendo-soltera-mujer-veinte-anos-rostro-hermoso-tomando-selfie-sola-disfrutando-bienestar-posando-retrato_516988-4957.avif`,
    contentType: 'image/avif',
  },
  {
    firstName: 'Consuelo', lastName: 'Martí Soler',
    image: `${D}/mujer-emocionada-alegre-caminando-parque_1262-20515.avif`,
    contentType: 'image/avif',
  },
  {
    firstName: 'Dolors', lastName: 'Pons Aparici',
    image: `${D}/alegre-hermosa-mujer-pelo-negro-pie-parque-ciudad-sonriendo-senora-disfrutando-tiempo-libre-al-aire-libre-verano-primer-plano-vista-frontal-concepto-retrato-femenino_74855-12894.avif`,
    contentType: 'image/avif',
  },
];

const [,, email, password] = process.argv;
if (!email || !password) {
  console.error('Uso: node upload-avatars.mjs email password');
  process.exit(1);
}

const { user } = await signInWithEmailAndPassword(auth, email, password);
const myUID = user.uid;
console.log('Login correcto\n');

const groupsSnap = await getDocs(collection(db, 'groups'));
const groupDoc = groupsSnap.docs[0];
const groupId = groupDoc.id;
const members = groupDoc.data().members;
console.log(`Grupo: "${groupDoc.data().name}" — ${members.length} miembros\n`);

let updatedMembers = [...members];

for (const a of assignments) {
  const member = members.find(m => m.firstName === a.firstName && m.lastName === a.lastName);

  if (!member) {
    console.log(`⚠  No encontrado: ${a.firstName} ${a.lastName}`);
    continue;
  }

  process.stdout.write(`Subiendo foto de ${a.firstName} ${a.lastName}... `);

  const buffer = readFileSync(a.image);
  const isFake = member.uid.startsWith('fake-uid');

  // Siempre subimos al path del admin (único path donde tenemos permiso garantizado)
  const storageRef = ref(storage, `users/${myUID}/member-avatars/${member.uid}`);
  await uploadBytes(storageRef, buffer, { contentType: a.contentType });
  const photoUrl = await getDownloadURL(storageRef);

  updatedMembers = updatedMembers.map(m => m.uid === member.uid ? { ...m, photoUrl } : m);

  console.log('✓');
}

await updateDoc(doc(db, 'groups', groupId), { members: updatedMembers });
console.log('\nGrupo actualizado. Listo!');

process.exit(0);
