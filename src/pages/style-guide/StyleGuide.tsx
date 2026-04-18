import { useState } from "react";
import "./style-guide.scss";
import Button from "../../ui-kit/button/Button";
import Input from "../../ui-kit/input/Input";
import Search from "../../ui-kit/search/Search";
import Avatar from "../../ui-kit/avatar/Avatar";
import Chip from "../../ui-kit/chip/Chip";
import MemberCard from "../../components/member-card/MemberCard";
import Alert from "../../components/alert/Alert";
import Loading from "../../components/loading/Loading";

const StyleGuide = () => {
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <div className="style-guide">
      <h1 className="style-guide__title">Style Guide</h1>

      <section className="style-guide__section">
        <h2 className="style-guide__section-title">Tipografía</h2>

        <div className="style-guide__item">
          <span className="style-guide__label">h1 · Bricolage Grotesque 800 · 40px</span>
          <h1>Título principal</h1>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">h2 · Bricolage Grotesque 800 · 32px</span>
          <h2>Título secundario</h2>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">h3 · Bricolage Grotesque 800 · 24px</span>
          <h3>Título terciario</h3>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">Body · General Sans 500 · 16px</span>
          <p>Texto de cuerpo. Lorem ipsum dolor sit amet consectetur.</p>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">Link · General Sans 600 · 16px · #3772ff</span>
          <a href="#">Enlace de ejemplo</a>
        </div>
        <div className="style-guide__item">
          <span className="style-guide__label">Small · 16px</span>
          <small>Texto pequeño de apoyo</small>
        </div>
      </section>

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
      </section>

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
