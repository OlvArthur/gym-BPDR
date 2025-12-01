import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const MONTHS_FR = [
  "janvier","février","mars","avril","mai","juin",
  "juillet","août","septembre","octobre","novembre","décembre"
];

const WEEKDAYS_FR = ["dim","lun","mar","mer","jeu","ven","sam"];

export default function CalendarModal({ visible, onClose, onConfirm }: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}) {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(today);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekDay = new Date(year, month, 1).getDay();

  const generateDays = () => {
    let days = [];

    // First-day spacing (Sun = 0 → should appear last)
    const offset = firstWeekDay === 0 ? 6 : firstWeekDay - 1;

    for (let i = 0; i < offset; i++) days.push(null);

    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
  };

  const changeMonth = (direction: number) => {
    let m = month + direction;
    let y = year;

    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }

    setMonth(m);
    setYear(y);
  };

  const isSelected = (d: any) =>
    d &&
    selectedDate.getDate() === d &&
    selectedDate.getMonth() === month &&
    selectedDate.getFullYear() === year;

  const formattedHeader = {
    weekday: selectedDate.toLocaleDateString("fr-FR", { weekday: "long" }),
    day: selectedDate.getDate(),
    month: MONTHS_FR[selectedDate.getMonth()],
    year: selectedDate.getFullYear(),
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerWeekday}>
              {formattedHeader.weekday}
            </Text>
            <Text style={styles.headerMonth}>
              {formattedHeader.month}
            </Text>
            <Text style={styles.headerDay}>{formattedHeader.day}</Text>
            <Text style={styles.headerYear}>{formattedHeader.year}</Text>
          </View>

          {/* MONTH SELECTOR */}
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Text style={styles.arrow}>◀</Text>
            </TouchableOpacity>

            <Text style={styles.monthLabel}>
              {MONTHS_FR[month]}  {year}
            </Text>

            <TouchableOpacity onPress={() => changeMonth(1)}>
              <Text style={styles.arrow}>▶</Text>
            </TouchableOpacity>
          </View>

          {/* WEEKDAY LABELS */}
          <View style={styles.weekdays}>
            {WEEKDAYS_FR.map((w, i) => (
              <Text key={i} style={styles.weekday}>
                {w}
              </Text>
            ))}
          </View>

          {/* CALENDAR GRID */}
          <View style={styles.grid}>
            {generateDays().map((d, idx) => {
              const selected = isSelected(d);

              return (
                <TouchableOpacity
                  key={idx}
                  disabled={!d}
                  onPress={() => d && setSelectedDate(new Date(year, month, d))}
                  style={[
                    styles.dayCell,
                    selected && styles.daySelected,
                    !d && styles.dayEmpty
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selected && styles.dayTextSelected
                    ]}
                  >
                    {d || ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* FOOTER BUTTONS */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => onConfirm(selectedDate)}>
              <Text style={styles.okButton}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>Annuler</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },

  /* HEADER (blue) */
  header: {
    backgroundColor: "#1B70D9",
    paddingVertical: 16,
    alignItems: "center",
  },
  headerWeekday: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 2,
  },
  headerMonth: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  headerDay: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
  },
  headerYear: {
    color: "#fff",
    fontSize: 16,
    marginTop: 2,
  },

  /* MONTH SELECTOR */
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    alignItems: "center",
  },
  arrow: {
    fontSize: 22,
    color: "#1B70D9",
    paddingHorizontal: 10,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B70D9",
  },

  /* WEEKDAYS */
  weekdays: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 4,
  },
  weekday: {
    width: 32,
    textAlign: "center",
    color: "#666",
    fontWeight: "600",
  },

  /* GRID */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  dayCell: {
    width: "13%",
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 4,
  },
  dayEmpty: {
    backgroundColor: "transparent",
  },
  daySelected: {
    backgroundColor: "#1B70D9",
    borderRadius: 4,
  },
  dayText: {
    fontSize: 15,
    color: "#333",
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },

  /* FOOTER */
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
  },
  okButton: {
    fontSize: 16,
    color: "#1B70D9",
    marginRight: 20,
    fontWeight: "600",
  },
  cancelButton: {
    fontSize: 16,
    color: "#888",
  },
});
