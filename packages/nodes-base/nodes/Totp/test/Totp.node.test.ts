import type { WorkflowTestData } from 'n8n-workflow';

import { executeWorkflow } from '@test/nodes/ExecuteWorkflow';
import * as Helpers from '@test/nodes/Helpers';

jest.mock('otpauth', () => {
	return {
		TOTP: jest.fn().mockImplementation(() => {
			return {
				generate: jest.fn().mockReturnValue('123456'),
			};
		}),
	};
});

describe('Execute TOTP node', () => {
	const tests: WorkflowTestData[] = [
		{
			description: 'Generate TOTP Token',
			input: {
				workflowData: Helpers.readJsonFileSync('nodes/Totp/test/Totp.workflow.test.json'),
			},
			output: {
				nodeData: {
					TOTP: [[{ json: { token: '123456' } }]], // ignore secondsRemaining to prevent flakiness
				},
			},
			credentials: {
				totpApi: {
					label: 'GitHub:john-doe',
					secret: 'BVDRSBXQB2ZEL5HE',
				},
			},
		},
	];

	for (const testData of tests) {
		// eslint-disable-next-line @typescript-eslint/no-loop-func
		test(testData.description, async () => {
			const { result } = await executeWorkflow(testData);

			Helpers.getResultNodeData(result, testData).forEach(({ nodeName, resultData }) => {
				const expected = testData.output.nodeData[nodeName][0][0].json;
				const actual = resultData[0]?.[0].json;

				expect(actual?.token).toEqual(expected.token);
			});

			expect(result.finished).toEqual(true);
		});
	}
});
