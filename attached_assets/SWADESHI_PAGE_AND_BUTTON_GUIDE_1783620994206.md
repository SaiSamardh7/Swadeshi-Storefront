# Swadeshi Page and Button Guide

This document explains the Swadeshi Next.js pages and shared UI controls without changing the app code. Line numbers refer to the files as they existed when this guide was written.

## Scope

- Page files covered: every `app/**/page.tsx` route plus `app/not-found.tsx` and `app/layout.tsx`.
- Button/control files covered: `Header`, `Footer`, `MobileBottomBar`, `MenuBrowser`, `AddToCartButton`, `CartProvider`, `LoginForm`, `LogoutButton`, `LeadForm`, `DeliveryZipField`, `AdminLogin`, `AdminLogout`, and `AdminOrderControls`.
- Data/helper files referenced when needed: `lib/business.ts` and `lib/catalog.ts`.

## Global App Shell

### `app/layout.tsx`

| Lines | What they do |
| --- | --- |
| 1-8 | Import Next metadata types, Google fonts, global CSS, layout components, cart provider, and business constants. |
| 10-25 | Configure the Poppins, Inter, and Pacifico fonts and expose their CSS variables. |
| 27-42 | Define default SEO metadata, title template, description, and Open Graph data for the whole site. |
| 44-76 | Build local-business structured data for search engines, including address, phone, hours, cuisine, and social links. |
| 78-82 | Declare the root layout component and its `children` prop type. |
| 83-87 | Render the root `<html>` element with language and font CSS classes. |
| 88-92 | Render the `<body>` and inject the JSON-LD schema script. |
| 93-98 | Wrap the site in `CartProvider`, then render `Header`, the current page in `<main>`, `Footer`, and `MobileBottomBar`. |
| 99-102 | Close the body, html, return statement, and component. |

### `lib/business.ts`

| Lines | What they do |
| --- | --- |
| 1-37 | Define the main business record: name, address, phone, email, website, social links, maps links, online order URL, grocery delivery URL, and store hours. |
| 39-42 | Explain that Frisco is the primary location and secondary location details should be confirmed. |
| 43-79 | Define all Swadeshi locations shown on the location page. |
| 81-82 | Export the primary order link and display label used by buttons across the site. |

### `lib/catalog.ts`

| Lines | What they do |
| --- | --- |
| 1 | Imports the full menu data. |
| 3-5 | Documents why server-side pricing uses the catalog instead of trusting browser prices. |
| 7-13 | Defines the shape of one catalog item. |
| 15-17 | Converts a category or item name into a URL-safe slug. |
| 19-21 | Builds a stable cart/catalog id from category and item name. |
| 23-25 | Explains why duplicate menu entries collapse into one cart id. |
| 26-45 | Builds a `Map` of all catalog items from the full menu data. |
| 47-49 | Looks up one catalog item by id. |
| 51-53 | Formats cents as a dollar string. |

## Route Pages

### `app/page.tsx` - Home

| Lines | What they do |
| --- | --- |
| 1-6 | Import navigation, business constants, data arrays, and display components. |
| 8-33 | Define the four service cards shown on the home page. |
| 35-41 | Define the five ordering/visit steps used in the "Eat. Shop. Take Home." section. |
| 43-45 | Declare the `Home` component and begin the returned fragment. |
| 46-78 | Render the hero section text and three actions: order online, shop grocery, and get directions. |
| 80-106 | Render the hero photo grid with kitchen, grocery, drink, and meat images. |
| 107-118 | Close the hero grid and render the trust strip. |
| 120-140 | Render service cards by mapping `SERVICES`; each card links to its section page. |
| 142-159 | Render popular kitchen items by mapping `POPULAR_PICKS` into `MenuCard`. |
| 161-177 | Render a story band and an "Our Story" link to `/about`. |
| 179-198 | Render the five-step ordering/visit workflow from `ORDER_STEPS`. |
| 200-233 | Render grocery category chips and actions for grocery page and directions. |
| 235-259 | Render halal meat summary cards and actions for calling and learning more. |
| 261-276 | Render the catering callout and link to `/catering`. |
| 278-294 | Render review-theme preview cards. |
| 296-315 | Render Instagram callout linking to the business Instagram page. |
| 317-352 | Render visit/contact details and directions/call actions. |
| 354-363 | Render the embedded Google Map. |
| 364-365 | Close the component return and function. |

