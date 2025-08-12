import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import { InputText } from "primereact/inputtext"
import { InputNumber } from "primereact/inputnumber"
import { Password } from 'primereact/password';
import { Card } from "primereact/card"
import { Button } from "primereact/button"

const RegisterForm = () =>{
    const {register} = useContext(AuthContext)

    const initialValues = {
        nombre:'',
        email:'',
        password:'',
        edad:null,
    }

    const validationSchema= Yup.object({
        nombre: Yup.string().required('Campo requerido'),
        email: Yup.string().email('Email invalido').required('Campo requerido'),
        password: Yup.string().min(6,'Minimo 6 caracteres').required('Campo requerido'),
        edad: Yup.string().min(1).required('Campo requerido')
    })

    const onSubmit = async (values) =>{
        console.log("llego");
        
        await register(values)
    }

    return(
        <Card title='Registrarse'>
            <Formik initialValues={initialValues} validationSchema={validationSchema}
            onSubmit={onSubmit}>
                {({handleChange, values, setFieldValue})=>(
                    console.log(values),
                    
                    <Form>
                        <label>Nombre</label>
                        <InputText name='nombre' value={values.name} onChange={handleChange}/>
                        <span><ErrorMessage name='nombre'/></span>

                        <label>Email</label>
                        <InputText name='email' value={values.email} onChange={handleChange}/>
                        <span><ErrorMessage name='email'/></span>

                        <label>Contraseña</label>
                        <Password name="password" value={values.password}  onChange={handleChange} />
                        <span><ErrorMessage name='password'/></span>

                        <label>Edad</label>
                        <InputNumber name='edad' value={values.edad} onValueChange={(e)=>setFieldValue('edad',e.value)}  min={1} max={90}/>
                        <span><ErrorMessage name='edad'/></span>

                        <Button label="Registrarse" type='submit'/>
                    </Form>
                )}
            </Formik>
        </Card>
    )
}
export default RegisterForm