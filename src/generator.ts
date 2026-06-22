export class HoomanGenerator {
    private typeMap: Record<string, string> = {
        'text': 'string',
        'number': 'number',
        'boolean': 'boolean',
        'void': 'void'
    };

    private knownVariables = new Set<string>();

    private mapType(type: string): string {
        if (type.startsWith('list of ')) {
            const base = type.replace('list of ', '').trim();
            return `${this.typeMap[base] || base}[]`;
        }
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
                node.params.forEach((p: any) => this.knownVariables.add(p.id));
                const ctorParams = node.params.map((p: any) => `${p.id}: ${this.mapType(p.paramType)}`).join(', ');
                const ctorBody = node.body.map((stmt: any) => `        ${this.generate(stmt)}`).join('\n');
                node.params.forEach((p: any) => this.knownVariables.delete(p.id));
                return `    constructor(${ctorParams}) {\n${ctorBody}\n    }`;

            case 'FunctionDeclaration':
                node.params.forEach((p: any) => this.knownVariables.add(p.id));
                const params = node.params.map((p: any) => `${p.id}: ${this.mapType(p.paramType)}`).join(', ');
                const body = node.body.map((stmt: any) => `        ${this.generate(stmt)}`).join('\n');
                const retType = node.returnType === 'void' ? '' : `: ${this.mapType(node.returnType)}`;
                node.params.forEach((p: any) => this.knownVariables.delete(p.id));
                return `    ${node.id}(${params})${retType} {\n${body}\n    }`;

            case 'VariableDeclaration':
                this.knownVariables.add(node.id);
                
                const isList = node.varType.startsWith('list of ');
                const mappedType = this.mapType(node.varType);
                const isClass = !isList && !this.typeMap[node.varType];

                if (isList) {
                    const arrayArgs = node.init && node.init[0] ? this.generate(node.init[0]) : '[]';
                    return `let ${node.id}: ${mappedType} = ${arrayArgs};`;
                } else if (isClass) {
                    const classArgs = node.init ? node.init.map((arg: any) => this.generate(arg)).join(', ') : '';
                    return `const ${node.id}: ${node.varType} = new ${node.varType}(${classArgs});`;
                }
                
                const initVal = node.init ? ` = ${this.generate(node.init[0])}` : '';
                return `let ${node.id}: ${mappedType}${initVal};`;

            case 'Assignment':
                const tgtStr = node.target.type === 'Identifier' ? node.target.name : this.generate(node.target);
                return `${tgtStr} = ${this.generate(node.value)};`;

            case 'ArrayAdd':
                return `${this.generate(node.target)}.push(${this.generate(node.value)});`;

            case 'ArrayRemove':
                return `${this.generate(node.target)}.splice(${this.generate(node.index)}, 1);`;

            case 'ArrayAccess':
                return `${this.generate(node.target)}[${this.generate(node.index)}]`;

            case 'ArrayLength':
                return `${this.generate(node.target)}.length`;

            case 'LoopStatement':
                this.knownVariables.add(node.iterator);
                const listCode = this.generate(node.list);
                const loopBody = node.body.map((stmt: any) => `        ${this.generate(stmt)}`).join('\n');
                this.knownVariables.delete(node.iterator);
                return `    for (const ${node.iterator} of ${listCode}) {\n${loopBody}\n    }`;

            case 'ConditionalStatement':
                const conditionCode = this.generate(node.condition);
                const mainBody = node.body.map((stmt: any) => `        ${this.generate(stmt)}`).join('\n');
                let tsOutput = `    if (${conditionCode}) {\n${mainBody}\n    }`;

                if (node.elseIfs && node.elseIfs.length > 0) {
                    node.elseIfs.forEach((ei: any) => {
                        const eiCond = this.generate(ei.condition);
                        const eiBody = ei.body.map((stmt: any) => `        ${this.generate(stmt)}`).join('\n');
                        tsOutput += ` else if (${eiCond}) {\n${eiBody}\n    }`;
                    });
                }

                if (node.fallback && node.fallback.length > 0) {
                    const elseBody = node.fallback.map((stmt: any) => `        ${this.generate(stmt)}`).join('\n');
                    tsOutput += ` else {\n${elseBody}\n    }`;
                }
                return tsOutput;

            case 'Comparison':
                return `${this.generate(node.left)} ${node.operator} ${this.generate(node.right)}`;

            case 'ArrayLiteral':
                const arrayElements = node.elements.map((el: any) => this.generate(el)).join(', ');
                return `[${arrayElements}]`;

            case 'FunctionCall':
                const args = node.args.map((a: any) => this.generate(a)).join(', ');
                let callTgt = '';
                if (node.target.type === 'Identifier') callTgt = node.target.name; 
                else if (node.target.type === 'Path') callTgt = node.target.parts.join('.');
                else callTgt = this.generate(node.target);
                
                return `${callTgt}(${args});`;

            case 'PrintStatement':
                let templateString = node.content.map((part: any) => {
                    if (part.type === 'PrintVar') return `\${${this.generate(part.target)}}`;
                    return part.value.replace(/\r?\n\s*/g, '');
                }).join('');
                
                templateString = templateString.trim();
                if (templateString.includes('\\n')) {
                    const args = templateString.split('\\n').map((s: string) => `\`${s.trim()} \\n\``);
                    args[args.length - 1] = args[args.length - 1].replace(' \\n`', '`');
                    return `console.log(${args.join(', ')});`;
                }
                return `console.log(\`${templateString}\`);`;

            case 'Path': 
                return node.parts.join('.');

            case 'Identifier':
                if (this.knownVariables.has(node.name) || node.name === "this") {
                    return node.name; 
                } else {
                    return `\`${node.name}\``; 
                }

            case 'Literal':
                return node.value;
                
            case 'Group':
                return this.generate(node.expression);

            default:
                throw new Error(`Unknown AST Node Type: ${node.type}`);
        }
    }
}