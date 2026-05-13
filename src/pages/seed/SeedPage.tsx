import { useState } from "react";
import { doc, updateDoc, addDoc, setDoc, getDocs, deleteDoc, collection, deleteField } from "firebase/firestore";
import { db } from "../../plugins/firebase";
import { useAuthContext } from "../../context/auth/AuthContext";

const SeedPage = () => {
  const { user, profile } = useAuthContext();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSeed = async () => {
    if (!user || !profile?.groupId) return;

    const groupId = profile.groupId;
    const adminUid = user.uid;

    setStatus("loading");

    try {
      // Limpieza previa
      await updateDoc(doc(db, "users", adminUid), { linkedMembers: deleteField() });

      const eventsSnap = await getDocs(collection(db, "groups", groupId, "events"));
      for (const eventDoc of eventsSnap.docs) {
        const attendancesSnap = await getDocs(collection(db, "groups", groupId, "events", eventDoc.id, "attendances"));
        for (const attendanceDoc of attendancesSnap.docs) {
          await deleteDoc(attendanceDoc.ref);
        }
        await deleteDoc(eventDoc.ref);
      }

      const fakeMembers = [
        { uid: "fake-uid-vicent",      role: "organizer", username: "vicentferrer",    firstName: "Vicent",       lastName: "Ferrer Navarro",  email: "vicent.ferrer@demo.com" },
        { uid: "fake-uid-amparo",      role: "organizer", username: "amparotortosa",   firstName: "Amparo",       lastName: "Tortosa Gil",     email: "amparo.tortosa@demo.com" },
        { uid: "fake-uid-josepantoni", role: "member",    username: "josepantoni",     firstName: "Josep Antoni", lastName: "Blasco Pérez",    email: "josepantoni.blasco@demo.com" },
        { uid: "fake-uid-laia",        role: "member",    username: "laiacalatayud",   firstName: "Laia",         lastName: "Calatayud Martí", email: "laia.calatayud@demo.com" },
        { uid: "fake-uid-raul",        role: "member",    username: "raulmonzo",       firstName: "Raül",         lastName: "Monzó Pérez",     email: "raul.monzo@demo.com" },
        { uid: "fake-uid-consuelo",    role: "member",    username: "consuelomartí",   firstName: "Consuelo",     lastName: "Martí Soler",     email: "consuelo.marti@demo.com" },
        { uid: "fake-uid-ferran",      role: "member",    username: "ferrancatala",    firstName: "Ferran",       lastName: "Català Romeu",    email: "ferran.catala@demo.com" },
        { uid: "fake-uid-miquel",      role: "member",    username: "miquelvercher",   firstName: "Miquel Àngel", lastName: "Vercher Llopis",  email: "miquel.vercher@demo.com" },
        { uid: "fake-uid-dolors",      role: "member",    username: "dolorspons",      firstName: "Dolors",       lastName: "Pons Aparici",    email: "dolors.pons@demo.com" },
      ];

      await updateDoc(doc(db, "groups", groupId), {
        members: [
          {
            uid: adminUid,
            role: "admin",
            username: profile.username,
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email ?? "",
          },
          ...fakeMembers,
        ],
      });


      await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Plantà",
        date: new Date(2026, 2, 14),
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
        date: new Date(2026, 2, 19),
        startTime: "23:00",
        location: "Carrer de la Pau, 12, València",
        requiresConfirmation: false,
        sendReminder: false,
        isSpecial: true,
        description: "La nit de la cremà. El moment més emotiu de les falles.",
      });

      await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Reunió de Junta",
        date: new Date(2026, 3, 10),
        startTime: "20:00",
        location: "Local social de la falla",
        requiresConfirmation: true,
        sendReminder: true,
        confirmationDeadline: new Date(2026, 3, 7),
      });

      const missaRef = await addDoc(collection(db, "groups", groupId, "events"), {
        groupId, createdBy: adminUid, createdAt: new Date(),
        name: "Missa Fallera",
        date: new Date(2026, 5, 15),
        startTime: "12:00",
        location: "Parròquia de Sant Esteve, València",
        requiresConfirmation: true,
        sendReminder: true,
        confirmationDeadline: new Date(2026, 5, 8),
        description: "Missa en honor a la nostra fallera major.",
      });

      await addDoc(collection(db, "groups", groupId, "events"), {
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

      await addDoc(collection(db, "groups", groupId, "events"), {
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

      const missaId = missaRef.id;
      const attendancesCol = collection(db, "groups", groupId, "events", missaId, "attendances");

      // Solo miembros votan — admin y organizadores no
      await setDoc(doc(attendancesCol, "fake-uid-laia"), {
        userId: "fake-uid-laia", eventId: missaId, response: "yes", confirmedAt: new Date(2026, 5, 3),
      });
      await setDoc(doc(attendancesCol, "fake-uid-consuelo"), {
        userId: "fake-uid-consuelo", eventId: missaId, response: "yes", confirmedAt: new Date(2026, 5, 7),
      });
      await setDoc(doc(attendancesCol, "fake-uid-dolors"), {
        userId: "fake-uid-dolors", eventId: missaId, response: "yes", confirmedAt: new Date(2026, 5, 5),
      });
      await setDoc(doc(attendancesCol, "fake-uid-josepantoni"), {
        userId: "fake-uid-josepantoni", eventId: missaId, response: "no", confirmedAt: new Date(2026, 5, 4),
      });
      await setDoc(doc(attendancesCol, "fake-uid-raul"), {
        userId: "fake-uid-raul", eventId: missaId, response: "no", confirmedAt: new Date(2026, 5, 6),
      });
      // Ferran y Miquel Àngel: sin documento = pendiente

      await setDoc(doc(db, "groups", groupId, "joinRequests", "fake-uid-request-pere"), {
        uid: "fake-uid-request-pere",
        username: "peremas",
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

  return (
    <div style={{ padding: "32px", fontFamily: "sans-serif", maxWidth: "480px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Seed de datos de demo</h1>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        Crea todos los datos de demo en Firestore para la presentación.
        Ejecútalo solo una vez.
      </p>
      <p style={{ marginBottom: "4px" }}><strong>Grupo:</strong> {profile?.groupId ?? "—"}</p>
      <p style={{ marginBottom: "24px" }}><strong>Admin UID:</strong> {user?.uid ?? "—"}</p>

      {status === "idle" && (
        <button
          onClick={handleSeed}
          style={{ padding: "12px 24px", fontSize: "16px", cursor: "pointer", background: "#0068FF", color: "#fff", border: "none", borderRadius: "8px" }}
        >
          Crear datos de demo
        </button>
      )}
      {status === "loading" && <p>Creando datos...</p>}
      {status === "done"    && <p style={{ color: "green", fontWeight: "bold" }}>✅ Datos creados correctamente.</p>}
      {status === "error"   && <p style={{ color: "red" }}>❌ Ha habido un error. Mira la consola.</p>}
    </div>
  );
};

export default SeedPage;
