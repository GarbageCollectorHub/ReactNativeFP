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
}


export default RatesModel;