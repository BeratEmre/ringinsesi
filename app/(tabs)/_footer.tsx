import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons, FontAwesome6, MaterialCommunityIcons, SimpleLineIcons, Feather, Entypo, FontAwesome5 } from '@expo/vector-icons';

// Props interface'ini tanımlıyoruz
interface FooterProps {
  handleTabPress: (url: string) => void;
  currentUrl: string;
}

// Props tipini belirtiyoruz
const Footer: React.FC<FooterProps> = ({ handleTabPress, currentUrl }) => {
  const tabs = [
    { id: 4, name: 'Anasayfa', icon: 'home', url: 'https://ringinsesi.com.tr' },
    { id: 2, name: 'Boks', icon: 'newspaper', url: 'https://ringinsesi.com.tr/Press/Index' },
    { id: 1, name: 'Sıralama', icon: 'bar-graph', url: 'https://ringinsesi.com.tr/BoxerRanking/Index' },
    { id: 5, name: 'Takvim', icon: 'schedule', url: 'https://ringinsesi.com.tr/Schedule/Index' },
    { id: 3, name: 'Boksörler', icon: 'people-group', url: 'https://ringinsesi.com.tr/Boxer/List' },
  ];

  return (
    <View style={styles.footer}>
      {tabs.map((tab) => {
        var isActive = currentUrl.startsWith(tab.url); // Mevcut URL bu sekme ile eşleşiyor mu?
        if (tab.id == 4  )        
            isActive = currentUrl =='https://ringinsesi.com.tr' || currentUrl =='https://ringinsesi.com.tr/';
        
        var iconColor = isActive ? '#20c997' : '#555'; // Aktifse yeşil, değilse gri

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabPress(tab.url)}
          >
            {tab.icon === 'bar-graph' && (
              <Entypo name={tab.icon} size={24} color={iconColor} />
            )}
            {tab.icon === 'newspaper' && (
                <FontAwesome5 name={tab.icon} size={24} color={iconColor}  />
            )}
            {tab.icon === 'people-group' && (
              <FontAwesome6 name={tab.icon} size={24} color={iconColor} />
            )}
            {tab.icon === 'home' && (
              //   <FontAwesome name={tab.icon} size={24} color={iconColor} />
              <Feather name={tab.icon} size={24} color={iconColor} />
            )}
            {tab.icon === 'schedule' && (
              <MaterialIcons name={tab.icon} size={24} color={iconColor}  />
            )}
            <Text style={[styles.tabText, { color: iconColor }]}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    borderTopWidth: 0, // Border'ı kaldırdık
  },
  tab: {
    alignItems: 'center',
    maxWidth: '20%',
    width: '20%',
 
  },
  tabText: {
    fontSize: 10,
    marginTop: 5,
  },
});

export default Footer;