---
title: Crypto Dashboard
---

# Work Trial Task - Crypto Dashboard

## Project Setup guide:
1. To get started with the app make sure to do "npm i" followed by "npm run dev" when running the web-app directory.
2. In order to make this application I used NextJS for simple frontend/backend integration, TailwindCSS for simple styling, shadcn for certain elements I wanted, and lucide-react for icons. All of these together helped me create this application.

 ## API Integration Details
 1. I used CoinCap API instead of CoinGecko because of there is no need for an API Key and a simpler approach to a fast api.
 2. I used the endpoint "https://api.coincap.io/v2/assets" to perform a GET request.
 3. The implementation of this is in the server side of the code under app/api/crypto.ts, but the route handling is done by route.ts located in app/api/crypto.
 4. The client side called this API Get Request through the Refresh button which sets the updated data in the component's state.

## State Management
1. For statemanagement I used React's useState hook to make sure that all variables were being set properly to their respective cryptocurrency.
2. There is a total of three variables/functions that user useState which includes searchQuery, cryptoData, and isRefreshing.
3. searchQuery has the current search value in there.
4. cryptoData contains the data from the api
5. isRefreshing allows whether or not to display "Refreshing..." or "Refresh Data".

## Challenges & solutions
The trickiest part would be forgetting to implement the GET functionality of the API. I created crypto.ts which handles the functionality of the api request, but does not perform the GET() request. This had me confused for some time, but by backtracking my code through the explanation, I realized I forgot to add the actual route.ts. Although this wasn't extremely difficult to notice, it did cause some headache.
Another difficult part I did was implementing a more responsive look to the site to handle users looking at the site through their phones.