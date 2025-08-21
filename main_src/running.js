#!/usr/bin/env node

import vm from 'vm';
import yargs from 'yargs';
import ts from 'typescript';
import { exec } from 'child_process';
import { createRequire } from 'module';
import { hideBin } from 'yargs/helpers';
import { TransliteBind } from './translite.mjs';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, extname, basename, dirname, join } from 'path';

/**
 * Advanced TypeScript transpilation with better error handling
 * @param {string} tsCode - TypeScript code to transpile
 * @param {object} options - Compiler options
 * @returns {object} Result object with code, success status, and errors
 */
const transpileTypeScript = (tsCode, options = {}) => {
    const defaultOptions = {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.ES2020, // Changed to ES2020 for better import support
        strict: false, // Made less strict for better compatibility
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        skipLibCheck: true,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        ...options
    };

    try {
        const result = ts.transpileModule(tsCode, {
            compilerOptions: defaultOptions,
            reportDiagnostics: true
        });

        const errors = result.diagnostics?.map(diagnostic => {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            const line = diagnostic.start !== undefined ? 
                tsCode.slice(0, diagnostic.start).split('\n').length : 'unknown';
            return `Line ${line}: ${message}`;
        }) || [];

        return {
            code: result.outputText,
            success: errors.length === 0,
            errors: errors,
            diagnostics: result.diagnostics
        };
    } catch (error) {
        return {
            code: null,
            success: false,
            errors: [error.message],
            diagnostics: []
        };
    }
};

/**
 * Execute transpiled JavaScript code in VM context
 * @param {string} jsCode - JavaScript code to execute
 * @param {object} context - Additional context for VM
 * @returns {Promise<any>} Execution result
 */
const executeInVM = async (jsCode, context = {}) => {
    const require = createRequire(import.meta.url);
    
    const vmContext = vm.createContext({
        console: console,
        require: require,
        import: (modulePath) => import(modulePath),
        module: { exports: {} },
        exports: {},
        __dirname: process.cwd(),
        __filename: 'virtual-file.js',
        global: globalThis,
        process: process,
        Buffer: Buffer,
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval,
        ...context
    });

    try {
        // Check if code contains top-level await or import statements
        const hasAsyncFeatures = /(?:await\s|import\s)/m.test(jsCode);
        
        if (hasAsyncFeatures) {
            // Wrap in async function for top-level await support
            const wrappedCode = `(async () => {\n${jsCode}\n})()`;
            const result = vm.runInContext(wrappedCode, vmContext, {
                timeout: 15000,
                displayErrors: true,
                filename: 'virtual-bind-file.js'
            });
            return await result;
        } else {
            return vm.runInContext(jsCode, vmContext, {
                timeout: 10000,
                displayErrors: true,
                filename: 'virtual-bind-file.js'
            });
        }
    } catch (error) {
        throw new Error(`VM Execution Error: ${error.message}\nStack: ${error.stack}`);
    }
};

/**
 * Validate file path and return absolute path
 * @param {string} filePath - File path to validate
 * @returns {string} Absolute file path
 */
const validateFilePath = (filePath) => {
    if (!filePath) {
        throw new Error('File path is required');
    }

    const absolutePath = resolve(filePath);
    
    if (!existsSync(absolutePath)) {
        throw new Error(`File does not exist: ${absolutePath}`);
    }

    return absolutePath;
};

/**
 * Generate output file name
 * @param {string} inputFile - Input file path
 * @param {string} outputFile - Optional output file path
 * @returns {string} Output file path
 */
const generateOutputFileName = (inputFile, outputFile) => {
    if (outputFile) {
        // Ensure output has .js extension
        if (!outputFile.endsWith('.js')) {
            outputFile += '.js';
        }
        return resolve(outputFile);
    }

    // Generate output name from input file
    const inputPath = resolve(inputFile);
    const inputDir = dirname(inputPath);
    const inputName = basename(inputPath, extname(inputPath));
    
    // Remove .is extension if present
    const cleanName = inputName.replace(/\.is$/, '');
    
    return join(inputDir, `${cleanName}.js`);
};

/**
 * Main CLI handler
 */
const main = async () => {
    const argv = yargs(hideBin(process.argv))
        .option('run', {
            alias: 'r',
            type: 'string',
            description: 'Execute is file directly',
            demandOption: false
        })
        .option('transpile', {
            alias: 't',
            type: 'string', 
            description: 'Transpile is file to JavaScript',
            demandOption: false
        })
        .option('output', {
            alias: 'o',
            type: 'string',
            description: 'Output file path (for transpile mode)',
            demandOption: false
        })
        .option('watch', {
            alias: 'w',
            type: 'boolean',
            description: 'Watch file for changes (for run mode)',
            default: false
        })
        .option('verbose', {
            alias: 'v',
            type: 'boolean',
            description: 'Verbose output',
            default: false
        })
        .check((argv) => {
            if (!argv.run && !argv.transpile) {
                throw new Error('Either --run or --transpile option is required');
            }
            return true;
        })
        .help()
        .alias('help', 'h')
        .example('$0 --run file.is', 'Execute a is file')
        .example('$0 --transpile file.is --output result.js', 'Transpile is file to JavaScript')
        .parseSync();

    try {
        // Initialize transliterator
        const transliterator = new TransliteBind();
        
        if (argv.transpile) {
            await handleTranspileMode(argv, transliterator);
        } else if (argv.run) {
            await handleRunMode(argv, transliterator);
        }
        
    } catch (error) {
        console.error(`error: ${error.message}`);
        if (argv.verbose) {
            console.error(`Stack trace: ${error.stack}`);
        }
        process.exit(1);
    }
};

