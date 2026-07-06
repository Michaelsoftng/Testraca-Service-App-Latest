import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useAppState } from "../my-store/hooks/useAppState";
import { useNetwork } from "../my-store/hooks/useNetwork";
import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";

import {
  addAcceptedResultReviews,
  clearAcceptedResultReviews,
  setAcceptedResultReviews,
} from "../my-store/redux/userAcceptedResultReviewsSlice";
import { GET_ALL_RESULT_REVIEWS } from "../schema/ApiSchema";

export function useAcceptedResultReviewsRedux({ status = "", searchTerm = "", patientId = "", doctorId = "", queueOnly = any } = {}) {
  const dispatch = useAppDispatch();
  const limit = 10;
  const lastPatientId = useRef(patientId);

  useEffect(() => {
    if (patientId && lastPatientId.current && lastPatientId.current !== patientId) {
      dispatch(clearAcceptedResultReviews());
    }
    lastPatientId.current = patientId;
  }, [patientId, dispatch]);

  const cached = useAppSelector((state) =>
    patientId && state.acceptedResultReviews?.byUser
      ? state.acceptedResultReviews.byUser[patientId]
      : null
  );

  const [offset, setOffset] = useState(cached?.offset ?? 0);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(
    GET_ALL_RESULT_REVIEWS,
    {
      variables: { limit, offset, status, searchTerm, patientId, doctorId, queueOnly },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (!patientId || !data) return;
    if (offset !== 0) return;

    const reviews = data.getAllResultReviews?.resultReviews ?? [];
    const count = data.getAllResultReviews?.resultReviewCount ?? reviews.length;

    dispatch(setAcceptedResultReviews({ patientId, reviews, totalCount: count, offset: 0 }));
    setOffset(0);
  }, [data, patientId, dispatch, offset]);

  const mergedReviews = useMemo(() => {
    const cachedList = cached?.list ?? [];
    const newList = data?.getAllResultReviews?.resultReviews ?? [];
    const merged = [...cachedList];
    newList.forEach((r) => {
      if (!merged.find((c) => c.id === r.id)) merged.push(r);
    });
    return merged;
  }, [cached, data]);

  const totalCount = cached?.totalCount ?? data?.getAllResultReviews?.resultReviewCount ?? 0;

  const loadMore = async () => {
    if (loading || loadingMore || offset + limit >= totalCount || !patientId) return;
    const newOffset = offset + limit;
    setLoadingMore(true);

    try {
      const { data: moreData } = await fetchMore({
        variables: { limit, offset: newOffset, status, searchTerm, patientId, doctorId, queueOnly },
      });

      if (moreData?.getAllResultReviews?.resultReviews?.length) {
        dispatch(
          addAcceptedResultReviews({
            patientId,
            reviews: moreData.getAllResultReviews.resultReviews,
            totalCount: moreData.getAllResultReviews.resultReviewCount,
            offset: newOffset,
          })
        );
        setOffset(newOffset);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  useAppState(() => refetch?.({ fetchPolicy: "network-only" }));
  useNetwork(() => refetch?.({ fetchPolicy: "network-only" }));

  const reloadReviews = async () => {
    setOffset(0);
    await refetch({ fetchPolicy: "network-only" });
  };

  return {
    reviews: mergedReviews,
    totalCount,
    offset,
    loadMore,
    reloadReviews,
    loadingReviews: loading || networkStatus === 4,
    loadingMore,
    errorReviews: error,
  };
}
