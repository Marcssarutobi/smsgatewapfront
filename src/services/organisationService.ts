import { Organisation } from '../type/organisation';
import {api} from './api'

export const organisationService = {

    show: async ():Promise<Organisation>=>{
        const {data} = await api.get('/organisation')
        return data
    },

    update: async (payload:Pick<Organisation,'name'> & Partial<Pick<Organisation, 'signature' | 'website' | 'phone' | 'address'>>)=>{
        const {data} = await api.put('/organisation',payload)
        return data
    }

}