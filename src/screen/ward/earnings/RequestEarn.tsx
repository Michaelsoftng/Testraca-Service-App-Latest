import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { PAYSTACK_KEY_SK } from '../../../../config';
import CustomAlert from '../../../components/CustomAlert';
import Button from '../../../components/Button';
import { useGetUserDetails } from '../../../hook/useGetUserDetails';
import SearchablePicker from '../../../components/SearchablePicker';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';

type BankOption = {
  id: string;
  code: string;
  name: string;
  slug?: string;
};

type VerifyAccountResult = {
  status: boolean;
  accountName?: string;
  accountNumber?: string;
  message?: string;
};

const ELIGIBLE_ROLES = new Set(["DOCTOR", "PHARMACIST", "LAB_SCIENTIST", "PHLEBOTOMIST", "FACILITY_ADMIN", "FACILITY", "DISPATCHER"]);

const GET_MY_WALLET_BALANCE_QUERY = gql`
  query GetMyWalletBalance {
    getMyWalletBalance
  }
`;

const GET_BANKS_FOR_WITHDRAWAL = gql`
  query GetBanksForWithdrawal {
    getBanks {
      name
      code
      slug
    }
  }
`;

const MY_PAYOUTS_QUERY = gql`
  query MyPayouts($limit: Int!, $offset: Int!, $status: String) {
    getMyPayouts(limit: $limit, offset: $offset, status: $status) {
      payoutsCount
      payouts {
        id
        amountRequested
        amountPaid
        status
        accountName
        bankName
        reference
        description
        createdAt
      }
    }
  }
`;

const VERIFY_ACCOUNT_NUMBER_QUERY = gql`
  query VerifyAccount($accountNumber: String!, $bankCode: String!) {
    verifyAccountNumber(accountNumber: $accountNumber, bankCode: $bankCode) {
      status
      accountName
      accountNumber
      message
    }
  }
`;

const CREATE_PAYOUT_MUTATION = gql`
  mutation Withdraw(
    $amount: Float!
    $accountNumber: String!
    $accountName: String!
    $bankCode: String!
    $bankName: String!
    $description: String
  ) {
    createPayout(
      amount: $amount
      accountNumber: $accountNumber
      accountName: $accountName
      bankCode: $bankCode
      bankName: $bankName
      description: $description
    ) {
      status
      message
      payout {
        id
        amountRequested
        amountPaid
        status
        reference
        accountName
        bankName
        description
        createdAt
      }
    }
  }
`;