### `app/menu/page.tsx` - Kitchen Menu

| Lines | What they do |
| --- | --- |
| 1-3 | Import metadata type, business/order constants, and the menu browser component. |
| 5-9 | Define page title and description metadata. |
| 11-13 | Declare `MenuPage` and start the page container. |
| 14-20 | Render the page heading and menu summary copy. |
| 21-28 | Render action links: primary online ordering and phone call. |
| 29-31 | Render `MenuBrowser`, which contains search, filters, section tabs, and add-to-cart buttons. |
| 32-36 | Render price and availability disclaimer text. |
| 37-39 | Close the page container and component. |

### `app/cart/page.tsx` - Cart and Checkout

| Lines | What they do |
| --- | --- |
| 1-7 | Mark as a client component and import hooks, navigation, cart context, formatting, and business constants. |
| 9-17 | Declare component state: cart data, auth status, pickup name, note, busy flag, error, and placed order id. |
| 18-23 | On mount, call `/api/auth/me` to decide whether the user is logged in. |
| 25-51 | Define `placeOrder`: prevent default form submit, POST cart ids/quantities and pickup details to `/api/orders`, show errors, store order id on success, clear cart, and reset busy state. |
| 53-70 | If an order was placed, show confirmation plus links to account tracking and menu. |
| 73-78 | Render the normal cart page title. |
| 79-86 | If the cart is empty, show an empty-cart message and "Browse the Menu" link. |
| 87-128 | If the cart has items, render each cart line with item name, unit price, minus button, quantity, plus button, line total, and remove button. |
| 129-138 | Render subtotal and pay-at-pickup note. |
| 140-153 | If not authenticated, prompt login and link to `/account?next=/cart`. |
| 154-176 | If authenticated or still checking, render pickup details form fields. |
| 177-181 | Render order submission error if present. |
| 182-188 | Render the submit button; it is disabled while placing order or while auth is unknown. |
| 189-195 | Render a phone link for help. |
| 196-202 | Close conditional UI, page container, return, and component. |

### `app/account/page.tsx` - Customer Account

| Lines | What they do |
| --- | --- |
| 1-7 | Import metadata, links, auth/order helpers, formatting, login form, and logout button. |
| 9-15 | Map order statuses to badge color classes. |
| 17-20 | Define account page metadata. |
| 22-23 | Force dynamic rendering because session cookies are read. |
| 25-28 | Format an E.164 phone number for display. |
| 30-32 | Choose phone display if present, otherwise email. |
| 34-36 | Load the current user and that user's orders. |
| 38-52 | If no user is logged in, render the account login page with `LoginForm`. |
| 54-66 | If logged in, render the account header, contact identity, and `LogoutButton`. |
| 68-77 | Render the order section and empty-state link to `/menu` when there are no orders. |
| 78-117 | Render each order with id, date, status badge, item list, per-line prices, and subtotal. |
| 118-121 | Close the section, page, return, and component. |

### `app/admin/page.tsx` - Kitchen Admin Board

| Lines | What they do |
| --- | --- |
| 1-8 | Import metadata, admin/order helpers, formatting, admin UI controls, and auto-refresh. |
| 10-13 | Define admin page metadata and prevent indexing. |
| 15 | Force dynamic rendering because admin cookies and live orders are read. |
| 17-23 | Map order statuses to badge color classes. |
| 25-28 | Format phone numbers for display. |
| 30-32 | Choose phone if available, otherwise email. |
| 34-45 | If admin password is not configured, show setup guidance. |
| 47-53 | If the visitor is not an admin, render `AdminLogin`. |
| 55-57 | Load all orders and split them into active versus completed/cancelled. |
| 59-70 | Render admin board header, auto-refresh behavior, active count, and logout button. |
| 72-76 | Show "No orders yet" when no orders exist. |
| 77-122 | Render active order cards with customer contact, status, items, note, subtotal, and `AdminOrderControls`. |
| 124-143 | Render completed/cancelled orders inside a collapsible `<details>` section. |
| 144-148 | Close conditionals, page container, return, and component. |

### `app/contact/page.tsx` - Contact

