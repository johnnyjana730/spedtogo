import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Expo for icons

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  photo: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 5,
  },
  reviewsText: {
    fontSize: 14,
    color: '#808080',
    marginLeft: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#00BFFF',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  addText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});


const photo = "https://media.cntraveler.com/photos/57d87670fd86274a1db91acd/1:1/w_1536,h_1536,c_limit/most-beautiful-paris-pont-alexandre-iii-GettyImages-574883771.jpg";
const RestaurantCard = ({ marker}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: photo }} style={styles.photo} />
      <View style={styles.info}>
        <Text style={styles.name}>{marker.name}</Text>
        <View style={styles.rating}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>rating</Text>
          <Text style={styles.reviewsText}>reviews</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity >
            <Ionicons name="heart" size={24} color="#FF0000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addText}>Add to Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RestaurantCard;