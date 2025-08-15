import NbuRate from "../types/NbuRate";


// Модель для хранения состоний Компонента - Курс Валют
// Для сохранения данных между повторными инициализациями компонента при переходе между Calc/Game/Rates

class RatesModel {
    static #instance: RatesModel | null;        // # в JS - синтаксис для создания приватных полей
    static get instance(): RatesModel {
        if(RatesModel.#instance == null) {
            RatesModel.#instance = new RatesModel();
        }
        return RatesModel.#instance;
    }
    rates: Array<NbuRate> = [];
    shownRates: Array<NbuRate> = [];
    searchText: string = "";
    date: Date = new Date;
    ratesByDate: { [key: string]: Array<NbuRate> } = {}   // кеширование курсов по датам
}


export default RatesModel;