| Lines | What they do |
| --- | --- |
| 1-3 | Import metadata, business constants, and `LeadForm`. |
| 5-9 | Define contact page metadata. |
| 11-18 | Define the reason options for the contact form select field. |
| 20-30 | Render the contact page intro. |
| 31-47 | Render address, phone, email, and hours. |
| 48-60 | Render "Call Now" and "Get Directions" actions. |
| 63-69 | Start the contact form card and configure `LeadForm` to POST to `/api/contact`. |
| 70-91 | Render name, phone, email, and reason fields. |
| 92-96 | Render required message textarea and close `LeadForm`. |
| 97-101 | Close the page layout and component. |

### `app/catering/page.tsx` - Catering

| Lines | What they do |
| --- | --- |
| 1-5 | Import metadata, business constants, event data, `LeadForm`, and `TrustBar`. |
| 7-11 | Define catering page metadata. |
| 13-28 | Render the hero section with catering headline and summary. |
| 30-43 | Render trust-bar selling points and halal meat note. |
| 45-64 | Render event types and notes, including a phone link. |
| 67-73 | Start quote form card and configure `LeadForm` to POST to `/api/catering`. |
| 74-119 | Render catering fields: name, phone, email, event date, guest count, event type, food preference, and pickup/delivery. |
| 120-124 | Render details textarea and close `LeadForm`. |
| 125-130 | Close the layout and component. |

### `app/thali/page.tsx` - Thali Delivery

| Lines | What they do |
| --- | --- |
| 1-5 | Import metadata, business data, thali data, `LeadForm`, and ZIP field. |
| 7-11 | Define thali page metadata. |
| 13-27 | Render hero text using `THALI.description`; line 25 notes content is placeholder pending owner confirmation. |
| 29-53 | Render "How it works" data from `THALI` plus a phone link. |
| 55-64 | Start preorder form card and configure `LeadForm` to POST to `/api/thali`. |
| 65-78 | Render name, phone, and address fields. |
| 79-88 | Render delivery ZIP validation field and date field. |
| 89-109 | Render number-of-thalis and payment fields. |
| 110-120 | Render optional meat checkboxes from `THALI.meatOptions`. |
| 121-125 | Render optional notes textarea and close `LeadForm`. |
| 126-131 | Close the layout and component. |

### `app/grocery/page.tsx` - Grocery

| Lines | What they do |
| --- | --- |
| 1-4 | Import metadata, business constants, grocery categories, and `FoodTile`. |
| 6-10 | Define grocery page metadata. |
| 12-25 | Render the grocery hero. |
| 27-42 | Render grocery category cards from `GROCERY_CATEGORIES`. |
| 44-50 | Render the "Eat First, Then Shop" callout copy. |
| 51-71 | Render grocery delivery, store visit, and phone availability actions. |
| 72-76 | Close the page layout and component. |

### `app/halal-meat/page.tsx` - Halal Meat

| Lines | What they do |
| --- | --- |
| 1-6 | Import metadata, business constants, meat data, `FoodTile`, and `TrustBar`. |
| 8-12 | Define halal meat page metadata. |
| 14-40 | Render the hero, phone availability button, and directions button. |
| 42-53 | Render meat category cards from `MEAT_CATEGORIES`. |
| 55-63 | Render trust-bar items for halal, freshness, and handling. |
| 65-89 | Render counter price list from `MEAT_MENU`. |
| 91-96 | Render price/stock disclaimer. |
| 97-99 | Close the page and component. |

### `app/location/page.tsx` - Locations and Hours

| Lines | What they do |
| --- | --- |
| 1-3 | Import metadata, business/location data, and open/closed badge. |
| 5-9 | Define location page metadata. |
| 11-22 | Render page heading, `OpenBadge`, and location intro. |
| 24-49 | Render all location cards from `LOCATIONS`, each with a directions link. |
| 51-75 | Render main Frisco address, phone, email, and hours. |
| 77-82 | Render practical visit details such as access, parking, and payments. |
| 84-96 | Render directions and call actions. |
| 99-105 | Render embedded Google Map. |
| 106-109 | Close layout and component. |

### `app/about/page.tsx` - About

| Lines | What they do |
| --- | --- |
| 1-3 | Import metadata, `Link`, and business constants. |
| 5-9 | Define about page metadata. |
| 11-16 | Render page heading. |
| 17-35 | Render three paragraphs describing the business. |
| 36-48 | Render "View Menu" and "Get Directions" actions. |
| 49-51 | Close layout and component. |

