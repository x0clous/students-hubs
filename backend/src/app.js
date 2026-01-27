import express from 'express'
import cors from 'cors'
import {env} from './config/env.js'
import { errorMiddleware} from './middleware/error.middleware.js'
import { authRoutes } from './modules/auth/auth.routes.js'

export function buildApp(){
    const app=express ()
    app.use(cors({
        origin: env.CORS_ORIGIN,
        credentials: true
    })) 
    //Sirve para hacer la busqueda desde backend y no regresar archivos muy grandes
    app.use(express.json({
        limit: '1mb'
    }))
    app.get('/health', (_, res)=> res.json({
        ok: true,
        name: 'students-hub-api 👩‍💻',
        student: 'Ximena Tenorio Arredondo'
    }))
    app.use('/auth', authRoutes)

    app.use(errorMiddleware)
    return app
}