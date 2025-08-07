# Gainbridge Shopping Cart Assignment

This repo houses a small TypeScript/Playwright test suite that points to the Gainbridge shopping cart
[mock site](https://gb-saa-test.vercel.app).

## My Process

Initially, I documented all of the features that were relevant to the shopping cart. I also noted my
assumptions, UI/UX concerns, and a number of defects that I found. This helped me to prioritize certain 
features over others such as item deletion and quantity updates. Then, I leveraged the AI capabilities 
in Cursor to help build out my TypeScript/Playwright environment rather quickly so that I could spend 
more time crafting my tests and organizing my page objects.

On a typical project, I would push for a number of tests to actually be unit (or component) tests
such as asserting correct totals given item price and quantity, hover over text, and cart empty state.
But since Playwright tests run very fast, it's a light lift to run them here.

### Features and Assumed Requirements

Based on observed functionality, typical shopping cart capabilities, and desired user experiences, here
is a list of derived features and assumed requirements for this app.

1) User should be able to see a list of items in the cart
    * Display the item name, quantity field, item cost, and remove button for each item

1) User should be notified of "Limited Availability" of an item

2) User should be able to update the quantity of an item
    * The displayed item cost should equal the cost of a single item multiplied by the quantity
    * When the quantity is 0, the displayed item cost should be $0

3) User should be able to see the total cost
    * The displayed total cost should be the sum of all of the calculated item costs minus items that are 
out-of-stock.

4) User should be able to see available discount percentage for an item
    * The discount should be applied to the item

5) User should be able to see the countdown timer to know how long the discount is available
    * The countdown should be 2 minutes and start on page load
    * The discount expires when the countdown expires and the item cost should be updated accordingly

6) User should be able to remove an item
    * Display confirmation prompt when removing an item
    * Cancel -> Exit prompt, no changes to cart
    * Yes -> Exit prompt, selected item is removed from cart, total amount is updated, checkout button state 
is updated

7) User should be be aware that an item is out of stock
    * Item styling should include red background, gray text, disabled quantity field, and enabled Remove button

8) User should be able to checkout items in their cart
    * Button is enabled only when there is at least one item in the cart that has a quantity of 1 or greater 
and there are zero out-of-stock items in the cart

9) User should see an empty state when there are zero items in the cart

### Defects and UI/UX concerns

All of the following defects and concerns are related to unintuitive instructions, unclear outcomes,
or misalignment with best practices relating to shopping cart experiences.

* It is not clear that the item with the red background is an item that is out of stock.
    * There should be explicit text that indicates that it is out of stock _and_ that the user cannot progress 
forward to checkout without removing the item (if that is indeed the requirement). The user may not know that
they need to hover over the checkout button to understand why they cannot proceed to checkout.
    * There should also be messaging saying that the out-of-stock item is not included in the total cost.
* An item that has limited availability should be clearly labeled. Simply having the "!" is not sufficient
for the user to intuitively know that this is what it means. Again, the user may not know that they would need
to hover over the element to know what it means.
* The quantity field should be properly labeled.
* The whole discount concept is ambiguous and unclear.
    * The user isn't able to compare the original and the discounted costs.
    * The countdown isn't clearly labeled or tied to the discount. There should be text saying something like 
"Hurry! This discount will end when the countdown expires!"
    * When the countdown expires, the item cost doesn't change which makes the purpose of the countdown unclear
and makes the real cost of the item uncertain.
* The calculation for the total cost is never accurate as it seems to add $1 to what the real total should be.
This is true on page load and when updating item quantities.
* When setting the quantity to 0, the item cost should be updated to $0. Instead, it displays the same cost
as when the quantity is set to 1.
* Not sure if there is a limit to the quantity of items a user can purchase (or purchase at one time)
* When one item has been removed, the total cost still displays the last calculated amount. This is also true
when all items have been removed.
* There is no empty state when all items have been removed.
* From a design standpoint, the discount and countdown elements should probably be located below the item name
so that the placement of the cost, quantity, and remove button would remain consistent with the other items.

## Findings

### Testing

Out of 9 tests, unfortunately only 2 of them pass. The other 7 tests fail due to multiple critical defects with
the calculations of the total cost or with the item cost not adjusting properly when the quantity is 0. I would 
have added one more test to assert that the discount was removed after the countdown expired. However, it is 
unclear if the displayed item cost is the discounted price or the price that is yet to be discounted. Further 
clarification about this requirement would be requested before crafting the test.

### Action Items

Here's a list of items that should be resolved in the app:
* Fix the displayed total cost so that it displays the accurate amount (High Priority)
* Ensure that items with 0 quantity display $0 for its cost (High Priority)
* Add an empty state
* Add clear labels to fields
* Add clear messaging for checkout restrictions, applied discounts, items with limited availability, and 
out-of-stock items
* Rethink design of discount elements for UI consistency

## Setup and Running tests

Run `npm run install-browsers` to use the latest browser versions for Playwright

Run `npm run test` to execute all tests in headless mode

Run `npm run test:headed` to execute tests in headed mode