### `app/gallery/page.tsx` - Gallery

| Lines | What they do |
| --- | --- |
| 1-4 | Import metadata, Next image, order link, and business data. |
| 6-10 | Define gallery page metadata. |
| 12-37 | Define the photo grid image paths and captions. |
| 39-48 | Render gallery heading and intro. |
| 50-65 | Render each photo as an image tile with a caption overlay. |
| 67-70 | Render "Hungry? Order Online" action. |
| 71-74 | Close layout and component. |

### `app/reviews/page.tsx` - Reviews

| Lines | What they do |
| --- | --- |
| 1-3 | Import metadata, business constants, and review themes. |
| 5-9 | Define reviews page metadata. |
| 11-18 | Render heading and explanatory copy. |
| 20-32 | Render review theme cards from `REVIEW_THEMES`. |
| 35-49 | Render review CTA section with Google Maps review link and contact link. |
| 50-53 | Close layout and component. |

### `app/indian-food-allen/page.tsx`

| Lines | What they do |
| --- | --- |
| 1-2 | Import metadata and shared city landing component. |
| 4-8 | Define Allen SEO metadata. |
| 10-21 | Render `CityLanding` configured for Allen with city, headline, intro, and drive note. |
| 22 | Close the component. |

### `app/indian-food-plano/page.tsx`

| Lines | What they do |
| --- | --- |
| 1-2 | Import metadata and shared city landing component. |
| 4-8 | Define Plano SEO metadata. |
| 10-22 | Render `CityLanding` configured for Plano with city, headline, intro, and drive note. |
| 23 | Close the component. |

### `app/indian-food-mckinney/page.tsx`

| Lines | What they do |
| --- | --- |
| 1-2 | Import metadata and shared city landing component. |
| 4-8 | Define McKinney SEO metadata. |
| 10-22 | Render `CityLanding` configured for McKinney with city, headline, intro, and drive note. |
| 23 | Close the component. |

### `app/accessibility/page.tsx`

| Lines | What they do |
| --- | --- |
| 1-2 | Import metadata and business constants. |
| 4-7 | Define accessibility page metadata. |
| 9-13 | Render page container and heading. |
| 14-18 | Describe site accessibility practices. |
| 19-31 | Describe store accessibility and provide email/phone contact links. |
| 32-35 | Close layout and component. |

### `app/privacy/page.tsx`

| Lines | What they do |
| --- | --- |
| 1-2 | Import metadata and business constants. |
| 4-7 | Define privacy page metadata. |
| 9-10 | Comment that the policy should be reviewed before launch and updated if analytics are added. |
| 11-17 | Render page title, last-updated date, and content wrapper. |
| 18-27 | Explain what form data is collected and how it is used. |
| 28-35 | Explain cookies, tracking, and basic host logs. |
| 36-44 | Explain third-party ordering, maps, and email provider involvement. |
| 45-59 | Explain user choices and provide email/phone contact links. |
| 60-63 | Close layout and component. |

### `app/terms/page.tsx`

| Lines | What they do |
| --- | --- |
| 1-2 | Import metadata and business constants. |
| 4-7 | Define terms page metadata. |
| 9-10 | Comment that these are short terms and should be reviewed by the owner. |
| 11-17 | Render page title, last-updated date, and content wrapper. |
| 18-25 | Explain what the website provides and user agreement to terms. |
| 26-35 | Explain menu/pricing/availability can change. |
| 36-44 | Explain third-party online ordering and catering request confirmation. |
| 45-57 | Render terms contact section with email and phone links. |
| 58-61 | Close layout and component. |

### `app/not-found.tsx`

| Lines | What they do |
| --- | --- |
| 1-2 | Import link component and business/order constants. |
| 4-6 | Declare the not-found component and start centered layout. |
| 7-12 | Render missing-page heading and explanatory copy. |
| 13-23 | Render actions to home, menu, and phone call. |
| 24-26 | Close layout and component. |

## Shared Components That Power Page Behavior

### `components/Header.tsx`

