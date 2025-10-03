import { StyleSheet, Text, View,TouchableOpacity, ScrollView,Image } from 'react-native'
import React from 'react'
import { useState } from 'react'
import CustomHeader from '@/components/CustomHeader'
import CustomHero from '@/components/CustomHero'
import { 
  useFonts, 
  SpaceGrotesk_400Regular, // Poids Regular
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold      // Poids Bold 
} from '@expo-google-fonts/space-grotesk';
import { symptomData } from '../data/symptoms';
import { useNavigation } from "@react-navigation/native";
import SendIcon from '@/components/CustomIcon'
const Compteur = ({count=0}) => {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Medium':SpaceGrotesk_500Medium,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });
  return <>
    <View style={styles.compteur}>
      <Text style={styles.compteurText}>{count} symptôme(s) sélectionné(s)</Text>
    </View>
  </>
}

const FormButton = ({ formData }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      // onPress={() => navigation.navigate("Chat", { data: formData })}
      style={{
        backgroundColor: "#212121",
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderWidth: 2,
        borderColor: "#4b4b4bff",
        elevation:10,
        borderRadius:10,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
      }}
    >
      <Image
        source={require("../../assets/icons/send.png")}
        style={{
          width: 24,
          height: 24,
          tintColor: "#fff",
          resizeMode: "contain",
        }}
      />
    </TouchableOpacity>
  );
};

const Form = ({selectedValues,setSelectedValues}) => {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Medium':SpaceGrotesk_500Medium,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleSelect = (field: string, value: any, multiple = false) => {
    setSelectedValues((prev) => {
      if (multiple) {
        const old = prev[field] || [];
        return {
          ...prev,
          [field]: old.includes(value)
            ? old.filter((v) => v !== value)
            : [...old, value],
        };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white", padding: 16,marginBottom:85 }}
      showsVerticalScrollIndicator={false}
    >
      {Object.entries(symptomData).map(([category, fields]) => (
        <View key={category} style={{ marginBottom: 24 }}>
          {/* Titre de section */}
          <Text
            style={{
              fontFamily: "SpaceGrotesk-Bold",
              fontSize: 20,
              marginBottom: 12,
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>

          {/* Champs */}
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
              {/* Label */}
              <Text
                style={{
                  fontFamily: "SpaceGrotesk-Medium",
                  fontSize: 16,
                }}
              >
                {field.label}
              </Text>

              {/* Binaire → cercle + label alignés */}
              {field.type === "binaire" && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() =>
                    handleSelect(
                      field.key,
                      selectedValues[field.key] ? 0 : 1
                    )
                  }
                >
                  {/* Cercle */}
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: "#212121",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    {selectedValues[field.key] ? (
                      <View
                        style={ 
                        {
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: "#212121",
                        }
                      }
                      />
                    ) : null}
                  </View>

                  {/* Texte aligné au centre verticalement */}
                  <Text
                    style={
                    {
                      fontFamily: "SpaceGrotesk-Regular",
                        fontSize: 15,
                      color:"#212121"
                    }
                  }
                  >
                    {selectedValues[field.key] ? "Oui" : "Non"}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Catégorielle / Ordinale → boutons carrés */}
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
                        borderColor:
                          selectedValues[field.key] === opt
                            ? "#868686ff"
                            : "#d1d5db",
                        backgroundColor:
                          selectedValues[field.key] === opt
                            ? "#212121"
                            : "#f3f4f6",
                      }}
                      onPress={() =>
                        handleSelect(field.key, opt, field.multiple)
                      }
                    >
                      <Text
                        style={{
                          fontFamily: "SpaceGrotesk-Regular",
                          fontSize: 14,
                          color:
                            selectedValues[field.key] === opt
                              ? "white"
                              : "#111",
                        }}
                      >
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
  );
}

const Analyse = () => {

  const [formData, setFormData] = useState({})

   const countSelected = Object.values(formData).filter(
    (v) => v !== null && v !== "" && v !== false
  ).length;

  return <>
    <View style={styles.ecran}>
      <CustomHero title="Analyse des plants de riz" heroText={"Sélectionnez les symptômes observés sur vos plants de riz"}/>
      <View style={styles.formsend}>
        <Compteur count={countSelected} />
        <FormButton />
      </View>
      <Form  selectedValues={formData} setSelectedValues={setFormData}/>
    </View>
  </>
}

export default Analyse

const styles = StyleSheet.create({
  ecran: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    paddingBottom: 20,
    height: "100%",
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
  }
})