/**
 * SizeUtility.ts
 *
 * This file provides pre-calculated responsive size constants for React Native applications.
 * These constants help maintain consistent spacing and sizing across different screen sizes
 * and device densities.
 *
 * USAGE:
 * - N_* constants: Use for general spacing, padding, margins, and font sizes
 * - V_* constants: Use for vertical spacing, heights, and vertical positioning
 * - M_* constants: Use for moderate scaling (balanced horizontal and vertical scaling)
 *
 * EXAMPLES:
 * ```tsx
 * import { N_16, V_20, M_14 } from '../utils/SizeUtility';
 *
 * // In a StyleSheet
 * const styles = StyleSheet.create({
 *   container: {
 *     padding: N_16,
 *     marginVertical: V_20,
 *     fontSize: M_14,
 *   }
 * });
 * ```
 *
 * BENEFITS:
 * - Consistent spacing across all screen sizes
 * - Automatic scaling for different device densities
 * - Type-safe size constants
 * - Improved maintainability and readability
 * - Reduces manual calculations and magic numbers
 *
 * NOTE: These constants are pre-calculated for performance optimization.
 * The values are computed once at module load time rather than on each render.
 */

import {moderateScale, normalize, verticalScale} from './Dimensions';

/**
 * NORMALIZE CONSTANTS (N_*)
 *
 * These constants use the normalize() function which provides responsive scaling
 * based on the device's screen width. Ideal for:
 * - General spacing (padding, margins)
 * - Font sizes
 * - Border widths
 * - Icon sizes
 * - Any element that should scale with screen width
 */
export const N_1 = normalize(1);
export const N_2 = normalize(2);
export const N_3 = normalize(3);
export const N_4 = normalize(4);
export const N_5 = normalize(5);
export const N_6 = normalize(6);
export const N_7 = normalize(7);
export const N_8 = normalize(8);
export const N_9 = normalize(9);
export const N_10 = normalize(10);
export const N_11 = normalize(11);
export const N_12 = normalize(12);
export const N_13 = normalize(13);
export const N_14 = normalize(14);
export const N_15 = normalize(15);
export const N_16 = normalize(16);
export const N_17 = normalize(17);
export const N_18 = normalize(18);
export const N_19 = normalize(19);
export const N_20 = normalize(20);
export const N_21 = normalize(21);
export const N_22 = normalize(22);
export const N_23 = normalize(23);
export const N_24 = normalize(24);
export const N_25 = normalize(25);
export const N_26 = normalize(26);
export const N_27 = normalize(27);
export const N_28 = normalize(28);
export const N_29 = normalize(29);
export const N_30 = normalize(30);
export const N_31 = normalize(31);
export const N_32 = normalize(32);
export const N_33 = normalize(33);
export const N_34 = normalize(34);
export const N_35 = normalize(35);
export const N_36 = normalize(36);
export const N_37 = normalize(37);
export const N_38 = normalize(38);
export const N_39 = normalize(39);
export const N_40 = normalize(40);
export const N_41 = normalize(41);
export const N_42 = normalize(42);
export const N_43 = normalize(43);
export const N_44 = normalize(44);
export const N_45 = normalize(45);
export const N_46 = normalize(46);
export const N_47 = normalize(47);
export const N_48 = normalize(48);
export const N_49 = normalize(49);
export const N_50 = normalize(50);

/**
 * VERTICAL SCALE CONSTANTS (V_*)
 *
 * These constants use the verticalScale() function which provides responsive scaling
 * based on the device's screen height. Ideal for:
 * - Vertical spacing (margins, padding)
 * - Component heights
 * - Line heights
 * - Vertical positioning
 * - Elements that should scale with screen height
 */
