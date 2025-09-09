import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup'
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

const ResetPassword = () =>{

    const resetSchema = Yup.object({
        password: Yup.string().min(6, "minimo 6 caracteres").required('La contraseña es requerida'),
        confirm: Yup.string().oneOf([Yup.ref("password")], "Las contraseñas no coinciden").required('Repeti la contraseña')
    })

    const {resetPassword} = useContext(AuthContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [params, setParams] = useState({token: '', id:''})

    useEffect(()=>{
        const url = new URLSearchParams(window.location.search)
        setParams({token: url.get("token")|| "", id: url.get('id') || ''})        
    }, [])

    const invalidLink = !params.token || !params.id

    return(
        <Card title='Nueva contraseña'>
            {invalidLink ? <h5>Enlace invalido o incompleto</h5> : 
            
            <Formik
            initialValues={{password: '', confirm: ''}}
            validationSchema={resetSchema}
            onSubmit={async(values, {resetForm})=>{
                setLoading(true)
                const response = await resetPassword({
                    id: params.id,
                    token: params.token,
                    password: values.password
                })
                if(response){
                    resetForm()
                    navigate('/inicio-sesion')
                }
                setLoading(false)
            }}
            >
             {({values, handleChange, handleBlur})=>(
                <Form>
                    <label>Nueva contraseña</label>
                    <Password
                    id='password'
                    name='password'
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nueva contraseña"
                    feedback={false}
                    />
                    <ErrorMessage name="password"/>

                    <label>Repetir contraseña</label>

                    <Password
                    id='confirm'
                    name='confirm'
                    value={values.confirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Repetir contraseña"
                    feedback={false}
                    />

                    <ErrorMessage name="confirm"/>

                    <Button
                    type="submit"
                    label="Guardar contraseña"
                    icon={loading ? "pi pi-spin pi-spinner" : 'pi pi-send'}
                    />

                </Form>

             )}   
            </Formik>

            }
        </Card>
    )

}

export default ResetPassword