
 /**
 * Hydra Error returned by the API
 */

 export default class HydraError {
    private _title: string;
    private _description: string;
    private _arrayInvalidAttributes: Array<{
        fieldName?: string;
        description?: string;
    }>;

    constructor(title: string, description: string) {
        this._title = title;
        this._description = description;
        this._arrayInvalidAttributes = new Array<{
            fieldName?: string;
            description?: string;
        }>();
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get arrayInvalidAttributes(): Array<{
        fieldName?: string;
        description?: string;
    }> {
        return this._arrayInvalidAttributes;
    }

    set arrayInvalidAttributes(
        value: Array<{ fieldName?: string; description?: string }>
    ) {
        this._arrayInvalidAttributes = value;
    }

    addInvalidAttribute(attributeName: string, description: string) {
        this.arrayInvalidAttributes.push({
            fieldName: attributeName,
            description: description,
        });
    }

    /**
     * Returns the corresponding enumeration related to HydraErrorEnum.
     *
     * For example, if this._description = "Not Found", then this function will return the corresponding key which is NOT_FOUND.
     * If there is any corresponding key, then it will return null.
     * @see APIErrorEnum
     * @deprecated
     */
    public getCorrespondingEnum(): string | null {
        return null
       //  Functions.getEnumKeyByEnumValue(APIErrorEnum, this._description);
    }
}
