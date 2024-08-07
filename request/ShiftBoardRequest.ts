import { PreferWorkdays } from "@/model/PreferWorkdays";
import axios, { AxiosResponse } from "axios";
import { Moment } from "moment";

export class ShiftBoardRequest{
    getPreferredEmployeesBydate = async(date:Moment):Promise<string[]>=>{
        try{
            const response:AxiosResponse = await axios.get(process.env.EXPO_PUBLIC_API_URL+'api/shift/shiftboard/getBoardByDate',
            {params:{date:date.format()}});
            return response.data;
        }catch(e){
            throw new Error("Get Failure"+(e as Error).message)
        }
    }
    updatePreferWorkday = async(preferWorkdays:PreferWorkdays):Promise<Object>=>{
        try{
            const response:AxiosResponse = await axios.put(process.env.EXPO_PUBLIC_API_URL+'api/shift/shiftboard/updateBoard',preferWorkdays);
            return response.data;
        }catch(e){
            throw new Error("Put Failure"+(e as Error).message)
        }
    }

    shiftToNextMonth = async():Promise<Object>=>{
        try{
            const response:AxiosResponse = await axios.put(process.env.EXPO_PUBLIC_API_URL+'api/shift/shiftboard/shiftToNextMonth');
            return response.data;
        }catch(e){
            throw new Error("Put Failure"+(e as Error).message)
        }
    }

    getCurrentMonth = async():Promise<number>=>{
        try{
            const response:AxiosResponse = await axios.get(process.env.EXPO_PUBLIC_API_URL+'api/shift/shiftboard/getCurrentMonth');
            return response.data;
        }catch(e){
            throw new Error("Get Failure"+(e as Error).message)
        }
    }

    getPreferredDatesByUser = async(username:string):Promise<Date[]>=>{
        try{
            const response:AxiosResponse = await axios.get(process.env.EXPO_PUBLIC_API_URL+'api/shift/shiftboard/getBoardByUser',{params:{username:username}});
            return response.data;
        }catch(e){
            throw new Error("Get Failure"+(e as Error).message)
        }
    }

}