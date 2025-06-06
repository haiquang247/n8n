/* eslint-disable @typescript-eslint/no-loop-func */
import type { WorkflowTestData } from 'n8n-workflow';
import path from 'path';

import { executeWorkflow } from '@test/nodes/ExecuteWorkflow';
import * as Helpers from '@test/nodes/Helpers';

describe('Test Read Binary Files Node', () => {
	const workflow = Helpers.readJsonFileSync(
		'nodes/ReadBinaryFiles/test/ReadBinaryFiles.workflow.json',
	);
	const node = workflow.nodes.find((n: any) => n.name === 'Read Binary Files');
	const dir = path.join(__dirname, 'data').split('\\').join('/');
	node.parameters.fileSelector = `${dir}/*.json`;

	const tests: WorkflowTestData[] = [
		{
			description: 'nodes/ReadBinaryFiles/test/ReadBinaryFiles.workflow.json',
			input: {
				workflowData: workflow,
			},
			output: {
				nodeData: {
					'Read Binary Files': [
						[
							{
								binary: {
									data: {
										mimeType: 'application/json',
										fileType: 'json',
										fileExtension: 'json',
										data: 'ewoJInRpdGxlIjogIkxvcmVtIElwc3VtIgp9Cg==',
										directory: dir,
										fileName: 'sample.json',
										fileSize: '28 B',
									},
								},
								json: {},
							},
							{
								binary: {
									data: {
										mimeType: 'application/json',
										fileType: 'json',
										fileExtension: 'json',
										data: 'ewoJInRpdGxlIjogIklwc3VtIExvcmVtIgp9Cg==',
										directory: dir,
										fileName: 'sample2.json',
										fileSize: '28 B',
									},
								},
								json: {},
							},
						],
					],
				},
			},
		},
	];

	for (const testData of tests) {
		test(testData.description, async () => {
			const { result } = await executeWorkflow(testData);

			const resultNodeData = Helpers.getResultNodeData(result, testData);
			resultNodeData.forEach(({ nodeName, resultData }) =>
				expect(resultData).toEqual(testData.output.nodeData[nodeName]),
			);

			expect(result.finished).toEqual(true);
		});
	}
});
