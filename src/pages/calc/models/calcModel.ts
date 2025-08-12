


class CalcModel {
    static #instance: CalcModel | null;
    static get instance(): CalcModel {
        if (CalcModel.#instance == null) {
            CalcModel.#instance = new CalcModel();
        }
        return CalcModel.#instance;
    }

    result: string = "0";
    expression: string = "";
    firstOperand: number | null = null;
    secondOperand: number | null = null;
    operation: string | null = null;
    isSecondOperand: boolean = false;
    lastOpAndOperand: { op: string, val: number } | null = null;
}

export default CalcModel;
