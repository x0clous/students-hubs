import { firestore } from '../../config/firebase.js';
const col = () => firestore.collection('users')
export async function findByUsuario(usuario){
    const user = await col().where('usuario', '==', usuario).limit(1).get()
    if (user.empty) return null
    const doc = user.docs[0]
    return {
        id: doc.id, 
        ...doc.data() //Sirve para regresar todos los datos como un solo objeto
    }
}
//Aqui es donde se va a insertar a la base de datos
export async function createUser(data){
    const usuarioNuevo = await col().add({
        ...data,
        createdAt: new Date().toISOString()
    })
    const doc = await usuarioNuevo.get()
    return {
        id: doc.id, 
       // ...doc.data() //Sirve para regresar todos los datos como un solo objeto
    }
}