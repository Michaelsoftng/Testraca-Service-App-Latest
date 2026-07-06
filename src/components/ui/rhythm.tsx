import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

type ScreenProps = {
  children: React.ReactNode;
  tone?: "light" | "gray";
};

export function AppScreen({ children, tone = "light" }: ScreenProps) {
  return (
    <SafeAreaView className={tone === "gray" ? "flex-1 bg-[#F3F5F4] pt-6" : "flex-1 bg-white pt-6"}>
      {children}
    </SafeAreaView>
  );
}

type HeaderProps = {
  title: string;
  subtitle?: string;
  dark?: boolean;
};

export function PageHeader({ title, subtitle, dark = false }: HeaderProps) {
  return (
    <View className={dark ? "bg-[#0D1B2A] px-5 pt-6 pb-8 rounded-b-[32px]" : "px-5 pt-4 pb-6"}>
      <Text className={dark ? "text-white text-[20px] leading-[36px] font-extrabold" : "text-[#0F172A] text-[20px] leading-[34px] font-extrabold"}>
        {title}
      </Text>
      {subtitle ? (
        <Text className={dark ? "text-slate-300 mt-2 text-sm" : "text-slate-500 mt-2 text-sm"}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function RhythmCard({ children, className = "" }: CardProps) {
  return <View className={`bg-white rounded-3xl border border-slate-100 p-5 ${className}`}>{children}</View>;
}

type SectionTitleProps = {
  title: string;
};

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <Text className="text-[11px] tracking-[2px] uppercase text-slate-500 font-bold mb-3">{title}</Text>
  );
}

type Step = {
  label: string;
  state: "done" | "active" | "todo";
};

type ProgressProps = {
  steps: Step[];
  onStepPress?: (step: Step, index: number) => void;
  variant?: "progress" | "tabs";
};

export function StepProgress({ steps, onStepPress, variant = "progress" }: ProgressProps) {
  return (
    <View className={variant === "tabs" ? "flex-row items-center gap-2" : "flex-row items-start justify-between"}>
      {steps.map((step, index) => {
        if (variant === "tabs") {
          const isActive = step.state === "active";

          return (
            <TouchableOpacity
              key={step.label}
              className={`flex-1 items-center rounded-2xl border px-3 py-3 ${
                isActive ? "bg-[#0D1B2A] border-[#0D1B2A]" : "bg-white border-slate-200"
              }`}
              activeOpacity={onStepPress ? 0.8 : 1}
              disabled={!onStepPress}
              onPress={() => onStepPress?.(step, index)}
            >
              <Text className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-500"}`}>
                {step.label}
              </Text>
            </TouchableOpacity>
          );
        }

        const dotClass =
          step.state === "done"
            ? "bg-[#059669]"
            : step.state === "active"
              ? "bg-[#0D1B2A]"
              : "bg-slate-200";
        const labelClass =
          step.state === "active" || step.state === "done"
            ? "text-slate-900"
            : "text-slate-400";

        return (
          <TouchableOpacity
            key={step.label}
            className="items-center flex-1"
            activeOpacity={onStepPress ? 0.8 : 1}
            disabled={!onStepPress}
            onPress={() => onStepPress?.(step, index)}
          >
            <View className={`w-8 h-8 rounded-full ${dotClass}`} />
            <Text className={`mt-2 text-[10px] font-semibold ${labelClass}`}>{step.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
