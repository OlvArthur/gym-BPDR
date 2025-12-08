import { format } from "date-fns"
import React, { useEffect, useRef, useState } from "react"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Calendar, LocaleConfig } from 'react-native-calendars'

export default function CalendarModal({ visible, onClose, onConfirm, currentSelectedDate = new Date() }: {
    visible: boolean,
    onClose: () => void
    onConfirm: (date: Date) => void
    currentSelectedDate: Date
}) {

  const modalRef = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(modalRef.current && !(modalRef.current as any).contains(e.target)) {
        onClose()
      }
    }

    if(visible) document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [visible, onClose])

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

  const [selectedDate, setSelectedDate] = useState(currentSelectedDate)

  const formatHeader = (date: Date) => ({
    weekDay: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
    month: date.toLocaleDateString('fr-FR', { month: 'long' }),
    day: date.getDate(),
    year: date.getFullYear(),
  }) 

  const header = formatHeader(selectedDate)

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View ref={modalRef} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerWeekday}>{header.weekDay}</Text>
            <Text style={styles.headerMonth}>{header.month}</Text>
            <Text style={styles.headerDay}>{header.day}</Text>
            <Text style={styles.headerYear}>{header.year}</Text>
          </View>

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
                  onClose()
                  onConfirm(selectedDate)
                }}>
                    <Text style={styles.okButton}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.cancelButton}>Annuler</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  )
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
