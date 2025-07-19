

export interface ProductVariants {
    values: string[];
    title: string;
}

export const generateSKU = (
    productName: string,
    attributes: Record<string, string>
) => {
    const namePrefix = productName
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase()
        .substring(0, 3)
        .padEnd(3, "X");

    const attributeParts = Object.values(attributes).map((value) =>
        value
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase()
            .substring(0, 4)
    );

    return [namePrefix, ...attributeParts].join("-");
};

export const generateVariantCombinations = (variants: ProductVariants[]) => {
    if (!variants.length) return [];

    const combinations: Array<{
        name: string;
        attributes: Record<string, string>;
    }> = [];

    function cartesianProduct(arrays: string[][]): string[][] {
        return arrays.reduce(
            (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
            [[]] as string[][]
        );
    }

    const validVariants = variants.filter(
        (v) => v.title && v.values && v.values.length > 0
    );
    if (validVariants.length === 0) return [];

    const valueArrays = validVariants.map((v) => v.values);
    const combinations_raw = cartesianProduct(valueArrays);

    combinations_raw.forEach((combo) => {
        const attributes: Record<string, string> = {};
        const nameParts: string[] = [];

        combo.forEach((value, index) => {
            const variantTitle = validVariants[index].title;
            attributes[variantTitle] = value;
            nameParts.push(value);
        });

        combinations.push({
            name: nameParts.join(" / "),
            attributes,
        });
    });

    return combinations;
};