| Lines | What they do |
| --- | --- |
| 1-8 | Mark as client component and import image, links, state, business constants, open badge, and cart link. |
| 10-20 | Define main navigation items. |
| 22-24 | Declare `Header` and mobile-menu open state. |
| 26-40 | Render top bar with address link, open badge, hours, and phone link. |
| 42-52 | Render logo link to home; clicking it closes the mobile menu. |
| 54-67 | Render desktop navigation, cart link, account link, and order link. |
| 69-77 | Render mobile menu toggle button; clicking flips `open`; label and icon change between open/close. |
| 80-109 | When `open` is true, render mobile navigation links; each internal link closes the menu on click. |
| 110-113 | Close header and component. |

### `components/Footer.tsx`

| Lines | What they do |
| --- | --- |
| 1-3 | Import image, links, and business/order constants. |
| 5-21 | Render footer logo and business summary. |
| 23-43 | Render address, phone, email, and hours. |
| 45-66 | Render footer exploration links. |
| 68-99 | Render quick actions: online order, directions, Facebook, Instagram. |
| 101-116 | Render copyright and policy/terms/accessibility links. |
| 117-119 | Close footer and component. |

### `components/MobileBottomBar.tsx`

| Lines | What they do |
| --- | --- |
| 1-2 | Import internal links and business/order constants. |
| 4-9 | Define four mobile quick actions: order, menu, call, and directions. |
| 11-16 | Render fixed bottom navigation visible on mobile. |
| 17-27 | Render external actions as `<a>` links and internal actions as Next `<Link>`. |
| 28-30 | Close nav and component. |

### `components/CartProvider.tsx`

| Lines | What they do |
| --- | --- |
| 1-4 | Mark as client component and import React state/context helpers. |
| 5-15 | Define cart line and cart context types. |
| 17-18 | Create context and localStorage key. |
| 20-23 | Declare provider and cart/loaded state. |
| 24-33 | Load cart data once from `localStorage`; malformed data is ignored. |
| 35-38 | Persist cart changes to `localStorage` after initial load. |
| 40-63 | Build memoized cart API: quantity clamp, count, subtotal, add, set quantity, remove, and clear. |
| 65-66 | Provide cart context to child components. |
| 68-72 | Expose `useCart`; throw if used outside `CartProvider`. |

### `components/CartLink.tsx`

| Lines | What they do |
| --- | --- |
| 1-4 | Mark as client component and import link plus cart hook. |
| 6-8 | Comment and declare cart link with optional class name. |
| 9-15 | Read cart count and render link to `/cart` with an accessible dynamic label. |
| 16-21 | Show "Cart" and, if count is positive, a badge with item count. |
| 22-24 | Close link and component. |

### `components/MenuBrowser.tsx`

| Lines | What they do |
| --- | --- |
| 1-6 | Mark as client component and import state, full menu data, item id helper, and add button. |
| 8-10 | Define vegetarian filter type and section labels from menu data. |
| 12-27 | Render the vegetarian/non-vegetarian dot indicator component. |
| 29-32 | Declare browser state: active section, veg filter, and search query. |
| 34-50 | Compute visible sections/categories/items from search and veg filter. |
| 52-72 | Render section buttons; clicking a section sets it active and clears the search query. |
| 74-85 | Render search input; typing updates `query`. |
| 86-109 | Render filter buttons; clicking sets filter to all, veg, or non-veg. |
| 112-116 | Show no-results message when filters/search hide all items. |
| 117-148 | Render matching sections, categories, menu rows, prices, veg dots, and `AddToCartButton`. |
| 149-151 | Close component. |

### `components/AddToCartButton.tsx`

| Lines | What they do |
| --- | --- |
| 1-4 | Mark as client component and import state plus cart hook. |
| 6-15 | Comment and define props: id, name, and price in cents. |
| 16-18 | Read `add` from cart context and track temporary added state. |
| 20-27 | Render button; clicking adds the item, shows confirmation, then resets after 1.2 seconds. |
| 28-30 | Choose green "added" styling or saffron default styling. |
| 31-34 | Show `Added ✓` after click or `+ Add` normally, then close component. |

### `components/LoginForm.tsx`

