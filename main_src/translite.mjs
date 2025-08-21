export class TransliteBind {
    constructor() {
        this.keyworld = {
            "variabel": "var",
            "buatkan": "let",
            "tetapkan": "const"
        };

        this.type = {
            "teks": "string",
            "angka": "number",
            "boolean": "boolean",
            "pecahan": "number",
            "apapun": "any",
            "kosong": "void",
            "kunci": "key"
        };
        
        this.transFunction = {
            "menampilkan": "console.log",
            "konsol": "console",
            "waktu": "Date",
            "tunggu": "setTimeout",
            "interval": "setInterval",
            "hentikan": "clearTimeout",
            "hentikanInterval": "clearInterval",
            "pemetaan": "Map",
        };
        
        this.otherKeyworld = {
            'Benar': 'true',
            'Salah': 'false',
            'setaraDengan': '===',
            'samaDengan': '==',
            'tidakSamaDengan': '!==',
            'bukan': '!',
            'dan': '&&',
            'atau': '||',
            'lebihDari': '>',
            'kurangDari': '<',
            'lebihAtauSamaDari': '>=',
            'kurangAtauSamaDari': '<=',
            'tipeDari': 'typeof',
            'tipe': 'typeof',
            'simpan': 'this',
            'simpanan': 'this',
            'lempar': 'throw',
            'panggil': 'new',
            'keluar': 'break',
            'lanjutkan': 'continue',
            'kembalikan': 'return',
            'kelas': 'class',
            'klas': 'class',
            'ekstenti': 'extention',
        };
        
        this.sintax = `
// default sintax
const readline = await import('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menanyakan(...question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        }); 
    }); 
}

function menkonfirmasi(...question) {
    return new Promise((resolve) => {
        rl.question(\`$\{
            question ? question : "apakah kamu setujuh? "
        \} [Y/N]: \`, (answer) => {
            return answer.toLowerCase() === 'y' ? true: false
        }); 
    }); 
}

function panjang(item) {
    return item.length
}

`;
    }
    
    translite(code) {
        if (!code || typeof code !== 'string') {
            throw new Error('Input code must be a non-empty string');
        }

        let result = code;

        // 1. Process variables
        result = this.processVariables(result);
        
        // 2. Process functions
        result = this.processTransFunction(result);
        
        // 3. Process function declarations
        result = this.processFunctionDeclarations(result);
        
        // 4. Process generic types
        result = this.processGenericTypes(result);
        
        // 5. Process control flow statements
        result = this.TransStatement(result);
        
        // 6. Process statement key-string (template literals)
        result = this.TransKeyString(result);
        
        // 7. Process other keywords
        result = this.TransKeyword(result);
        
        // 8. Clean up
        // result = this.cleanupResult(result);
        
        result = `${this.sintax}\n${result}`

        return result;
    }

    processVariables(code) {
        let result = code;
        
        for (const indo_type in this.type) {
            if (this.type.hasOwnProperty(indo_type)) {
                const shorthandWithTypePattern = new RegExp(
                    `;;(\\w+)\\s*:\\s*${this.escapeRegex(indo_type)}\\s*;`,
                    "g"
                );
                
                result = result.replace(shorthandWithTypePattern, (match, varName) => {
                    let defaultValue;
                    switch (indo_type) {
                        case 'teks':
                            defaultValue = "''";
                            break;
                        case 'angka':
                            defaultValue = "0";
                            break;
                        case 'boolean':
                            defaultValue = "false";
                            break;
                        case 'pecahan':
                            defaultValue = "0.0";
                            break;
                        default:
                            defaultValue = "undefined";
                    }
                    return `var ${varName} = ${defaultValue};`;
                });
            }
        }
        
        // ;;varName; → var varName = undefined;
        result = result.replace(
            /;;(\w+)\s*;/g,
            "var $1 = undefined;"
        );
        
        for (const indo_keyword in this.keyworld) {
            if (this.keyworld.hasOwnProperty(indo_keyword)) {
                const ts_keyword = this.keyworld[indo_keyword];
                
                for (const indo_type in this.type) {
                    if (this.type.hasOwnProperty(indo_type)) {
                        const ts_type = this.type[indo_type];
                
                        // Basic variables
                        const basicPattern = new RegExp(
                            `\\b(${this.escapeRegex(indo_keyword)})\\s+(\\w+)\\s*:\\s*(${this.escapeRegex(indo_type)})\\s*=\\s*([^;]+);?`,
                            "gi"
                        );
                        result = result.replace(basicPattern, `${ts_keyword} $2 = $4;`);

                        // Array types
                        const arrayPattern = new RegExp(
                            `\\b(${this.escapeRegex(indo_keyword)})\\s+(\\w+)\\s*:\\s*\\[\\s*(${this.escapeRegex(indo_type)})\\s*\\]\\s*([+*?]?)\\s*=\\s*([^;]+);?`,
                            "gi"
                        );
                        result = result.replace(arrayPattern, `${ts_keyword} $2 = $5;`);

                        // Object types - Fixed regex pattern
                        const objectPattern = new RegExp(
                            `\\b(${this.escapeRegex(indo_keyword)})\\s+(\\w+)\\s*:\\s*\\{\\s*([^}]*?)\\}\\s*=\\s*([^;]+);?`,
                            "gi"
                        );
                        result = result.replace(objectPattern, (match, keyword, varName, typeContent, value) => {
                            return `${ts_keyword} ${varName} = ${value};`;
                        });

                        // Nested arrays
                        const nestedArrayPattern = new RegExp(
                            `\\b(${this.escapeRegex(indo_keyword)})\\s+(\\w+)\\s*:\\s*(\\[\\[\\s*${this.escapeRegex(indo_type)}\\s*\\]\\])\\s*=\\s*([^;]+);?`,
                            "gi"
                        );
                        result = result.replace(nestedArrayPattern, `${ts_keyword} $2 = $4;`);
                    }
                }
            }
        }
        
        return result;
    }
    
    processTransFunction(code) {
        let result = code;
        
        for (const indo_keyword in this.transFunction) {
            if (this.transFunction.hasOwnProperty(indo_keyword)) {
                const ts_keyword = this.transFunction[indo_keyword];
            
                // Pattern untuk function dengan parameter
                const functionPattern = new RegExp(
                    `\\b(${this.escapeRegex(indo_keyword)})\\s*\\(\\s*([^)]*)\\s*\\)`,
                    "gi"
                );
                result = result.replace(functionPattern, `${ts_keyword}($2)`);
                
                // Pattern untuk method chaining - Fixed logic
                const methodPattern = new RegExp(
                    `\\b(\\w+)\\.(${this.escapeRegex(indo_keyword)})\\s*\\(\\s*([^)]*)\\s*\\)`,
                    "gi"
                );
                result = result.replace(methodPattern, (match, object, method, params) => {
                    // Don't translate the object name, only the method
                    return `${object}.${ts_keyword}(${params})`;
                });
            }
        }
        
        return result;
    }

    processFunctionDeclarations(code) {
        let result = code;
        
        // Pattern untuk function declaration
        const functionDeclarationPattern = new RegExp(
            `(\\s*|\\n*)\\b(fungsi)\\s+(\\w+)\\s*\\(([^)]*)\\)\\s*:\\s*(\\w+)\\s*\\{`,
            "gi"
        );
        
        result = result.replace(functionDeclarationPattern, (match, space, keyword, funcName, params, returnType) => {
            const translatedParams = this.translateFunctionParams(params);
            return `${space}function ${funcName}(${translatedParams}) {`;
        });
        
        // Pattern untuk arrow function
        const arrowFunctionPattern = new RegExp(
            `(\\s*|\\n*)\\s*(\\w+)\\s*=\\s*\\(([^)]*)\\)\\s*:\\s*(\\w+)\\s*=>`,
            "gi"
        );
        
        result = result.replace(arrowFunctionPattern, (match, space, funcName, params, returnType) => {
            const translatedParams = this.translateFunctionParams(params);
            return `${space}${funcName} = (${translatedParams}) =>`;
        });
        
        return result;
    }

    translateFunctionParams(params) {
        if (!params.trim()) return '';
        
        return params.split(',').map(param => {
            const trimmed = param.trim();
            // Remove TypeScript type annotations for JavaScript
            const typeMatch = trimmed.match(/(\w+)\s*:\s*(\w+)/);
            
            if (typeMatch) {
                const [, paramName] = typeMatch;
                return paramName;
            }
            
            return trimmed;
        }).join(', ');
    }

    processObjectType(typeContent) {
        return `{}`;
    }

    processGenericTypes(result) {
        // In JavaScript, we don't need generic type annotations, so we can remove them
        for (const indoType in this.type) {
            if (this.type.hasOwnProperty(indoType)) {
                // Generic Array
                const genericArrayPattern = new RegExp(`Array<${this.escapeRegex(indoType)}>`, 'gi');
                result = result.replace(genericArrayPattern, `Array`);
                
                // Generic Promise
                const promisePattern = new RegExp(`Promise<${this.escapeRegex(indoType)}>`, 'gi');
                result = result.replace(promisePattern, `Promise`);
                
                // Generic Map
                const mapPattern = new RegExp(`Map<(\\w+),\\s*${this.escapeRegex(indoType)}>`, 'gi');
                result = result.replace(mapPattern, `Map`);
                
                // Generic Set
                const setPattern = new RegExp(`Set<${this.escapeRegex(indoType)}>`, 'gi');
                result = result.replace(setPattern, `Set`);
            }
        }
        
        return result;
    }
    
    TransStatement(code) {
        let result = code;
        
        // Control flow statements
        result = this.statementIf(result);
        
        // Loops
        result = this.statementLoop(result);
        
        // Try-catch-finally
        result = this.statementExcept(result);
        
        // Switch case
        result = this.statementSwitch(result);
        
        // Import/export
        result = this.statementImport(result);
        result = this.statementExport(result);
        
        // Async/await
        result = this.statementAsyncAwait(result);
        
        // Label and interface
        result = this.statementLabelInterface(result);
        
        return result;
    }
    
    statementIf(code) {
        let result = this.statementIfelse(code);
        result = result.replace(
            /(\s*)\s*jika\s*\(([^)]+)\)\s*\{/g,
            "$1if ($2) {"
        );
        return this.statementElse(result);
    }
    
    statementIfelse(code) {
        return code.replace(
            /(\s*)\}\s*selain\s*jika\s*\(([^)]+)\)\s*\{/g,
            "$1} else if ($2) {"
        );
    }
    
    statementElse(code) {
        return code.replace(
            /(\s*)\}\s*selain\s*\{/g,
            "$1} else {"
        );
    }
    
    statementLoop(code) {
        let result = this.statementDo(code);
        result = this.statementWhile(result);
        return this.statementFor(result);
    }
    
    statementDo(code) {
        let result = code.replace(/(\s*)lakukan\s*\{/g, "$1do {");
        return result.replace(
            /(\s*)\}\s*selama\s*\(([^)]+)\)/g,
            "$1} while ($2)"
        );
    }
    
    statementWhile(code) {
        return code.replace(
            /(\s*)selama\s*\(([^)]+)\)\s*\{/g,
            "$1while ($2) {"
        );
    }
    
    statementFor(code) {
        let result = code;
        const types = {
            "dalam": "in",
            "dari": "of"
        };
        
        // Basic for loop pattern
        result = result.replace(
            /(\s*)untuk\s*\(([^)]+)\)\s*\{/g,
            "$1for ($2) {"
        );
        
        // For-in and for-of loops
        for (const indo_typeOperator in types) {
            if (types.hasOwnProperty(indo_typeOperator)) {
                const ts_typeOperator = types[indo_typeOperator];
                
                for (const indo_keyword in this.keyworld) {
                    if (this.keyworld.hasOwnProperty(indo_keyword)) {
                        const ts_keyword = this.keyworld[indo_keyword];
                        
                        // Pattern: untuk (buatkan item dalam array)
                        const forInOfPattern = new RegExp(
                            `(\\s*)untuk\\s*\\(\\s*${this.escapeRegex(indo_keyword)}\\s+(\\w+)\\s+${this.escapeRegex(indo_typeOperator)}\\s+(\\w+)\\s*\\)\\s*\\{`,
                            "gi"
                        );
                        result = result.replace(forInOfPattern, `$1for (${ts_keyword} $2 ${ts_typeOperator} $3) {`);
                        
                        // Traditional for loop with type
                        for (const indo_type in this.type) {
                            if (this.type.hasOwnProperty(indo_type)) {
                                const traditionalForPattern = new RegExp(
                                    `(\\s*)untuk\\s*\\(\\s*${this.escapeRegex(indo_keyword)}\\s+(\\w+)\\s*:\\s*${this.escapeRegex(indo_type)}\\s*=\\s*([^;]+)\\s*;\\s*([^;]+)\\s*;\\s*([^)]+)\\s*\\)\\s*\\{`,
                                    "gi"
                                );
                                result = result.replace(traditionalForPattern, `$1for (${ts_keyword} $2 = $3; $4; $5) {`);
                                
                                const arrayForPattern = new RegExp(
                                    `(\\s*)untuk\\s*\\(\\s*${this.escapeRegex(indo_keyword)}\\s*\\[\\s*(\\w+)\\s*:\\s*${this.escapeRegex(indo_type)}\\s*,\\s*(\\w+)\\s*:\\s*${this.escapeRegex(indo_type)}\\s*\\]\\s+${this.escapeRegex(indo_typeOperator)}\\s+(\\w+)\\s*\\)\\s*\\{`,
                                    "gi"
                                );
                                result = result.replace(arrayForPattern, `$1for ([${ts_keyword} $2, ${ts_keyword} $3] ${ts_typeOperator} $4) {`);
                            }
                        }
                    }
                }
            }
        }
        
        return result;
    }
    
    statementExcept(code) {
        let result = this.statementTry(code);
        result = this.statementCatch(result);
        return this.statementFinally(result);
    }
    
    statementTry(code) {
        return code.replace(
            /(\s*)\s*coba\s*\{/g,
            "$1try {"
        );
    }
    
    statementCatch(code) {
        return code.replace(
            /(\s*)\}\s*tangkap\s*\(([^)]+)\)\s*\{/g,
            "$1} catch ($2) {"
        );
    }
    
    statementFinally(code) {
        return code.replace(
            /(\s*)\}\s*akhirnya\s*\{/g,
            "$1} finally {"
        );
    }
    
    statementSwitch(code) {
        let result = code.replace(
            /(\s*)\s*mengalihkan\s*\(([^)]+)\)\s*\{/g,
            "$1switch ($2) {"
        );
        result = this.statementCase(result);
        return this.statementDefault_1(result);
    }
    
    statementCase(code) {
        return code.replace(
            /(\s*)\s*kasus\s+([^:]+)\s*:/g,
            "$1case $2:"
        );
    }
    
    statementDefault_1(code) {
        return code.replace(
            /(\s*)\s*bawaan\s*:/g,
            "$1default:"
        );
    }
    
    statementExport(code) {
        let result = code.replace(
            /(\s*)ekspor\s+\{([^}]+)\}/g,
            "$1export { $2 }"
        );
        
        result = result.replace(
            /(\s*)ekspor\s+bawaan\s+([^;\n]+)/g,
            "$1export default $2"
        );
        
        result = result.replace(
            /(\s*)ekspor\s+([^;\n{]+)/g,
            "$1export $2"
        );
        
        return result;
    }
    
    statementImport(code) {
        let result = code;
        
        // 1. dari 'sini' impor * sebagai sesuatu → import * as sesuatu from 'sini'
        result = result.replace(
            /(\s*)dari\s+(['"`][^'"`]+['"`])\s+impor\s+\*\s+sebagai\s+(\w+)/g,
            "$1import * as $3 from $2"
        );
        
        // 2. dari 'sini' impor {ke sebagai kata_arah, ini sebagai kata_tunjuk} → import {ke as kata_arah, ini as kata_tunjuk} from 'sini'
        result = result.replace(
            /(\s*)dari\s+(['"`][^'"`]+['"`])\s+impor\s+\{([^}]+)\}/g,
            (match, indent, source, imports) => {
                // Process the imports inside braces to handle 'sebagai' → 'as'
                const processedImports = imports.replace(/(\w+)\s+sebagai\s+(\w+)/g, '$1 as $2');
                return `${indent}import {${processedImports}} from ${source}`;
            }
        );
        
        // 3. dari 'sini' impor (ke, sini, ini, apa) → import {ke, sini, ini, apa} from 'sini'
        result = result.replace(
            /(\s*)dari\s+(['"`][^'"`]+['"`])\s+impor\s+\(([^)]+)\)/g,
            "$1import { $3 } from $2"
        );
        
        // 4. dari 'sini' impor ini → import ini from 'sini'
        result = result.replace(
            /(\s*)dari\s+(['"`][^'"`]+['"`])\s+impor\s+(\w+)/g,
            "$1import $3 from $2"
        );
        
        // 5. impor './ini.js' → import './ini.js'
        result = result.replace(
            /(\s*)impor\s+(['"`][^'"`]+['"`])/g,
            "$1import $2"
        );
        
        result = result.replace(
            /(\s*)impor\s+\((['"`][^'"`]+['"`])\)/g,
            "$1import($2);"
        );
        // 6. Handle any remaining 'sebagai' → 'as' (for edge cases)
        result = result.replace(
            /(\w+)\s+sebagai\s+(\w+)/g,
            "$1 as $2"
        );
        
        return result;
    }
    
    statementAsyncAwait(code) {
        let result = code.replace(
            /(\s*)sinkron\s+(fungsi|\w+)/g,
            "$1async $2"
        );
        
        result = result.replace(
            /(\s*)menunggu\s+([^;\n]+)/g,
            "$1await $2"
        );
        
        return result;
    }
    
    statementLabelInterface(code) {
        let result = code.replace(
            /(\s+)label\s+(\w+)\s+\{/g,
            "$1label $2 {"
        )
        result = code.replace(
            /(\s+)tatapmuka\s+(\w+)\s+\{/g,
            "$1interface $2 {"
        )
        return result
    }
    
    TransKeyword(code) {
        let result = code;
        
        // Process keywords with word boundaries to avoid partial replacements
        for (const indo_keyword in this.otherKeyworld) {
            if (this.otherKeyworld.hasOwnProperty(indo_keyword)) {
                const ts_keyword = this.otherKeyworld[indo_keyword];
                
                // Use word boundaries (\b) for better precision
                const pattern = new RegExp(`([^])\\b(\\s+|\\W*|\\D*|\\S*)${this.escapeRegex(indo_keyword)}\\b(\\s+|\\W*|\\D*|\\S*)([^])`, "g");
                result = result.replace(pattern, `$1 $2${ts_keyword}$3 $4`);
            }
        }
        
        return result;
    }
    
    TransKeyString(code) {
        let result = code;
        
        // Template literal with variables k"...{variable}..." → `...${variable}...`
        result = result.replace(
            /k(["'`])([^]*?)\{([^]*?)\}([^]*?)\1/g,
            '`$2\$\{$3\}$4`'
        );
        
        // Multiple variable interpolation
        result = result.replace(
            /k(["'`])([^]*?)\1/g,
            (match, quote, content) => {
                // Replace all {variable} patterns with ${variable}
                const processedContent = content.replace(/\{([^]*?)\}/g, '\$\{$1\}');
                return '`' + processedContent + '`';
            }
        );
        
        // Template literal k"..." → `...`
        result = result.replace(
            /k(["'`])([^]*?)\1/g,
            '`$2`'
        );
        
        return result;
    }
    
    cleanupResult(result) {
        return result
            // Normalize line breaks
            .replace(/\s*\n\s*/g, '\n')
            // Remove extra spaces but preserve single spaces
            .replace(/[ \t]+/g, ' ')
            // Remove duplicate semicolons
            .replace(/;\s*;/g, ';')
            // Normalize punctuation spacing
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*:\s*/g, ': ')
            .replace(/\s*=\s*/g, ' = ')
            // Clean brackets and parentheses
            .replace(/\s*\[\s*/g, '[')
            .replace(/\s*\]\s*/g, ']')
            .replace(/\{\s*/g, '{ ')
            .replace(/\s*\}/g, ' }')
            .replace(/\(\s*/g, '(')
            .replace(/\s*\)/g, ')')
            // Normalize comma spacing
            .replace(/,\s*/g, ', ')
            // Clean up extra whitespace
            .trim();
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Public utility methods
    addKeyword(indo, ts) {
        this.keyworld[indo] = ts;
        return this;
    }

    addType(indo, ts) {
        this.type[indo] = ts;
        return this;
    }

    addFunction(indo, ts) {
        this.transFunction[indo] = ts;
        return this;
    }

    addOtherKeyword(indo, ts) {
        this.otherKeyworld[indo] = ts;
        return this;
    }

    getAvailableKeywords() {
        return Object.keys(this.keyworld);
    }

    getAvailableTypes() {
        return Object.keys(this.type);
    }

    getAvailableFunctions() {
        return Object.keys(this.transFunction);
    }

    getAvailableOtherKeywords() {
        return Object.keys(this.otherKeyworld);
    }

    showMappings() {
        console.log("=== KEYWORD MAPPINGS ===");
        console.table(this.keyworld);
        
        console.log("\n=== TYPE MAPPINGS ===");
        console.table(this.type);
        
        console.log("\n=== FUNCTION MAPPINGS ===");
        console.table(this.transFunction);
        
        console.log("\n=== OTHER KEYWORD MAPPINGS ===");
        console.table(this.otherKeyworld);
    }

    // Test method untuk memeriksa translasi
    test(indonesianCode) {
        console.log("=== INPUT ===");
        console.log(indonesianCode);
        console.log("\n=== OUTPUT ===");
        console.log(this.translite(indonesianCode));
    }
}

// Export untuk penggunaan sebagai module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransliteBind;
}
const Translite = new TransliteBind();
export function translite(code) {
    return translite.translite(code);
}