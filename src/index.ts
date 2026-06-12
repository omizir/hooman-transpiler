import * as fs from 'fs';
import { parse } from './parser.js';
import { HoomanGenerator } from './generator.js';

const inputFile = process.argv[2];
if (!inputFile) {
    console.error("Please provide a .hmn file.");
    process.exit(1);
}

try {
    const code = fs.readFileSync(inputFile, 'utf-8');
    
    // 1. Parse string into AST
    const ast = parse(code);
    const astFile = inputFile.replace('.hmn', '.ast.json');
    fs.writeFileSync(astFile, JSON.stringify(ast));
    
    // 2. Generate TS from AST
    const generator = new HoomanGenerator();
    const outputTs = generator.generate(ast);
    
    // 3. Save output
    const outputFile = inputFile.replace('.hmn', '.ts');
    fs.writeFileSync(outputFile, outputTs);
    
    console.log(`✅ Successfully compiled via AST to ${outputFile}`);
} catch (error: any) {
    // Peggy throws highly specific syntax errors (line, column, expected characters)
    if (error.location) {
        console.error(`Syntax Error at line ${error.location.start.line}, column ${error.location.start.column}`);
        console.error(error.message);
    } else {
        console.error(error);
    }
}