| Lines | What they do |
| --- | --- |
| 1-7 | Mark as client component, import hooks/router, and define login channel/step types. |
| 9-17 | Declare state for channel, step, contact, code, busy flag, error, and optional dev code. |
| 19-23 | `switchChannel` changes phone/email mode and clears stale contact/error. |
| 25-47 | `sendCode` POSTs channel/contact to `/api/auth/request-code`, moves to code step on success, and displays errors on failure. |
| 49-70 | `verify` POSTs channel/contact/code to `/api/auth/verify-code` and refreshes the route on success. |
| 72-81 | Render login card and choose contact-step form when `step === "contact"`. |
| 83-96 | Render Phone/Email toggle buttons. |
| 98-111 | Render phone or email input based on selected channel. |
| 112-119 | Render error and "Send code" submit button. |
| 121-131 | Render code-step form and optional dev-code message. |
| 132-145 | Render six-digit code input that strips non-digits. |
| 146-153 | Render error and "Verify & log in" submit button. |
| 154-164 | Render "Use a different number/email" button; clicking returns to contact step and clears code/error. |
| 165-169 | Close conditional UI and component. |

### `components/LogoutButton.tsx`

| Lines | What they do |
| --- | --- |
| 1-4 | Mark as client component and import router plus state. |
| 6-9 | Declare logout button and busy state. |
| 10-18 | Render button; clicking sets busy, POSTs `/api/auth/logout`, then refreshes the page. |
| 19-23 | Show "Logging out..." while busy or "Log out" normally, then close component. |

### `components/LeadForm.tsx`

| Lines | What they do |
| --- | --- |
| 1-6 | Mark as client component and define form status type. |
| 8-18 | Comment and define generic props: endpoint, success message, and child fields. |
| 19-20 | Track status and error message. |
| 22-44 | On submit, prevent default, gather `FormData`, POST JSON to the given endpoint, then set success or error state. |
| 46-52 | If successfully sent, replace the form with a success message. |
| 54-56 | Render the form and injected child fields. |
| 57-65 | Add hidden honeypot field named `company` for bot detection. |
| 66-74 | Render error message plus phone link when submit fails. |
| 75-77 | Render submit button; disabled while sending and text changes to `Sending...`. |
| 78-80 | Close form and component. |

### `components/DeliveryZipField.tsx`

| Lines | What they do |
| --- | --- |
| 1-4 | Mark as client component and import state plus delivery-zone checker. |
| 6-8 | Comment and declare ZIP field component. |
| 9-10 | Track ZIP input and compute zone status once five digits are entered. |
| 12-26 | Render required numeric ZIP input; typing strips non-digits. |
| 27-38 | Render live feedback: in delivery zone, outside zone, or nothing until five digits. |
| 39-41 | Close label and component. |

### `components/AdminLogin.tsx`

| Lines | What they do |
| --- | --- |
| 1-4 | Mark as client component and import router plus state. |
| 6-10 | Track password, busy flag, and error. |
| 12-30 | On submit, POST password to `/api/admin/login`; refresh on success or show errors. |
| 32-49 | Render staff login form and password field. |
| 50-54 | Render error if present. |
| 55-57 | Render submit button; disabled while checking and text changes to `Checking...`. |
| 58-60 | Close form and component. |

### `components/AdminLogout.tsx`

| Lines | What they do |
| --- | --- |
| 1-4 | Mark as client component and import router plus state. |
| 6-9 | Declare logout button and busy state. |
| 10-18 | Render button; clicking POSTs `/api/admin/logout` and refreshes the page. |
| 19-23 | Show `...` while busy or `Log out` normally, then close component. |

### `components/AdminOrderControls.tsx`

| Lines | What they do |
| --- | --- |
| 1-5 | Mark as client component and import router, state, and order status type. |
| 7-15 | Define next valid admin actions per order status. |
| 17-23 | Define component props: order id and current status. |
| 24-25 | Create router and busy state. |
| 27-39 | Define `set(status)`: POST new status to `/api/admin/orders/status`, refresh the board, then clear busy. |
| 41-42 | Pick available next actions and decide whether cancellation is allowed. |
| 44-56 | Render next-step buttons such as "Start preparing", "Mark ready", and "Complete". |
| 57-66 | Render "Cancel" only for received/preparing orders. |
| 67-69 | Close control wrapper and component. |

### `components/CityLanding.tsx`

| Lines | What they do |
| --- | --- |
| 1-4 | Import links, business/order constants, popular picks, and menu card component. |
| 6-11 | Define the city landing page config shape. |
| 13-15 | Comment and declare shared city landing component. |
| 17-43 | Render city hero with order, menu, and directions actions. |
| 45-51 | Render popular menu picks. |
| 53-64 | Render three feature cards: grocery, halal meat, and catering. |
| 66-88 | Render visit section with phone, directions, and location/parking links. |
| 89-92 | Close page fragment and component. |