/**
 * Handle transpile mode
 * @param {object} argv - CLI arguments
 * @param {TransliteBind} transliterator - Transliterator instance
 */
const handleTranspileMode = async (argv, transliterator) => {
    const inputFile = validateFilePath(argv.transpile);
    const outputFile = generateOutputFileName(inputFile, argv.output);

    if (argv.verbose) {
        console.log(`Input file: ${inputFile}`);
        console.log(`Output file: ${outputFile}`);
    }

    // Read and transliterate
    const rawCode = readFileSync(inputFile, 'utf8');
    const transliteratedCode = transliterator.translite(rawCode);
    
    if (!transliteratedCode) {
        throw new Error('Transliteration resulted in empty code');
    }

    if (argv.verbose) {
        console.log('Transliteration completed');
        console.log('Starting TypeScript transpilation...');
    }
    // Transpile TypeScript
    const transpileResult = transpileTypeScript(transliteratedCode);
    
    if (!transpileResult.success) {
        console.log(`Sintax:\n${'='.repeat(50)}\n${transpileResult.code}\n${'='.repeat(50)}\n`);
        console.error('TypeScript compilation errors:');
        transpileResult.errors.forEach(error => console.error(`  • ${error}`));
        throw new Error('TypeScript transpilation failed');
    }

    // Write output file
    writeFileSync(outputFile, transpileResult.code, 'utf8');
    
    console.log(`Successfully transpiled to: ${outputFile}`);
    
    if (argv.verbose) {
        console.log('Generated JavaScript:');
        console.log('─'.repeat(50));
        console.log(transpileResult.code);
        console.log('─'.repeat(50));
    }
};

/**
 * Handle run mode
 * @param {object} argv - CLI arguments
 * @param {TransliteBind} transliterator - Transliterator instance
 */
const handleRunMode = async (argv, transliterator) => {
    const inputFile = validateFilePath(argv.run);
    const outputFile = generateOutputFileName(inputFile, argv.output);
    
    const executeFile = async () => {
        try {
            if (argv.verbose) {
                console.log(`Executing: ${inputFile}`);
            }

            // Read and transliterate
            const rawCode = readFileSync(inputFile, 'utf8');
            const transliteratedCode = transliterator.translite(rawCode);
            
            if (!transliteratedCode) {
                throw new Error('Transliteration resulted in empty code');
            }

            // Transpile TypeScript
            const transpileResult = transpileTypeScript(transliteratedCode);
            
            if (!transpileResult.success) {
                console.error('TypeScript compilation errors:');
                console.log(`Sintax:\n${'='.repeat(50)}\n${transpileResult.code}\n${'='.repeat(50)}\n`);
                transpileResult.errors.forEach(error => console.error(`  • ${error}`));
                return;
            }

            if (argv.verbose) {
                console.log('Transpilation completed, executing...');
            }

            // Execute in VM
            try {
                await executeInVM(transpileResult.code);
            } catch (err) {
                writeFileSync(outputFile, transpileResult.code, 'utf8');
                exec(`node ${outputFile}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error: ${error}`);
                        return;
                    }
                    console.log(`Output: ${stdout}`);
                    if (stderr) console.error(`Stderr: ${stderr}`);
                    });
            }
            if (argv.verbose) {
                console.log('execution completed');
            }
            
        } catch (error) {
            console.error(`execution error: ${error.message}`);
            if (argv.verbose) {
                console.error(`Stack: ${error.stack}`);
            }
        }
    };
    
    await executeFile();

    // Watch mode
    if (argv.watch) {
        const { watch } = await import('chokidar');
        
        console.log(`Watching ${inputFile} for changes...`);
        
        const watcher = watch(inputFile, {
            persistent: true,
            ignoreInitial: true
        });
        
        watcher.on('change', async () => {
            console.log('File changed, re-executing...');
            await executeFile();
        });
        
        watcher.on('error', (error) => {
            console.error(`atcher error: ${error.message}`);
        });

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\nStopping watcher...');
            watcher.close();
            process.exit(0);
        });
    }
};

// Execute main function
main().catch(error => {
    console.error(`Unexpected error: ${error.message}`);
    process.exit(1);
});

export { transpileTypeScript, executeInVM, validateFilePath, generateOutputFileName };