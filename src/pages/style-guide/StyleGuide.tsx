import { useState } from "react";
import "./style-guide.scss";
import Avatar from "../../ui-kit/avatar/Avatar";
import BackButton from "../../ui-kit/icons/BackButton";
import Button from "../../ui-kit/button/Button";
import Chip from "../../ui-kit/chip/Chip";
import EyeToggleIcon from "../../ui-kit/icons/EyeToggleIcon";
import Input from "../../ui-kit/input/Input";
import Search from "../../ui-kit/search/Search";
import Stepper from "../../ui-kit/stepper/Stepper";
import Alert from "../../components/alert/Alert";
import LanguageSelector from "../../components/language-selector/LanguageSelector";
import Loading from "../../components/loading/Loading";
import MemberCard from "../../components/members/MemberCard";
import EventCard from "../../components/events/EventCard";
import EventsFilter from "../../components/events/EventsFilter";
import type { FilterOption, FilterKey } from "../../components/events/EventsFilter";
import type { FallesEvent } from "../../models/event.model";

const mockEventBase: FallesEvent = {
  id: "evt-1",
  groupId: "group-1",
  createdBy: "user-admin",
  name: "Cena de la Falla",
  date: new Date(2026, 5, 5),
  location: "Restaurante El Mercat",
  startTime: "21:00",
  requiresConfirmation: true,
  sendReminder: false,
  createdAt: new Date(),
};

const mockEventSpecial: FallesEvent = {
  ...mockEventBase,
  id: "evt-2",
  name: "Ofrenda a la Virgen",
  date: new Date(2026, 5, 12),
  startTime: "10:00",
  location: "Plaça de la Mare de Déu",
  isSpecial: true,
};

const mockEventLongName: FallesEvent = {
  ...mockEventBase,
  id: "evt-3",
  name: "Reunión extraordinaria de la comisión de fiestas mayores",
  date: new Date(2026, 4, 28),
  startTime: "19:30",
  location: "Local social",
};

const mockEventNoConfirmation: FallesEvent = {
  ...mockEventBase,
  id: "evt-4",
  name: "Plantà",
  date: new Date(2026, 5, 20),
  startTime: "08:00",
  location: "Carrer Major",
  requiresConfirmation: false,
};

const mockEventFinished: FallesEvent = {
  ...mockEventBase,
  id: "evt-5",
  name: "Cena de Sobaquillo",
  date: new Date(2026, 2, 17),
  startTime: "21:00",
  location: "Plaza del Ángel",
};

const adminFilterOptions: FilterOption[] = [
  { key: "all", label: "Todos", count: 8 },
  { key: "active", label: "Activos", count: 3 },
  { key: "deadline-closed", label: "Plazo cerrado", count: 1 },
  { key: "finished", label: "Finalizados", count: 4 },
];

const memberFilterOptions: FilterOption[] = [
  { key: "all", label: "Todos", count: 8 },
  { key: "upcoming", label: "Próximos", count: 4 },
  { key: "pending", label: "Sin respuesta", count: 2 },
  { key: "past", label: "Pasados", count: 4 },
];

const ColorSwatch = ({ variable, hex, label }: { variable: string; hex: string; label?: string }) => (
  <div className="style-guide__swatch">
    <div className="style-guide__swatch-color" style={{ background: `var(${variable})` }} />
    <div className="style-guide__swatch-info">
      <span className="style-guide__swatch-var">{label ?? variable}</span>
      <span className="style-guide__swatch-hex">{hex}</span>
    </div>
  </div>
);

const GradientSwatch = ({ variable, label }: { variable: string; label: string }) => (
  <div className="style-guide__swatch">
    <div className="style-guide__swatch-color" style={{ background: `var(${variable})` }} />
    <div className="style-guide__swatch-info">
      <span className="style-guide__swatch-var">{variable}</span>
      <span className="style-guide__swatch-hex">{label}</span>
    </div>
  </div>
);

const RadiusSwatch = ({ variable, value }: { variable: string; value: string }) => (
  <div className="style-guide__radius-item">
    <div className="style-guide__radius-box" style={{ borderRadius: `var(${variable})` }} />
    <span className="style-guide__label">{variable}</span>
    <span className="style-guide__label">{value}</span>
  </div>
);

