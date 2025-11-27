// components/RankingDropdown.tsx
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const PRIMARY = "#3B57A2";

type RankingDropdownProps = {
  selectedValue: number;
  onChange: (value: number) => void;
  items: { label: string; value: number }[];
};

export default function RankingDropdown({
  selectedValue,
  onChange,
  items,
}: RankingDropdownProps) {
  return (
    <View style={styles.dropdownWrapper}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(value) => onChange(Number(value))}
        mode="dropdown"
        style={styles.picker}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownWrapper: {
    width: "47%",
    borderWidth: 2,
    borderColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "android" ? 0 : 10,
    borderRadius: 6,

    ...(Platform.OS === "web" && {
      outline: "none",
    }),
  },

  picker: {
    ...(Platform.OS === "web"
      ? {
          borderWidth: 0,
          outline: "none",
          backgroundColor: "transparent",
        }
      : {}),
  },
});