const formatCurrency = (value: number | string | null | undefined) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const statusTone = (status: string) => {
  switch (String(status || "").toUpperCase()) {
    case "SUCCESS":
      return "bg-emerald-50 text-emerald-700";
    case "FAILED":
    case "REVERSED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
};

export default function RequestEarn() {
  const navigation = useNavigation();
  // useUserAuthVerify(navigation);

  const { userData, reloadUserDetails } = useGetUserDetails();
  const role = String(userData?.userType || "").toUpperCase();
  const isEligible = ELIGIBLE_ROLES.has(role);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [verifiedAccount, setVerifiedAccount] = useState<VerifyAccountResult | null>(null);
  const [resolvingAccount, setResolvingAccount] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgDescription, setMsgDescription] = useState("");
  const [formData, setFormData] = useState({
    bankName: "",
    bankCode: "",
    accountNumber: "",
    accountName: "",
    amount: "",
    description: "",
  });

  const showMessage = (title: string, description: string) => {
    if (description.toLowerCase().includes("authentication error")) {
      // handleLogout();
      return;
    }
    setMsgTitle(title);
    setMsgDescription(description);
    setModalVisible(true);
  };

  const {
    data: balanceData,
    loading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useQuery<any>(GET_MY_WALLET_BALANCE_QUERY, {
    fetchPolicy: "network-only",
    skip: !isEligible,
  });

  const {
    data: banksData,
    loading: banksLoading,
    error: banksError,
    refetch: refetchBanks,
  } = useQuery<any>(GET_BANKS_FOR_WITHDRAWAL, {
    fetchPolicy: "network-only",
    skip: !isEligible,
  });

  const {
    data: payoutsData,
    loading: payoutsLoading,
    error: payoutsError,
    refetch: refetchPayouts,
  } = useQuery<any>(MY_PAYOUTS_QUERY, {
    variables: { limit: 10, offset: 0 },
    fetchPolicy: "network-only",
    skip: !isEligible,
  });

  const [verifyAccount, { loading: verifyingAccount }] = useLazyQuery<any>(VERIFY_ACCOUNT_NUMBER_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const result = data?.verifyAccountNumber as VerifyAccountResult | undefined;
      if (!result) {
        showMessage("Verification failed", "Could not verify bank account right now.");
        return;
      }

      setVerifiedAccount(result);
      if (result.status && result.accountName) {
        setFormData((prev) => ({
          ...prev,
          accountName: result.accountName || "",
        }));
        return;
      }

      showMessage("Account not found", result.message || "Please check the account number and bank.");
    },
    onError: (error) => {
      showMessage("Verification failed", error.message || "Could not verify account details.");
    },
  });

  const [createPayout, { loading: submitting }] = useMutation<any>(CREATE_PAYOUT_MUTATION, {
    onCompleted: async (data) => {
      const result = data?.createPayout;
      if (!result?.status) {
        showMessage("Withdrawal failed", result?.message || "Withdrawal could not be processed.");
        return;
      }

      showMessage("Transfer in progress", result.message || "Payout initiated successfully.");
      setFormData((prev) => ({
        ...prev,
        amount: "",
        description: "",
      }));
      await Promise.allSettled([refetchBalance(), refetchPayouts(), reloadUserDetails()]);
    },
    onError: (error) => {
      showMessage("Withdrawal failed", error.message || "Withdrawal could not be processed.");
    },
  });

  const banks: BankOption[] = useMemo(() => {
    const source = banksData?.getBanks || [];
    return source.map((item: any) => ({
      id: String(item.code),
      code: String(item.code),
      name: String(item.name),
      slug: item.slug,
    }));
  }, [banksData]);

  const availableBalance = Number(balanceData?.getMyWalletBalance || 0);
  const requestedAmount = Number(formData.amount || 0);
  const payouts = payoutsData?.getMyPayouts?.payouts || [];
  const canVerifyAccount = formData.accountNumber.trim().length >= 10 && formData.bankCode.trim().length > 0;
  const isAccountResolved = Boolean(
    formData.accountName.trim().length > 0 &&
      formData.accountNumber.trim().length === 10 &&
      formData.bankCode.trim().length > 0 &&
      !resolveError &&
      !resolvingAccount
  );
  const isAccountVerified = Boolean(
    (verifiedAccount?.status &&
      verifiedAccount?.accountNumber === formData.accountNumber.trim() &&
      formData.accountName.trim().length > 0) ||
      isAccountResolved
  );
  const hasEnoughBalance = requestedAmount > 0 && requestedAmount <= availableBalance;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([refetchBalance(), refetchBanks(), refetchPayouts(), reloadUserDetails()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Real-time Paystack account resolution for instant feedback
  const resolvePaystackAccount = async (accountNumber: string, bankCode: string) => {
    if (!accountNumber || !bankCode) {
      setResolveError(null);
      return;
    }

    setResolvingAccount(true);
    setResolveError(null);
    try {
      const response = await axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_KEY_SK}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status && response.data?.data?.account_name) {
        setVerifiedAccount({
          status: true,
          accountName: response.data.data.account_name,
          accountNumber,
          message: 'Resolved via Paystack',
        });
        setFormData((prev) => ({
          ...prev,
          accountName: response.data.data.account_name,
        }));
      } else {
        setVerifiedAccount(null);
        setResolveError(response.data?.data?.message || 'Account not found');
      }
    } catch (error: any) {
      setVerifiedAccount(null);
      const errorMsg = error?.response?.data?.message || 'Failed to resolve account';
      setResolveError(errorMsg);
    } finally {
      setResolvingAccount(false);
    }
  };

  // Debounced real-time resolution when account number or bank code changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.accountNumber && formData.bankCode) {
        resolvePaystackAccount(formData.accountNumber, formData.bankCode);
      }
    }, 500); // Debounce to avoid excessive API calls

    return () => clearTimeout(timer);
  }, [formData.accountNumber, formData.bankCode]);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    if (name === "accountNumber") {
      const nextValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, accountNumber: nextValue }));
      setVerifiedAccount(null);
      setResolveError(null);
      return;
    }

    if (name === "amount") {
      const nextValue = value.replace(/[^0-9.]/g, "");
      setFormData((prev) => ({ ...prev, amount: nextValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (code: string, name: string) => {
    setSelectedBankCode(code);
    setVerifiedAccount(null);
    setResolveError(null);
    setFormData((prev) => ({
      ...prev,
      bankCode: code,
      bankName: name,
      accountName: "",
    }));
  };

  const handleVerify = async () => {
    if (!canVerifyAccount) {
      showMessage("Incomplete details", "Select a bank and enter a valid 10-digit account number first.");
      return;
    }

    await verifyAccount({
      variables: {
        accountNumber: formData.accountNumber.trim(),
        bankCode: formData.bankCode.trim(),
      },
    });
  };

  const handleSubmit = async () => {
    if (!isEligible) {
      showMessage("Unavailable", "Only doctors, phlebotomists, and facility admins can withdraw funds.");
      return;
    }

    if (!isAccountVerified) {
      showMessage("Verify account", "Verify the bank account before continuing.");
      return;
    }

    if (!hasEnoughBalance) {
      showMessage("Insufficient funds", "You don't have enough balance for this withdrawal amount.");
      return;
    }

    await createPayout({
      variables: {
        amount: requestedAmount,
        accountNumber: formData.accountNumber.trim(),
        accountName: formData.accountName.trim(),
        bankCode: formData.bankCode.trim(),
        bankName: formData.bankName.trim(),
        description: formData.description.trim() || null,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7F6]">
      <CustomAlert
        title={msgTitle}
        msg={msgDescription}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-[#0B1724] pt-12 pb-10 px-6 rounded-b-[36px]" style={{ backgroundColor: '#0B1724' }}>
          {/* <TouchableOpacity className="flex-row items-center mb-4" onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={20} color="white" />
            <Text className="text-white ml-2 opacity-70">Back</Text>
          </TouchableOpacity> */}

          <Text className="text-white text-3xl font-bold">Withdraw earnings</Text>
          <Text className="text-white/75 mt-2 text-sm">
            Verify the bank account before submitting a payout request.
          </Text>

          <View className="mt-6 bg-white/10 rounded-2xl p-4 border border-white/10">
            <Text className="text-white/70 text-xs font-bold uppercase tracking-widest">Available balance</Text>
            {balanceLoading ? (
              <ActivityIndicator size="small" color="#ffffff" className="mt-3" />
            ) : (
              <Text className="text-white text-3xl font-bold mt-2">{formatCurrency(availableBalance)}</Text>
            )}
            <Text className="text-white/70 text-sm mt-2">
              Withdrawals are processed in naira and your wallet updates immediately after a successful request.
            </Text>
          </View>
        </View>

        <View className="px-4 -mt-6 pb-10">
          {!isEligible ? (
            <View className="bg-white rounded-2xl p-5 border border-gray-100">
              <View className="w-12 h-12 rounded-2xl bg-red-50 items-center justify-center mb-4">
                <MaterialIcons name="block" size={24} color="#DC2626" />
              </View>
              <Text className="text-lg font-semibold text-gray-900">Withdrawal unavailable</Text>
              <Text className="text-gray-500 mt-2">
                Only healthcare professionals (doctors, pharmacists, lab scientists, and phlebotomists) and facility admins can request payouts.
              </Text>
            </View>
          ) : (
            <>
              {(balanceError || banksError || payoutsError) && (
                <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
                  <Text className="text-red-700 font-semibold">Some withdrawal data could not be loaded.</Text>
                  <TouchableOpacity onPress={onRefresh} className="mt-2">
                    <Text className="text-red-700 font-bold">Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
                <Text className="text-gray-400 font-bold text-xs mb-4 tracking-widest uppercase">
                  Bank verification
                </Text>

                <View>
                  <Text className="text-sm font-semibold text-gray-600 mb-1">Account number</Text>
                  <View className="h-14 border border-gray-300 rounded-2xl bg-white flex-row items-center px-4 gap-3">
                    <MaterialIcons name="account-balance" size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 h-full text-base font-semibold text-gray-900"
                      placeholder="0123456789"
                      placeholderTextColor="#B7B7B7"
                      keyboardType="numeric"
                      value={formData.accountNumber}
                      onChangeText={(value) => handleInputChange('accountNumber', value)}
                    />
                  </View>
                </View>

                <View className="mt-4">
                  <Text className="text-sm font-semibold text-gray-600 mb-1">Bank</Text>
                  <View className="h-14 border border-gray-300 rounded-2xl bg-white justify-center overflow-hidden">
                    {banksLoading ? (
                      <View className="px-4 py-4">
                        <Text className="text-gray-500">Loading banks...</Text>
                      </View>
                    ) : banks.length > 0 ? (
                      <SearchablePicker
                        data={banks}
                        selectedValue={selectedBankCode}
                        placeholder="Select bank"
                        searchPlaceHolder="Search bank..."
                        onValueChange={(code: string, name: string) => handleBankChange(code, name)}
                      />
                    ) : (
                      <View className="px-4 py-4">
                        <Text className="text-gray-500">No banks available right now.</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* <Button
                  onPress={handleVerify}
                  disabled={!canVerifyAccount || verifyingAccount || banks.length === 0}
                  className="w-full h-[52px] bg-[#0B1724] rounded-2xl items-center justify-center mt-4"
                  textClassName="text-white text-base font-semibold text-center"
                  name={verifyingAccount ? "Verifying..." : "Verify account"}
                /> */}

                <View className={`rounded-2xl p-4 mt-4 ${
                  isAccountVerified ? "bg-emerald-50" : resolvingAccount ? "bg-blue-50" : resolveError ? "bg-red-50" : "bg-gray-50"
                }`}>
                  <Text className={`text-xs font-bold uppercase tracking-widest ${
                    isAccountVerified ? "text-emerald-700" : resolvingAccount ? "text-blue-700" : resolveError ? "text-red-700" : "text-gray-500"
                  }`}>
                    {isAccountVerified ? "Verified" : resolvingAccount ? "Resolving..." : resolveError ? "Resolution error" : "Account name"}
                  </Text>
                  <Text className={`text-base font-semibold mt-2 ${
                    isAccountVerified ? "text-emerald-800" : resolvingAccount ? "text-blue-800" : resolveError ? "text-red-700" : "text-gray-700"
                  }`}>
                    {resolvingAccount ? "Looking up account name..." : formData.accountName || resolveError || verifiedAccount?.message || "Enter account number and select a bank."}
                  </Text>
                </View>
              </View>

              <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
                <Text className="text-gray-400 font-bold text-xs mb-4 tracking-widest uppercase">
                  Withdrawal request
                </Text>

                <View>
                  <Text className="text-sm font-semibold text-gray-600 mb-1">Amount</Text>
                  <View className="h-14 border border-gray-300 rounded-2xl bg-white flex-row items-center px-4 gap-3">
                    <Text className="text-gray-500 font-semibold">NGN</Text>
                    <TextInput
                      className="flex-1 h-full text-base font-semibold text-gray-900"
                      placeholder="0.00"
                      placeholderTextColor="#B7B7B7"
                      keyboardType="numeric"
                      value={formData.amount}
                      onChangeText={(value) => handleInputChange("amount", value)}
                    />
                  </View>
                  {formData.amount.length > 0 && !hasEnoughBalance ? (
                    <Text className="text-red-600 text-xs mt-2">You don&apos;t have enough balance for this amount.</Text>
                  ) : (
                    <Text className="text-gray-500 text-xs mt-2">Enter an amount up to {formatCurrency(availableBalance)}.</Text>
                  )}
                </View>

                <View className="mt-4">
                  <Text className="text-sm font-semibold text-gray-600 mb-1">Description</Text>
                  <TextInput
                    className="min-h-[96px] text-base font-medium text-gray-900 border border-gray-300 rounded-2xl px-4 py-4 bg-white"
                    placeholder="My weekly earnings"
                    placeholderTextColor="#B7B7B7"
                    multiline
                    textAlignVertical="top"
                    value={formData.description}
                    onChangeText={(value) => handleInputChange("description", value)}
                  />
                </View>

                {availableBalance <= 0 && (
                  <View className="bg-amber-50 rounded-2xl p-4 mt-4 border border-amber-100">
                    <Text className="text-amber-800 font-semibold">Nothing available yet</Text>
                    <Text className="text-amber-700 text-sm mt-1">
                      You&apos;ll be able to request a payout once settled earnings reach your wallet.
                    </Text>
                  </View>
                )}

                <Button
                  onPress={handleSubmit}
                  disabled={submitting || verifyingAccount || !isAccountVerified || !hasEnoughBalance || availableBalance <= 0}
                  className="w-full h-[52px] bg-primary rounded-2xl items-center justify-center mt-5"
                  textClassName="text-white text-base font-semibold text-center"
                  name={submitting ? "Submitting..." : "Withdraw now"}
                />
              </View>

              <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <Text className="text-gray-400 font-bold text-xs mb-4 tracking-widest uppercase">
                  Withdrawal history
                </Text>

                {payoutsLoading ? (
                  <View className="py-10 items-center">
                    <ActivityIndicator size="small" color="#059669" />
                    <Text className="text-gray-500 mt-3">Loading payouts...</Text>
                  </View>
                ) : payouts.length === 0 ? (
                  <View className="bg-gray-50 rounded-2xl p-5 items-center">
                    <MaterialIcons name="history-toggle-off" size={28} color="#9CA3AF" />
                    <Text className="text-gray-900 font-semibold mt-3">No payouts yet</Text>
                    <Text className="text-gray-500 text-center mt-1">
                      Your withdrawal requests will appear here once you submit the first payout.
                    </Text>
                  </View>
                ) : (
                  payouts.map((item: any) => (
                    <View key={item.id} className="py-4 border-b border-gray-100 last:border-b-0">
                      <View className="flex-row items-start justify-between gap-3">
                        <View className="flex-1">
                          <Text className="text-gray-900 font-semibold">
                            {formatCurrency(item.amountPaid || item.amountRequested)}
                          </Text>
                          <Text className="text-gray-500 text-xs mt-1">
                            {item.bankName || "Bank"} • {item.accountName || "Account"}
                          </Text>
                          {!!item.description && (
                            <Text className="text-gray-500 text-xs mt-1">{item.description}</Text>
                          )}
                          {!!item.reference && (
                            <Text className="text-gray-400 text-xs mt-1">Ref: {item.reference}</Text>
                          )}
                        </View>
                        <View className={`px-3 py-1 rounded-full ${statusTone(item.status)}`}>
                          <Text className="text-[10px] font-bold uppercase">{String(item.status || "processing")}</Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}