## How Each Button and Link Works

### Navigation and Global Actions

| UI text | Location | Behavior |
| --- | --- | --- |
| Logo | `Header` lines 43-52 | Internal Next link to `/`; also closes the mobile menu. |
| Desktop nav items | `Header` lines 54-59 | Internal Next links to their configured pages. |
| Cart | `Header` line 60 / `CartLink` lines 11-21 | Opens `/cart`; badge updates from cart context count. |
| Account | `Header` lines 61-63 | Opens `/account`. |
| Order Online | `Header` lines 64-66, many pages | Opens `BUSINESS.orderUrl`, the Heartland/POS ordering URL. |
| Mobile menu toggle | `Header` lines 69-77 | Toggles `open`; icon switches between hamburger and X; `aria-expanded` follows state. |
| Mobile nav links | `Header` lines 80-109 | Open the selected page; internal links close the menu. |
| Footer explore links | `Footer` lines 48-64 | Internal Next links to site sections. |
| Footer quick actions | `Footer` lines 71-97 | Order/directions/social links open the configured external URLs. |
| Mobile bottom bar | `MobileBottomBar` lines 17-27 | Shows mobile shortcuts: external anchors for order/call/directions and internal Next link for menu. |

### Home Page Actions

| UI text | Lines | Behavior |
| --- | --- | --- |
| `ORDER_LABEL` | `app/page.tsx` 64-66 | Opens online ordering URL. |
| Shop Grocery | `app/page.tsx` 67-69 | Navigates to `/grocery`. |
| Get Directions | `app/page.tsx` 70-77 and 341-348 | Opens Google Maps in a new tab. |
| Service cards | `app/page.tsx` 126-137 | Each card navigates to its `href` from `SERVICES`. |
| View full menu | `app/page.tsx` 149-151 | Navigates to `/menu`. |
| Our Story | `app/page.tsx` 173-175 | Navigates to `/about`. |
| Explore Grocery | `app/page.tsx` 220-222 | Navigates to `/grocery`. |
| Call for Availability | `app/page.tsx` 252-254 | Opens phone dialer with `BUSINESS.phoneTel`. |
| Learn More | `app/page.tsx` 255-257 | Navigates to `/halal-meat`. |
| Request Catering Quote | `app/page.tsx` 272-274 | Navigates to `/catering`. |
| Follow Instagram | `app/page.tsx` 306-313 | Opens Instagram in a new tab. |
| Call Now | `app/page.tsx` 349-351 | Opens phone dialer. |

### Menu and Cart Actions

| UI text | Lines | Behavior |
| --- | --- | --- |
| Menu section tabs | `MenuBrowser` 55-70 | Set active menu section and clear search text. |
| Search input | `MenuBrowser` 78-84 | Filters dishes live by lowercased dish name. |
| All/Veg/Non-Veg filters | `MenuBrowser` 86-109 | Set the vegetarian filter state. |
| `+ Add` | `AddToCartButton` 20-33 | Adds item to cart context/localStorage; existing items increment quantity; button briefly says `Added ✓`. |
| Decrease quantity | `app/cart/page.tsx` 96-103 | Calls `setQty(l.id, l.qty - 1)`; provider clamps quantity to at least 1. |
| Increase quantity | `app/cart/page.tsx` 105-112 | Calls `setQty(l.id, l.qty + 1)`; provider clamps quantity to at most 99. |
| Remove item | `app/cart/page.tsx` 117-124 | Removes that line from cart context/localStorage. |
| Browse the Menu | `app/cart/page.tsx` 82-84 | Opens `/menu` when cart is empty. |
| Log in with phone | `app/cart/page.tsx` 147-152 | Opens account login with `next=/cart` query. |
| Place order - pay at pickup | `app/cart/page.tsx` 182-188 | Submits pickup form to `placeOrder`, which POSTs to `/api/orders`, then clears cart on success. |
| Track My Order | `app/cart/page.tsx` 62-64 | Opens `/account` after order placement. |
| Order More | `app/cart/page.tsx` 65-67 | Opens `/menu` after order placement. |

### Login and Account Actions

