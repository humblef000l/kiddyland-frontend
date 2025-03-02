/**
 * Converts a camelCase string to snake_case.
 *
 * @param {string} str - The camelCase string to convert.
 * @returns {string} - The converted snake_case string.
 *
 * @example
 * camelToSnake('myVariableName'); // 'my_variable_name'
 */
export const camelToSnake = (str: string): string => {
    return str.replace(/([A-Z])/g, (match, p1, offset) => (offset ? '_' : '') + p1).toLowerCase();
}

/**
 * Converts a snake_case string to camelCase.
 *
 * @param {string} str - The snake_case string to convert.
 * @returns {string} - The converted camelCase string.
 *
 * @example
 * snakeToCamel('my_variable_name'); // 'myVariableName'
 */
export const snakeToCamel = (str:string):string=>{
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Recursively converts all keys of an object or array from camelCase to snake_case.
 *
 * @param {any} obj - The object or array to process.
 * @returns {any} - A new object or array with all keys in snake_case.
 *
 * @example
 * camelToSnakeKeys({ myVariableName: 'value' });
 * // { my_variable_name: 'value' }
 */
export const camelToSnakeKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(camelToSnakeKeys);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                camelToSnake(key),
                camelToSnakeKeys(value)
            ])
        );
    }
    return obj;
};


/**
 * Recursively converts all keys of an object or array from snake_case to camelCase.
 *
 * @param {any} obj - The object or array to process.
 * @returns {any} - A new object or array with all keys in camelCase.
 *
 * @example
 * snakeToCamelKeys({ my_variable_name: 'value' });
 * // { myVariableName: 'value' }
 */
export const snakeToCamelKeys = (obj:any):any=>{
    if(Array.isArray(obj)){
        return obj.map(snakeToCamelKeys);
    }else if(obj !== null && typeof obj == 'object'){
        return Object.fromEntries(
            Object.entries(obj).map(([key,value])=>[
                snakeToCamel(key),
                snakeToCamelKeys(value),
            ])
        )
    }
    return obj;
}