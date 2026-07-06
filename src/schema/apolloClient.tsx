// apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL_LINK } from "../../config"; // ✅ Make sure this ends with /graphql

// 1. Create HTTP link
const httpLink = createHttpLink({
  uri: URL_LINK,
});

// 2. Log GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    console.log("[GraphQL Errors]", graphQLErrors);
  }
  if (networkError) {
    console.log("[Network Error]", networkError);
  }
  if (operation) {
    console.log("[Operation]", operation.operationName);
  }
});

// 3. Attach Authorization header dynamically
const authLink = setContext(async (_, { headers }) => {
  try {
    const token = await AsyncStorage.getItem("userToken_");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  } catch (e) {
    console.log("Error getting token", e);
    return { headers };
  }
});

// 4. Combine and create Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;








// // schema/apolloClient.ts
// import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import { onError } from '@apollo/client/link/error';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { URL_LINK } from '../../config';


// // Custom upload link using fetch and FormData
// // const uploadLink = createHttpLink({
// //   uri: URL_LINK,
// //   fetch: async (uri, options) => {
// //     // Check if we have files in the request body
// //     const { body } = options as any;

// //     if (body && typeof body === 'object') {
// //       const bodyObj = JSON.parse(body as string);

// //       // Look for files in variables
// //       const hasFile = Object.values(bodyObj.variables || {}).some(
// //         (v) => v instanceof File || v?.uri
// //       );

// //       if (hasFile) {
// //         const formData = new FormData();

// //         // Add operations
// //         formData.append('operations', JSON.stringify(bodyObj));

// //         // Map files
// //         const map: Record<string, string[]> = {};
// //         let i = 0;
// //         for (const [key, value] of Object.entries(bodyObj.variables)) {
// //           if (value instanceof File || value?.uri) {
// //             map[i] = [`variables.${key}`];
// //             i++;
// //           }
// //         }
// //         formData.append('map', JSON.stringify(map));

// //         // Append files to FormData
// //         i = 0;
// //         for (const [_, value] of Object.entries(bodyObj.variables)) {
// //           if (value instanceof File || value?.uri) {
// //             let file: any = value;

// //             if (value?.uri) {
// //               // Convert Expo file URI to blob
// //               const response = await fetch(value.uri);
// //               const blob = await response.blob();
// //               file = new File([blob], value.name || 'file');
// //             }

// //             formData.append(String(i), file);
// //             i++;
// //           }
// //         }

// //         return fetch(uri, {
// //           method: 'POST',
// //           body: formData,
// //           headers: {
// //             ...(options as any).headers,
// //           },
// //         });
// //       }
// //     }

// //     // Default fetch for normal queries/mutations
// //     return fetch(uri, options);
// //   },
// // });
// // const uploadLink = createHttpLink({
// //   uri: URL_LINK,
// //   fetch: async (uri, options) => {
// //     const { body } = options || {};
// //     if (!body || typeof body !== "string") {
// //       // Default fetch for normal queries/mutations
// //       return fetch(uri, options);
// //     }

// //     const bodyObj = JSON.parse(body);

// //     // --- Detect if any variable contains a file or a file array ---
// //     const hasFile = Object.values(bodyObj.variables || {}).some((v) => {
// //       if (v instanceof File || v?.uri) return true;
// //       if (Array.isArray(v)) return v.some((f) => f instanceof File || f?.uri);
// //       return false;
// //     });

// //     if (!hasFile) {
// //       // No files found → standard GraphQL request
// //       return fetch(uri, options);
// //     }

// //     // --- Construct multipart form data for GraphQL upload ---
// //     const formData = new FormData();

// //     // Add operations (the original GraphQL body)
// //     formData.append("operations", JSON.stringify(bodyObj));

// //     // Build file map
// //     const map = {};
// //     let i = 0;

// //     for (const [key, value] of Object.entries(bodyObj.variables)) {
// //       if (Array.isArray(value)) {
// //         value.forEach((item, index) => {
// //           if (item instanceof File || item?.uri) {
// //             map[i] = [`variables.${key}.${index}`];
// //             i++;
// //           }
// //         });
// //       } else if (value instanceof File || value?.uri) {
// //         map[i] = [`variables.${key}`];
// //         i++;
// //       }
// //     }

