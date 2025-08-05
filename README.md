# Gainbridge Shopping Cart Assignment

This repo houses a small TypeScript/Playwright test suite that points to the Gainbridge shopping cart
[mock site](https://gb-saa-test.vercel.app).

## My Process

Initially, I documented all of the features that were relevant to the shopping cart. I also noted my
assumptions, UI/UX concerns, and a number of defects that I found. This helped me to prioritize certain 
features over others such as item deletion and quantity updates. Then, I leveraged the AI capabilities 
in Cursor to help build out my TypeScript/Playwright environment rather quickly so that I could spend 
more time crafting my tests and organizing my page objects.

## Considering the Test Pyramid

On a typical project, I would push for a number of tests to actually be unit (or component) tests
such as asserting correct totals given item price and quantity, hover over text, and cart empty state.
But since Playwright tests run very fast, it's a light lift to run them here.

## Findings

Unfortunately only 2 out of 9 tests pass. The other 7 tests fail due to multiple critical defects with
the calculations of the grand total both on page load and on any user action. In addition, the discount
doesn't seem to actually impact the item cost, whether during the countdown or after it finishes. This 
only compounds the calculation issue with the grand total.