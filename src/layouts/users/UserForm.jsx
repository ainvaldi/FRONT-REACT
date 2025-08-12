import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUserContext } from "../../context/UserContext"; 
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";

const validationSchema = Yup.object({
  nombre: Yup.string()
    .required("El nombre es requerido"),

  contrasenia: Yup.string()
    .required("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),

  email: Yup.string()
    .email("Debe ser un email válido")
    .required("El email es requerido"),

  edad: Yup.number()
    .typeError("La edad debe ser un número")
    .integer("La edad debe ser un número entero")
    .positive("La edad debe ser mayor que 0")
    .required("La edad es requerida"),
});


export default function UserForm() {
  const { users, addUser, editUser } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    nombre: "",
    email: "",
    contrasenia: "",
    edad: 0,
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const user = users.find((p) => p.id === Number(id));
      if (user) {
        setInitialValues({
          nombre: user.nombre || "",
          email: user.email || "",
          contrasenia: user.contrasenia || "",
          edad: user.edad || 0,
        });
      }
    }
  }, [id, users]);

  const handleSubmit = async (values) => {
    if (isEdit) {
      await editUser(Number(id), values);
    } else {
      await addUser(values);
    }
    navigate("/usuarios");
  };

  return (
    <div className="p-d-flex p-flex-column p-align-center p-mt-3">
      <h2>{isEdit ? "Editar" : "Crear"} Usuario</h2>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form
          className="p-d-flex p-flex-column p-gap-3"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <div>
            <label>Nombre:</label>
            <Field
              name="nombre"
              className="p-inputtext p-component p-mb-3"
              placeholder="Nombre del usuario"
            />
            <ErrorMessage
              name="nombre"
              component="div"
              className="p-text-danger"
            />
          </div>

          <div>
            <label>Email:</label>
            <Field
              name="email"
              type="email"
              className="p-inputtext p-component p-mb-3"
              placeholder="email del usuario"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="p-text-danger"
            />
          </div>
          {!isEdit&&(
          <div>
            <label>Contraseña:</label>
            <div className="p-inputgroup p-mb-1">
              <Field
                name="contrasenia"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña del usuario"
                className="p-inputtext p-component"
              />
              <span
                className="p-inputgroup-addon"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`} />
              </span>
            </div>
            <ErrorMessage
              name="contrasenia"
              component="div"
              className="p-text-danger"
            />
          </div>
          )}
          <div>
            <label>Edad:</label>
            <Field
              name="edad"
              type="number"
              className="p-inputtext p-component p-mb-3"
              placeholder="Edad"
            />
            <ErrorMessage
              name="edad"
              component="div"
              className="p-text-danger"
            />
          </div>

          <div className="p-d-flex p-gap-3">
            <Button
              type="submit"
              label={isEdit ? "Actualizar" : "Crear"}
              className="p-button-success p-button-rounded"
            />
            <Button
              label="Volver"
              className="p-button-secondary p-button-rounded"
              onClick={() => navigate("/usuarios")}
              type="button"
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
}