// //     formData.append("map", JSON.stringify(map));

// //     // Append each file
// //     i = 0;
// //     for (const [_, value] of Object.entries(bodyObj.variables)) {
// //       if (Array.isArray(value)) {
// //         for (const item of value) {
// //           if (item instanceof File || item?.uri) {
// //             let file = item;
// //             if (item?.uri) {
// //               const response = await fetch(item.uri);
// //               const blob = await response.blob();
// //               file = new File([blob], item.name || "file", { type: item.type });
// //             }
// //             formData.append(String(i), file);
// //             i++;
// //           }
// //         }
// //       } else if (value instanceof File || value?.uri) {
// //         let file = value;
// //         if (value?.uri) {
// //           const response = await fetch(value.uri);
// //           const blob = await response.blob();
// //           file = new File([blob], value.name || "file", { type: value.type });
// //         }
// //         formData.append(String(i), file);
// //         i++;
// //       }
// //     }

// //     // --- Final multipart request ---
// //     return fetch(uri, {
// //       method: "POST",
// //       body: formData,
// //       headers: {
// //         ...(options?.headers || {}),
// //         // ⚠️ Do NOT set 'Content-Type' manually — fetch sets it automatically for FormData
// //       },
// //     });
// //   },
// // });

// // const uploadLink = createHttpLink({
// //   uri: URL_LINK, // use your LAN IP, not localhost
// //   fetch: async (uri, options) => {
// //     const { body } = options || {};
// //     if (!body || typeof body !== "string") {
// //       // Default fetch for normal queries/mutations
// //       return fetch(uri, options);
// //     }

// //     const bodyObj = JSON.parse(body);

// //     // --- Detect if any variable contains a file or array of files ---
// //     const hasFile = Object.values(bodyObj.variables || {}).some((v) => {
// //       if (v?.uri) return true;
// //       if (Array.isArray(v)) return v.some((f) => f?.uri);
// //       return false;
// //     });

// //     if (!hasFile) {
// //       return fetch(uri, options);
// //     }

// //     // --- Multipart form data ---
// //     const formData = new FormData();
// //     formData.append("operations", JSON.stringify(bodyObj));

// //     // Build map
// //     const map: Record<string, string[]> = {};
// //     let i = 0;

// //     for (const [key, value] of Object.entries(bodyObj.variables)) {
// //       if (Array.isArray(value)) {
// //         value.forEach((item, index) => {
// //           if (item?.uri) map[i++] = [`variables.${key}.${index}`];
// //         });
// //       } else if (value?.uri) {
// //         map[i++] = [`variables.${key}`];
// //       }
// //     }

// //     formData.append("map", JSON.stringify(map));

// //     // Append files as blobs
// //     i = 0;
// //     for (const [_, value] of Object.entries(bodyObj.variables)) {
// //       if (Array.isArray(value)) {
// //         for (const item of value) {
// //           if (item?.uri) {
// //             const response = await fetch(item.uri);
// //             const blob = await response.blob();
// //             formData.append(String(i++), blob, item.name);
// //           }
// //         }
// //       } else if (value?.uri) {
// //         const response = await fetch(value.uri);
// //         const blob = await response.blob();
// //         formData.append(String(i++), blob, value.name);
// //       }
// //     }

// //     // --- Final fetch ---
// //     return fetch(uri, {
// //       method: "POST",
// //       body: formData,
// //       headers: {
// //         ...(options?.headers || {}),
// //         // DO NOT set Content-Type manually — fetch sets it automatically for FormData
// //       },
// //     });
// //   },
// // });

// const uploadLink = createHttpLink({
//   uri: URL_LINK,
//   fetch: async (uri, options) => {
//     const { body, headers } = options || {};
//     if (!body || typeof body !== 'string') return fetch(uri, options);

//     const bodyObj = JSON.parse(body);

