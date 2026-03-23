import "./CreateGroup.scss";
import { useTranslation } from "react-i18next";

//primero tenemos que tener una pantalla que sea con dos botones para elegir si crear grupo o unirte a uno si le das a crear grupo te llevara a esta pantalla
//en el return tiene que haber un formulario con inputs y un boton y estaran dentro de un formulario de react hook
//los inputs seran nombre del grupo, descripcion opcional, foto opcional
//al pulsar el boton submit primero hara todas las comprobaciones en el formulario y si hay errores te los mostrara o junto a los inputs o si es otro tipo de error con un alert
//si todas las comprobaciones van bien mirara si ya en firebase esta creado la base de datos de groups, si no esta creada la creara, luego añadira un nuevo grupo que tendra todos los datos,el id del grupo, quien lo haya creado pasara a ser administrador del grupo, los miembros que tiene que ahora mismo sera ninguno
//al usuario que ha creado el grupo se le añadera a su usuario el id del grupo al que pertenece


const CreateGroup = () => {
  const { t } = useTranslation("groups");

  return (
    <>
      
    </>
  );
};

export default CreateGroup;
