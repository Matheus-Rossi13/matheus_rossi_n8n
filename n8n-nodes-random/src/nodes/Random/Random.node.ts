import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Random implements INodeType {
	description: INodeTypeDescription = {
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const min = this.getNodeParameter('min', itemIndex, 1) as number;
				const max = this.getNodeParameter('max', itemIndex, 100) as number;

				if (min > max) {
					throw new NodeOperationError(this.getNode(), 'Min value cannot be greater than Max value.');
				}

				const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

				const response = await this.helpers.httpRequest({
					url,
					method: 'GET',
					json: false,
				});

				const randomNumber = parseInt(response as string, 10);

				if (isNaN(randomNumber)) {
					throw new NodeOperationError(this.getNode(), 'Failed to parse a valid number from Random.org response.');
				}

				returnData.push({
					json: {
						...items[itemIndex].json,
						randomNumber: randomNumber,
					},
					pairedItem: { item: itemIndex },
				});

			} catch (error) {
				if (this.continueOnFail()) {
					
					if (error instanceof Error) {
						items[itemIndex].json.error = error.message;
					} else {
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