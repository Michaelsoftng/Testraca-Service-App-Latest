// import { GET_PUBLIC_REQUEST, GETREQUEST } from "../../schema/apiSchema";
import { useQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { useAppState } from "../my-store/hooks/useAppState";
import { useNetwork } from "../my-store/hooks/useNetwork";
import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
import {
  addOrders,
  clearOrders,
  setOrders,
} from "../my-store/redux/userOrdersSlice";
import { useGetUserDetails } from "./useGetUserDetails";
import { GETREQUEST } from "../schema/ApiSchema";

export function useOrdersRedux() {
  const dispatch = useAppDispatch();
  const { userData, loadingUserDetails } = useGetUserDetails();

  // Determine which query to use
  const isFoodHandlers = userData?.patient?.testChoice === "FOODHANDLERS";
  const patientId = isFoodHandlers ? userData?.id : userData?.patient?.id;

  const limit = 10;
  const lastPatientId = useRef(patientId);

  // Reset orders when switching accounts
  useEffect(() => {
    if (patientId && lastPatientId.current && lastPatientId.current !== patientId) {
      dispatch(clearOrders());
    }
    lastPatientId.current = patientId;
  }, [patientId, dispatch]);

  // Cached data from Redux
  const cached = useAppSelector((state) =>
    patientId && state.orders?.byUser ? state.orders.byUser[patientId] : null
  );

  const [offset, setOffset] = useState(cached?.offset ?? 0);
  const orders = cached?.list ?? [];
  const totalCount = cached?.totalCount ?? 0;

  const query = GETREQUEST;

  // const query = isFoodHandlers ? GET_PUBLIC_REQUEST : GETREQUEST;

  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(query, {
    variables: { limit, offset: 0, patientId },
    skip: !patientId,
    fetchPolicy: "network-only", // ensures fresh data from server
    notifyOnNetworkStatusChange: true,
  });

  // When new data comes in (initial load or refetch), update Redux
  useEffect(() => {
    if (!patientId || !data) return;

    const result = isFoodHandlers
      ? data.getPublicRequestsByUser?.requests || []
      : data.getRequestByUsers?.requests || [];

    const count = isFoodHandlers
      ? data.getPublicRequestsByUser?.requestsCount || result.length
      : data.getRequestByUsers?.requestsCount || result.length;

    // Only reset list on first load (offset 0)
    if (offset === 0) {
      dispatch(
        setOrders({
          patientId,
          orders: result,
          totalCount: count,
          offset: 0,
        })
      );
    }
  }, [data, patientId, dispatch, isFoodHandlers, offset]);

  // Pagination
  const loadMore = async () => {
    if (loading || !patientId) return;

    const newOffset = offset + limit;
    if (newOffset >= totalCount) return;

    const { data: moreData } = await fetchMore({
      variables: { limit, offset: newOffset, patientId },
    });

    if (moreData) {
      const moreResults = isFoodHandlers
        ? moreData.getPublicRequestsByUser?.requests || []
        : moreData.getRequestByUsers?.requests || [];

      const count = isFoodHandlers
        ? moreData.getPublicRequestsByUser?.requestsCount || 0
        : moreData.getRequestByUsers?.requestsCount || 0;

      // 🔥 Append new items to Redux instead of replacing
      dispatch(
        addOrders({
          patientId,
          orders: moreResults,
          totalCount: count,
          offset: newOffset,
        })
      );
      setOffset(newOffset);
    }
  };

  // Refetch on app resume or network reconnect
  useAppState(() => refetch?.({ fetchPolicy: "network-only" }));
  useNetwork(() => refetch?.({ fetchPolicy: "network-only" }));

  // Manual reload
  const reloadOrders = async () => {
    setOffset(0);
    await refetch({ fetchPolicy: "network-only" });
  };

  return {
    orders,
    totalCount,
    offset,
    loadMore,
    reloadOrders,
    loadingOrders: loading || loadingUserDetails || networkStatus === 4,
    errorOrders: error,
  };
}



// import { GET_PUBLIC_REQUEST, GETREQUEST } from "@/schema/apiSchema";
// // import { useQuery } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import { useEffect, useRef, useState } from "react";
// import { useAppState } from "../my-store/hooks/useAppState";
// import { useNetwork } from "../my-store/hooks/useNetwork";
// import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
// import {
//   addOrders,
//   clearOrders,
//   setOrders,
// } from "../my-store/redux/userOrdersSlice";
// import { useGetUserDetails } from "./useGetUserDetails";

// export function useOrdersRedux() {
//   const dispatch = useAppDispatch();
//   const { userData, loadingUserDetails } = useGetUserDetails();

//   // Determine which query to use
//   const isFoodHandlers = userData?.patient?.testChoice === "FOODHANDLERS";
//   const patientId = isFoodHandlers ? userData?.id : userData?.patient?.id;

//   const limit = 10;
//   const lastPatientId = useRef(patientId);

//   // Reset orders when switching accounts
//   useEffect(() => {
//     if (patientId && lastPatientId.current && lastPatientId.current !== patientId) {
//       dispatch(clearOrders());
//     }
//     lastPatientId.current = patientId;
//   }, [patientId, dispatch]);

//   // Cached data from Redux
//   const cached = useAppSelector((state) =>
//     patientId && state.orders?.byUser ? state.orders.byUser[patientId] : null
//   );

//   const [offset, setOffset] = useState(cached?.offset ?? 0);
//   const orders = cached?.list ?? [];
//   const totalCount = cached?.totalCount ?? 0;

//   const query = isFoodHandlers ? GET_PUBLIC_REQUEST : GETREQUEST;

//   const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(query, {
//     variables: { limit, offset: 0, patientId },
//     skip: !patientId,
//     fetchPolicy: "network-only", // 🔥 ensures fresh data from server
//     notifyOnNetworkStatusChange: true,
//   });

//   // When new data comes in, always update Redux
//   useEffect(() => {
//     if (!patientId || !data) return;

//     const result = isFoodHandlers
//       ? data.getPublicRequestsByUser?.requests || []
//       : data.getRequestByUsers?.requests || [];

//     const count = isFoodHandlers
//       ? data.getPublicRequestsByUser?.requestsCount || result.length
//       : data.getRequestByUsers?.requestsCount || result.length;

//     // 🔥 Always update Redux when fresh data comes in
//     dispatch(
//       setOrders({
//         patientId,
//         orders: result,
//         totalCount: count,
//         offset: 0,
//       })
//     );
//     setOffset(0);
//   }, [data, patientId, dispatch, isFoodHandlers]);

//   // Pagination
//   const loadMore = async () => {
//     if (loading || !patientId) return;

//     const newOffset = offset + limit;
//     if (newOffset >= totalCount) return;

//     const { data: moreData } = await fetchMore({
//       variables: { limit, offset: newOffset, patientId },
//       updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
//     });

//     if (moreData) {
//       const moreResults = isFoodHandlers
//         ? moreData.getPublicRequestsByUser?.requests || []
//         : moreData.getRequestByUsers?.requests || [];

//       const count = isFoodHandlers
//         ? moreData.getPublicRequestsByUser?.requestsCount || 0
//         : moreData.getRequestByUsers?.requestsCount || 0;

//       dispatch(
//         addOrders({
//           patientId,
//           orders: moreResults,
//           totalCount: count,
//           offset: newOffset,
//         })
//       );
//       setOffset(newOffset);
//     }
//   };

//   // Refetch on app resume or network reconnect
//   useAppState(() => refetch?.());
//   useNetwork(() => refetch?.());

//   // Manual reload
//   const reloadOrders = async () => {
//     await refetch({ fetchPolicy: "network-only" }); // 🔥 force bypass cache
//   };

//   return {
//     orders,
//     totalCount,
//     offset,
//     loadMore,
//     reloadOrders,
//     loadingOrders: loading || loadingUserDetails || networkStatus === 4,
//     errorOrders: error,
//   };
// }



// import { GET_PUBLIC_REQUEST, GETREQUEST } from "@/schema/apiSchema";
// import { useQuery } from "@apollo/client/react";
// import { useEffect, useRef, useState } from "react";
// import { useAppState } from "../my-store/hooks/useAppState";
// import { useNetwork } from "../my-store/hooks/useNetwork";
// import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
// import {
//     addOrders,
//     clearOrders,
//     setOrders,
// } from "../my-store/redux/userOrdersSlice";
// import { useGetUserDetails } from "./useGetUserDetails";

// export function useOrdersRedux() {
//   const dispatch = useAppDispatch();
//   const { userData, loadingUserDetails } = useGetUserDetails();

//   // Determine which query to use
//   const isFoodHandlers = userData?.patient?.testChoice === "FOODHANDLERS";
//   const patientId = isFoodHandlers ? userData?.id : userData?.patient?.id;

//   const limit = 10; // increased limit if desired

//   // Track the last loaded user to detect account switch
//   const lastPatientId = useRef(patientId);

//   // Clear cached orders when user changes
//   useEffect(() => {
//     if (patientId && lastPatientId.current && lastPatientId.current !== patientId) {
//       dispatch(clearOrders());
//     }
//     lastPatientId.current = patientId;
//   }, [patientId, dispatch]);

//   // Retrieve cached data for this user
//   const cached = useAppSelector(
//     (state) =>
//       patientId && state.orders?.byUser ? state.orders.byUser[patientId] : null
//   );

//   const [offset, setOffset] = useState(cached?.offset ?? 0);
//   const orders = cached?.list ?? [];
//   const totalCount = cached?.totalCount ?? 0;

//   // Choose appropriate GraphQL query
//   const query = isFoodHandlers ? GET_PUBLIC_REQUEST : GETREQUEST;

//   const { data, loading, error, fetchMore, refetch } = useQuery(query, {
//     variables: { limit, offset: 0, patientId },
//     skip: !patientId,
//     fetchPolicy: "cache-and-network",
//   });

//   // Initial load
//   useEffect(() => {
//     if (data && patientId) {
//       const result = isFoodHandlers
//         ? data.getPublicRequestsByUser?.requests || []
//         : data.getRequestByUsers?.requests || [];

//       const count = isFoodHandlers
//         ? data.getPublicRequestsByUser?.requestsCount || result.length
//         : data.getRequestByUsers?.requestsCount || result.length;

//       if (!cached?.list?.length) {
//         dispatch(
//           setOrders({
//             patientId,
//             orders: result,
//             totalCount: count,
//             offset: 0,
//           })
//         );
//         setOffset(0);
//       }
//     }
//   }, [data, patientId, cached, dispatch, isFoodHandlers]);

//   // Load more (pagination)
//   const loadMore = async () => {
//     if (loading || !patientId) return;

//     const newOffset = offset + limit;
//     if (newOffset >= totalCount) return;

//     const { data: moreData } = await fetchMore({
//       variables: { limit, offset: newOffset, patientId },
//     });

//     if (moreData) {
//       const moreResults = isFoodHandlers
//         ? moreData.getPublicRequestsByUser?.requests || []
//         : moreData.getRequestByUsers?.requests || [];

//       const count = isFoodHandlers
//         ? moreData.getPublicRequestsByUser?.requestsCount || 0
//         : moreData.getRequestByUsers?.requestsCount || 0;

//       dispatch(
//         addOrders({
//           patientId,
//           orders: moreResults,
//           totalCount: count,
//           offset: newOffset,
//         })
//       );

//       setOffset(newOffset);
//     }
//   };

//   // Auto-refetch when app resumes or network reconnects
//   useAppState(() => refetch?.());
//   useNetwork(() => refetch?.());

//   const reloadOrders = async () => {
//     await refetch();
//   };

//   return {
//     orders,
//     totalCount,
//     offset,
//     loadMore,
//     reloadOrders,
//     loadingOrders: loading || loadingUserDetails,
//     errorOrders: error,
//   };
// }


// import { GET_PUBLIC_REQUEST, GETREQUEST } from "@/schema/apiSchema";
// import { useQuery } from "@apollo/client/react";
// import { useEffect, useRef, useState } from "react";
// import { useAppState } from "../my-store/hooks/useAppState";
// import { useNetwork } from "../my-store/hooks/useNetwork";
// import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
// import { addOrders, clearOrders, setOrders } from "../my-store/redux/userOrdersSlice";
// import { useGetUserDetails } from "./useGetUserDetails";

// export function useOrdersRedux() {
//   const dispatch = useAppDispatch();
//   const { userData, loadingUserDetails } = useGetUserDetails();
//   const isFoodHandlers = userData?.patient?.testChoice === "FOODHANDLERS";
//   const patientId = isFoodHandlers ? userData.id:userData?.patient?.id;
  
//   const limit = 5;

//   // Track the last loaded user to detect changes
//   const lastPatientId = useRef(patientId);

//   // Clear cache if user changes
//   useEffect(() => {
//     if (patientId && lastPatientId.current && lastPatientId.current !== patientId) {
//       dispatch(clearOrders());
//     }
//     lastPatientId.current = patientId;
//   }, [patientId, dispatch]);

//   // Retrieve cached data for this user
//   const cached = useAppSelector(
//     (state) => (patientId && state.orders?.byUser ? state.orders.byUser[patientId] : null)
//   );

//   const [offset, setOffset] = useState(cached?.offset ?? 0);
//   const orders = cached?.list ?? [];
//   const totalCount = cached?.totalCount ?? 0;

//   const query = isFoodHandlers ? GET_PUBLIC_REQUEST : GETREQUEST;

//   const { data, loading, error, fetchMore, refetch } = useQuery(query, {
//     variables: isFoodHandlers
//       ? { limit, offset: 0, patientId }
//       : { limit, offset: 0, patientId },
//     skip: !patientId,
//     fetchPolicy: "cache-and-network",
//   });

//   // Initial load
//   useEffect(() => {
//     if (data && patientId) {
//       const result =
//         data.getRequestByUsers?.requests ||
//         data.getPublicRequestsByUser?.requests ||
//         [];
//       const count =
//         data.getRequestByUsers?.requestsCount ||
//         data.getPublicRequestsByUser?.requestsCount ||
//         result.length;

//       if (!cached?.list?.length) {
//         dispatch(
//           setOrders({
//             patientId,
//             orders: result,
//             totalCount: count,
//             offset: 0,
//           })
//         );
//         setOffset(0);
//       }
//     }
//   }, [data, patientId, cached, dispatch]);

//   // Load more when needed
//   const loadMore = async () => {
//     if (loading || !patientId) return;

//     const newOffset = offset + limit;
//     if (newOffset >= totalCount) return;

//     const { data: moreData } = await fetchMore({
//       variables: {
//         limit,
//         offset: newOffset,
//         patientId,
//       },
//     });

//     if (moreData) {
//       const moreResults = isFoodHandlers ? moreData.getPublicRequestsByUser?.requests:  moreData.getRequestByUsers?.requests || [];
//       const count = moreData.getRequestByUsers?.requestsCount || 0;
//       dispatch(
//         addOrders({
//           patientId,
//           orders: moreResults,
//           totalCount: count,
//           offset: newOffset,
//         })
//       );
//       setOffset(newOffset);
//     }
//   };

//   // Auto-refetch for fresh data (but keeps cache)
//   useAppState(() => refetch?.());
//   useNetwork(() => refetch?.());

//   const reloadOrders = async () => {
//     await refetch();
//   };

//   return {
//     orders,
//     totalCount,
//     offset,
//     loadMore,
//     reloadOrders,
//     loadingOrders: loading || loadingUserDetails,
//     errorOrders: error,
//   };
// }



// // // src/hooks/useOrdersRedux.js
// // import { GET_PUBLIC_REQUEST, GETREQUEST } from "@/schema/apiSchema";
// // import { useQuery } from "@apollo/client/react";
// // import { useEffect, useState } from "react";
// // import { useAppState } from "../my-store/hooks/useAppState";
// // import { useNetwork } from "../my-store/hooks/useNetwork";
// // import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
// // import { addOrders, setOrders } from "../my-store/redux/userOrdersSlice";
// // import { useGetUserDetails } from "./useGetUserDetails";

// // export function useOrdersRedux() {
// //   const dispatch = useAppDispatch();
// //   const { userData, loadingUserDetails } = useGetUserDetails();
// //   console.error('USER DEETAILS ::::::>::: ',userData);
// //   const patientId = userData?.patient?.id;
// //   const isFoodHandlers = userData?.patient?.testChoice === "FOODHANDLERS";
// //   const limit = 10;

// //   // Retrieve cached data for this user
// //   const cached = useAppSelector(
// //   (state) => (patientId && state.orders?.byUser ? state.orders.byUser[patientId] : null)
// // );
// //   // const cached = useAppSelector(
// //   //   (state) => (patientId ? state.orders.byUser[patientId] : null)
// //   // );

// //   const [offset, setOffset] = useState(cached?.offset || 0);
// //   const orders = cached?.list || [];
// //   const totalCount = cached?.totalCount || 0;

// //   const query = isFoodHandlers ? GET_PUBLIC_REQUEST : GETREQUEST;

// //   const { data, loading, error, fetchMore, refetch } = useQuery(query, {
// //     variables: isFoodHandlers
// //       ? { limit: 100000, offset: 0, patientId }
// //       : { limit, offset: 0, patientId },
// //     skip: !patientId,
// //     fetchPolicy: "cache-and-network",
// //   });

// //   // Initial load
// //   useEffect(() => {
// //     if (data && patientId) {
// //       const result =
// //         data.getRequestByUsers?.requests ||
// //         data.getPublicRequest?.requests ||
// //         [];
// //       const count =
// //         data.getRequestByUsers?.requestsCount ||
// //         data.getPublicRequest?.requestsCount ||
// //         result.length;

// //       // Only replace if cache is empty
// //       if (!cached?.list?.length) {
// //         dispatch(
// //           setOrders({
// //             patientId,
// //             orders: result,
// //             totalCount: count,
// //             offset: 0,
// //           })
// //         );
// //         setOffset(0);
// //       }
// //     }
// //   }, [data, patientId]);

// //   // Load more when needed
// //   const loadMore = async () => {
// //     if (loading || !patientId) return;

// //     const newOffset = offset + limit;
// //     if (newOffset >= totalCount) return;

// //     const { data: moreData } = await fetchMore({
// //       variables: {
// //         limit,
// //         offset: newOffset,
// //         patientId,
// //       },
// //     });

// //     if (moreData) {
// //       const moreResults = moreData.getRequestByUsers?.requests || [];
// //       const count = moreData.getRequestByUsers?.requestsCount || 0;
// //       dispatch(
// //         addOrders({
// //           patientId,
// //           orders: moreResults,
// //           totalCount: count,
// //           offset: newOffset,
// //         })
// //       );
// //       setOffset(newOffset);
// //     }
// //   };

// //   // Auto-refetch for fresh data (but keeps cache)
// //   useAppState(() => refetch?.());
// //   useNetwork(() => refetch?.());

// //   const reloadOrders = async () => {
// //     await refetch();
// //   };

// //   return {
// //     orders,
// //     totalCount,
// //     offset,
// //     loadMore,
// //     reloadOrders,
// //     loadingOrders: loading || loadingUserDetails,
// //     errorOrders: error,
// //   };
// // }




// // // // src/hooks/useOrdersRedux.js
// // // import { GET_PUBLIC_REQUEST, GETREQUEST } from "@/schema/apiSchema";
// // // import { useQuery } from "@apollo/client/react";
// // // import { useEffect, useState } from "react";
// // // import { useAppState } from "../my-store/hooks/useAppState";
// // // import { useNetwork } from "../my-store/hooks/useNetwork";
// // // import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
// // // import { addOrders, setOrders } from "../my-store/redux/userOrdersSlice";
// // // import { useGetUserDetails } from "./useGetUserDetails";

// // // export function useOrdersRedux() {
// // //   const dispatch = useAppDispatch();
// // //   const { userData, loadingUserDetails } = useGetUserDetails();
// // //   const patientId = userData?.patient?.id;
// // //   const isFoodHandlers = userData?.patient?.testChoice === "FOODHANDLERS";
// // //   const limit = 10;

// // //   // Retrieve cached data for this user
// // //   const cached = useAppSelector(
// // //     (state) => (patientId ? state.orders.byUser[patientId] : null)
// // //   );

// // //   const [offset, setOffset] = useState(cached?.offset || 0);
// // //   const orders = cached?.list || [];
// // //   const totalCount = cached?.totalCount || 0;

// // //   const query = isFoodHandlers ? GET_PUBLIC_REQUEST : GETREQUEST;

// // //   const { data, loading, error, fetchMore, refetch } = useQuery(query, {
// // //     variables: isFoodHandlers
// // //       ? { limit: 100000, offset: 0, patientId }
// // //       : { limit, offset: 0, patientId },
// // //     skip: !patientId,
// // //     fetchPolicy: "cache-and-network",
// // //   });

// // //   // Initial load
// // //   useEffect(() => {
// // //     if (data && patientId) {
// // //       const result =
// // //         data.getRequestByUsers?.requests ||
// // //         data.getPublicRequest?.requests ||
// // //         [];
// // //       const count =
// // //         data.getRequestByUsers?.requestsCount ||
// // //         data.getPublicRequest?.requestsCount ||
// // //         result.length;

// // //       // Only replace if cache is empty
// // //       if (!cached?.list?.length) {
// // //         dispatch(
// // //           setOrders({
// // //             patientId,
// // //             orders: result,
// // //             totalCount: count,
// // //             offset: 0,
// // //           })
// // //         );
// // //         setOffset(0);
// // //       }
// // //     }
// // //   }, [data, patientId]);

// // //   // Load more when needed
// // //   const loadMore = async () => {
// // //     if (loading || !patientId) return;

// // //     const newOffset = offset + limit;
// // //     if (newOffset >= totalCount) return;

// // //     const { data: moreData } = await fetchMore({
// // //       variables: {
// // //         limit,
// // //         offset: newOffset,
// // //         patientId,
// // //       },
// // //     });

// // //     if (moreData) {
// // //       const moreResults = moreData.getRequestByUsers?.requests || [];
// // //       const count = moreData.getRequestByUsers?.requestsCount || 0;
// // //       dispatch(
// // //         addOrders({
// // //           patientId,
// // //           orders: moreResults,
// // //           totalCount: count,
// // //           offset: newOffset,
// // //         })
// // //       );
// // //       setOffset(newOffset);
// // //     }
// // //   };

// // //   // Auto-refetch for fresh data (but keeps cache)
// // //   useAppState(() => refetch?.());
// // //   useNetwork(() => refetch?.());

// // //   const reloadOrders = async () => {
// // //     await refetch();
// // //   };

// // //   return {
// // //     orders,
// // //     totalCount,
// // //     offset,
// // //     loadMore,
// // //     reloadOrders,
// // //     loadingOrders: loading || loadingUserDetails,
// // //     errorOrders: error,
// // //   };
// // // }



// // // // src/hooks/useOrdersRedux.js
// // // import { GET_PUBLIC_REQUEST, GETREQUEST } from "@/schema/apiSchema";
// // // import { useQuery } from "@apollo/client/react";
// // // import { useEffect, useState } from "react";
// // // import { useAppState } from "../my-store/hooks/useAppState";
// // // import { useNetwork } from "../my-store/hooks/useNetwork";
// // // import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
// // // import { addOrders, setOrders } from "../my-store/redux/userOrdersSlice";
// // // import { useGetUserDetails } from "./useGetUserDetails";

// // // export function useOrdersRedux() {
// // //   const dispatch = useAppDispatch();
// // //   const orders = useAppSelector((state) => state.orders.list);
// // //   const [offset, setOffset] = useState(0);
// // //   const [limit] = useState(10); 

// // //   const { userData, loadingUserDetails } = useGetUserDetails();
// // //   const patientId = userData?.patient?.id;
// // //   const isFoodHandlers = userData?.patient?.testChoice === "FOODHANDLERS";

// // //   const query = isFoodHandlers ? GET_PUBLIC_REQUEST : GETREQUEST;

// // //   const { data, loading, error, fetchMore, refetch } = useQuery(query, {
// // //     variables: isFoodHandlers
// // //       ? { limit: 100000, offset: 0, patientId }
// // //       : { limit, offset, patientId },
// // //     skip: !patientId,
// // //     fetchPolicy: "cache-and-network",
// // //   });

// // //   // Load data initially
// // //   useEffect(() => {
// // //     if (data) {
// // //       const result =
// // //         data.getRequestByUsers?.requests ||
// // //         data.getPublicRequest?.requests ||
// // //         [];
// // //       const count =
// // //         data.getRequestByUsers?.requestsCount ||
// // //         data.getPublicRequest?.requestsCount ||
// // //         result.length;

// // //       // On first fetch, replace
// // //       if (offset === 0) {
// // //         dispatch(setOrders({ orders: result, totalCount: count }));
// // //       } else {
// // //         // On subsequent fetches, append
// // //         dispatch(addOrders({ orders: result, totalCount: count }));
// // //       }
// // //     }
// // //   }, [data]);

// // //   // Refetch when app comes to foreground or reconnects
// // //   useAppState(() => refetch?.());
// // //   useNetwork(() => refetch?.());

// // //   // Load more function
// // //   const loadMore = async () => {
// // //     if (loading || !patientId) return;

// // //     const newOffset = offset + limit;
// // //     const totalCount = data?.getRequestByUsers?.requestsCount ?? 0;

// // //     if (newOffset >= totalCount) return; // no more data

// // //     const { data: moreData } = await fetchMore({
// // //       variables: {
// // //         limit,
// // //         offset: newOffset,
// // //         patientId,
// // //       },
// // //     });

// // //     if (moreData) {
// // //       const moreResults = moreData.getRequestByUsers?.requests || [];
// // //       const count = moreData.getRequestByUsers?.requestsCount || 0;
// // //       dispatch(addOrders({ orders: moreResults, totalCount: count }));
// // //       setOffset(newOffset);
// // //     }
// // //   };

// // //   return {
// // //     orders,
// // //     loadingOrders: loading || loadingUserDetails,
// // //     errorOrders: error,
// // //     reloadOrders: refetch,
// // //     loadMore,
// // //   };
// // // }





// // // // src/hooks/useOrdersRedux.js
// // // import { GET_PUBLIC_REQUEST, GETREQUEST } from "@/schema/apiSchema";
// // // // import useGetUserDetails from "@/schema/getUserDetails";
// // // import { useQuery } from "@apollo/client/react";
// // // import { useEffect } from "react";

// // // import { useAppState } from "../my-store/hooks/useAppState";
// // // import { useNetwork } from "../my-store/hooks/useNetwork";
// // // import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
// // // import { setOrders } from "../my-store/redux/userOrdersSlice";
// // // import { useGetUserDetails } from "./useGetUserDetails";


// // // export function useOrdersRedux() {
// // //   const dispatch = useAppDispatch();
// // //   const orders = useAppSelector((state) => state.orders.list);

// // //   // const { userData } = useGetUserDetails();
// // //   const { userData, loadingUserDetails, errorUserDetails, reloadUserDetails } = useGetUserDetails();
// // //   // const patientId = userData?.patient?.id;
// // //   console.log('Patient ID inside hook ::::::: ', userData?.patient?.id);
// // //   const isFoodHandlers = userData?.patient?.testChoice === "FOODHANDLERS";

// // //   console.log('Is Food Handlers ::::::: ', isFoodHandlers
// // //         ? { limit: 100000, offset: 0, patientId: userData?.patient?.id }
// // //         : { id: "", patientId: userData?.patient?.id });

// // //   const { data, loading, error, refetch } = useQuery(
// // //     isFoodHandlers ? GET_PUBLIC_REQUEST : GETREQUEST,
// // //     {
// // //       variables: isFoodHandlers
// // //         ? { limit: 100000, offset: 0, patientId: userData?.patient?.id }
// // //         : { id: "", patienId: userData?.patient?.id },
// // //       // skip: !patientId,
// // //       fetchPolicy: "cache-and-network",
// // //     }
// // //   );

// // //   // Load data into Redux whenever query data changes
// // //   useEffect(() => {
// // //     if (data) {
// // //       const fetchedOrders = data?.getRequest || data?.getPublicRequest || [];
// // //       dispatch(
// // //         setOrders({
// // //           orders: fetchedOrders,
// // //           totalCount: fetchedOrders.length,
// // //         })
// // //       );
// // //     }
// // //   }, [data, dispatch]);

// // //   console.log("Orders from Redux inside hook length ::::::: ", error);
// // //   console.log("Orders from Redux inside hook ::::::: ", orders);  
// // //   // Auto-refetch when app comes to foreground
// // //   useAppState(() => refetch?.().catch(() => {}));

// // //   // Auto-refetch when network reconnects
// // //   useNetwork(() => refetch?.().catch(() => {}));

// // //   // Manual reload function
// // //   const reloadOrders = () => refetch?.();

// // //   return {
// // //     orders,
// // //     loadingOrders: loading,
// // //     errorOrders: error,
// // //     reloadOrders,
// // //   };
// // // }


// // // // src/hooks/useOrdersState.js
// // // import { GET_PUBLIC_REQUEST, GETREQUEST } from "@/schema/apiSchema";
// // // import useGetUserDetails from "@/schema/getUserDetails";
// // // import { useQuery } from "@apollo/client/react";
// // // import { useEffect, useState } from "react";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { useAppState } from "../my-store/hooks/useAppState";
// // // import { useNetwork } from "../my-store/hooks/useNetwork";
// // // import { addOrders, setOrders } from "../my-store/redux/userOrdersSlice";

// // // const LIMIT = 10;

// // // export function useOrdersState() {
// // //   const dispatch = useDispatch();
// // //   const orders = useSelector((state) => state.orders.list);
// // //   const totalCount = useSelector((state) => state.orders.totalCount);

// // //   const { userData } = useGetUserDetails();
// // //   const isFoodHandlers = userData?.patient?.testChoice === "FOODHANDLERS";

// // //   const [loadingMore, setLoadingMore] = useState(false);

// // //   const { data, loading, error, fetchMore, refetch } = useQuery(
// // //     isFoodHandlers ? GET_PUBLIC_REQUEST : GETREQUEST,
// // //     {
// // //       variables: isFoodHandlers
// // //         ? { limit: LIMIT, offset: 0, patientId: userData?.patient?.id }
// // //         : { id: "", patientId: userData?.patient?.id },
// // //       fetchPolicy: "cache-and-network",
// // //       skip: !userData?.patient?.id, // ✅ skip until userData is ready
// // //     }
// // //   );

// // //   // Load data into Redux when query returns
// // //   useEffect(() => {
// // //     if (data) {
// // //       const requests = data?.getRequest || data?.getPublicRequest || [];
// // //       dispatch(
// // //         setOrders({
// // //           packages: requests,
// // //           totalCount: requests.length,
// // //         })
// // //       );
// // //     }
// // //   }, [data, dispatch]);

// // //   // Auto-refresh on app foreground / network reconnect
// // //   useAppState(() => refetch?.().catch(() => {}));
// // //   useNetwork(() => refetch?.().catch(() => {}));

// // //   const loadMore = async () => {
// // //     if (orders.length >= totalCount || loadingMore) return;

// // //     setLoadingMore(true);
// // //     try {
// // //       const { data: moreData } = await fetchMore({
// // //         variables: { offset: orders.length, limit: LIMIT },
// // //       });

// // //       if (moreData?.getAllPackages?.packages) {
// // //         const filteredPackages = isFoodHandlers
// // //           ? moreData.getAllPackages.packages.filter((item) => item.isPublicHealthPackage)
// // //           : moreData.getAllPackages.packages;

// // //         dispatch(
// // //           addOrders({
// // //             packages: filteredPackages,
// // //             totalCount: totalCount + filteredPackages.length,
// // //           })
// // //         );
// // //       }
// // //     } catch (err) {
// // //       console.error("Error loading more orders:", err);
// // //     } finally {
// // //       setLoadingMore(false);
// // //     }
// // //   };
// // // // console.log("Orders from Redux ::::::: ", orders.length);
// // // console.log("Orders from Redux ::::::: ", orders);
// // //   return {
// // //     orders,
// // //     loadingOrders: loading,
// // //     loadingMoreOrders: loadingMore,
// // //     errorOrders: error,
// // //     loadMoreOrders: loadMore,
// // //   };
// // // }


// // // // src/hooks/usePackages.js
// // // import { GET_PUBLIC_REQUEST, GETREQUEST } from "@/schema/apiSchema";
// // // import useGetUserDetails from "@/schema/getUserDetails";
// // // import { useQuery } from "@apollo/client/react";
// // // import { useEffect, useState } from "react";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { useAppState } from "../my-store/hooks/useAppState";
// // // import { useNetwork } from "../my-store/hooks/useNetwork";
// // // import { addOrders, setOrders } from "../my-store/redux/userOrdersSlice";

// // // // import useGetUserDetails from "./getUserDetails";

// // // const LIMIT = 10;

// // // export function useOrdersState() {
// // //   const dispatch = useDispatch();
// // //   const orders = useSelector((state) => state.orders.list);
// // //   const totalCount = useSelector((state) => state.orders.totalCount);

// // //  const { userData, loadingUserDetails, errorUserDetails, reloadUserDetails } = useGetUserDetails();
// // //   const isFoodHandlers = userData?.patient?.testChoice === "FOODHANDLERS";

// // //   const [loadingMore, setLoadingMore] = useState(false);

// // //   const { data, loading, error, fetchMore, refetch } = useQuery(isFoodHandlers ? GET_PUBLIC_REQUEST : GETREQUEST, {
// // //       variables: isFoodHandlers
// // //         ? {
// // //             limit: LIMIT,
// // //           offset: 0,
// // //           patientId: userData?.patient?.id,
// // //         }
// // //       : {
// // //           id: "",
// // //           patienId: userData?.patient?.id,

// // //         }, 
    
// // //     fetchPolicy: "cache-and-network",
    
// // //       }
// // //   //   {
// // //   //   variables: { offset: 0, limit: LIMIT },
// // //   //   fetchPolicy: "cache-and-network",
// // //   // }



// // // );

// // //   // Filter and load into Redux when data changes   const getAllOders = data?.getRequest || data?.getPublicRequest || [];
// // //   useEffect(() => {
// // //     if (data?.getRequest || data?.getPublicRequest) {
// // //       const filteredRequests = data?.getRequest || data?.getPublicRequest;

// // //       dispatch(
// // //         setOrders({
// // //           packages: filteredRequests,
// // //           totalCount: filteredRequests.length,
// // //         })
// // //       );
// // //     }
// // //   }, [data, isFoodHandlers]);

// // //   // Auto-refresh when app comes to foreground
// // //   useAppState(() => refetch().catch(() => {}));

// // //   // Auto-refresh when network comes back
// // //   useNetwork(() => refetch().catch(() => {}));

// // //   const loadMore = async () => {
// // //     if (packages.length >= totalCount || loadingMore) return;

// // //     setLoadingMore(true);
// // //     try {
// // //       const { data: moreData } = await fetchMore({
// // //         variables: { offset: packages.length, limit: LIMIT },
// // //       });

// // //       if (moreData?.getAllPackages?.packages) {
// // //         const filteredPackages = isFoodHandlers
// // //           ? moreData.getAllPackages.packages.filter((item) => item.isPublicHealthPackage === true)
// // //           : moreData.getAllPackages.packages;

// // //         dispatch(
// // //           addOrders({
// // //             packages: filteredPackages,
// // //             totalCount: totalCount + filteredPackages.length,
// // //           })
// // //         );
// // //       }
// // //     } catch (err) {
// // //       console.error("Error loading more Loader:", err);
// // //     } finally {
// // //       setLoadingMore(false);
// // //     }
// // //   };

// // //   console.log("Orders from Redux ::::::: ", orders.length);
// // //   console.log("Orders from Redux ::::::: ", orders);
// // //   return {
// // //     orders,
// // //     loadingOrders_: loading,
// // //     loadingMoreOrders_: loadingMore,
// // //     errorOrders_: error,
// // //     loadMoreOrders: loadMore,
// // //   };
// // // }

