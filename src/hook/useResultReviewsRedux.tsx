import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useAppState } from "../my-store/hooks/useAppState";
import { useNetwork } from "../my-store/hooks/useNetwork";
import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";

import {
  addResultReviews,
  clearResultReviews,
  setResultReviews,
} from "../my-store/redux/userResultReviewsSlice";
import { GET_ALL_RESULT_REVIEWS } from "../schema/ApiSchema";

export function useResultReviewsRedux({
  status = "",
  searchTerm = "",
  patientId = "",
  doctorId = "",
  queueOnly = false,
} = {}) {
  const dispatch = useAppDispatch();
  const limit = 10;
  const scopeKey = doctorId || patientId || "__global__";
  const lastScopeKey = useRef(scopeKey);

  useEffect(() => {
    if (lastScopeKey.current && lastScopeKey.current !== scopeKey) {
      dispatch(clearResultReviews());
    }
    lastScopeKey.current = scopeKey;
  }, [scopeKey, dispatch]);

  const cached = useAppSelector((state) =>
    scopeKey && state.resultReviews?.byUser
      ? state.resultReviews.byUser[scopeKey]
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
    GET_ALL_RESULT_REVIEWS,
    {
      variables: { limit, offset: 0, status, searchTerm, patientId, doctorId, queueOnly },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    }
  );

  // Seed Redux with the first page whenever fresh data arrives (initial load or refetch).
  useEffect(() => {
    if (!data) return;

    const reviewList = data.getAllResultReviews?.resultReviews ?? [];
    const count = data.getAllResultReviews?.resultReviewCount ?? reviewList.length;

    dispatch(
      setResultReviews({ patientId: scopeKey, reviews: reviewList, totalCount: count, offset: 0 })
    );
    setPaginationOffset(0);
  }, [data, scopeKey, dispatch]);

  // Redux is the single source of truth for the full accumulated list.
  // Falls back to the raw Apollo page only when the cache is cold (e.g. first render).
  const reviews = useMemo(
    () => cached?.list ?? data?.getAllResultReviews?.resultReviews ?? [],
    [cached, data]
  );

  const totalCount =
    cached?.totalCount ?? data?.getAllResultReviews?.resultReviewCount ?? 0;

  // Load the next page.
  // Uses fetchMore only — paginationOffset is never written back to useQuery variables
  // so there is no redundant second request.
  // Guard uses `reviews.length >= totalCount` so the last partial page is still fetched.
  const loadMore = async () => {
    if (loading || loadingMore) return;
    if (reviews.length >= totalCount) return;

    const newOffset = paginationOffset + limit;
    setLoadingMore(true);

    try {
      const { data: moreData } = await fetchMore({
        variables: { limit, offset: newOffset, status, searchTerm, patientId, doctorId, queueOnly },
      });

      if (moreData?.getAllResultReviews?.resultReviews?.length) {
        dispatch(
          addResultReviews({
            patientId: scopeKey,
            reviews: moreData.getAllResultReviews.resultReviews,
            totalCount: moreData.getAllResultReviews.resultReviewCount,
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

  const reloadReviews = async () => {
    setPaginationOffset(0);
    await refetch({ fetchPolicy: "network-only" });
  };

  return {
    reviews,
    totalCount,
    offset: paginationOffset,
    loadMore,
    reloadReviews,
    loadingReviews: loading || networkStatus === 4,
    loadingMore,
    errorReviews: error,
  };
}