| UI text | Lines | Behavior |
| --- | --- | --- |
| Phone / Email | `LoginForm` 83-96 | Switches login channel and clears contact/error state. |
| Send code | `LoginForm` 117-119 | POSTs contact and channel to `/api/auth/request-code`; moves to code step on success. |
| Verify & log in | `LoginForm` 151-153 | POSTs code to `/api/auth/verify-code`; refreshes page on success so server reads the new session. |
| Use a different number/email | `LoginForm` 154-164 | Returns to contact step and clears code/error. |
| Log out | `LogoutButton` 10-21 | POSTs `/api/auth/logout`, then refreshes page. |
| Start an Order | `app/account/page.tsx` 73-75 | Opens `/menu` from empty order history. |

### Lead Forms

| UI text | Location | Behavior |
| --- | --- | --- |
| Contact form Submit | `LeadForm` 75-77 used by `app/contact/page.tsx` | Sends contact fields as JSON to `/api/contact`; success replaces form with success message. |
| Catering form Submit | `LeadForm` 75-77 used by `app/catering/page.tsx` | Sends catering fields as JSON to `/api/catering`; success replaces form with success message. |
| Thali form Submit | `LeadForm` 75-77 used by `app/thali/page.tsx` | Sends thali preorder fields as JSON to `/api/thali`; success replaces form with success message. |
| Delivery ZIP typing | `DeliveryZipField` 15-38 | Not a button, but live control: strips non-digits and shows zone feedback after five digits. |

### Admin Actions

| UI text | Lines | Behavior |
| --- | --- | --- |
| Admin Log in | `AdminLogin` 55-57 | POSTs password to `/api/admin/login`; refreshes page on success. |
| Admin Log out | `AdminLogout` 10-21 | POSTs `/api/admin/logout`; refreshes page. |
| Start preparing | `AdminOrderControls` 9-12, 44-56 | For `received` orders, POSTs status `preparing`. |
| Mark ready | `AdminOrderControls` 9-12, 44-56 | For `preparing` orders, POSTs status `ready`. |
| Complete | `AdminOrderControls` 9-12, 44-56 | For `ready` orders, POSTs status `completed`. |
| Cancel | `AdminOrderControls` 57-66 | For `received` or `preparing` orders, POSTs status `cancelled`. |
| Completed / cancelled summary | `app/admin/page.tsx` 124-143 | Native `<details>` disclosure; clicking expands/collapses old orders without server calls. |

### Other Page Actions

| UI text | Location | Behavior |
| --- | --- | --- |
| Call links | Multiple pages | Use `tel:+14692943500`; on phones this opens the dialer. |
| Email links | Contact, privacy, terms, accessibility, footer | Use `mailto:Spfrisco@gmail.com`; opens the user's email client. |
| Get Directions / Visit Store | Multiple pages | Open configured Google Maps URLs, usually in a new tab. |
| Order Grocery Delivery | `app/grocery/page.tsx` 52-59 | Opens Grubhub grocery ordering URL in a new tab. |
| City landing Order Online | `CityLanding` 27-29 | Opens online ordering URL. |
| City landing View Full Menu | `CityLanding` 30-32 | Opens `/menu`. |
| City landing Location & Parking | `CityLanding` 84-86 | Opens `/location`. |
| Gallery Hungry? Order Online | `app/gallery/page.tsx` 68-70 | Opens online ordering URL. |
| Reviews Google review link | `app/reviews/page.tsx` 39-44 | Opens the business Google Maps listing in a new tab. |
| Reviews Contact us | `app/reviews/page.tsx` 46-48 | Opens `/contact`. |
| Not found Back to Home | `app/not-found.tsx` 14-16 | Opens `/`. |
| Not found View Menu | `app/not-found.tsx` 17-19 | Opens `/menu`. |
| Not found Call Us | `app/not-found.tsx` 20-22 | Opens phone dialer. |

## Important Behavior Notes

- Cart state is browser-side and persists in `localStorage` under `sw_cart`.
- The browser cart stores item ids and quantities, but the server should price orders from `lib/catalog.ts`.
- Generic forms use `LeadForm`, which posts JSON to a page-provided endpoint and includes a hidden `company` honeypot field.
- Login is passwordless for customers: request code first, then verify code.
- Admin login is separate from customer login and uses `/api/admin/*` endpoints.
- External links such as Google Maps, Instagram, Facebook, Grubhub, and Heartland/POS ordering are plain anchors, not Next client-side navigation.
