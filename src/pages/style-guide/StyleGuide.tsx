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
          <div className="style-guide__row">
            <Button text="Primary" />
            <Button text="Secondary" variant="secondary" />
            <Button text="Disabled" disabled />
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
