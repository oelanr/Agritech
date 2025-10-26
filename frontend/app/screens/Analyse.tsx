import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import CustomHero from '@/components/CustomHero'
import CustomAlert from '@/components/CustomAlert'
import { symptomData } from '../data/symptoms'
import { useNavigation } from "@react-navigation/native"
import { 
  useFonts, 
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold
} from '@expo-google-fonts/space-grotesk'

const { width, height } = Dimensions.get('window')

// ------------------- Compteur -------------------
interface CompteurProps {
  count?: number
}

const Compteur: React.FC<CompteurProps> = ({ count = 0 }) => {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Medium': SpaceGrotesk_500Medium,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  })

  if (!fontsLoaded) return null

  return (
    <View style={styles.compteur}>
      <Text style={styles.compteurText}>{count} symptôme(s) sélectionné(s)</Text>
    </View>
  )
}

// ------------------- FormButton -------------------
interface FormButtonProps {
  formData: Record<string, any>
  resetForm: () => void
  requiredFields: string[]
}

const FormButton: React.FC<FormButtonProps> = ({ formData, resetForm, requiredFields }) => {
  const navigation = useNavigation()
  const [alertVisible, setAlertVisible] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])

  const handlePress = () => {
    const missing = requiredFields.filter((field) => {
      const value = formData[field]
      return value === undefined || value === null || value === "" || value === false
    })

    if (missing.length > 0) {
      setMissingFields(missing)
      setAlertVisible(true)
      return
    }

    navigation.navigate("Chat", { data: formData })
    resetForm()
  }

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.buttonSend}
      >
        <Image
          source={require("../../assets/icons/send.png")}
          style={styles.buttonIcon}
        />
      </TouchableOpacity>

      <CustomAlert
        visible={alertVisible}
        missingFields={missingFields}
        onClose={() => setAlertVisible(false)}
      />
    </>
  )
}

// ------------------- Form -------------------
interface FormProps {
  selectedValues: Record<string, any>
  setSelectedValues: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

const Form: React.FC<FormProps> = ({ selectedValues, setSelectedValues }) => {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Medium': SpaceGrotesk_500Medium,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  })

  if (!fontsLoaded) return null

  const handleSelect = (field: string, value: any, multiple = false) => {
    setSelectedValues((prev) => {
      if (multiple) {
        const old = prev[field] || []
        return {
          ...prev,
          [field]: old.includes(value)
            ? old.filter((v) => v !== value)
            : [...old, value],
        }
      } else {
        return { ...prev, [field]: value }
      }
    })
  }

  return (
    <ScrollView
      style={{ backgroundColor: "#FFFFFF", padding: 16 }}
      contentContainerStyle={{ paddingBottom: 200 }} 
      showsVerticalScrollIndicator={false}
    >
      {Object.entries(symptomData).map(([category, fields]) => (
        <View key={category} style={{ marginBottom: 24 }}>
          <Text style={{ fontFamily: "SpaceGrotesk-Bold", fontSize: 20, marginBottom: 12 }}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>

          {fields.map((field) => (
            <View
              key={field.key}
              style={field.type === "binaire" ?
                {
                  marginBottom: 16,
                  padding: 20,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                } :
                {
                  marginBottom: 16,
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "#fff",
                }
              }
            >
              <Text style={{ fontFamily: "SpaceGrotesk-Medium", fontSize: 16 }}>
                {field.label}
              </Text>

              {field.type === "binaire" && (
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => handleSelect(field.key, selectedValues[field.key] ? 0 : 1)}
                >
                  <View style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor: "#212121",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}>
                    {selectedValues[field.key] ? (
                      <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#212121",
                      }}/>
                    ) : null}
                  </View>

                  <Text style={{ fontFamily: "SpaceGrotesk-Regular", fontSize: 15, color:"#212121" }}>
                    {selectedValues[field.key] ? "Oui" : "Non"}
                  </Text>
                </TouchableOpacity>
              )}

              {(field.type === "categorielle" || field.type === "ordinale") && (
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {field.options?.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        borderRadius: 10,
                        marginTop:10,
                        marginRight: 8,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: selectedValues[field.key] === opt ? "#868686ff" : "#d1d5db",
                        backgroundColor: selectedValues[field.key] === opt ? "#212121" : "#f3f4f6",
                      }}
                      onPress={() => handleSelect(field.key, opt, field.multiple)}
                    >
                      <Text style={{
                        fontFamily: "SpaceGrotesk-Regular",
                        fontSize: 14,
                        color: selectedValues[field.key] === opt ? "white" : "#111",
                      }}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

// ------------------- Analyse -------------------
const Analyse: React.FC = () => {
  // Initialisation formData : binaires à 0, autres champs à null
  const initialFormData: Record<string, any> = {}
  Object.values(symptomData).flat().forEach(field => {
    initialFormData[field.key] = field.type === "binaire" ? 0 : null
  })

  const [formData, setFormData] = useState<Record<string, any>>(initialFormData)

  const requiredFields = Object.values(symptomData).flat().map((f) => f.key)

  const resetForm = () => {
    const newForm: Record<string, any> = {}
    Object.values(symptomData).flat().forEach(field => {
      newForm[field.key] = field.type === "binaire" ? 0 : null
    })
    setFormData(newForm)
  }

  const countSelected = Object.values(formData).filter(v => v !== null && v !== "" && v !== false).length

  return (
    <View style={styles.ecran}>
      <CustomHero 
        title="Analyse des plants de riz" 
        heroText={"Sélectionnez les symptômes observés sur vos plants de riz"}
      />
      <View style={styles.formsend}>
        <Compteur count={countSelected} />
        <FormButton formData={formData} resetForm={resetForm} requiredFields={requiredFields} />
      </View>
      <Form selectedValues={formData} setSelectedValues={setFormData}/>
    </View>
  )
}

export default Analyse

// ------------------- Styles -------------------
const styles = StyleSheet.create({
  ecran: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    height: height,
  },
  compteur: {
    marginTop:20,
    paddingVertical: 6,
    paddingHorizontal:20,
    backgroundColor: '#d7f7e4ff',
    borderColor: "#c0e8d0ff",
    borderWidth: 2,
    elevation:2,
    borderRadius: 10,
    marginBottom:20
  },
  compteurText: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 16,
    color: '#087E69',
    textAlign:'center'
  },
  formsend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal:20
  },
  buttonSend: {
    backgroundColor: "#212121",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: "#4b4b4bff",
    elevation: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    resizeMode: "contain",
  },
})
