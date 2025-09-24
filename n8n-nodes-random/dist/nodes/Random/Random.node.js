"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Random {
    constructor() {
        this.description = {
            displayName: 'Random',
            name: 'random',
            icon: 'file:random.svg',
            group: ['transform'],
            version: 1,
            subtitle: '= {{ $parameter["operation"] }}',
            description: 'Generates a true random number using Random.org',
            defaults: {
                name: 'Random',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'True Random Number Generator',
                            value: 'generate',
                            action: 'Generate a true random number',
                        },
                    ],
                    default: 'generate',
                },
                {
                    displayName: 'Min',
                    name: 'min',
                    type: 'number',
                    default: 1,
                    required: true,
                    description: 'The minimum value for the random number (inclusive)',
                },
                {
                    displayName: 'Max',
                    name: 'max',
                    type: 'number',
                    default: 100,
                    required: true,
                    description: 'The maximum value for the random number (inclusive)',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                const min = this.getNodeParameter('min', itemIndex, 1);
                const max = this.getNodeParameter('max', itemIndex, 100);
                if (min > max) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Min value cannot be greater than Max value.');
                }
                const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
                const response = await this.helpers.httpRequest({
                    url,
                    method: 'GET',
                    json: false,
                });
                const randomNumber = parseInt(response, 10);
                if (isNaN(randomNumber)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Failed to parse a valid number from Random.org response.');
                }
                returnData.push({
                    json: {
                        ...items[itemIndex].json,
                        randomNumber: randomNumber,
                    },
                    pairedItem: { item: itemIndex },
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    // Bloco de código corrigido para o TypeScript 5+
                    if (error instanceof Error) {
                        items[itemIndex].json.error = error.message;
                    }
                    else {
                        items[itemIndex].json.error = 'An unknown error occurred';
                    }
                    returnData.push(items[itemIndex]);
                    continue;
                }
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.Random = Random;
