import { testMocks } from '@suite-common/test-utils';
import { asNetworkSymbol } from '@suite-common/wallet-config';

import { formatData, sanitizeCsvValue } from './exportTransactionsUtils';

const { getWalletTransaction } = testMocks;

// The Blob of jsdom has no text().
const readText = (file: Blob) =>
    new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsText(file);
    });

describe(formatData.name, () => {
    const symbol = asNetworkSymbol('btc');

    const exportJson = async (transactions: ReturnType<typeof getWalletTransaction>[]) => {
        const file = await formatData(
            { symbol, accountName: 'Account', type: 'json', transactions, baseCurrencyCode: 'usd' },
            {},
            [],
        );

        return JSON.parse(file ? await readText(file) : '{}');
    };

    it('leaves the fee empty for a transaction whose input values are not resolved', async () => {
        const blockbookTransaction = getWalletTransaction({ symbol, fee: '144' });
        const { details } = blockbookTransaction;
        // The Electrum backend gives a foreign input without the value of its previous output.
        const unresolvedTransaction = getWalletTransaction({
            symbol,
            type: 'recv',
            fee: '0',
            details: {
                ...details,
                vin: details.vin.map(({ value: _value, ...input }) => ({
                    ...input,
                    addresses: [],
                    isAddress: false,
                })),
                totalInput: '0',
            },
        });

        const { transactions } = await exportJson([unresolvedTransaction, blockbookTransaction]);

        expect(transactions.map(({ fee }: { fee: string }) => fee)).toEqual(['', '0.00000144']);
    });
});

describe(sanitizeCsvValue.name, () => {
    test.each([
        ['simplevalue', 'simplevalue'],
        ['value,with,commas', '"value,with,commas"'],
        ['value"with"quotes', 'value"with"quotes'],
        ['commas,"and",quotes', '"commas,""and"",quotes"'],
        ['a,"b","c",d', '"a,""b"",""c"",d"'],
        ['=formula', "'=formula"],
        ['+formula', "'+formula"],
        ['-formula', "'-formula"],
        ['@formula', "'@formula"],
        ['\t=formula', "'\t=formula"],
        [' =formula', "' =formula"],
        ['\r=formula', "'\r=formula"],
        ['=formula,with,commas', '"\'=formula,with,commas"'],
        ['text=formula', 'text=formula'],
    ])('sanitizes "%s" to "%s"', (input, expected) => {
        expect(sanitizeCsvValue(input)).toBe(expected);
    });
});
