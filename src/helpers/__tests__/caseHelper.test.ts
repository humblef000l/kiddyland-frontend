import { camelToSnake, camelToSnakeKeys, snakeToCamel, snakeToCamelKeys } from "../caseHelper";

describe('utilHelper',()=>{
    describe('camelToSnake', () => {
        it('should convert camelCase to snake_case', () => {
            expect(camelToSnake('customVariable')).toBe('custom_variable');
            expect(camelToSnake('customVariableTest')).toBe('custom_variable_test')
        });
    
        it('should handle single word without uppercase', () => {
            expect(camelToSnake('simple')).toBe('simple');
        })
    
        it('should handle strings that start with uppercase letters', () => {
            expect(camelToSnake('MyVariable')).toBe('my_variable');
        })
    
        it('should handle empty strings', () => {
            expect(camelToSnake('')).toBe('');
        });
    
        it('should handle consecutive uppercase letters', () => {
            expect(camelToSnake('getHTTPResponse')).toBe('get_h_t_t_p_response');
        });
    
        it('should handle already snake_case strings', () => {
            expect(camelToSnake('already_snake_case')).toBe('already_snake_case');
        });
    });
    
    describe('snakeToCamel', () => {
        it('should convert snake_case to camelCase', () => {
            expect(snakeToCamel('custom_variable')).toBe('customVariable');
        })
    
        it('should handle single word without uppercase', () => {
            expect(snakeToCamel('simple')).toBe('simple');
        })
    
        it('should handle empty strings', () => {
            expect(snakeToCamel('')).toBe('');
        });
    
        it('should handle consecutive uppercase letters', () => {
            expect(snakeToCamel('get_h_t_t_p_response')).toBe('getHTTPResponse');
        });
    
        it('should handle already snake_case strings', () => {
            expect(snakeToCamel('alreadyCamelCase')).toBe('alreadyCamelCase');
        });
    
    });
    
    describe('camelToSnakeKeys', () => {
        
        it('should convert object keys from camelCase to snake_case', () => {
            const input = {
                firstName: 'John',
                lastName: 'Doe',
                addressInfo: {
                    streetName: 'Main St',
                    zipCode: 12345
                }
            };
            const expected = {
                first_name: 'John',
                last_name: 'Doe',
                address_info: {
                    street_name: 'Main St',
                    zip_code: 12345
                }
            };
            expect(camelToSnakeKeys(input)).toEqual(expected);
        });
    
        it('should handle arrays of objects', () => {
            const input = [
                { firstName: 'John' },
                { lastName: 'Doe' }
            ];
            const expected = [
                { first_name: 'John' },
                { last_name: 'Doe' }
            ];
            expect(camelToSnakeKeys(input)).toEqual(expected);
        });
    
        it('should handle nested arrays and objects', () => {
            const input = {
                users: [
                    { userName: 'johndoe' },
                    { userName: 'janedoe' }
                ]
            };
            const expected = {
                users: [
                    { user_name: 'johndoe' },
                    { user_name: 'janedoe' }
                ]
            };
            expect(camelToSnakeKeys(input)).toEqual(expected);
        });
    
        it('should return null if input is null', () => {
            expect(camelToSnakeKeys(null)).toBeNull();
        });
    
        it('should return primitives as-is', () => {
            expect(camelToSnakeKeys('string')).toBe('string');
            expect(camelToSnakeKeys(123)).toBe(123);
            expect(camelToSnakeKeys(true)).toBe(true);
        });
    
        it('should handle empty objects and arrays', () => {
            expect(camelToSnakeKeys({})).toEqual({});
            expect(camelToSnakeKeys([])).toEqual([]);
        });
    });
    
    describe('snakeToCamelKeys', () => {
        it('should convert object keys from snake_case to camelCase', () => {
            const input = {
                first_name: 'John',
                last_name: 'Doe',
                address_info: {
                    street_name: 'Main St',
                    zip_code: 12345
                }
            };
            const expected = {
                firstName: 'John',
                lastName: 'Doe',
                addressInfo: {
                    streetName: 'Main St',
                    zipCode: 12345
                }
            };
            expect(snakeToCamelKeys(input)).toEqual(expected);
        });
    
        it('should handle arrays of objects', () => {
            const input = [
                { first_name: 'John' },
                { last_name: 'Doe' }
            ];
            const expected = [
                { firstName: 'John' },
                { lastName: 'Doe' }
            ];
            expect(snakeToCamelKeys(input)).toEqual(expected);
        });
    
        it('should handle nested arrays and objects', () => {
            const input = {
                users: [
                    { user_name: 'johndoe' },
                    { user_name: 'janedoe' }
                ]
            };
            const expected = {
                users: [
                    { userName: 'johndoe' },
                    { userName: 'janedoe' }
                ]
            };
            expect(snakeToCamelKeys(input)).toEqual(expected);
        });
    
        it('should return null if input is null', () => {
            expect(snakeToCamelKeys(null)).toBeNull();
        });
    
        it('should return the value as-is if it is a primitive', () => {
            expect(snakeToCamelKeys(123)).toBe(123);
            expect(snakeToCamelKeys('string')).toBe('string');
            expect(snakeToCamelKeys(true)).toBe(true);
        });
    
        it('should handle empty objects and arrays', () => {
            expect(snakeToCamelKeys({})).toEqual({});
            expect(snakeToCamelKeys([])).toEqual([]);
        });
    });
})