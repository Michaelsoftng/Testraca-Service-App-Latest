import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useAppState } from "../my-store/hooks/useAppState";
import { useNetwork } from "../my-store/hooks/useNetwork";
import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
import {
  addConsultations,
  clearConsultations,
  setConsultations,
} from "../my-store/redux/userConsultationsSlice";
import { useGetUserDetails } from "./useGetUserDetails";
import { GET_ALL_CONSULTATIONS } from "../schema/ApiSchema";

export function useConsultationsRedux({
  status = "",
  searchTerm = "",
  queueOnly = false,
  doctorId = "",
} = {}) {
  const dispatch = useAppDispatch();
  const { userData, loadingUserDetails } = useGetUserDetails();
  const limit = 10;
  const lastDoctorId = useRef(doctorId);

  // Reset Redux cache when the active doctor changes
  useEffect(() => {
    if (doctorId && lastDoctorId.current && lastDoctorId.current !== doctorId) {
      dispatch(clearConsultations());
    }
    lastDoctorId.current = doctorId;
  }, [doctorId, dispatch]);

  const cached = useAppSelector((state) =>
    doctorId && state.consultations?.byUser
      ? state.consultations.byUser[doctorId]
      : null
  );

  // Track pagination progress in a dedicated state variable.
  // IMPORTANT: this is intentionally NOT passed to useQuery's variables — doing so
  // would cause a second redundant network request every time a page is loaded.
  const [paginationOffset, setPaginationOffset] = useState(cached?.offset ?? 0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Apollo query always starts at offset 0.
  // Subsequent pages are fetched exclusively via fetchMore below.
  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(
    GET_ALL_CONSULTATIONS,
    {
      variables: { limit, offset: 0, status, queueOnly, doctorId },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    }
  );

  // Seed Redux with the first page whenever fresh data arrives (initial load or refetch).
  // FIX: dispatch payload must use `patientId` as the key because that is what the
  // Redux slice's reducers (setConsultations / addConsultations) destructure.
  // Previously `doctorId` was passed directly, so `patientId` was always `undefined`
  // and every reducer hit its early-return guard → Redux was never written → the
  // accumulated list was always empty → pagination replaced data instead of appending.
  useEffect(() => {
    if (!doctorId || !data) return;

    const result = data.getAllConsultations?.consultations ?? [];
    const count = data.getAllConsultations?.consultationCount ?? result.length;

    dispatch(
      setConsultations({
        patientId: doctorId, // ← FIXED: was `doctorId` (wrong key), now `patientId: doctorId`
        consultations: result,
        totalCount: count,
        offset: 0,
      })
    );
    setPaginationOffset(0);
  }, [data, doctorId, dispatch]);

  // Redux is the single source of truth for the full accumulated list.
  // Falls back to the raw Apollo page only when the cache is cold (e.g. first render).
  const consultations = useMemo(
    () => cached?.list ?? data?.getAllConsultations?.consultations ?? [],
    [cached, data]
  );

  const totalCount =
    cached?.totalCount ?? data?.getAllConsultations?.consultationCount ?? 0;

  // Load the next page.
  // Uses fetchMore only — paginationOffset is never written back to useQuery variables
  // so there is no redundant second request.
  // Guard uses `consultations.length >= totalCount` so the last partial page is still
  // fetched (the previous `offset + limit >= totalCount` guard was too aggressive and
  // would skip the final page when the total is not an exact multiple of the limit).
  const loadMore = async () => {
    if (loading || loadingMore || !doctorId) return;
    if (consultations.length >= totalCount) return;

    const newOffset = paginationOffset + limit;
    setLoadingMore(true);

    try {
      const { data: moreData } = await fetchMore({
        variables: { limit, offset: newOffset, status, queueOnly, doctorId },
      });

      if (moreData?.getAllConsultations?.consultations?.length) {
        dispatch(
          addConsultations({
            patientId: doctorId, // ← FIXED: was `doctorId` (wrong key), now `patientId: doctorId`
            consultations: moreData.getAllConsultations.consultations,
            totalCount: moreData.getAllConsultations.consultationCount,
            offset: newOffset,
          })
        );
        setPaginationOffset(newOffset);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  useAppState(() => refetch?.({ fetchPolicy: "network-only" }));
  useNetwork(() => refetch?.({ fetchPolicy: "network-only" }));

  const reloadConsultations = async () => {
    setPaginationOffset(0);
    await refetch({ fetchPolicy: "network-only" });
  };

  return {
    consultations,
    totalCount,
    offset: paginationOffset,
    loadMore,
    reloadConsultations,
    loadingConsultations: loading || loadingUserDetails || networkStatus === 4,
    loadingMore,
    errorConsultations: error,
  };
}
