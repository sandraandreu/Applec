import { useState } from "react";
import { doc, updateDoc, addDoc, setDoc, getDocs, getDoc, deleteDoc, collection, deleteField } from "firebase/firestore";
import { db } from "../../plugins/firebase";
import { useAuthContext } from "../../context/auth/AuthContext";

const SeedPage = () => {
  const { user, profile } = useAuthContext();
  const [status, setStatus]       = useState<"idle" | "loading" | "done" | "error">("idle");
  const [memberStatus, setMemberStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSeed = async () => {
    if (!user || !profile?.groupId) return;

    const groupId = profile.groupId;
    const adminUid = user.uid;

    setStatus("loading");

    try {
      // Limpieza previa
      await updateDoc(doc(db, "users", adminUid), { linkedMembers: deleteField() });

      const linkedMembersSnap = await getDocs(collection(db, "groups", groupId, "linkedMembers"));
      for (const linkedDoc of linkedMembersSnap.docs) {
        await deleteDoc(linkedDoc.ref);
      }

      const eventsSnap = await getDocs(collection(db, "groups", groupId, "events"));
      for (const eventDoc of eventsSnap.docs) {
        const attendancesSnap = await getDocs(collection(db, "groups", groupId, "events", eventDoc.id, "attendances"));
        for (const attendanceDoc of attendancesSnap.docs) {
          await deleteDoc(attendanceDoc.ref);
        }
        await deleteDoc(eventDoc.ref);
      }

      const fakeMembers = [
        { uid: "fake-uid-vicent",      role: "organizer", firstName: "Vicent",       lastName: "Ferrer Navarro",  email: "vicent.ferrer@demo.com" },
        { uid: "fake-uid-amparo",      role: "organizer", firstName: "Amparo",       lastName: "Tortosa Gil",     email: "amparo.tortosa@demo.com" },
        { uid: "fake-uid-josepantoni", role: "member",    firstName: "Josep Antoni", lastName: "Blasco Pérez",    email: "josepantoni.blasco@demo.com" },
        { uid: "fake-uid-laia",        role: "member",    firstName: "Laia",         lastName: "Calatayud Martí", email: "laia.calatayud@demo.com" },
        { uid: "fake-uid-raul",        role: "member",    firstName: "Raül",         lastName: "Monzó Pérez",     email: "raul.monzo@demo.com" },
        { uid: "fake-uid-consuelo",    role: "member",    firstName: "Consuelo",     lastName: "Martí Soler",     email: "consuelo.marti@demo.com" },
        { uid: "fake-uid-ferran",      role: "member",    firstName: "Ferran",       lastName: "Català Romeu",    email: "ferran.catala@demo.com" },
        { uid: "fake-uid-miquel",      role: "member",    firstName: "Miquel Àngel", lastName: "Vercher Llopis",  email: "miquel.vercher@demo.com" },
        { uid: "fake-uid-dolors",      role: "member",    firstName: "Dolors",       lastName: "Pons Aparici",    email: "dolors.pons@demo.com" },
      ];

      const groupSnap = await getDoc(doc(db, "groups", groupId));
      const currentMembers = (groupSnap.data()?.members ?? []) as { uid: string }[];
      const realMembers = currentMembers.filter(
        m => m.uid !== adminUid && !m.uid.startsWith("fake-uid-")
      );

      await updateDoc(doc(db, "groups", groupId), {
        members: [
          {
            uid: adminUid,
            role: "admin",
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email ?? "",
          },
          ...fakeMembers,
          ...realMembers,
        ],
      });


      await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Plantà",
        date: new Date(2027, 2, 14),
        startTime: "18:00",
        location: "Carrer de la Pau, 12, València",
        requiresConfirmation: false,
        sendReminder: false,
        isSpecial: true,
        description: "Plantà de la falla. Tots a ajudar!",
      });

      await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Cremà",
        date: new Date(2027, 2, 19),
        startTime: "23:00",
        location: "Carrer de la Pau, 12, València",
        requiresConfirmation: false,
        sendReminder: false,
        isSpecial: true,
        description: "La nit de la cremà. El moment més emotiu de les falles.",
      });

      const reunioRef = await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Reunió de Junta",
        date: new Date(2026, 5, 25),
        startTime: "20:00",
        location: "Local social de la falla",
        requiresConfirmation: true,
        sendReminder: true,
        confirmationDeadline: new Date(2026, 5, 22),
      });

      const missaRef = await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Missa Fallera",
        date: new Date(2026, 6, 10),
        startTime: "12:00",
        location: "Parròquia de Sant Esteve, València",
        requiresConfirmation: true,
        sendReminder: true,
        confirmationDeadline: new Date(2026, 6, 5),
        description: "Missa en honor a la nostra fallera major.",
      });

      const soparRef = await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Sopar de Germandat",
        date: new Date(2026, 5, 28),
        startTime: "21:00",
        endTime: "00:00",
        location: "Restaurant El Molí, Picanya",
        requiresConfirmation: true,
        sendReminder: true,
        confirmationDeadline: new Date(2026, 5, 20),
        description: "Sopar anual de germandat de la falla. Places limitades!",
      });

      const assembleaRef = await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Assemblea General",
        date: new Date(2026, 6, 5),
        startTime: "19:30",
        location: "Local social de la falla",
        requiresConfirmation: true,
        sendReminder: true,
        confirmationDeadline: new Date(2026, 6, 1),
      });

      await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Paella Popular",
        date: new Date(2026, 6, 12),
        startTime: "14:00",
        endTime: "17:00",
        location: "Plaça Major, Torrent",
        requiresConfirmation: false,
        sendReminder: false,
        description: "Paella popular oberta a tots els fallers i familiars.",
      });

      await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Sopar de Benvinguda",
        date: new Date(2026, 2, 15),
        startTime: "21:00",
        location: "Local social de la falla",
        requiresConfirmation: false,
        sendReminder: false,
        description: "Sopar de benvinguda per iniciar la temporada fallera.",
      });

      await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Excursió a Xàtiva",
        date: new Date(2026, 3, 25),
        startTime: "09:00",
        location: "Estació del Nord, València",
        requiresConfirmation: false,
        sendReminder: false,
        description: "Excursió cultural a la ciutat de Xàtiva.",
      });

      await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Taller de Pirotècnia",
        date: new Date(2026, 5, 22),
        startTime: "17:00",
        location: "Carrer de la Pau, 12, València",
        requiresConfirmation: false,
        sendReminder: false,
        description: "Taller per aprendre els secrets de la pirotècnia valenciana.",
      });

      const visitaRef = await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Visita al Museu Faller",
        date: new Date(2026, 7, 3),
        startTime: "11:00",
        location: "Plaça de Monteolivete, 4, València",
        requiresConfirmation: true,
        sendReminder: true,
        confirmationDeadline: new Date(2026, 6, 28),
        description: "Visita guiada al Museu Faller de València.",
      });

      const berenarRef = await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Berenar de Xiquets",
        date: new Date(2026, 7, 30),
        startTime: "18:00",
        endTime: "20:00",
        location: "Local social de la falla",
        requiresConfirmation: true,
        sendReminder: true,
        confirmationDeadline: new Date(2026, 7, 25),
        description: "Berenar per als xiquets i xiquetes de la falla.",
      });

      // ── Vinculados de 4 miembros ────────────────────────────────────
      const linkedCol = collection(db, "groups", groupId, "linkedMembers");
      // Laia
      await setDoc(doc(linkedCol, "linked-laia-pau"),       { ownerUid: "fake-uid-laia",     firstName: "Pau",    lastName: "Calatayud", relationship: "Fill" });
      await setDoc(doc(linkedCol, "linked-laia-neus"),      { ownerUid: "fake-uid-laia",     firstName: "Neus",   lastName: "Calatayud", relationship: "Filla" });
      // Dolors
      await setDoc(doc(linkedCol, "linked-dolors-toni"),    { ownerUid: "fake-uid-dolors",   firstName: "Toni",   lastName: "Pons",      relationship: "Marit" });
      // Vicent (organitzador)
      await setDoc(doc(linkedCol, "linked-vicent-carme"),   { ownerUid: "fake-uid-vicent",   firstName: "Carme",  lastName: "Ferrer",    relationship: "Mare" });
      await setDoc(doc(linkedCol, "linked-vicent-esteve"),  { ownerUid: "fake-uid-vicent",   firstName: "Esteve", lastName: "Ferrer",    relationship: "Fill" });
      // Consuelo
      await setDoc(doc(linkedCol, "linked-consuelo-pep"),   { ownerUid: "fake-uid-consuelo", firstName: "Pep",    lastName: "Martí",     relationship: "Marit" });

      const atCol = (eventId: string) => collection(db, "groups", groupId, "events", eventId, "attendances");

      // ── Reunió de Junta ─────────────────────────────────────────────
      const reunioId = reunioRef.id;
      await setDoc(doc(atCol(reunioId), "fake-uid-vicent"),      { userId: "fake-uid-vicent",      eventId: reunioId, response: "yes", confirmedAt: new Date(2026, 5, 10), linkedResponses: { "linked-vicent-carme": "no", "linked-vicent-esteve": "yes" } });
      await setDoc(doc(atCol(reunioId), "fake-uid-amparo"),      { userId: "fake-uid-amparo",      eventId: reunioId, response: "yes", confirmedAt: new Date(2026, 5, 11) });
      await setDoc(doc(atCol(reunioId), "fake-uid-josepantoni"), { userId: "fake-uid-josepantoni", eventId: reunioId, response: "no",  confirmedAt: new Date(2026, 5, 12) });
      await setDoc(doc(atCol(reunioId), "fake-uid-laia"),        { userId: "fake-uid-laia",        eventId: reunioId, response: "yes", confirmedAt: new Date(2026, 5, 9),  linkedResponses: { "linked-laia-pau": "yes", "linked-laia-neus": "yes" } });
      await setDoc(doc(atCol(reunioId), "fake-uid-consuelo"),    { userId: "fake-uid-consuelo",    eventId: reunioId, response: "yes", confirmedAt: new Date(2026, 5, 13), linkedResponses: { "linked-consuelo-pep": "yes" } });
      await setDoc(doc(atCol(reunioId), "fake-uid-ferran"),      { userId: "fake-uid-ferran",      eventId: reunioId, response: "no",  confirmedAt: new Date(2026, 5, 14) });
      await setDoc(doc(atCol(reunioId), "fake-uid-dolors"),      { userId: "fake-uid-dolors",      eventId: reunioId, response: "yes", confirmedAt: new Date(2026, 5, 10), linkedResponses: { "linked-dolors-toni": "no" } });
      // Raül y Miquel: pendientes

      // ── Missa Fallera ───────────────────────────────────────────────
      const missaId = missaRef.id;
      await setDoc(doc(atCol(missaId), "fake-uid-vicent"),      { userId: "fake-uid-vicent",      eventId: missaId, response: "yes", confirmedAt: new Date(2026, 5, 20), linkedResponses: { "linked-vicent-carme": "yes", "linked-vicent-esteve": "yes" } });
      await setDoc(doc(atCol(missaId), "fake-uid-amparo"),      { userId: "fake-uid-amparo",      eventId: missaId, response: "no",  confirmedAt: new Date(2026, 5, 22) });
      await setDoc(doc(atCol(missaId), "fake-uid-josepantoni"), { userId: "fake-uid-josepantoni", eventId: missaId, response: "no",  confirmedAt: new Date(2026, 5, 4) });
      await setDoc(doc(atCol(missaId), "fake-uid-laia"),        { userId: "fake-uid-laia",        eventId: missaId, response: "yes", confirmedAt: new Date(2026, 5, 3),  linkedResponses: { "linked-laia-pau": "yes", "linked-laia-neus": "no" } });
      await setDoc(doc(atCol(missaId), "fake-uid-raul"),        { userId: "fake-uid-raul",        eventId: missaId, response: "no",  confirmedAt: new Date(2026, 5, 6) });
      await setDoc(doc(atCol(missaId), "fake-uid-consuelo"),    { userId: "fake-uid-consuelo",    eventId: missaId, response: "yes", confirmedAt: new Date(2026, 5, 7),  linkedResponses: { "linked-consuelo-pep": "yes" } });
      await setDoc(doc(atCol(missaId), "fake-uid-dolors"),      { userId: "fake-uid-dolors",      eventId: missaId, response: "yes", confirmedAt: new Date(2026, 5, 5),  linkedResponses: { "linked-dolors-toni": "yes" } });
      // Ferran y Miquel: pendientes

      // ── Sopar de Germandat (cena adultos, sin acompañantes) ───────────
      const soparId = soparRef.id;
      await setDoc(doc(atCol(soparId), "fake-uid-vicent"),      { userId: "fake-uid-vicent",      eventId: soparId, response: "yes", confirmedAt: new Date(2026, 5, 15) });
      await setDoc(doc(atCol(soparId), "fake-uid-amparo"),      { userId: "fake-uid-amparo",      eventId: soparId, response: "yes", confirmedAt: new Date(2026, 5, 15) });
      await setDoc(doc(atCol(soparId), "fake-uid-josepantoni"), { userId: "fake-uid-josepantoni", eventId: soparId, response: "yes", confirmedAt: new Date(2026, 5, 16) });
      await setDoc(doc(atCol(soparId), "fake-uid-laia"),        { userId: "fake-uid-laia",        eventId: soparId, response: "yes", confirmedAt: new Date(2026, 5, 14) });
      await setDoc(doc(atCol(soparId), "fake-uid-raul"),        { userId: "fake-uid-raul",        eventId: soparId, response: "no",  confirmedAt: new Date(2026, 5, 17) });
      await setDoc(doc(atCol(soparId), "fake-uid-consuelo"),    { userId: "fake-uid-consuelo",    eventId: soparId, response: "yes", confirmedAt: new Date(2026, 5, 15) });
      await setDoc(doc(atCol(soparId), "fake-uid-ferran"),      { userId: "fake-uid-ferran",      eventId: soparId, response: "yes", confirmedAt: new Date(2026, 5, 16) });
      await setDoc(doc(atCol(soparId), "fake-uid-dolors"),      { userId: "fake-uid-dolors",      eventId: soparId, response: "yes", confirmedAt: new Date(2026, 5, 15) });
      // Miquel: pendiente

      // ── Assemblea General ───────────────────────────────────────────
      const assembleaId = assembleaRef.id;
      await setDoc(doc(atCol(assembleaId), "fake-uid-vicent"),      { userId: "fake-uid-vicent",      eventId: assembleaId, response: "yes", confirmedAt: new Date(2026, 6, 1) });
      await setDoc(doc(atCol(assembleaId), "fake-uid-amparo"),      { userId: "fake-uid-amparo",      eventId: assembleaId, response: "yes", confirmedAt: new Date(2026, 6, 1) });
      await setDoc(doc(atCol(assembleaId), "fake-uid-josepantoni"), { userId: "fake-uid-josepantoni", eventId: assembleaId, response: "yes", confirmedAt: new Date(2026, 6, 2) });
      await setDoc(doc(atCol(assembleaId), "fake-uid-laia"),        { userId: "fake-uid-laia",        eventId: assembleaId, response: "yes", confirmedAt: new Date(2026, 6, 1) });
      await setDoc(doc(atCol(assembleaId), "fake-uid-consuelo"),    { userId: "fake-uid-consuelo",    eventId: assembleaId, response: "no",  confirmedAt: new Date(2026, 6, 3) });
      await setDoc(doc(atCol(assembleaId), "fake-uid-ferran"),      { userId: "fake-uid-ferran",      eventId: assembleaId, response: "yes", confirmedAt: new Date(2026, 6, 2) });
      await setDoc(doc(atCol(assembleaId), "fake-uid-miquel"),      { userId: "fake-uid-miquel",      eventId: assembleaId, response: "yes", confirmedAt: new Date(2026, 6, 1) });
      await setDoc(doc(atCol(assembleaId), "fake-uid-dolors"),      { userId: "fake-uid-dolors",      eventId: assembleaId, response: "no",  confirmedAt: new Date(2026, 6, 3) });
      // Raül: pendiente

      // ── Visita al Museu Faller ──────────────────────────────────────
      const visitaId = visitaRef.id;
      await setDoc(doc(atCol(visitaId), "fake-uid-vicent"),      { userId: "fake-uid-vicent",      eventId: visitaId, response: "yes", confirmedAt: new Date(2026, 6, 20), linkedResponses: { "linked-vicent-carme": "yes", "linked-vicent-esteve": "yes" } });
      await setDoc(doc(atCol(visitaId), "fake-uid-amparo"),      { userId: "fake-uid-amparo",      eventId: visitaId, response: "no",  confirmedAt: new Date(2026, 6, 22) });
      await setDoc(doc(atCol(visitaId), "fake-uid-laia"),        { userId: "fake-uid-laia",        eventId: visitaId, response: "yes", confirmedAt: new Date(2026, 6, 19), linkedResponses: { "linked-laia-pau": "yes", "linked-laia-neus": "yes" } });
      await setDoc(doc(atCol(visitaId), "fake-uid-raul"),        { userId: "fake-uid-raul",        eventId: visitaId, response: "yes", confirmedAt: new Date(2026, 6, 21) });
      await setDoc(doc(atCol(visitaId), "fake-uid-consuelo"),    { userId: "fake-uid-consuelo",    eventId: visitaId, response: "yes", confirmedAt: new Date(2026, 6, 20), linkedResponses: { "linked-consuelo-pep": "yes" } });
      await setDoc(doc(atCol(visitaId), "fake-uid-miquel"),      { userId: "fake-uid-miquel",      eventId: visitaId, response: "yes", confirmedAt: new Date(2026, 6, 20) });
      await setDoc(doc(atCol(visitaId), "fake-uid-dolors"),      { userId: "fake-uid-dolors",      eventId: visitaId, response: "yes", confirmedAt: new Date(2026, 6, 21), linkedResponses: { "linked-dolors-toni": "yes" } });
      // Josep Antoni y Ferran: pendientes

      // ── Berenar de Xiquets ──────────────────────────────────────────
      const berenarId = berenarRef.id;
      await setDoc(doc(atCol(berenarId), "fake-uid-vicent"),      { userId: "fake-uid-vicent",      eventId: berenarId, response: "yes", confirmedAt: new Date(2026, 7, 20), linkedResponses: { "linked-vicent-carme": "yes", "linked-vicent-esteve": "yes" } });
      await setDoc(doc(atCol(berenarId), "fake-uid-amparo"),      { userId: "fake-uid-amparo",      eventId: berenarId, response: "no",  confirmedAt: new Date(2026, 7, 22) });
      await setDoc(doc(atCol(berenarId), "fake-uid-josepantoni"), { userId: "fake-uid-josepantoni", eventId: berenarId, response: "no",  confirmedAt: new Date(2026, 7, 21) });
      await setDoc(doc(atCol(berenarId), "fake-uid-laia"),        { userId: "fake-uid-laia",        eventId: berenarId, response: "yes", confirmedAt: new Date(2026, 7, 19), linkedResponses: { "linked-laia-pau": "yes", "linked-laia-neus": "yes" } });
      await setDoc(doc(atCol(berenarId), "fake-uid-consuelo"),    { userId: "fake-uid-consuelo",    eventId: berenarId, response: "yes", confirmedAt: new Date(2026, 7, 20), linkedResponses: { "linked-consuelo-pep": "yes" } });
      await setDoc(doc(atCol(berenarId), "fake-uid-miquel"),      { userId: "fake-uid-miquel",      eventId: berenarId, response: "yes", confirmedAt: new Date(2026, 7, 20) });
      await setDoc(doc(atCol(berenarId), "fake-uid-dolors"),      { userId: "fake-uid-dolors",      eventId: berenarId, response: "yes", confirmedAt: new Date(2026, 7, 21), linkedResponses: { "linked-dolors-toni": "yes" } });
      // Raül y Ferran: pendientes

      await setDoc(doc(db, "groups", groupId, "joinRequests", "fake-uid-request-pere"), {
        uid: "fake-uid-request-pere",
        firstName: "Pere",
        lastName: "Mas Carbonell",
        email: "pere.mas@demo.com",
        requestedAt: new Date(2026, 4, 10),
      });

      setStatus("done");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleMemberSeed = async () => {
    if (!user || !profile?.groupId) return;

    const groupId  = profile.groupId;
    const memberUid = user.uid;

    setMemberStatus("loading");

    try {
      // Reincorporar a Carmen al array members del grupo, borrando cualquier entrada stale
      const groupSnap = await getDoc(doc(db, "groups", groupId));
      const currentMembers = (groupSnap.data()?.members ?? []) as { uid: string }[];
      const membersWithoutCarmen = currentMembers.filter(member => member.uid !== memberUid);

      await Promise.all([
        updateDoc(doc(db, "groups", groupId), {
          members: [
            ...membersWithoutCarmen,
            {
              uid: memberUid,
              role: "member",
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email ?? "",
            },
          ],
        }),
        updateDoc(doc(db, "users", memberUid), { role: "member" }),
      ]);

      // Vinculados de Carmen — en la subcollección del grupo
      const linkedMembersCol = collection(db, "groups", groupId, "linkedMembers");
      await setDoc(doc(linkedMembersCol, "linked-marc"),  { ownerUid: memberUid, firstName: "Marc",  lastName: "Soriano", relationship: "Fill" });
      await setDoc(doc(linkedMembersCol, "linked-julia"), { ownerUid: memberUid, firstName: "Júlia", lastName: "Soriano", relationship: "Filla" });

      // Buscar eventos por nombre para añadir asistencias
      const eventsSnap = await getDocs(collection(db, "groups", groupId, "events"));
      const events = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() as { name: string } }));

      const missa   = events.find(e => e.name === "Missa Fallera");
      const sopar   = events.find(e => e.name === "Sopar de Germandat");
      const reunio  = events.find(e => e.name === "Reunió de Junta");
      const visita  = events.find(e => e.name === "Visita al Museu Faller");

      // Missa Fallera — sí, con acompañantes
      if (missa) {
        await setDoc(doc(db, "groups", groupId, "events", missa.id, "attendances", memberUid), {
          userId: memberUid, eventId: missa.id, response: "yes",
          confirmedAt: new Date(2026, 5, 6),
          linkedResponses: { "linked-marc": "yes", "linked-julia": "yes" },
        });
      }

      // Sopar de Germandat — sí (sin acompañantes, cena de adultos)
      if (sopar) {
        await setDoc(doc(db, "groups", groupId, "events", sopar.id, "attendances", memberUid), {
          userId: memberUid, eventId: sopar.id, response: "yes",
          confirmedAt: new Date(2026, 5, 12),
        });
      }

      // Reunió de Junta — no va
      if (reunio) {
        await setDoc(doc(db, "groups", groupId, "events", reunio.id, "attendances", memberUid), {
          userId: memberUid, eventId: reunio.id, response: "no",
          confirmedAt: new Date(2026, 3, 5),
        });
      }

      // Assemblea General — pendiente (sin doc)

      // Visita al Museu Faller — no va
      if (visita) {
        await setDoc(doc(db, "groups", groupId, "events", visita.id, "attendances", memberUid), {
          userId: memberUid, eventId: visita.id, response: "no",
          confirmedAt: new Date(2026, 6, 20),
        });
      }

      // Berenar de Xiquets — pendiente (sin doc)

      setMemberStatus("done");
    } catch (error) {
      console.error(error);
      setMemberStatus("error");
    }
  };

  const btnStyle = (color: string) => ({
    padding: "12px 24px", fontSize: "16px", cursor: "pointer",
    background: color, color: "#fff", border: "none", borderRadius: "8px",
  });

  return (
    <div style={{ padding: "32px", fontFamily: "sans-serif", maxWidth: "480px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Seed de datos de demo</h1>
      <p style={{ marginBottom: "4px" }}><strong>Rol:</strong> {profile?.role ?? "—"}</p>
      <p style={{ marginBottom: "4px" }}><strong>Grupo:</strong> {profile?.groupId ?? "—"}</p>
      <p style={{ marginBottom: "24px" }}><strong>UID:</strong> {user?.uid ?? "—"}</p>

      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>Admin — datos generales</h2>
        <p style={{ marginBottom: "12px", color: "#555", fontSize: "14px" }}>Crea miembros, eventos y asistencias de demo. Borra y recrea todo.</p>
        {status === "idle"    && <button onClick={handleSeed} style={btnStyle("#0068FF")}>Crear datos de demo</button>}
        {status === "loading" && <p>Creando datos...</p>}
        {status === "done"    && <p style={{ color: "green", fontWeight: "bold" }}>✅ Datos creados correctamente.</p>}
        {status === "error"   && <p style={{ color: "red" }}>❌ Error. Mira la consola.</p>}
      </div>

      <div>
        <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>Miembro — Carmen Soriano</h2>
        <p style={{ marginBottom: "12px", color: "#555", fontSize: "14px" }}>Añade acompañantes y respuestas de asistencia. Ejecútalo con la cuenta de Carmen.</p>
        {memberStatus === "idle"    && <button onClick={handleMemberSeed} style={btnStyle("#3772FF")}>Añadir datos de miembro</button>}
        {memberStatus === "loading" && <p>Añadiendo datos...</p>}
        {memberStatus === "done"    && <p style={{ color: "green", fontWeight: "bold" }}>✅ Datos de miembro añadidos.</p>}
        {memberStatus === "error"   && <p style={{ color: "red" }}>❌ Error. Mira la consola.</p>}
      </div>
    </div>
  );
};

export default SeedPage;
