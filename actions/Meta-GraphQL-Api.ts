// @/actions/Meta-GraphQL-Api.ts
'use server'

import { prisma } from "@/lib/db"
import { cache } from 'react'
import { headers } from 'next/headers'
import{ apiNameToDocId, DEFAULT_GRAPHQL_CONFIG } from "@/utils/MetaGraphQLConstsAndFunctions"

// Type definitions
type GraphQLConfig = {
  url: string
  headers: Record<string, string>
  method: string
  body: Record<string, any>
}

interface MetaGraphQLApiProps {
  configId?: string
  variables?: Record<string, any>
  fb_api_req_friendly_name?: string
}

export async function metaGraphQLApi({
  variables,
  fb_api_req_friendly_name,
  configId,
}: MetaGraphQLApiProps) {
  try {
   

    const text = await fetchGraphQL({
      variables,
      fb_api_req_friendly_name,
      configId,
    })

    // Use our optimized parser to handle multiple JSON objects
    const parsedData = parseJsonObjects(text);

    if (parsedData.length === 0) {
      throw new Error("No valid JSON objects found in the response");
    }
    // console.log(
    //   "\n",
    //   "🔧🔧🔧🔧 ~ Meta-GraphQL-Api ~ ",
    //   fb_api_req_friendly_name,
    //   " ~ \n",
    //   variables,
    //   " ~ \n",
    //   text.slice(0, 200),
    // );
    return parsedData.length === 1 ? parsedData[0] : parsedData;
  } catch (error) {
    console.error("Error in metaGraphQLApi:", error.message);
    throw error;
  }
}

  /* Meta GraphQL API Server Action Summary
  
  # Meta GraphQL API Server Action

## Key Features:
1. Flexible GraphQL requests to Meta (Facebook) API
2. Handles multiple JSON objects in a single response
3. Customizable headers and parameters
4. Error handling and logging

## Usage:

```typescript
import { metaGraphQLApi } from '@/app/actions/Meta-GraphQL-Api';

const result = await metaGraphQLApi({
  variables: {
    // Your GraphQL variables here
  },
  fb_api_req_friendly_name: "AdLibrarySearchPaginationQuery" // or other query names
});
```

## Input:
- `variables`: Object containing GraphQL query variables
- `fb_api_req_friendly_name`: String identifying the specific API query

## Returned Result:
- Single object if only one JSON object is returned
- Array of objects if multiple JSON objects are returned

## Handling Results:

```typescript
if (Array.isArray(result)) {
  // Handle multiple returned objects
  result.forEach(item => {
    // Process each item
  });
} else {
  // Handle single returned object
  // Process result directly
}
```

## Error Handling:
- The action throws errors for HTTP issues or invalid responses
- Implement try-catch in the calling code to handle errors

## Notes:
- Uses predefined headers and parameters, customizable if needed
- Automatically selects appropriate `doc_id` based on `fb_api_req_friendly_name`
- Parses complex responses with multiple JSON objects
- Designed for server-side use in Next.js applications

  */


// This implementation includes:

// Caching System: Uses React's cache function to cache GraphQL configurations
// Fallback Strategy:
// Falls back to DEFAULT_GRAPHQL_CONFIG if no config is found
// Merges any partial config with DEFAULT_GRAPHQL_CONFIG to ensure all required fields
// Parameter Overrides:
// Handles variables override
// Manages fb_api_req_friendly_name and related doc_id mapping
// Helper Functions:
// getGraphQLConfig: Cached function to fetch and validate configurations
// objectToURLSearchParams: Converts body object to URLSearchParams
// Type Safety:
// TypeScript interfaces for params and config
// Proper type checking throughout the code
// To use this function, you can call it like this:
// Using default active config
// const result = await fetchGraphQL({
//   variables: { someVar: "value" }
// })

