// src/hooks/useRequestsRedux.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../my-store/redux/hooks";
import { GET_ALL_REQUESTS } from "../schema/ApiSchema";
import { 
      addRequests,
  resetRequests,
  setRequests,
 } from "../my-store/redux/phlebotomistRequestsSlice";
import { useAppState } from "../my-store/hooks/useAppState";
import { useNetwork } from "../my-store/hooks/useNetwork";

export function useRequestsRedux({
  requestStatus = "",
  searchTerm = "",
  queueOnly = false,
  phlebotomistId = "",
} = {}) {
  const dispatch = useAppDispatch();
  const limit = 10;
  const cacheKey = useMemo(
    () =>
      [
        phlebotomistId || "anonymous",
        queueOnly ? "queue" : "all",
        requestStatus || "any-status",
        searchTerm || "any-search",
      ].join("::"),
    [phlebotomistId, queueOnly, requestStatus, searchTerm]
  );
  const lastCacheKey = useRef(cacheKey);

  // Reset only the previous cache bucket when query context changes.
  useEffect(() => {
    if (lastCacheKey.current !== cacheKey) {
      dispatch(resetRequests({ phlebotomistId: lastCacheKey.current }));
      setOffset(0);
    }
    lastCacheKey.current = cacheKey;
  }, [cacheKey, dispatch]);

  const cached = useAppSelector((state: any) =>
    state.phlebotomistRequests?.byUser?.[cacheKey] || null
  );

  const [offset, setOffset] = useState(cached?.offset ?? 0);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(
    GET_ALL_REQUESTS,
    {
      variables: {
        limit,
        offset,
        requestStatus,
        searchTerm,
        phlebotomistId,
        queueOnly,
      },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    }
  );

  // Save first page only. Do not reset offset during fetchMore updates.
  useEffect(() => {
    if (!data) return;
    if (offset !== 0) return;

    const result = data.getAllRequests?.requests ?? [];
    const count = data.getAllRequests?.requestsCount ?? result.length;

    dispatch(
      setRequests({
        phlebotomistId: cacheKey,
        requests: result,
        totalCount: count,
        offset: 0,
      })
    );
    setOffset(0);
  }, [data, cacheKey, dispatch, offset]);

  const requests = useMemo(() => {
    const cachedList = cached?.list ?? [];
    const fresh = data?.getAllRequests?.requests ?? [];

    const merged = [...cachedList];
    fresh.forEach((r: any) => {
      if (!merged.find((m) => m.id === r.id)) {
        merged.push(r);
      }
    });

    return merged;
  }, [cached, data]);

  const totalCount =
    cached?.totalCount ??
    data?.getAllRequests?.requestsCount ??
    0;

  const loadMore = async () => {
    if (
      loading ||
      loadingMore ||
      offset + limit >= totalCount
    )
      return;

    const newOffset = offset + limit;
    setLoadingMore(true);

    try {
      const { data: moreData } = await fetchMore({
        variables: {
          limit,
          offset: newOffset,
          requestStatus,
          searchTerm,
          phlebotomistId,
          queueOnly,
        },
      });

      if (moreData?.getAllRequests?.requests?.length) {
        dispatch(
          addRequests({
            phlebotomistId: cacheKey,
            requests: moreData.getAllRequests.requests,
            totalCount: moreData.getAllRequests.requestsCount,
            offset: newOffset,
          })
        );
        setOffset(newOffset);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const reloadRequests = useCallback(() => {
    return refetch?.();
  }, [refetch]);

  useAppState(() => reloadRequests());
  useNetwork(() => reloadRequests());

  return {
    requests,
    totalCount,
    offset,
    loadMore,
    reloadRequests,
    loadingRequests: loading || networkStatus === 4,
    loadingMore,
    errorRequests: error,
  };
}
