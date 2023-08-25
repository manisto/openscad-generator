const validTypes = ["boolean", "number", "string"];

export function mapModels(modelMap, currentModel) {
    return Array
        .from(modelMap)
        .map(([model, settings]) => ({
            model,
            label: settings.label,
            selected: currentModel === model,
        }));
}

export function mapGroups(groups) {
    if (!groups) {
        return null;
    }

    return groups
        .filter(group => group.parameters && group.parameters.length !== 0)
        .map(group => ({
            ...group,
            parameters: mapParameters(group.parameters),
        }));
}

export function mapParameters(parameters) {
    if (!parameters) {
        return null;
    }
    
    return parameters.map(parameter => ({
        ...parameter,
        possibleValues: mapPossibleValues(parameter),
        type: {
            [validTypes.includes(parameter.type) ? parameter.type : "other"]: true,
            _specified: parameter.type
        },
    }));
}

export function mapPossibleValues({name, type: parameterType, possibleValues}) {
    if (!possibleValues) {
        return null;
    }

    const label = "label";
    const value = "value";

    return possibleValues.map(possibleValue => {
        const valueType = typeof possibleValue;

        if (valueType === "object") {
            if (![label, value].every(prop => prop in possibleValue)) {
                console.error(`Missing label or value for parameter ${name}:`, possibleValue);
                return null;
            }

            if (typeof possibleValue[label] !== "string") {
                console.error(`Label is not string for parameter ${name}:`, possibleValue);
                return null;
            }

            const optionValueType = typeof possibleValue[value];

            if (optionValueType !== parameterType) {
                console.error(`Wrong value type for parameter ${name} (was ${optionValueType}, expected ${parameterType}):`, possibleValue);
                return null;
            }

            return possibleValue;
        }

        if (validTypes.includes(valueType)) {
            if (valueType !== parameterType) {
                console.error(`Wrong value type for parameter ${name} (was ${valueType}, expected ${parameterType}):`, possibleValue);
                return null;
            }

            return {
                [label]: possibleValue,
                [value]: possibleValue,
            };
        }

        console.error("Skipping unknown possible value:", possibleValue);
        return null;
    }).filter(value => value !== null);
}