//     // --- Collect files from variables ---
//     const files: { file: any; path: string }[] = [];
//     Object.entries(bodyObj.variables || {}).forEach(([key, value]) => {
//       if (Array.isArray(value)) {
//         value.forEach((item: any, index) => {
//           if (item?.uri) files.push({ file: item, path: `variables.${key}.${index}` });
//         });
//       } else if (value?.uri) {
//         files.push({ file: value, path: `variables.${key}` });
//       }
//     });

//     if (files.length === 0) {
//       // No files → normal fetch
//       return fetch(uri, options);
//     }

//     // --- Build multipart form data ---
//     const formData = new FormData();
//     formData.append('operations', JSON.stringify(bodyObj));

//     const map: Record<string, string[]> = {};
//     files.forEach((_, i) => (map[i] = [files[i].path]));
//     formData.append('map', JSON.stringify(map));

//     // Append files
//     await Promise.all(
//       files.map(async (f, i) => {
//         // fetch the URI and convert to blob
//         const response = await fetch(f.file.uri);
//         const blob = await response.blob();
//         // append blob with filename and type
//         formData.append(String(i), blob, f.file.name);
//       })
//     );

//     // --- Get auth token ---
//     const token = await AsyncStorage.getItem('userToken_');

//     // --- Send the multipart request ---
//     return fetch(uri, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         ...(headers || {}),
//         Authorization: token ? `Bearer ${token}` : '',
//         // ⚠ Do NOT set Content-Type, let fetch handle it
//       },
//     });
//   },
// });
// // Error handling
// // Error handling
// const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
//   if (graphQLErrors && graphQLErrors.length > 0) {
//     graphQLErrors.forEach(({ message, locations, path, extensions }) => {
//       console.log(
//         `[GraphQL Error]:\n Message: ${message}\n Path: ${path}\n Locations: ${JSON.stringify(locations)}\n Extensions: ${JSON.stringify(extensions)}`
//       );
//     });
//   }

//   if (networkError) {
//     console.log('[Network Error]:', networkError);

//     // If the backend returns a GraphQL-style error in the network response (like 400)
//     if (networkError?.result?.errors) {
//       console.log('[Network Error -> GraphQL Errors]:', networkError.result.errors);
//       networkError.result.errors.forEach((err) => {
//         console.log('[Network Error Message]:', err.message);
//       });
//     }

//     // Sometimes, the actual body is nested under networkError.result
//     if (networkError?.result) {
//       console.log('[Network Error Result Body]:', JSON.stringify(networkError.result, null, 2));
//     }
//   }

//   return forward(operation);
// });


// // Auth link
// const authLink = setContext(async (_, { headers }) => {
//   const token = await AsyncStorage.getItem('userToken_');
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// // Apollo Client
// const client = new ApolloClient({
//   link: ApolloLink.from([errorLink, authLink, uploadLink]),
//   cache: new InMemoryCache(
//     {
//   typePolicies: {
//     Query: {
//       fields: {
//         getRequestByUsers: {
//           merge: false, // always replace instead of merging old + new
//         },
//         getPublicRequestsByUser: {
//           merge: false,
//         },
//       },
//     },
//   },
// }
//   ),
// });

// export default client;






// // apolloClient.js
// import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import { onError } from '@apollo/client/link/error';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { URL_LINK } from '../../config'; // Your GraphQL endpoint

// // 1. Create HTTP link
// const httpLink = createHttpLink({
//   uri: URL_LINK,
// });

// // 2. Log GraphQL and network errors
// const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
//   if (graphQLErrors) {
//     console.log('[GraphQL Errors]', graphQLErrors);
//   }
//   if (networkError) {
//     console.log('[Network Error]', networkError);
//   }
//   if (operation) {
//     console.log('[Operation]', operation.operationName);
//   }
// });

// // 3. Attach Authorization header dynamically
// const authLink = setContext(async (_, { headers }) => {
//   try {
//     const token = await AsyncStorage.getItem('userToken_');
//     return {
//       headers: {
//         ...headers,
//         authorization: token ? `Bearer ${token}` : '',
//       },
//     };
//   } catch (e) {
//     console.log('Error getting token', e);
//     return { headers };
//   }
// });

// // 4. Create Apollo Client with authLink + httpLink
// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

// export default client;
