import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useAppState } from "../my-store/hooks/useAppState";
import { useNetwork } from "../my-store/hooks/useNetwork";
import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";

import { useGetUserDetails } from "./useGetUserDetails";
import { GET_ALL_CONSULTATIONS } from "../schema/ApiSchema";
import { addAcceptedConsultations, clearAcceptedConsultations, setAcceptedConsultations } from "../my-store/redux/userAcceptedConsultationsSlice";

export function useAcceptedConsultationsRedux({
  status = "",
  searchTerm = "",
  queueOnly = any,
  doctorId = "",
} = {}) {
  const dispatch = useAppDispatch();
  const { userData, loadingUserDetails } = useGetUserDetails();
  const limit = 10;
  const lastDoctorId = useRef(doctorId);

  // Reset Redux cache when doctor changes
  useEffect(() => {
    if (doctorId && lastDoctorId.current && lastDoctorId.current !== doctorId) {
      dispatch(clearAcceptedConsultations());
    }
    lastDoctorId.current = doctorId;
  }, [doctorId, dispatch]);

  const cached = useAppSelector((state) =>
    doctorId && state.acceptedConsulttattion?.byUser
      ? state.acceptedConsulttattion.byUser[doctorId]
      : null
  );

  const [offset, setOffset] = useState(cached?.offset ?? 0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Apollo query
  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(
    GET_ALL_CONSULTATIONS,
    {
      variables: { limit, offset, status, queueOnly, doctorId },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    }
  );

  // Merge initial page into Redux only. Do not reset offset on fetchMore responses.
  useEffect(() => {
    if (!doctorId || !data) return;
    if (offset !== 0) return;

    const result = data.getAllConsultations?.consultations ?? [];
    const count = data.getAllConsultations?.consultationCount ?? result.length;

    dispatch(
      setAcceptedConsultations({
        doctorId,
        consultations: result,
        totalCount: count,
        offset: 0,
      })
    );
    setOffset(0);
  }, [data, doctorId, dispatch, offset]);

  // Combined consultations (Redux + Apollo)
  const consultations = useMemo(() => {
    const cachedList = cached?.list ?? [];
    const newList = data?.getAllConsultations?.consultations ?? [];
    // merge without duplicates
    const merged = [...cachedList];
    newList.forEach((item) => {
      if (!merged.find((c) => c.id === item.id)) {
        merged.push(item);
      }
    });
    return merged;
  }, [cached, data]);

  const totalCount = cached?.totalCount ?? data?.getAllConsultations?.consultationCount ?? 0;

  // Pagination
  const loadMore = async () => {
    if (loading || loadingMore || offset + limit >= totalCount || !doctorId) return;

    const newOffset = offset + limit;
    setLoadingMore(true);

    try {
      const { data: moreData } = await fetchMore({
        variables: { limit, offset: newOffset, status, queueOnly, doctorId },
      });

      if (moreData?.getAllConsultations?.consultations?.length) {
        dispatch(
          addAcceptedConsultations({
            doctorId,
            consultations: moreData.getAllConsultations.consultations,
            totalCount: moreData.getAllConsultations.consultationCount,
            offset: newOffset,
          })
        );
        setOffset(newOffset);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  // Refetch on app resume or network reconnect
  useAppState(() => refetch?.({ fetchPolicy: "network-only" }));
  useNetwork(() => refetch?.({ fetchPolicy: "network-only" }));

  const reloadConsultations = async () => {
    setOffset(0);
    await refetch({ fetchPolicy: "network-only" });
  };

  return {
    consultations,
    totalCount,
    offset,
    loadMore,
    reloadConsultations,
    loadingConsultations: loading || loadingUserDetails || networkStatus === 4,
    loadingMore,
    errorConsultations: error,
  };
}




// import { useEffect, useRef, useState } from "react";
// // import { useQuery } from "@apollo/client";
// // import { GET_ALL_CONSULTATIONS } from "../../schema/apiSchema";
// import { useQuery } from "@apollo/client/react";
// import { useAppState } from "../my-store/hooks/useAppState";
// import { useNetwork } from "../my-store/hooks/useNetwork";
// import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
// import {
//     addConsultations,
//     clearConsultations,
//     setConsultations,
// } from "../my-store/redux/userConsultationsSlice";
// import { useGetUserDetails } from "./useGetUserDetails";
// import { GET_ALL_CONSULTATIONS } from "../schema/ApiSchema";

// export function useConsultationsRedux({ status = "", searchTerm = "" } = {}) {
//   const dispatch = useAppDispatch();
//   const { userData, loadingUserDetails } = useGetUserDetails();

//   const doctorId = userData?.id;
//   console.error('YWYWYWYWWYWYWYWYW ::::::: ', doctorId);   //userData?.id ||  userData?.doctor?.id;
//   const limit = 10;
//   const lastPatientId = useRef(doctorId);

//   // Reset cache when switching patient
//   useEffect(() => {
//     if (doctorId && lastPatientId.current && lastPatientId.current !== doctorId) {
//       dispatch(clearConsultations());
//     }
//     lastPatientId.current = doctorId;
//   }, [doctorId, dispatch]);

//   // Cached consultations
//   const cached = useAppSelector((state) =>
//     doctorId && state.consultations?.byUser
//       ? state.consultations.byUser[doctorId]
//       : null
//   );

//   const [offset, setOffset] = useState(cached?.offset ?? 0);
//   const consultations = cached?.list ?? [];
//   const totalCount = cached?.totalCount ?? 0;

//   const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(
//     GET_ALL_CONSULTATIONS,
//     {
//       variables: { limit, offset: 0, status, "queueOnly": false },
//       skip: !doctorId,
//       fetchPolicy: "network-only",
//       notifyOnNetworkStatusChange: true,
//     }
//   );

//   // Initial set or refetch
//   useEffect(() => {
//     if (!doctorId || !data) return;

//     const result = data.getAllConsultations?.consultations || [];
//     const count = data.getAllConsultations?.consultationCount || result.length;

//     if (offset === 0) {
//       dispatch(
//         setConsultations({
//           doctorId,
//           consultations: result,
//           totalCount: count,
//           offset: 0,
//         })
//       );
//     }
//   }, [data, doctorId, offset, dispatch]);

//   // Pagination
//   const loadMore = async () => {
//     if (loading || !doctorId) return;
//     const newOffset = offset + limit;
//     if (newOffset >= totalCount) return;

//     const { data: moreData } = await fetchMore({
//       variables: { limit, offset: newOffset, status, searchTerm, doctorId },
//     });

//     if (moreData) {
//       const moreResults = moreData.getAllConsultations?.consultations || [];
//       const count = moreData.getAllConsultations?.consultationCount || 0;

//       dispatch(
//         addConsultations({
//           doctorId,
//           consultations: moreResults,
//           totalCount: count,
//           offset: newOffset,
//         })
//       );
//       setOffset(newOffset);
//     }
//   };

//   // Refetch on app resume or network reconnect
//   useAppState(() => refetch?.({ fetchPolicy: "network-only" }));
//   useNetwork(() => refetch?.({ fetchPolicy: "network-only" }));

//   // Manual reload
//   const reloadConsultations = async () => {
//     setOffset(0);
//     await refetch({ fetchPolicy: "network-only" });
//   };

//   console.error('LALALALALALAL :::::: ', consultations );
//   return {
//     consultations,
//     totalCount,
//     offset,
//     loadMore,
//     reloadConsultations,
//     loadingConsultations: loading || loadingUserDetails || networkStatus === 4,
//     errorConsultations: error,
//   };
// }
