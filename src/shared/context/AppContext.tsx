import { createContext } from "react"


type AppContextType = {
    navigate: (href:string) => void,
    user: string | null,
    setUser: (user:string|null) => void,
    request: (url:string, ini?: any) => Promise<any>,
};


const init: AppContextType = {
    navigate: (_:string) => { throw "navigate no implemented"; },
    user: null,
    setUser: (_:string|null) => { throw "setUser no implemented"; },
    request: (_:string, __:any) => { throw "request no implemented"; },
}

export const AppContext = createContext<AppContextType>(init);