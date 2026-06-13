import { Either } from "../util/Either";

export type ValidationRule = (value: string) => string | null;

export interface ValidationRules {
    rules: ValidationRule[]
}

export const withValidation = (value: string, rules: ValidationRules): Either<string, string> => {
    for (const rule of rules.rules) {
        const error = rule(value)
        if (error) return { tag: 'left', error }
    }
    return { tag: 'right', value };
}
