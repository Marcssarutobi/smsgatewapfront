import { MessageResponse } from "../type/common";
import { Device } from "../type/device";
import { api } from "./api";

export const deviceService = {

    listAllDevice: async():Promise<Device[]>=>{
        const {data} = await api.get('/devices')
        return data
    },

    showDevice: async(id:number):Promise<Device>=>{
        const {data} = await api.get(`/devices/${id}`)
        return data
    },

    generatePairingCode: async ()=>{
        const {data} = await api.post<{ pairing_token: string; qr_payload: string; expires_in: number }>('/devices/pairing-code')
        return data
    },

    renameDevice: async(id:number,name:string):Promise<Device>=>{
        const {data} = await api.patch(`/devices/${id}`, { name })
        return data
    },

    destroyDevice: async (id:number)=>{
        const {data} = await api.delete<MessageResponse>(`/devices/${id}`)
        return data
    }

}