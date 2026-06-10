export class HoomanGenerator {
    private typeMap: Record<string, string> = {
        'text': 'string',
        'number': 'number',
        'boolean': 'boolean',
        'void': 'void'
    };

    // A basic Symbol Table to track variables in scope
    private knownVariables = new Set<string>();

    private mapType(type: string): string {
        return this.typeMap[type] || type;
    }

    public generate(node: any): string {
        switch (node.type) {
            case 'Program':
                return node.body.map((stmt: any) => this.generate(stmt)).join('\n\n');

            case 'ClassDeclaration':
                const props = node.properties.map((p: any) => `    ${p.id}: ${this.mapType(p.propType)};`).join('\n');
                const ctor = node.constructor ? this.generate(node.constructor) : '';
                const methods = node.methods.map((m: any) => this.generate(m)).join('\n\n');
                return `class ${node.id} {\n${props}\n\n${ctor}\n\n${methods}\n}`;

            case 'Constructor':
                // 1. Register parameters into our known scope
                node.params.forEach((p: any) => this.knownVariables.add(p.id));

                const ctorParams = node.params.map((p: any) => `${p.id}: ${this.mapType(p.paramType)}`).join(', ');
                const ctorBody = node.body.map((stmt: any) => `        ${this.generate(stmt)}`).join('\n');

                // 2. Remove parameters from scope once the constructor ends
                node.params.forEach((p: any) => this.knownVariables.delete(p.id));

                return `    constructor(${ctorParams}) {\n${ctorBody}\n    }`;

            case 'FunctionDeclaration':
                // 1. Register parameters
                node.params.forEach((p: any) => this.knownVariables.add(p.id));

                const params = node.params.map((p: any) => `${p.id}: ${this.mapType(p.paramType)}`).join(', ');
                const body = node.body.map((stmt: any) => `        ${this.generate(stmt)}`).join('\n');
                const retType = node.returnType === 'void' ? '' : `: ${this.mapType(node.returnType)}`;

                // 2. Clean up parameters
                node.params.forEach((p: any) => this.knownVariables.delete(p.id));

                return `    ${node.id}(${params})${retType} {\n${body}\n    }`;

            case 'VariableDeclaration':
                // Register local/global variables so they aren't treated as strings later
                this.knownVariables.add(node.id);

                const isClass = !this.typeMap[node.varType];
                if (isClass) {
                    const args = node.init ? node.init.map((arg: any) => this.generate(arg)).join(', ') : '';
                    return `const ${node.id}: ${node.varType} = new ${node.varType}(${args});`;
                }
                const initVal = node.init ? ` = ${this.generate(node.init[0])}` : '';
                return `let ${node.id}: ${this.mapType(node.varType)}${initVal};`;

            case 'Assignment':
                // Always treat the assignment target physically as code, never as a string fallback
                const tgtStr = node.target.type === 'Identifier' ? node.target.name : this.generate(node.target);
                return `${tgtStr} = ${this.generate(node.value)};`;

            case 'FunctionCall':
                const args = node.args.map((a: any) => this.generate(a)).join(', ');
                let callTgt = '';
                if (node.target.type === 'Identifier') callTgt = node.target.name;
                else if (node.target.type === 'Path') callTgt = node.target.parts.join('.');
                else callTgt = this.generate(node.target);

                return `${callTgt}(${args});`;

            case 'Path':
                return node.parts.join('.');

            case 'PrintStatement':
                let templateString = node.content.map((part: any) => {
                    if (part.type === 'PrintVar') return `\${${this.generate(part.target)}}`;

                    // Remove physical file newlines (\r\n or \n) and any indentation spaces that follow them
                    return part.value.replace(/\r?\n\s*/g, '');
                }).join('');

                // Trim any stray spaces at the very beginning or end
                templateString = templateString.trim();

                // If you specifically want to match the comma-separated arguments in dog_expected.ts:
                if (templateString.includes('\\n')) {
                    const args = templateString.split('\\n').map((s: string) => `\`${s.trim()} \\n\``);
                    // The last argument shouldn't have a trailing \n
                    args[args.length - 1] = args[args.length - 1].replace(' \\n`', '`');
                    return `console.log(${args.join(', ')});`;
                }

                // Fallback for normal prints
                return `console.log(\`${templateString}\`);`;

            case 'Identifier':
                // "this" should always be treated as code, alongside known variables
                if (this.knownVariables.has(node.name) || node.name === "this") {
                    return node.name;
                } else {
                    return `\`${node.name}\``;
                }

            case 'Literal':
                return node.value;

            default:
                throw new Error(`Unknown AST Node Type: ${node.type}`);
        }
    }
}