export const V_1 = verticalScale(1);
export const V_2 = verticalScale(2);
export const V_3 = verticalScale(3);
export const V_4 = verticalScale(4);
export const V_5 = verticalScale(5);
export const V_6 = verticalScale(6);
export const V_7 = verticalScale(7);
export const V_8 = verticalScale(8);
export const V_9 = verticalScale(9);
export const V_10 = verticalScale(10);
export const V_11 = verticalScale(11);
export const V_12 = verticalScale(12);
export const V_13 = verticalScale(13);
export const V_14 = verticalScale(14);
export const V_15 = verticalScale(15);
export const V_16 = verticalScale(16);
export const V_17 = verticalScale(17);
export const V_18 = verticalScale(18);
export const V_19 = verticalScale(19);
export const V_20 = verticalScale(20);
export const V_21 = verticalScale(21);
export const V_22 = verticalScale(22);
export const V_23 = verticalScale(23);
export const V_24 = verticalScale(24);
export const V_25 = verticalScale(25);
export const V_26 = verticalScale(26);
export const V_27 = verticalScale(27);
export const V_28 = verticalScale(28);
export const V_29 = verticalScale(29);
export const V_30 = verticalScale(30);
export const V_31 = verticalScale(31);
export const V_32 = verticalScale(32);
export const V_33 = verticalScale(33);
export const V_34 = verticalScale(34);
export const V_35 = verticalScale(35);
export const V_36 = verticalScale(36);
export const V_37 = verticalScale(37);
export const V_38 = verticalScale(38);
export const V_39 = verticalScale(39);
export const V_40 = verticalScale(40);
export const V_41 = verticalScale(41);
export const V_42 = verticalScale(42);
export const V_43 = verticalScale(43);
export const V_44 = verticalScale(44);
export const V_45 = verticalScale(45);
export const V_46 = verticalScale(46);
export const V_47 = verticalScale(47);
export const V_48 = verticalScale(48);
export const V_49 = verticalScale(49);
export const V_50 = verticalScale(50);

/**
 * MODERATE SCALE CONSTANTS (M_*)
 *
 * These constants use the moderateScale() function which provides balanced scaling
 * that considers both width and height. Ideal for:
 * - Balanced responsive sizing
 * - Elements that need proportional scaling
 * - When you want scaling that's not too aggressive
 * - General purpose responsive sizing
 */
export const M_1 = moderateScale(1);
export const M_2 = moderateScale(2);
export const M_3 = moderateScale(3);
export const M_4 = moderateScale(4);
export const M_5 = moderateScale(5);
export const M_6 = moderateScale(6);
export const M_7 = moderateScale(7);
export const M_8 = moderateScale(8);
export const M_9 = moderateScale(9);
export const M_10 = moderateScale(10);
export const M_11 = moderateScale(11);
export const M_12 = moderateScale(12);
export const M_13 = moderateScale(13);
export const M_14 = moderateScale(14);
export const M_15 = moderateScale(15);
export const M_16 = moderateScale(16);
export const M_17 = moderateScale(17);
export const M_18 = moderateScale(18);
export const M_19 = moderateScale(19);
export const M_20 = moderateScale(20);
export const M_21 = moderateScale(21);
export const M_22 = moderateScale(22);
export const M_23 = moderateScale(23);
export const M_24 = moderateScale(24);
export const M_25 = moderateScale(25);
export const M_26 = moderateScale(26);
export const M_27 = moderateScale(27);
export const M_28 = moderateScale(28);
export const M_29 = moderateScale(29);
export const M_30 = moderateScale(30);
export const M_31 = moderateScale(31);
export const M_32 = moderateScale(32);
export const M_33 = moderateScale(33);
export const M_34 = moderateScale(34);
export const M_35 = moderateScale(35);
export const M_36 = moderateScale(36);
export const M_37 = moderateScale(37);
export const M_38 = moderateScale(38);
export const M_39 = moderateScale(39);
export const M_40 = moderateScale(40);
export const M_41 = moderateScale(41);
export const M_42 = moderateScale(42);
export const M_43 = moderateScale(43);
export const M_44 = moderateScale(44);
export const M_45 = moderateScale(45);
export const M_46 = moderateScale(46);
export const M_47 = moderateScale(47);
export const M_48 = moderateScale(48);
export const M_49 = moderateScale(49);
export const M_50 = moderateScale(50);
