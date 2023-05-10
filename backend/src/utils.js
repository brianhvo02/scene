export const snakeToCamel = str =>
    str.toLowerCase().replace(/([-_][a-z])/g, group =>
        group
        .toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );

export const extractAllowedParams = (allowedParams, result) => Object.fromEntries(allowedParams.map(key => [snakeToCamel(key), result[key]]));