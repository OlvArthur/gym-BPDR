import { format } from "date-fns"
import React, { useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Calendar, LocaleConfig } from 'react-native-calendars'

LocaleConfig.locales['fr'] = {
  monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre', 
      'Décembre'
  ],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  today: "Aujourd'hui"
}

LocaleConfig.defaultLocale = 'fr'


interface CalendarModalProps {
  visible: boolean,
  onClose: () => void
  onConfirm: (date: Date) => void
  currentSelectedDate?: Date
}

export default function CalendarModal({ visible, onClose, onConfirm, currentSelectedDate = new Date() }: CalendarModalProps) {

  const [selectedDate, setSelectedDate] = useState(currentSelectedDate)

  const headerDate = {
    weekDay: selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' }),
    month: selectedDate.toLocaleDateString('fr-FR', { month: 'long' }),
    day: selectedDate.getDate(),
    year: selectedDate.getFullYear(),
  }

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      {/* BACKDROP */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* MODAL CONTENT */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.container}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerWeekday}>{headerDate.weekDay}</Text>
            <Text style={styles.headerMonth}>{headerDate.month}</Text>
            <Text style={styles.headerDay}>{headerDate.day}</Text>
            <Text style={styles.headerYear}>{headerDate.year}</Text>
          </View>

          {/* CALENDAR */}
          <Calendar
            onDayPress={(day) => {
              const date = new Date(day.year, day.month - 1, day.day)
              setSelectedDate(date)
            }}
            current={currentSelectedDate.toString()}
            markedDates={{
              [format(currentSelectedDate, "yyyy-MM-dd")]: { selected: true }
            }}
          />
          
          {/* FOOTER BUTTONS */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => {
              onConfirm(selectedDate)
              onClose()
            }}>
                <Text style={styles.okButton}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
  },

  /* HEADER (blue) */
  header: {
    backgroundColor: "#1B70D9",
    paddingVertical: 18,
    alignItems: "center",
  },
  headerWeekday: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 2,
    textTransform: "capitalize",
  },
  headerMonth: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  headerDay: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
    marginVertical: 2,
  },
  headerYear: {
    color: "#fff",
    fontSize: 16,
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
    marginRight: 24,
    fontWeight: "600",
  },
  cancelButton: {
    fontSize: 16,
    color: "#888",
  },
});