const StyleGuide = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminFilter, setAdminFilter] = useState<FilterKey>("all");
  const [memberFilter, setMemberFilter] = useState<FilterKey>("all");

  return (
    <div className="style-guide">
      <h1 className="style-guide__title">Style Guide</h1>

      {/* ── COLORES ── */}
      <section className="style-guide__section">
        <h2 className="style-guide__section-title">Colores — Texto</h2>
        <div className="style-guide__swatch-grid">
          <ColorSwatch variable="--color-text-primary"   hex="#121212" />
          <ColorSwatch variable="--color-text-secondary" hex="#4C4C4C" />
          <ColorSwatch variable="--color-text-muted"     hex="#7D7D7D" />
          <ColorSwatch variable="--color-text-inverse"   hex="#FAFAFA" />
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__section-title">Colores — Marca</h2>
        <div className="style-guide__swatch-grid">
          <ColorSwatch variable="--color-brand" hex="#0068FF" />
          <ColorSwatch variable="--color-error" hex="#FF1C4E" />
          <ColorSwatch variable="--color-link"  hex="#3772FF" />
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__section-title">Colores — Accents</h2>
        <div className="style-guide__swatch-grid">
          <ColorSwatch variable="--color-accent-teal"   hex="#00C8C5" />
          <ColorSwatch variable="--color-accent-orange" hex="#FF7E00" />
          <ColorSwatch variable="--color-accent-purple" hex="#F581FF" />
          <ColorSwatch variable="--color-accent-yellow" hex="#FBFF85" />
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__section-title">Colores — Fondos pastel</h2>
        <div className="style-guide__swatch-grid">
          <ColorSwatch variable="--color-bg-blue"   hex="#E5F0FF" />
          <ColorSwatch variable="--color-bg-teal"   hex="#B2EEEE" />
          <ColorSwatch variable="--color-bg-pink"   hex="#FCE6FF" />
          <ColorSwatch variable="--color-bg-yellow" hex="#FEFFE7" />
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__section-title">Colores — Gradientes</h2>
        <div className="style-guide__swatch-grid">
          <GradientSwatch variable="--color-bg-gradient-blue" label="#CCE1FF → #FEFFE7" />
          <GradientSwatch variable="--color-bg-gradient-teal" label="#B2EEEE → #FEFFE7" />
          <GradientSwatch variable="--color-bg-gradient-pink" label="#FCE6FF → #FEFFE7" />
          <GradientSwatch variable="--color-bg-gradient-red"  label="#FFD2DC → #FEFFE7" />
        </div>
      </section>

      <section className="style-guide__section">
        <h2 className="style-guide__section-title">Colores — Bordes</h2>
        <div className="style-guide__swatch-grid">
          <ColorSwatch variable="--color-border"       hex="#D5D5D5" />
          <ColorSwatch variable="--color-border-light" hex="#E0E0E0" />
        </div>
      </section>

      {/* ── TIPOGRAFÍA ── */}
      <section className="style-guide__section">
        <h2 className="style-guide__section-title">Tipografía</h2>

        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-display · Bricolage ExtraBold · 40px</span>
          <h1 className="h1--large">Display</h1>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-h1 · Bricolage ExtraBold · 32px</span>
          <h1>Heading 1</h1>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-h2 · Bricolage ExtraBold · 24px</span>
          <h2>Heading 2</h2>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-button · Bricolage Bold · 24px</span>
          <span className="style-guide__type-button">Botón</span>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-date-title · Bricolage Bold · 18px</span>
          <span className="style-guide__type-date-title">Fecha título</span>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-date · Bricolage Bold · 16px</span>
          <span className="style-guide__type-date">Fecha</span>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-body-l · General Sans · 20px</span>
          <span className="style-guide__type-body-l">Body large — subtítulos</span>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-body-l · General Sans SemiBold · 20px</span>
          <span className="style-guide__type-body-l style-guide__type--bold">Body large bold</span>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-body-m · General Sans · 18px</span>
          <span className="style-guide__type-body-m">Body medium — texto</span>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-body-m · General Sans SemiBold · 18px</span>
          <span className="style-guide__type-body-m style-guide__type--bold">Body medium bold</span>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-body-s · General Sans · 16px</span>
          <p>Body small — texto base</p>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-body-s · General Sans SemiBold · 16px</span>
          <p><strong>Body small bold</strong></p>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--font-size-pill · General Sans SemiBold · 12px</span>
          <span className="style-guide__type-pill">Pills / etiquetas</span>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">--color-link · General Sans · 16px</span>
          <a href="#">Enlace de ejemplo</a>
        </div>
      </section>

      {/* ── RADIUS ── */}
      <section className="style-guide__section">
        <h2 className="style-guide__section-title">Border Radius</h2>
        <div className="style-guide__radius-grid">
          <RadiusSwatch variable="--radius-input"  value="10px" />
          <RadiusSwatch variable="--radius-card"   value="12px" />
          <RadiusSwatch variable="--radius-chip"   value="12px" />
          <RadiusSwatch variable="--radius-button" value="22px" />
          <RadiusSwatch variable="--radius-pill"   value="100px" />
        </div>
      </section>

      {/* ── UI KIT ── */}
      <section className="style-guide__section">
        <h2 className="style-guide__section-title">UI Kit</h2>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">Button</h3>
          <div className="style-guide__stack">
            <div className="style-guide__item">
              <span className="style-guide__label">primary</span>
              <Button text="Confirmar asistencia" />
            </div>
            <div className="style-guide__item">
              <span className="style-guide__label">primary · con icono · como Link (prop to)</span>
              <Button
                text="Editar evento"
                to="/events"
                icon={<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              />
            </div>
            <div className="style-guide__item">
              <span className="style-guide__label">secondary</span>
              <Button text="Cancelar" variant="secondary" />
            </div>
            <div className="style-guide__item">
              <span className="style-guide__label">especial</span>
              <Button text="Guardar" variant="especial" />
            </div>
            <div className="style-guide__item">
              <span className="style-guide__label">danger · con icono</span>
              <Button
                text="Eliminar evento"
                variant="danger"
                icon={<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              />
            </div>
            <div className="style-guide__item">
              <span className="style-guide__label">going-no-active</span>
              <Button text="No" variant="going-no-active" />
            </div>
            <div className="style-guide__item">
              <span className="style-guide__label">going-yes · con icono</span>
              <Button
                text="Sí"
                variant="going-yes"
                icon={<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              />
            </div>
            <div className="style-guide__item">
              <span className="style-guide__label">going-yes-active · con icono</span>
              <Button
                text="Sí"
                variant="going-yes-active"
                icon={<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              />
            </div>
            <div className="style-guide__item">
              <span className="style-guide__label">linked · disabled</span>
              <Button
                text="Votar por mis vinculados"
                variant="linked"
                disabled
                icon={<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M25 15.9985H7M16 6.99854V24.9985V6.99854Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              />
            </div>
            <div className="style-guide__item">
              <span className="style-guide__label">disabled</span>
              <Button text="Acción no disponible" disabled />
            </div>
          </div>
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">Input</h3>
          <div className="style-guide__stack">
            <Input label="Nombre" placeholder="Escribe tu nombre" id="sg-name" />
            <Input
              label="Email"
              placeholder="email@ejemplo.com"
              id="sg-email"
              error="Este campo es obligatorio"
            />
          </div>
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">Search</h3>
          <Search placeholder="Buscar miembro..." onChange={(_value) => undefined} />
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">Avatar</h3>
          <div className="style-guide__stack">
            <div className="style-guide__row style-guide__row--centered">
              <Avatar firstName="Ana" lastName="García" role="admin" size="sm" />
              <Avatar firstName="Ana" lastName="García" role="admin" size="md" />
              <Avatar firstName="Ana" lastName="García" role="admin" size="lg" />
            </div>
            <div className="style-guide__row style-guide__row--centered">
              <Avatar firstName="Pere" lastName="Mas" role="organizer" size="sm" />
              <Avatar firstName="Pere" lastName="Mas" role="organizer" size="md" />
              <Avatar firstName="Pere" lastName="Mas" role="organizer" size="lg" />
            </div>
            <div className="style-guide__row style-guide__row--centered">
              <Avatar firstName="Joan" lastName="Valls" role="member" size="sm" />
              <Avatar firstName="Joan" lastName="Valls" role="member" size="md" />
              <Avatar firstName="Joan" lastName="Valls" role="member" size="lg" />
            </div>
          </div>
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">Chip</h3>
          <div className="style-guide__row">
            <Chip role="admin" variant="short" />
            <Chip role="admin" variant="full" />
            <Chip role="organizer" variant="short" />
            <Chip role="organizer" variant="full" />
          </div>
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">BackButton</h3>
          <BackButton />
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">Stepper</h3>
          <div className="style-guide__stack">
            <Stepper currentStep={1} totalSteps={3} />
            <Stepper currentStep={2} totalSteps={3} />
            <Stepper currentStep={3} totalSteps={3} />
          </div>
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">EyeToggleIcon</h3>
          <div className="style-guide__row style-guide__row--centered">
            <EyeToggleIcon showPassword={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            <span>{showPassword ? "Visible" : "Oculto"}</span>
          </div>
        </div>
      </section>

      {/* ── COMPONENTS ── */}
      <section className="style-guide__section">
        <h2 className="style-guide__section-title">Components</h2>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">MemberCard</h3>
          <div className="style-guide__stack">
            <MemberCard firstName="Ana" lastName="García" email="ana@falla.com" role="admin" />
            <MemberCard firstName="Pere" lastName="Mas" email="pere@falla.com" role="organizer" />
            <MemberCard firstName="Joan" lastName="Valls" email="joan@falla.com" role="member" />
          </div>
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">EventCard</h3>
          <div className="style-guide__stack">
            <span className="style-guide__label">Admin — botón editar</span>
            <EventCard event={mockEventBase} role="admin" userId="user-admin" />

            <span className="style-guide__label">Organizador — evento de otro (sin editar)</span>
            <EventCard event={mockEventBase} role="organizer" userId="user-other" />

            <span className="style-guide__label">Miembro — sin respuesta (punto naranja)</span>
            <EventCard event={mockEventBase} role="member" userId="user-1" attendanceResponse={null} />

            <span className="style-guide__label">Miembro — va (check azul)</span>
            <EventCard event={mockEventBase} role="member" userId="user-1" attendanceResponse="yes" />

            <span className="style-guide__label">Miembro — no va (tachado)</span>
            <EventCard event={mockEventBase} role="member" userId="user-1" attendanceResponse="no" />

            <span className="style-guide__label">Evento especial (gradiente en fecha)</span>
            <EventCard event={mockEventSpecial} role="member" userId="user-1" attendanceResponse="yes" />

            <span className="style-guide__label">Sin confirmación requerida (sin indicador)</span>
            <EventCard event={mockEventNoConfirmation} role="member" userId="user-1" />

            <span className="style-guide__label">Nombre largo (truncado)</span>
            <EventCard event={mockEventLongName} role="admin" userId="user-admin" />

            <span className="style-guide__label">Evento finalizado (texto gris, sin acciones)</span>
            <EventCard event={mockEventFinished} role="admin" userId="user-admin" />
          </div>
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">EventsFilter</h3>
          <div className="style-guide__stack">
            <span className="style-guide__label">Admin / Organizador</span>
            <EventsFilter
              options={adminFilterOptions}
              selected={adminFilter}
              onChange={setAdminFilter}
            />

            <span className="style-guide__label">Miembro</span>
            <EventsFilter
              options={memberFilterOptions}
              selected={memberFilter}
              onChange={setMemberFilter}
            />
          </div>
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">Loading</h3>
          <div className="style-guide__row">
            <div className="style-guide__loading-preview">
              <Loading />
            </div>
            <div className="style-guide__loading-preview">
              <Loading message="Cargando miembros..." />
            </div>
          </div>
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">LanguageSelector</h3>
          <LanguageSelector />
        </div>

        <div className="style-guide__component">
          <h3 className="style-guide__component-name">Alert</h3>
          <Button text="Abrir alert" onClick={() => setAlertOpen(true)} />
          <Alert
            isOpen={alertOpen}
            header="¿Eliminar miembro?"
            message="Esta acción no se puede deshacer."
            onDismiss={() => setAlertOpen(false)}
            buttons={[
              { text: "Cancelar", role: "cancel" },
              { text: "Eliminar" },
            ]}
          />
        </div>
        
      </section>
    </div>
  );
};

export default StyleGuide;
