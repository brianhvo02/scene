export const snakeToCamel = str =>
    str.toLowerCase().replace(/([-_][a-z])/g, group =>
        group
        .toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );

export const extractAllowedParams = (allowedParams, result, convertSnake = true) => 
    Object.fromEntries(allowedParams.map(key => [
        (convertSnake ? snakeToCamel(key) : key), 
        result[key]
    ]));