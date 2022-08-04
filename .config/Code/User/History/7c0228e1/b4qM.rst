##################################################
Formula for computing approximate number of cycles
##################################################

.. note:: Cycles = n * (69 + 137 * (m - 1)) + 680

===============================
Number of cycles for Primitives
===============================

1. Multiply -> 16
2. Inverse  -> 644
3. Add      -> 1
4. Subtract -> 1
5. Square   -> 1
6. Modulo   -> 1

=====================================
Number of cycles for Group Operations
=====================================

1. Point Add    -> 137
2. Point Double -> 69

===================================
Number of cycles for Transformation
===================================

1. Transform A-P    -> 1
2. Transform P-A    -> 679

==========================================
Number of cycles for Scalar Multiplication
==========================================

Let 'n' be the position of the first bit set in the scalar.
Let 'm' be the number of set bits in the scalar excluding the first set bit.

Cycles = 70n + 137m + 694