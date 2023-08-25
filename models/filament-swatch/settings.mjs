export const settings = {
    label: "Filament Swatch",
    "filenameTemplate": (parameters) => `filament-swatch.stl`,
    "parameters": [
        {
            "type": "string",
            "name": "material",
            "label": "Material",
            "placeholder": "PLA",
        },
        {
            "type": "string",
            "name": "brand",
            "label": "Brand",
        },
        {
            "type": "string",
            "name": "name",
            "label": "Name",
        },
        {
            "type": "number",
            "name": "size",
            "label": "Font size",
            "defaultValue": "6",
        },
    ],
};
