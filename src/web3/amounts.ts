import { BigNumber, parseUnits, formatUnits } from 'ethers/utils';
import { Amount } from '../types';

/**
 * @dev Formats a simple amount to 2 decimal places
 * @param simpleAmount Simple amount to parse
 * @param symbol Symbol to postfix (if any)
 */
export const formatSimpleAmount = (
  simpleAmount: number | null,
  symbol?: string | null,
): string | null => {
  if (typeof simpleAmount === 'number') {
    // Use two padded decimal places
    const [intAmount, decimals = ''] = simpleAmount.toString().split('.');
    const paddedDecimals = decimals.slice(0, 2).padEnd(2, '0');
    return `${intAmount}.${paddedDecimals}${symbol ? ` ${symbol}` : ''}`;
  }
  return null;
};

/**
 * @dev Converts an exact token amount into a simple amount, by dividing by 10**decimals
 * @param exactAmount Exact amount to parse
 * @param decimals Number of decimal places the exact amount has
 * @param symbol Symbol of the token
 * @param commas Add comma separators to separate thousands
 */
export const formatExactAmount = (
  exactAmount?: BigNumber,
  decimals?: number,
  symbol?: string,
  commas = false,
): string | null =>
  exactAmount && decimals
    ? commas
      ? formatSimpleAmount(
          parseFloat(formatUnits(exactAmount, decimals)),
          symbol,
        )?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || null
      : formatSimpleAmount(
          parseFloat(formatUnits(exactAmount, decimals)),
          symbol,
        )
    : null;

/**
 * @dev Converts a simple amount into an object containing both Simple and Exact amounts
 * @param simpleAmount Simple amount to parse
 * @param decimals Number of decimal places the exact amount should have
 */
export const parseAmount = (
  simpleAmount: string | null,
  decimals: number | null,
): Amount => {
  if (!(simpleAmount && decimals)) {
    return { exact: null, simple: null };
  }

  const exact = parseUnits(simpleAmount.slice(0, decimals), decimals);
  const simple = parseFloat(formatUnits(exact, decimals));
  return {
    exact,
    simple,
  };
};