// // Using specific config with friendly name
// const result = await fetchGraphQL({
//   configId: "some-config-id",
//   fb_api_req_friendly_name: "AdLibraryAdCollationDetailsQuery",
//   variables: { someVar: "value" }
// })
export async function fetchGraphQL({
  configId,
  variables,
  fb_api_req_friendly_name,
}: MetaGraphQLApiProps) {
  try {
    // Get config with fallback strategy
    const config = await getGraphQLConfig(configId)
    
    console.log(
      "\n",
      " 🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧 ~ Meta-GraphQL-Api ~ fetchGraphQL ~ -------------",
      "\n",
      config.headers,
      "\n",
       config.body,
      "\n",
    )
    
    // Deep clone the config to avoid modifying the cached version
    const headers = { ...config.headers }
    const body = { ...config.body }

    if (variables) {
      body.variables = variables
    }

    if (fb_api_req_friendly_name) {
      body.fb_api_req_friendly_name = fb_api_req_friendly_name
      headers["x-fb-friendly-name"] = fb_api_req_friendly_name
      
      // Set doc_id if available in mapping
      const docId = apiNameToDocId[fb_api_req_friendly_name as keyof typeof apiNameToDocId]
      if (docId) {
        body.doc_id = docId
      }
    }

    // Convert body to URLSearchParams
    const bodyParams = objectToURLSearchParams(body)

    console.log(
      "\n",
      " 🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧🔧 ~ Meta-GraphQL-Api ~ fetchGraphQL ~ ++++++++++++++++",
      "\n",
      headers,
      "\n",
       bodyParams,
      "\n",
    )

    // Make the request
    const response = await fetch(config.url, {
      method: config.method,
      headers: headers as HeadersInit,
      body: bodyParams,
    })

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`)
    }

    return await response.text()
  } catch (error) {
    console.error('Error in fetchGraphQL:', error.message)
    throw error
  }
}


// Config fetching logic with fallback:
// Try to get config by configId
// If not found, get newest active config
// If no config found at all, use DEFAULT_GRAPHQL_CONFIG
// Use individual field fallbacks only when a field is completely missing from the DB config
async function getGraphQLConfig(configId?: string): Promise<GraphQLConfig> {
  try {
    let config

    if (configId) {
      config = await prisma.metaGraphQLConfig.findUnique({
        where: { id: configId },
      })
    } else {
      config = await prisma.metaGraphQLConfig.findFirst({
        where: { is_active: true },
        orderBy: { createdAt: 'desc' },
      })
    }

    if (!config) {
      return DEFAULT_GRAPHQL_CONFIG
    }

    // Since graphql_xhr is stored as JSON, we can directly access its fields
    const xhr = config.graphql_xhr as any

    // Return the complete config from DB, falling back to DEFAULT only if fields are missing
    return {
      url: xhr.url || DEFAULT_GRAPHQL_CONFIG.url,
      headers: typeof xhr.headers === 'object' ? xhr.headers : DEFAULT_GRAPHQL_CONFIG.headers,
      method: xhr.method || DEFAULT_GRAPHQL_CONFIG.method,
      body: typeof xhr.body === 'object' ? xhr.body : DEFAULT_GRAPHQL_CONFIG.body,
    }
  } catch (error) {
    console.error('Error fetching GraphQL config:', error)
    return DEFAULT_GRAPHQL_CONFIG
  }
}

// Convert body object to URLSearchParams
function objectToURLSearchParams(obj: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
    }
  }
  return params
}

// Optimized parser to handle multiple JSON objects
function parseJsonObjects(text: string): any[] {
  const results: any[] = [];
  let bracketCount = 0;
  let currentObject = "";

  // First step: Remove "for (;;);"
  text = text.replace("for (;;);", "");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === "{") {
      bracketCount++;
    } else if (char === "}") {
      bracketCount--;
    }

    currentObject += char;

    if (bracketCount === 0 && currentObject.trim() !== "") {
      try {
        const parsedObject = JSON.parse(currentObject);
        results.push(parsedObject);
        currentObject = "";
      } catch (error) {
        console.error("Error parsing JSON object:", error.message);
      }
    }
  }

  return results;
}
