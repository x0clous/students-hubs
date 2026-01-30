import bcrypt from 'bcrypt'
import * as UserRepo from './users.repository.js'

export async function create(payload){
    const existing= await UserRepo.findByUsuario(payload.usuario)
    if(existing)
    {
        const err=new Error('Usuario ya existe')
        err.statusCode=409
        throw err
    }
    const hash=await bcrypt.hash(payload.password, 10)
    const user=await UserRepo.createUser({
        matricula: payload.matricula,
        nombre: payload.nombre,
        apaterno: payload.apaterno,
        amaterno: payload.amaterno ?? '',
        usuario: payload.usuario,
        passwordHash: hash,
        activo: true
    })
    return sanitize(user)
}
export async function update(id, patch){
    const user= await UserRepo.getById(id)
    if(!user){
        const e = new Error('User not found')
        e.statusCode = 404
        throw e
    }
    const data = { ...patch }
    if(patch.password){
        data.passwordHash = await bcrypt.hash(patch.password, 10)
        delete data.password
    }
    const updated = await UserRepo.updateUser(id, data)
    return sanitize(updated)
}


export async function remove(id, patch){
    const user= await UserRepo.getById(id)
    if(!user){
        const e = new Error('User not found')
        e.statusCode = 404
        throw e
    }
    const updated = await UserRepo.softDelete(id)
    return sanitize(updated)
}

export async function list(params){
    const users= await UserRepo.list(params)
    return users.map(sanitize)
}

//Sirve para mantener el hash
function sanitize(user){
    const{ passwordHash, ...safe}=user
    return safe
}