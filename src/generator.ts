export class HoomanGenerator {
    private typeMap: Record<string, string> = {
        'text': 'string',
        'number': 'number',
        'boolean': 'boolean',
        'void': 'void'
    };

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
                const ctorParams = node.params.map((p: any) => `${p.id}: ${this.mapType(p.paramType)}`).join(', ');
                const ctorBody = node.body.map((stmt: any) => `        ${this.generate(stmt)}`).join('\n');
                return `    constructor(${ctorParams}) {\n${ctorBody}\n    }`;

            case 'FunctionDeclaration':
                const params = node.params.map((p: any) => `${p.id}: ${this.mapType(p.paramType)}`).join(', ');
                const body = node.body.map((stmt: any) => `        ${this.generate(stmt)}`).join('\n');
                const retType = node.returnType === 'void' ? '' : `: ${this.mapType(node.returnType)}`;
                return `    ${node.id}(${params})${retType} {\n${body}\n    }`;

            case 'VariableDeclaration':
                // Handles both basic variables and class instantiation
                const isClass = !this.typeMap[node.varType];
                if (isClass) {
                    const args = node.init ? node.init.map((arg: any) => this.generate(arg)).join(', ') : '';
                    return `const ${node.id}: ${node.varType} = new ${node.varType}(${args});`;
                }
                const initVal = node.init ? ` = ${this.generate(node.init[0])}` : '';
                return `let ${node.id}: ${this.mapType(node.varType)}${initVal};`;

            case 'Assignment':
                return `${this.generate(node.target)} = ${this.generate(node.value)};`;

            case 'FunctionCall':
                const args = node.args.map((a: any) => this.generate(a)).join(', ');
                return `${this.generate(node.target)}(${args});`;

            case 'PrintStatement':
                const templateParts = node.content.map((part: any) => {
                    if (part.type === 'PrintVar') return `\${${this.generate(part.target)}}`;
                    return part.value.replace(/\n\s+/g, '\\n '); // Clean up multiline formatting
                }).join('');
                return `console.log(\`${templateParts}\`);`;

            case 'MemberExpression':
                return `${node.object}.${node.property}`;

            case 'Identifier':
                return node.name;

            case 'Literal':
                return node.value;

            default:
                throw new Error(`Unknown AST Node Type: ${node.type}`);
        }
    }
}