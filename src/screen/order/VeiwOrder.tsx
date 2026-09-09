import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { URL_LINK } from "../../../config";
import { GETREQUESTBYID } from "../../schema/ApiSchema";
import useAuth from "../../schema/UseAuth";
import { MaterialIcons } from "@expo/vector-icons";

// ── Helpers ────────────────────────────────────────────────────────────────────

const toNumber = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Handles both raw numbers and pre-formatted strings like "₦8710.05" */
const parseAmount = (v: any): number => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const n = Number(v.replace(/[₦,\s]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const formatNaira = (v: any) =>
  `₦${toNumber(v).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (v?: string) => {
  if (!v) return "N/A";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? v
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const statusLabel = (s?: string) =>
  (s || "Unknown")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getBadgeColors = (s?: string): string => {
  const u = (s || "").toUpperCase();
  if (u.includes("COMPLETED") || u.includes("RECEIVED")) return "bg-emerald-100 text-emerald-700";
  if (u.includes("UNPAID") || u.includes("CANCELLED")) return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
};

const getStatusCategory = (s?: string): string => {
  const u = (s || "").toUpperCase();
  if (u.includes("COMPLETED") || u.includes("RECEIVED")) return "Completed";
  if (u.includes("UNPAID") || u.includes("CANCELLED")) return "Unpaid";
  return "In Progress";
};

// Custom inline icons to eliminate library dependency issues in Expo Go
const ArrowLeft = () => <Text className="text-teal-800 text-xl font-bold">←</Text>;
const ShareIcon = () => <Text className="text-teal-800 text-base">⎋</Text>;
const CopyIcon = () => <Text className="text-gray-400 text-xs ml-1">📋</Text>;

// ── Main screen ────────────────────────────────────────────────────────────────

export default function VeiwOrder() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { token } = useAuth(navigation);

  const itemData = route?.params?.itemData || {};
  console.log("Item data passed to VeiwOrder screen:", itemData);
  const [requestData, setRequestData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const id: string | undefined = itemData?.id;
      if (!id || !token) { setFetching(false); return; }
      try {
        setFetching(true);
        const resp = await axios.post(
          URL_LINK,
          { query: GETREQUESTBYID, variables: { id } },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const d = resp?.data?.data?.getRequest;
        if (active) setRequestData(d || itemData);
      } catch {
        if (active) setRequestData(itemData);
      } finally {
        if (active) setFetching(false);
      }
    };

    run();
    return () => { active = false; };
  }, [itemData?.id, token]);

  const data = requestData || itemData;

  /* unique test names — testRequests[].test.name (detail API) or tests[].name (list API) */
  const tests = useMemo<string[]>(() => {
    const seen = new Set<string>();
    const collect = (name: string) => {
      if (!name || seen.has(name)) return false;
      seen.add(name);
      return true;
    };

    const fromTestRequests = Array.isArray(data?.testRequests)
      ? data.testRequests.map((t: any) => t?.test?.name).filter(Boolean)
      : [];

    const fromTests = Array.isArray(data?.tests)
      ? data.tests.map((t: any) => (typeof t === "string" ? t : t?.name)).filter(Boolean)
      : [];

    const all = [...fromTestRequests, ...fromTests] as string[];
    return all.filter(collect);
  }, [data]);

  /* total: prefer numeric `total`, fall back to pre-formatted `amount` string */
  const total = toNumber(data?.total) || parseAmount(data?.amount);
  const balance = toNumber(data?.balance);
  const amountPaid = Math.max(total - balance, 0);
  const distanceCharge = toNumber(data?.distanceCharge);
  const phlebotomistEarning = toNumber(data?.phlebotomistEarning);

  const patientName = `${
    data?.patient?.firstName?.trim()
      ? data.patient.firstName
      : data?.requestedByProfessional?.firstName || ""
  } ${
    data?.patient?.lastName?.trim()
      ? data.patient.lastName
      : data?.requestedByProfessional?.lastName || ""
  }`.trim();

  const patientPhone =
    data?.patient?.phoneNumber || data?.requestedByProfessional?.phoneNumber || "N/A";

  const pickupAddress = data?.samplePickUpAddress || data?.pickUpAddress || "N/A";

  const testCount: number = data?.testRequestCount ?? tests.length;

  // Show the PACKAGE name(s) (plus any standalone test names) here — not every
  // individual test inside a package. Sourced from the roster items.
  const specimenNames: string[] = (() => {
    const roster = Array.isArray(data?.patients) ? data.patients : [];
    const set = new Set<string>();
    roster.forEach((p: any) =>
      (Array.isArray(p?.items) ? p.items : []).forEach((item: any) => {
        const isPackage = item?.kind === "PACKAGE" || Boolean(item?.packageId);
        if (isPackage && item?.packageName) set.add(item.packageName);
        else
          (Array.isArray(item?.tests) ? item.tests : []).forEach(
            (t: any) => t?.name && set.add(t.name)
          );
      })
    );
    return Array.from(set);
  })();

  const specimenLabel =
    specimenNames.length > 0
      ? specimenNames.join(", ")
      : tests.length > 0
      ? tests.join(", ")
      : `${testCount} test${testCount === 1 ? "" : "s"}`;

  const orderId = `#${String(data?.id || "").split("-")?.[4] || "N/A"}`;

  /* receiving facility — testRequests[0].facility (detail API) */
  const facility = data?.testRequests?.[0]?.facility || null;
  const facilityName = facility?.facilityName || "N/A";
  const facilityType = facility?.facilityType ? statusLabel(facility.facilityType) : "N/A";
  const facilityRating: number | null =
    typeof facility?.rating === "number" ? facility.rating : null;

  /* actual sample patient(s) — requestId[] (detail API) or derived from testRequests[] (list API) */
  const samplePatients: Array<{
    id?: string;
    patientName?: string;
    patientAge?: number;
    gender?: string;
    status?: string;
  }> = Array.isArray(data?.requestId)
    ? data.requestId
    : Array.isArray(data?.testRequests)
    ? data.testRequests.map((t: any) => ({
        id: t?.id,
        patientName: t?.patientName,
        patientAge: t?.patientAge,
        gender: t?.gender,
        status: t?.status,
      }))
    : [];

  // Group the sample-patient manifest by PACKAGE (or standalone test) so a
  // multi-test package shows as ONE row (with a View toggle to reveal the
  // tests inside) instead of one near-identical row per test. Sourced from the
  // roster `patients[].items`; falls back to the flat samplePatients list.
  const manifestRows = useMemo(() => {
    const roster = Array.isArray(data?.patients) ? data.patients : [];
    const recs = Array.isArray(data?.requestId)
      ? data.requestId
      : Array.isArray(data?.testRequests)
      ? data.testRequests
      : [];
    const rows: any[] = [];

    roster.forEach((p: any, pIdx: number) => {
      const name = (p?.name || `${p?.firstName || ""} ${p?.lastName || ""}`).trim();
      const nameKey = name.toLowerCase();
      const rec = recs.find(
        (r: any) => (r?.patientName || "").trim().toLowerCase() === nameKey
      );
      const patientAge = p?.age ?? rec?.patientAge ?? null;
      const gender = p?.gender ?? rec?.gender ?? "";
      const items = Array.isArray(p?.items) ? p.items : [];

      if (items.length === 0) {
        rows.push({
          id: `${p?.id || nameKey || pIdx}-0`,
          patientName: name || "Patient",
          patientAge,
          gender,
          status: rec?.status || data?.requestStatus,
          kind: "test",
          label: "",
          tests: [],
        });
        return;
      }

      items.forEach((item: any, idx: number) => {
        const isPackage = item?.kind === "PACKAGE" || Boolean(item?.packageId);
        const testNames = (Array.isArray(item?.tests) ? item.tests : [])
          .map((t: any) => t?.name)
          .filter(Boolean);
        rows.push({
          id: `${p?.id || nameKey || pIdx}-${idx}`,
          patientName: name || "Patient",
          patientAge,
          gender,
          status: item?.status || rec?.status || data?.requestStatus,
          kind: isPackage ? "package" : "test",
          label: isPackage ? item?.packageName || "Package" : testNames.join(", "),
          tests: testNames,
        });
      });
    });

    if (rows.length === 0) {
      return (samplePatients || []).map((p: any, idx: number) => ({
        id: p?.id || idx,
        patientName: p?.patientName || "Patient",
        patientAge: p?.patientAge ?? null,
        gender: p?.gender || "",
        status: p?.status,
        kind: "test",
        label: "",
        tests: [],
      }));
    }

    return rows;
  }, [data, samplePatients]);

  const uniquePatientCount = useMemo(() => {
    const roster = Array.isArray(data?.patients) ? data.patients : [];
    if (roster.length) return roster.length;
    const names = new Set(
      (samplePatients || [])
        .map((p: any) => (p?.patientName || "").trim().toLowerCase())
        .filter(Boolean)
    );
    return names.size || samplePatients.length;
  }, [data, samplePatients]);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const toggleRow = (id: string) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (fetching) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0F766E" />
        <Text className="text-slate-400 mt-3 text-sm">Loading order details…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Upper Context Header Panel */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
            <ArrowLeft />
          </TouchableOpacity>
          <View>
            <View className="flex-row items-center">
              <Text className="text-xs font-mono text-gray-400 font-semibold">{orderId}</Text>
              <TouchableOpacity><CopyIcon /></TouchableOpacity>
            </View>
            <Text className="text-base font-bold text-slate-900">Order Manifest Details</Text>
          </View>
        </View>
        <TouchableOpacity className="p-2 bg-slate-50 rounded-full border border-gray-100">
          <ShareIcon />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>




        {/* ── Requester & Logistics ── */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
          <View className="flex-row justify-between mb-4">
                        <View>
              <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Request ID</Text>
              <Text className="text-xs font-bold text-[#475569] mt-0.5">
                #{String(data?.id).split("-")?.[4] || "N/A"}
                {/* {requestData?.requestId} */}
                </Text>
            </View>
            <View>
              <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Request Date</Text>
              <Text className="text-xs font-bold text-[#475569] mt-0.5">{formatDate(data?.requestDate)}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Collection Date</Text>
              <Text className="text-xs font-bold text-[#475569] mt-0.5">{formatDate(data?.sampleCollectionDate)}</Text>
            </View>
          </View>

          <View className="flex-row justify-between pb-4 border-b border-gray-100 mb-4">
            <View>
              <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Patients</Text>
              <Text className="text-xs font-bold text-[#475569] mt-0.5">{uniquePatientCount || 0} Total</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Drop-off Distance</Text>
              <Text className="text-xs font-bold text-[#475569] mt-0.5">{data?.dropOffDistance || 0} km</Text>
            </View>
          </View>

          <View className="gap-3">
            <View className="flex-row items-start gap-3">
              <MaterialIcons name="location-on" size={16} color="#006968" style={{ marginTop: 1 }} />
              <View>
                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pickup Address</Text>
                <Text className="text-xs font-bold text-[#1E293B] mt-0.5">{data?.samplePickUpAddress || "N/A"}</Text>
              </View>
            </View>
          </View>
        </View>







        {/* Core Operational Overview Status Block */}
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm flex-row justify-between items-center">
          <View>
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logistics Run Status</Text>
            <Text className="text-lg font-bold text-slate-900 mt-0.5">{statusLabel(data?.requestStatus)}</Text>
          </View>
          <View className={`${getBadgeColors(data?.requestStatus)} px-3 py-1 rounded-full`}>
            <Text className="text-xs font-bold uppercase tracking-wide">{getStatusCategory(data?.requestStatus)}</Text>
          </View>
        </View>

        {/* Section Block 1: Patient Details Manifest */}
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Patient & Logistics Route</Text>
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-base font-bold text-slate-900">{patientName || "Patient"}</Text>
          <Text className="text-xs text-slate-500 font-medium mt-0.5">{patientPhone}</Text>

          <View className="mt-3 pt-3 border-t border-gray-50 flex-row items-start">
            <Text className="text-base mr-2">📍</Text>
            <Text className="text-xs text-slate-600 flex-1 leading-relaxed">
              {pickupAddress}
            </Text>
          </View>
        </View>

        {/* Section Block 1b: Sample Patient(s) Manifest */}
        {manifestRows.length > 0 && (
          <>
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Sample Patient{manifestRows.length === 1 ? "" : "s"}
            </Text>
            <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
              {manifestRows.map((row: any, idx: number) => {
                const isPackage = row.kind === "package";
                const expanded = expandedRows.has(row.id);
                return (
                  <View
                    key={row.id || idx}
                    className={`${idx > 0 ? "mt-3 pt-3 border-t border-gray-50" : ""}`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1 pr-2">
                        <Text className="text-sm font-bold text-slate-900">{row.patientName || "Patient"}</Text>
                        <Text className="text-xs text-slate-500 mt-0.5">
                          {row.patientAge != null ? `${row.patientAge} yrs` : "Age N/A"} · {statusLabel(row.gender)}
                        </Text>
                        {row.label ? (
                          <View className="flex-row items-center mt-1 flex-wrap">
                            {isPackage ? (
                              <View className="bg-indigo-50 px-2 py-0.5 rounded-md mr-1.5">
                                <Text className="text-indigo-700 text-[9px] font-bold">PACKAGE</Text>
                              </View>
                            ) : null}
                            <Text className="text-teal-800 text-xs font-semibold flex-shrink" numberOfLines={1}>
                              {row.label}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <View className="flex-row items-center">
                        {isPackage && row.tests.length > 0 ? (
                          <TouchableOpacity
                            className="border border-teal-700 px-3 py-1 rounded-lg mr-2"
                            onPress={() => toggleRow(row.id)}
                          >
                            <Text className="text-teal-700 text-[11px] font-semibold">
                              {expanded ? "Hide" : "View"}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        <View className={`${getBadgeColors(row.status)} px-2.5 py-1 rounded-full`}>
                          <Text className="text-[10px] font-bold uppercase tracking-wide">{statusLabel(row.status)}</Text>
                        </View>
                      </View>
                    </View>

                    {isPackage && expanded && row.tests.length > 0 ? (
                      <View className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          {row.tests.length} test{row.tests.length === 1 ? "" : "s"} in this package
                        </Text>
                        {row.tests.map((tn: string, i: number) => (
                          <View key={i} className="flex-row items-center py-0.5">
                            <Text className="text-teal-700 mr-1.5">•</Text>
                            <Text className="text-xs text-slate-700 flex-1">{tn}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Section Block 2: Specimen Details Manifest */}
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Specimen Collection Specs</Text>
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-baseline">
            <Text className="text-sm font-bold text-teal-800 flex-1 pr-2" numberOfLines={2}>🩸 {specimenLabel}</Text>
            <Text className="text-[10px] font-mono font-bold text-slate-400">{formatDate(data?.sampleCollectionDate)}</Text>
          </View>

          <View className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drop-off Logistics</Text>
            <Text className="text-xs font-medium text-slate-700 mt-1">
              {formatDate(data?.sampleDropOffDate ?? data?.samepleDropOffDate)} · {data?.dropOffDistance || 0} km
            </Text>
          </View>
        </View>

        {/* Section Block 2b: Receiving Facility Details */}
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Receiving Facility</Text>
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-base font-bold text-slate-900">{facilityName}</Text>
            <Text className="text-xs text-slate-500 font-medium mt-0.5">{facilityType}</Text>
          </View>
          {facilityRating !== null && (
            <View className="bg-amber-100 px-2.5 py-1 rounded-full">
              <Text className="text-xs font-bold text-amber-700">⭐ {facilityRating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {/* Section Block 3: Redesigned Financial Manifest Details */}
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Financial Settlement Matrix</Text>
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">

          {/* Individual Item breakdown entries */}
          <View className="space-y-2.5 pb-3 border-b border-gray-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-slate-500">Order Total</Text>
              <Text className="text-xs font-semibold text-slate-800">{formatNaira(total)}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-slate-500">Amount Paid</Text>
              <Text className="text-xs font-semibold text-slate-800">{formatNaira(amountPaid)}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-slate-500">Balance Due</Text>
              <Text className="text-xs font-semibold text-slate-800">{formatNaira(balance)}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-slate-500">Distance Charge</Text>
              <Text className="text-xs font-semibold text-teal-700">+{formatNaira(distanceCharge)}</Text>
            </View>
          </View>

          {/* Aggregated Net Payout Total Row */}
          <View className="flex-row justify-between items-center pt-3.5">
            <View>
              <Text className="text-sm font-bold text-slate-900">Total Net Payout</Text>
              <Text className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Settled to Agent Wallet</Text>
            </View>
            <Text className="text-2xl font-black text-teal-800">
              {formatNaira(phlebotomistEarning)}
            </Text>
          </View>
        </View>

        {/* Track request CTA */}
        <TouchableOpacity
          className="bg-teal-800 rounded-2xl py-4 items-center mb-8"
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("track_request", {
              itemData: data,
              requestData: JSON.stringify([data]),
            })
          }
        >
          <Text className="text-white font-bold text-base">Track Request</Text>
        </TouchableOpacity>
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
